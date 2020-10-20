const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    var tag = req.body.tag;
    var value = req.body.value;
    var description = req.body.description;
    var reminderCreated = req.body.reminderCreated;
    res.send(true);
});

router.delete('/', (req, res) => {
    var id = req.id;
    res.send(true);
});

router.put('/',(req, res) => {
    var id = req.body.id;
    var tag = req.body.tag;
    var value = req.body.value;
    var description = req.body.description;
    var paid = req.body.paid;
    var reminderCreated = req.body.reminderCreated;
    res.send(true);
});



module.exports = router;