const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Our actual pages.
app.use('/', indexRouter);

// Mounted vendors.
app.use('/vendor/leaflet', express.static(path.join(__dirname, 'node_modules/leaflet/dist')));
app.use('/vendor/leaflet-providers', express.static(path.join(__dirname, 'node_modules/leaflet-providers')));
app.use('/vendor/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// Serve items statically in public.
app.use(express.static(path.join(__dirname, 'public'))); 

// Mounted API endpoint.
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
