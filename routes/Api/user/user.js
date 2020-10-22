const express = require('express');
// const mailgun = require("mailgun-js");
var nodemailer = require('nodemailer');
var pool = require('../../../helpers/pool');
var hashing = require('../../../helpers/hashing')
var config = require('../../../config');
const router = express.Router();
const PASSWORD = config.email.email;
const EMAIL = config.email.password;
router.post('/', (req, res) => {
    // var cookie = req.cookies.cookieName;
    var body = {};
    console.log(req.body);
    body.token = 0;
    body.name = req.body.name;
    body.email = req.body.email;
    res.body = {};
    // res.cookie('email',body.email, {httpOnly: true, secure: true});
    // body.cookies = req.cookies;
    console.log(body);

    //Se conecta com o banco
    pool.connect(function (err, client) {
        if (err) {
            console.log(err);
            try {
                client.release();
            }catch (e) {
                console.log(e);
            }
            res.status(500).send({error:err});
            return;
        }
        else {
            var query = "insert into users(account_type, name, email, password) values ('S',$1,$2,$3)";
            var values = [req.body.name, req.body.email, hashing.generate_hash_sync(req.body.password)];

            client.query(query, values, function (err) {
                if (err) {
                    console.log(err);
                    try {
                        client.release();
                    }catch (e) {
                        console.log(e);
                    }
                    res.status(400).send({error:err});
                    return;
                }else {
                    query = "select id_user, id_comfirm_route from users where email= $1 fetch first 1 rows only";
                    values = [req.body.email]

                        client.query(query, values, function (err, result_01){

                            try {
                                client.release();
                            }catch (e) {
                                console.log(e);
                            }
                            console.log(result_01.rows);
                            if(result_01.rows[0].length != 0) {
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: EMAIL,
                                        pass: PASSWORD
                                    }
                                });

                                var mailOptions = {
                                    from: EMAIL,
                                    to: body.email,
                                    subject: 'Confirm email',
                                    text: 'link: ' + result_01.rows[0].id_comfirm_route
                                };

                                transporter.sendMail(mailOptions, function (error/*, info*/) {
                                    if (error) {
                                        console.log(/*error*/ 'erro');
                                        // res.send(body);
                                    } else {
                                        console.log('Email sent: '/* + info.response*/);
                                    }
                                });
                                res.cookie('id', result_01.rows[0].id_user, {httpOnly: true, signed: true});
                                body.token = result_01.rows[0].id_user;
                                res.send(body);
                                return;
                            }
                    });
                }
                // res.json(result.rows[0]);
            })
        }
    });


    // next();
    // res.send(body);
});

router.post(
    '/login',(req, res)=>{
        res.body = {}

        req.signedCookies.id = parseInt(req.body.token);

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
            }
            var query = "select id_user, password, name from users where " +
                "users.email = $1 fetch first 1 rows only;";
            var values = [req.body.email];
            console.log(values);
            client.query(query, values, function (err, result) {

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
                    //
                    // try {
                    //     client.release();
                    // }catch (e) {
                    //     console.log(e);
                    // }
                    console.log(result.rows);
                    if (result.rows.length == 0) {
                        try {
                            client.release();
                        }catch (e) {
                            console.log(e);
                        }
                        res.status(400).send("not a user")
                        return;
                    }
                    try {
                        client.release();
                    }catch (e) {
                        console.log(e);
                    }
                    console.log(result.rows[0])
                    if (hashing.compare_password_sync(req.body.password, result.rows[0].password)) {
                        res.cookie('id', result.rows[0].id_user, {httpOnly: true, signed: true});
                        res.body.token = result.rows[0].id_user;
                        res.body.email = req.body.email;
                        res.body.name = result.rows[0].name;

                        res.send(res.body);
                    } else {
                        // try {
                        //     client.release();
                        // }catch (e) {
                        //     console.log(e);
                        // }
                        res.status(400).send({error: 'Invalid Password'});
                        return;
                    }

                }
            });
        });

    }

);

module.exports = router;