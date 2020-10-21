const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    var tag = req.body.tag;
    if(res.signedCookies.id != null){
        //Se conecta com o banco
        pool.connect(function (err, client/*, done*/) {
            if (err) {
                console.log(err);
                res.status(400).send({error: err});
            } else {
                var query = "insert into tags(id_user, tag) values ($1,$2)";
                var values = [res.signedCookies.id, tag];

                client.query(query, values, function (err/*, result*/) {
                    if (err) {
                        console.log(err);
                        res.status(400).send({error: err});
                    } else {
                        res.send(true);
                    }
                });
            }
        });
    }
});

router.get('/', (req, res) => {
    var tag = req.body.tag;
    if(res.signedCookies.id != null){
        //Se conecta com o banco
        pool.connect(function (err, client/*, done*/) {
            if (err) {
                console.log(err);
                res.status(400).send({error: err});
            } else {
                var query = "select tag from tags where ";
                var values = [res.signedCookies.id, tag];

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
    }
});

module.exports = router;