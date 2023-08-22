require('dotenv').config();
const config = require('@Config');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
// Cors Origin
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
// đọc dữ liệu from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// sử dụng để log mọi request ra console
//app.use(morgan("[:date[iso]][:method :url HTTP/:http-version] Completed with status :status in :response-time ms "));
// chỉ định view engine là ejs
app.set('view engine', 'ejs');
// chỉ định thư mục view là nơi chứa các view engine file
app.set('views', __dirname + '/views');
// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static(__dirname + '/public'));
// tương tự mogan
app.use(compression({
    level: 6
}));
// express set session options
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "SCRERT_SESSION_KEY",
}));

// load các routes rest api
const routerHttp = require('@HttpRouters');
app.use('/', routerHttp);

// export server handle
module.exports = app;