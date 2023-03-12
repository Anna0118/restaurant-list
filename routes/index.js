const express = require("express");
const router = express.Router();

// home mudule
const home = require("./modules/home");
router.use("/", home);

// restuarant module
const restaurants = require("./modules/restaurants");
router.use("/restaurants", restaurants);

// module export
module.exports = router;
