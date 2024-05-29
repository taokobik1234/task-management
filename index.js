const express = require('express');
const database = require("./config/database");
const bodyParser = require("body-parser");
const cookieParser= require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const routesApiVer1 = require("./api/v1/routes/index.route")
const app = express();
const port = process.env.PORT;

database.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
// route version1
routesApiVer1(app);

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})