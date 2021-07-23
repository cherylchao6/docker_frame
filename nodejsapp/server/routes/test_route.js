//This is a route for me to quckly test if redis works in the homepage
const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
const { test } = require("../controllers/test_controller");


router.get("/", test);


module.exports = router;