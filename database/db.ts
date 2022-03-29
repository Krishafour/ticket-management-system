const {Client}=require('pg')
//import Client from 'pg';
require("dotenv").config();


export const pool:typeof Client=new Client({
host:process.env.dbHOST,
port:process.env.dbPORT,
user:process.env.dbUSER,
password:process.env.dbPASSWORD,
database:process.env.dbDATABASE
})
