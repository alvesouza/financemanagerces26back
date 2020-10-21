const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userApi = require('./routes/Api/user/user');
const tagApi = require('./routes/Api/tag/tag')
const expenseApi = require('./routes/Api/expense/expense')
const app = express();
const port = process.env.PORT || 3333;
const cors = require('cors');


// app.use(allowCrossDomain);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('cwe$Fdew3!QWSWQCTYTH764qwd@!'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Listening on port ${port}`));


// set a cookie
app.use(cors());
app.use(function (req, res, next) {
  // check if client sent cookie
  // var cookie = req.cookies.cookieName;
  // const allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  //console.log('Im here')
  // const origin = req.get('origin');
  // // console.log(req.headers)
  // // console.log(origin);
  // if (origin) {
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  // }else{
  //   res.setHeader('Access-Control-Allow-Origin', '*');
  // }
  //
  //  // res.header("Access-Control-Allow-Origin", "*");
  // //Quais são os métodos que a conexão pode realizar na API
  // res.setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,HEAD,OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, ' +
  //     'X-Requested-With, Access-Control-Allow-Headers, Origin, Accept, Access-Control-Request-Method,' +
  //     ' Access-Control-Request-Headers');
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  // if (cookie === undefined) {
  //   // no: set a new cookie
  //   var randomNumber=Math.random().toString();
  //   randomNumber=randomNumber.substring(2,randomNumber.length);
  //   // res.cookie('cookieName',randomNumber, {httpOnly: true });
  //   // console.log('cookie created successfully');
  //   console.log('cookie = ', res.cookies.cookie);
  // } else {
  //   // yes, cookie was already present
  //   console.log('cookie exists', cookie);
  // }
  next(); // <-- important!
});



// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use(
    '/user',
    userApi
);
app.use('/expense',
    expenseApi
);

app.use('/tag',
    tagApi
);

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
