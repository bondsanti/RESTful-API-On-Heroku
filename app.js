const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
var cors = require('cors')

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const companyRouter = require('./routes/company');
const employeeRouter = require('./routes/employee');
const shopRouter = require('./routes/shop');

//require config
const config = require('./config/index');
//require middeleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  
  //  apply to all requests
  app.use(limiter);

// init helmet
app.use(helmet());

mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// init passport
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/company', companyRouter);
app.use('/employee', employeeRouter);
app.use('/shop', shopRouter);

//middleware
app.use(errorHandler);

module.exports = app;