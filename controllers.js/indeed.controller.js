import puppeteer from "puppeteer";
import fs from "fs";

const data = {
  list: [],
};

const indeed = async (req, res) => {
  let browser;
  try {
    const { skill, city, state } = req.body; // Extract skill from the request body
    if (!skill ) {
      return res.status(400).json({ message: "Skill is required" });
    }
    if (!city ) {
        return res.status(400).json({ message: "city is required" });
      }
      if (!state ) {
        return res.status(400).json({ message: "state is required" });
      }

    // Launch the browser in non-headless mode for debugging
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to the Indeed search page
    await page.goto(`https://in.indeed.com/jobs?q=${skill}&l=${city}%2C+${state}`, {
      timeout: 0,
      waitUntil: 'networkidle0',
    });

    // Get the job data from the page
    const jobData = await page.evaluate((data) => {
      const items = document.querySelectorAll('td.resultContent');
      items.forEach((item, index) => {
        console.log(`Scraping data of job: ${index + 1}`);

        const title = item.querySelector('h2.jobTitle>a')?.innerText || 'Title not found';
        const link = item.querySelector('h2.jobTitle>a')?.href || 'Link not found';
        let salary = item.querySelector('div.metadata.salary-snippet-container > div')?.innerText || 'Not defined';
        const companyName = item.querySelector('span.companyName')?.innerText || 'Company not found';

        data.list.push({
          title: title,
          salary: salary,
          companyName: companyName,
          link: link,
        });
      });
      return data;
    }, data);

    console.log(`Successfully collected ${jobData.list.length} jobs`);

    // Write data to a JSON file
    const json = JSON.stringify(jobData, null, 2);
    fs.writeFileSync('jobs.json', json, 'utf8');
    console.log('Successfully written job data to jobs.json');

    // Close the browser
    await browser.close();

    // Send the job data as the response
    return res.status(200).json({
      message: `Successfully scraped ${jobData.list.length} jobs`,
      jobs: jobData.list,
    });

  } catch (error) {
    console.error("Error scraping jobs:", error.message);

    // Ensure the browser closes in case of error
    if (browser) await browser.close();

    return res.status(500).json({
      message: "Failed to scrape jobs",
      error: error.message,
    });
  }
};

export default indeed;
