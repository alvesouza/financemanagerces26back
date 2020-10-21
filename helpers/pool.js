var pg = require('pg')

//Host
// ec2-3-218-75-21.compute-1.amazonaws.com
// Database
// d85ujhir1i7gco
// User
// oujsfxlruvvmux
// Port
// 5432
// Password
// 37cfde7dd3dc2197af0fa7f0a7dd42dbbb671758cecee3d1fecf244c0dfd4233
// URI
// postgres://oujsfxlruvvmux:37cfde7dd3dc2197af0fa7f0a7dd42dbbb671758cecee3d1fecf244c0dfd4233@ec2-3-218-75-21.compute-1.amazonaws.com:5432/d85ujhir1i7gco
// Heroku CLI
// heroku pg:psql postgresql-objective-76987 --app financemanagerces26back

// const PGUSER = 'oujsfxlruvvmux'
// const PGDATABASE = 'd85ujhir1i7gco'
// const host = 'ec2-3-218-75-21.compute-1.amazonaws.com';
// const password = '37cfde7dd3dc2197af0fa7f0a7dd42dbbb671758cecee3d1fecf244c0dfd4233';
const Port = 5432
// var config = {
//     user: PGUSER, // name of the user account
//     database: PGDATABASE, // name of the database
//     host: host,
//     // port: Port,
//     password: password,
//     max: 10, // max number of clients in the pool
//     idleTimeoutMillis: 30000
// }
// var config = {
//     connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
//     ssl: isProduction,
//     max: 10, // max number of clients in the pool
//     idleTimeoutMillis: 30000
// }
const env_config = require('../config')
// var config = {
//     connectionString: 'postgres://xzdyuyszpnfeob:564008abf9cd23b0f0f47757ca4bfcd262e0bbeb972' +
//         '2803f759651acb00ca874@ec2-34-202-65-210.compute-1.amazonaws.com:5432/dd9p8pp2k0skrh',
//     ssl: { rejectUnauthorized: false },
//     max: 10, // max number of clients in the pool
//     idleTimeoutMillis: 30000
// }
var config = {
    connectionString: env_config.connection,
    ssl: { rejectUnauthorized: false },
    // min: env_config.pool.min,
    max: env_config.pool.max, // max number of clients in the pool
    idleTimeoutMillis: env_config.idleTime
}

var pool = new pg.Pool(config);

module.exports = pool;