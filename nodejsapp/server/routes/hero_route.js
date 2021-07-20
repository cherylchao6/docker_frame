const express = require("express");
const router = express.Router();
const {verifyMember} = require("../util");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
const { getHeroes } = require("../controllers/hero_controller");


router.get("/heroes/:heroId", verifyMember, getHeroes);


module.exports = router;