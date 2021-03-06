const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors')
const { isLoginAdmin } = require('./app/Middleware/auth')

const apiRouter = require('./api/router')

const indexRouter = require('./routes/index');
const usersRouter = require('./app/User/router');
const dashboardRouter = require('./app/Dashboard/router');
const categoryRouter = require('./app/Category/router')
const bankRouter = require('./app/Bank/router')
const itemRouter = require('./app/Item/router')
const bookingRouter = require('./app/Booking/router')
const featuresRouter = require('./app/Feature/router')
const activitiesRouter = require('./app/Activity/router')

const app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'staycation',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
app.use(flash())
app.use(methodOverride('_method'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));

app.use('/', indexRouter);
app.use('/api/v1', apiRouter)
app.use('/auth', usersRouter)
app.use('/dashboard', isLoginAdmin ,dashboardRouter);
app.use('/categories', isLoginAdmin ,categoryRouter);
app.use('/bank', isLoginAdmin ,bankRouter);
app.use('/items', isLoginAdmin ,itemRouter);
app.use('/items/features', isLoginAdmin ,featuresRouter)
app.use('/items/activities', isLoginAdmin ,activitiesRouter)
app.use('/booking', bookingRouter);

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
