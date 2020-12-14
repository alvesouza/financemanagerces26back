const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const userApi = require('./routes/Api/user/user');
const tagApi = require('./routes/Api/tag/tag')
const expenseApi = require('./routes/Api/expense/expense')
const expensesChartApi = require('./routes/Api/expense/expensesToChart')
const app = express();
const port = process.env.PORT || 3337;
const cors = require('cors');
const helmet = require('helmet')


// app.use(allowCrossDomain);
// view engine setup
// app.options('*', cors())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('cwe$Fdew3!QWSWQCTYTH764qwd@!'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use( helmet.hsts( { maxAge: 7776000000 } ) ) ;
app.use( helmet.frameguard( 'SAMEORIGIN' ) ) ;
app.use( helmet.xssFilter( { setOnOldIE: true } ) ) ;
app.use( helmet.noSniff() ) ;
app.listen(port, () => console.log(`Listening on port ${port}`));
const translator = {remidercreated:"remiderCreated"};

// set a cookie
app.use(function (req, res, next) {
  if(req.query["remindercreated"]){
    req.body["remindercreated"] = req.query["remindercreated"]
  }
  if(req.body["remindercreated"]){
    req.body["reminderCreated"] = req.body["remindercreated"]
  }
  console.log(req.body);
  res.header("Access-Control-Allow-Origin", "*");

  //code injection protection
  var re = /[<][ ]*[s][c][r][i][p][t][ ]*[>]/;
  for (values in req.body){
    console.log('teste body',req.body[values])
    if(re.test(req.body[values])){
      next(createError(404));
    }
  }
  for (values in req.query){
    console.log('teste query ',req.query[values])
    if(re.test(req.query[values])){
      next(createError(404));
    }
  }
  next(); // <-- important!
});

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
app.use('/expensestochart', expensesChartApi);

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
