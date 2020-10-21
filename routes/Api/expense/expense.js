const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('id user is ', req.cookies);
    console.log('id user is ', req.signedCookies);//Se conecta com o banco
    pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
            res.status(400).send({error: err});
        } else {
            var query = "insert into expenses_tag_order_user_id(id_user, tag, description, value, reminder, paid)" +
                " values ($1, $2, $3, $4, $5, $6)";
            var values = [ req.signedCookies.id, req.body.tag, req.body.description, req.body.value,
                req.body.reminderCreated, req.body.paid];

            client.query(query, values, function (err/*, result*/) {
                if (err) {
                    console.log(err);
                    res.status(400).send({error: err});
                } else {
                    res.send(200).send(true);
                }
            });
        }
    });

    // res.send(true);
});

router.delete('/', (req, res) => {
    res.send(true);pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
            res.status(400).send({error: err});
        } else {
            var query = "delete from expenses where id_expenses = $1 and id_user = $2";
            var values = [req.body.id, req.signedCookies.id];

            client.query(query, values, function (err/*, result*/) {
                if (err) {
                    console.log(err);
                    res.status(400).send({error: err});
                } else {
                    res.status(200).send();
                }
            });
        }
    });
});

router.put('/',(req, res) => {
    // var id = req.body.id;
    // var tag = req.body.tag;
    // var value = req.body.value;
    // var description = req.body.description;
    // var paid = req.body.paid;
    // var reminderCreated = req.body.reminderCreated;
    pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
            res.status(400).send({error: err});
        } else {
            var query = "insert into users(account_type, name, email, password) values ('S',$1,$2,$3)";
            var values = [req.body.name, req.body.email, hashing.generate_hash_sync(req.body.password)];

            client.query(query, values, function (err/*, result*/) {
                if (err) {
                    console.log(err);
                    res.status(400).send({error: err});
                } else {
                    res.status(200).send(true);
                }
            });
        }
    });
});

router.get('/', (req, res) => {
    console.log('id user is ', req.cookies);
    console.log('id user is ', req.signedCookies);//Se conecta com o banco
    pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
            res.status(400).send({error: err});
        } else {
            var query = "select * expenses_tag_order_user_id" +
                " where id_user = $1";
            var values = [ req.signedCookies.id];
            for (const obKey in req.body) {
                if(obKey.localeCompare('id') == 0){
                    query = query + ', id_expense = ' + req.body[obKey];
                }else {
                    query = query + ', ' + obKey + ' = ' + req.body[obKey];
                }
            }
            client.query(query, values, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400).send({error: err});
                } else {
                    res.send(200).send(result.rows);
                }
            });
        }
    });

    res.send(true);
});

module.exports = router;