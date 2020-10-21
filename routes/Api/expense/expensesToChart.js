const express = require('express');
var pool = require('../../../helpers/pool');
const router = express.Router();

function calcTime(offset, option = {days:10}) {
    option = option||{};
    option.days = option.days||0;
    d = new Date();

    utc = d.getTime() + (d.getTimezoneOffset() * 60000) ;
    nd = new Date(utc + (3600000*offset)+ 60000*60*24*option.days);

    // return time as a string
    return nd;

}
router.get('/', (req, res) => {
    console.log('id user is ', req.cookies);
    console.log('id user is ', req.signedCookies);//Se conecta com o banco
    req.body = req.query;
    req.signedCookies.id = req.body.token;
    var begin = calcTime('-3', {days:-7});
    var end = calcTime('-3');
    pool.connect(function (err, client/*, done*/) {
        if (err) {
            console.log(err);
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

module.exports = router;