const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    var body = {};
    console.log(req);
    body.id = 0;
    body.name = req.body.name;
    body.email = req.body.email;
    console.log(body);
    res.send(body);
});



module.exports = router;