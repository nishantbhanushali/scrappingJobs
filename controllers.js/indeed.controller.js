
import puppeteer from "puppeteer"

const data  = {
    list :  []
}

const indeed = async(req, res) =>{
    try {
        const {skill, city, state} = req.body

        const main = async(skill) => {
        
        //    open a browser called chromium 
            const browser = await puppeteer.launch({headless : false})

        // open a new page on chrome
            const page = await browser.newPage()

        // go to the website
        // https://in.indeed.com/jobs?q=${skill}+developer&l=${Mumbai}%2C+${Maharashtra}
           const indeed = await page.goto(`https://in.indeed.com/jobs?q=${skill}+developer&l=${city}%2C+${state}`, {
            timeout : 0,
            waitUntil : "networkidle0"
            
           })
        //    help to run the function inside my page
           const jobData = await page.evaluate( async(data) =>{
                const items = document.querySelectorAll('td.resultContent')
                items.forEach((item, index) =>{
                    const jobTitle = document.querySelector("h2.jobTitle>a")?.innerText
                    const jobLink = document.querySelector("h2.jobTitle>a")?.href
                    let  jobSalary = document.querySelector("div.metadata.salary-snippet-container>div")?.innerText
                    const companyName = document.querySelector("span.company-name")?.innerText
                    if(!jobSalary) {
                        jobSalary = "not defined"
                    }

                    data.list.push({jobTitle  : jobTitle,
                        jobLink : jobLink,
                        jobSalary : jobSalary,
                        companyName : companyName

                    })
                    

                })


           })
           return data

           


            browser.close()



        }



        res.status(200).json({message :"this are all the jobs"})
        
    } catch (error) {
        return res.status(400).json({message : error.message, 
            list : data.list
        })
        
    }

    
}

export default indeed