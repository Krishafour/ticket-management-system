import express from 'express';
import swaggerUI from 'swagger-ui-express';
import {pool} from "./database/db";
import {execute,text} from "./models/user";
import {execute1,text1} from "./models/ticket";

const swaggerDocs:any=require("./openAPIDocumentation/swagger.json");
const tms:string= require("./routes/ticketManagementSystem");
const app:any= express();
const port:string |undefined= process.env.PORT;

require("dotenv").config();


pool.on("connect",()=>{
    console.log("connected to postgres");
});

pool.on("error", (err:any) => {
    console.log("this is error", err);
  });

pool.connect();

execute(text).then(result => {
    if (result) {
        console.log('Table 1 created');
    }
});

execute1(text1).then(result => {
    if (result) {
        console.log('Table 2 created');
    }
});

app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs));
app.use(express.json());
app.use("/", tms);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});