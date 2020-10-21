const express = require('express');
var pool = require('../../../helpers/pool');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('id user is ', req.cookies);
    console.log('id user is ', req.signedCookies);//Se conecta com o banco
    req.signedCookies.id = req.body.token;
    pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
            try {
                client.release();
            }catch (e) {
                console.log(e);
            }
            res.status(400).send({error: err});
            return;
        } else {
            if(req.body.reminderCreated && req.body.reminderCreated != null &&
                            req.body.reminderCreated.localeCompare('null')) {
                var query = "insert into expenses_tag_order_user_id(id_user, tag, description, value, reminderCreated, paid)" +
                    " values ($1, $2, $3, $4, $5, $6)";
                var values = [req.signedCookies.id, req.body.tag, req.body.description, req.body.value,
                    req.body.reminderCreated, req.body.paid];
            }else{
                var query = "insert into expenses_tag_order_user_id(id_user, tag, description, value, paid)" +
                    " values ($1, $2, $3, $4, $5)";
                var values = [req.signedCookies.id, req.body.tag, req.body.description, req.body.value,
                    req.body.paid];
            }

            client.query(query, values, function (err/*, result*/) {
                try {
                    client.release();
                }catch (e) {
                    console.log(e);
                }
                if (err) {
                    console.log(err);
                    res.status(400).send({error: err});
                    return;
                } else {
                    res.status(200).send(true);
                    return;
                }
            });
        }
    });

    // res.send(true);
});

router.delete('/', (req, res) => {
    req.signedCookies.id = req.body.token;
    pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
            try {
                client.release();
            }catch (e) {
                console.log(e);
            }
            res.status(400).send({error: err});
            return;
        } else {
            var query = "delete from expenses where id_expenses = $1 and id_user = $2";
            var values = [req.body.id, req.signedCookies.id];

            client.query(query, values, function (err/*, result*/) {
                try {
                    client.release();
                }catch (e) {
                    console.log(e);
                }
                if (err) {
                    console.log(err);
                    res.status(400).send({error: err});
                    return;
                } else {
                    res.status(200).send();
                    return;
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

    req.signedCookies.id = req.body.token;
    pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
            res.status(400).send({error: err});
            return;
        } else {
            var query = "insert into users(account_type, name, email, password) values ('S',$1,$2,$3)";
            var values = [req.body.name, req.body.email, hashing.generate_hash_sync(req.body.password)];

            client.query(query, values, function (err/*, result*/) {

                try {
                    client.release();
                }catch (e) {
                    console.log(e);
                }
                if (err) {
                    console.log(err);
                    res.status(400).send({error: err});
                    return;
                } else {
                    res.status(200).send(true);
                    return;
                }
            });
        }
    });
});

router.get('/', (req, res) => {
    console.log('req.cookies user is ', req.cookies);
    console.log('req.signedCookies user is ', req.signedCookies);//Se conecta com o banco
    req.body = req.query;
    req.signedCookies.id = req.body.token;

    pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
            res.status(400).send({error: err});
            return;
        } else {
            var query = "select * from expenses_tag_order_user_id" +
                " where id_user = $1";
            var values = [ req.signedCookies.id];
            var i = 2;
            for (const obKey in req.query) {
                if(obKey.localeCompare('id') == 0){
                    query = query + ' and id_expense = $' + i;
                    values.push(req.query[obKey])
                }else if(obKey.localeCompare('token') != 0){
                    query = query + ' and ' + obKey + ' = $' + i;
                    values.push(req.query[obKey])
                }
                i += 1;
            }
            console.log('query is :\n', query);
            client.query(query, values, function (err, result) {

                try {
                    client.release();
                }catch (e) {
                    console.log(e);
                }
                if (err) {
                    console.log(err);
                    res.status(400).send({error: err});
                    return;
                } else {
                    res.status(200).send(result.rows);
                    return;
                }
            });
        }
    });

    // res.send(true);
});

module.exports = router;