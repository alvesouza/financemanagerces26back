const pool = require('./pool')
const format = require('pg-format')
pool.connect(function (err, client, done) {
    if (err) throw new Error(err);
    var ageQuery = format('SELECT * from users WHERE id_user = 1')
    client.query(ageQuery, function (err, result) {
        if (err) throw new Error(err);
        console.log(result.rows[0]);
    })
});