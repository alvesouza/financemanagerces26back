const express = require('express');
const cookieParser = require('cookie-parser');
const format = require('pg-format');
// const mailgun = require("mailgun-js");
var nodemailer = require('nodemailer');
var pool = require('../../../helpers/pool')
var hashing = require('../../../helpers/hashing')
const router = express.Router();
const PASS = "byt6%&*uig9HKhuf6DDCctfj9";
const mail = "managerfinance.ces26@gmail.com";
router.post('/', (req, res) => {
    // var cookie = req.cookies.cookieName;
    var body = {};
    console.log(req.body);
    body.id = 0;
    body.name = req.body.name;
    body.email = req.body.email;
    // res.cookie('email',body.email, {httpOnly: true, secure: true});
    // body.cookies = req.cookies;
    console.log(body);

    //Se conecta com o banco
    pool.connect(function (err, client, done) {
        if (err) {
            console.log(err);
            res.status(400).send({error:err});
        }
        else {
            var query = "insert into users(account_type, name, email, password) values ('S',$1,$2,$3)";
            var values = [req.body.name, req.body.email, hashing.generate_hash_sync(req.body.password)];

            client.query(query, values, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400).send({error:err});
                }
                else {
                    query = "select id_user, id_comfirm_route from users where email= $1 fetch first 1 rows only";
                    values = [req.body.email]

                        client.query(query, values, function (err, result_01){
                        console.log(result_01.rows);
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: mail,
                                pass: PASS
                            }
                        });

                        var mailOptions = {
                            from: mail,
                            to: body.email,
                            subject: 'Confirm email',
                            text: 'link: ' + result_01.rows[0].id_comfirm_route
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(/*error*/ 'erro');
                            } else {
                                console.log('Email sent: '/* + info.response*/);
                            }
                        });
                        res.cookie('id',result_01.rows[0].id_user, {httpOnly: true, signed:true });
                        console.log(res.cookies);
                        res.body.id = res.signedCookies.id;
                        res.send(body);
                    });
                }
                // res.json(result.rows[0]);
            })
        }
    });


    // next();
    // res.send(body);
});

router.get(
    '/',(req, res)=>{
        pool.connect(function (err, client, done) {
            if (err) {
                console.log(err);
                res.status(400).send({error:err});
            }
            var query = "select id_user, users.password, name from users where " +
                "users.email = $1 fetch first 1 rows only;";
            var hash = hashing.generate_hash_sync(req.body.password)
            var values = [req.body.email];

            client.query(query, values, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400).send({error:err});
                }
                else{
                    if (hashing.compare_password_sync(req.body.password, result.rows[0].password)){
                        res.cookie('id',result_01.rows[0].id_user, {httpOnly: true, signed:true });
                        res.body.id = res.signedCookies.id;
                        res.body.email = req.body.email;
                        res.body.name = result_01.rows[0].name;
                        res.send(res.body);
                    }else{
                        res.status(400).send({error:'Invalid Password'});
                    }

                }
            });
        });
    }

);

module.exports = router;