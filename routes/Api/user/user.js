const express = require('express');
const cookieParser = require('cookie-parser');
// const mailgun = require("mailgun-js");
var nodemailer = require('nodemailer');
// const DOMAIN = 'financemanager.com';
// const DOMAIN = 'sandbox8397a09e1ae84939aa438d7cd140d261.mailgun.org';
const DOMAIN = 'gmail.com';
// const DOMAIN = 'gmail';
// const APIKEY = '3703153f6bb3038c696a95edb45e07b3-53c13666-cc8eebf0';
const router = express.Router();
const PASS = "byt6%&*uig9HKhuf6DDCctfj9";
const mail = "managerfinance.ces26@gmail.com";
router.post('/', (req, res) => {
    // var cookie = req.cookies.cookieName;
    var body = {};
    console.log(req);
    body.id = 0;
    body.name = req.body.name;
    body.email = req.body.email;
    // res.cookie('email',body.email, {httpOnly: true, secure: true});
    // body.cookies = req.cookies;
    console.log(body);

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
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(/*error*/ 'erro');
        } else {
            console.log('Email sent: '/* + info.response*/);
        }
    });
    // next();
    res.send(body);
});



module.exports = router;