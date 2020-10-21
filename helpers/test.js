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

// const hashing = require('./hashing')
// console.log(hashing.generate_hash_sync('fesfevftrgfdvd'))
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
var now = new Date();
var day = now.getDay()
console.log(now.toMysqlFormat())