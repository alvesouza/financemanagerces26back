const express = require('express');
var pool = require('../../../helpers/pool');
const router = express.Router();

router.post('/', (req, res) => {
    var tag = req.body.tag;
    req.signedCookies.id = parseInt(req.body.token);
    if(req.signedCookies.id != null){
        //Se conecta com o banco
        pool.connect(function (err, client/*, done*/) {
            if (err) {
                console.log(err);
                try {
                    client.release();
                }catch (e) {
                    console.log(e);
                }
                res.status(500).send({error: err});
                return;
            } else {
                var query = "insert into tags(id_user, tag) values ($1,$2)";
                var values = [req.signedCookies.id, tag];

                client.query(query, values, function (err/*, result*/) {
                    try {
                        client.release();
                    }catch (e) {
                        console.log(e);
                    }
                    if (err) {
                        console.log(err);
                        res.status(500).send({error: err});
                        return;
                    } else {
                        res.send(true);
                        return;
                    }
                });
            }
        });
    }
});

router.get('/', (req, res) => {
    var tag = req.body.tag;
    req.body = req.query;
    req.signedCookies.id = parseInt(req.body.token);
    console.log(tag);
    if(req.signedCookies.id != null){
        //Se conecta com o banco
        pool.connect(function (err, client/*, done*/) {
            if (err) {
                console.log(err);
                try {
                    client.release();
                }catch (e) {
                    console.log(e);
                }
                res.status(500).send({error: err});
                return;
            } else {
                var query = "select tag from tags where id_user = $1";
                var values = [req.signedCookies.id];

                client.query(query, values, function (err, result) {
                    try {
                        client.release();
                    }catch (e) {
                        console.log(e);
                    }
                    if (err) {
                        console.log(err);

                        res.status(500);
                        return;
                    } else {
                        res.send(result.rows);

                        return;
                    }
                });
            }
        });
    }
});

module.exports = router;