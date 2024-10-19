import express from "express"
const app = express()
 


const Port = 3001

// middlewares

app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({extended : false}))

import getRoutes from "./routes/getRoutes.js"
app.use("/api/v1/", getRoutes)



app.listen(Port , () => {
    console.log("port is running on ", Port);
    
})