// const pool = require('./pool')
// const format = require('pg-format')
// pool.connect(function (err, client, done) {
//     if (err) throw new Error(err);
//     var ageQuery = format('SELECT * from users WHERE id_user = 1')
//     client.query(ageQuery, function (err, result) {
//         if (err) throw new Error(err);
//         console.log(result.rows[0]);
//     })
// });

// var ob = {};
// ob.a = 2;
// ob.b = "galera"
// ob.ei = 2.475
// ob.ab = true
// ob.name
// var text = '';
// var primeiro = true
// for (const obKey in ob) {
//     if (primeiro) {
//         text = ob.constructor.name + "." + obKey + ' = ' + ob[obKey];
//         primeiro = false;
//     }else{
//         text = text + ', ' + ob.constructor.name + "." + obKey + ' = ' + ob[obKey];
//     }
// }
//
// console.log(text)

const hashing = require('./hashing')
console.log(hashing.generate_hash_sync('fesfevftrgfdvd'))
