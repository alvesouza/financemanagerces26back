const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    var tag = req.body.tag;
    res.send(true);
});

router.get('/', (req, res) => {
    var tag = req.body.tag;
    res.send(true);
});

module.exports = router;