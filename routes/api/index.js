const express = require('express');
let router = express.Router();
const v1router = require('../api/v1/index');
router.use("/v1",v1router);
module.exports = router;