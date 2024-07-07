const express = require('express');
require('dotenv').config();
const bodyParser = require("body-parser");
const sequelize = require('./config.js');
const userRoute = require('./routes/userRoute.js')


const app = express();
const port = process.env.PORT || 8000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(userRoute);




app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});


module.exports = app;
