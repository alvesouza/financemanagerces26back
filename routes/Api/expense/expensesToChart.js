const express = require('express');
var pool = require('../../../helpers/pool');
const router = express.Router();

function calcTime(offset, option = {days:0}) {
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
    req.signedCookies.id = parseInt(req.body.token);

    console.log('id user is ', req.cookies);
    console.log('id user is ', req.signedCookies);//Se conecta com o banco
    // console.log(d.getDate())
    // console.log(d.getMonth())
    // console.log(d.getFullYear())
    var begin = calcTime('-3', {days:-7});
    var end = calcTime('-3');
    console.log(begin);
    console.log(end);
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

            var query = "select * from expenses_tag_order_user_id\n" +
                "where date >= '"+begin.getFullYear()+"-"+parseInt(begin.getMonth()+1)+"-"+begin.getDate()+"'\n" +
                "  and\n" +
                "      date <= '"+end.getFullYear()+"-"+parseInt(end.getMonth()+1)+"-"+end.getDate()+"' and id_user = $1;";
            var values = [req.signedCookies.id];

            // console.log('///////////////////////////\n',query);
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