const express = require("express");
const router = express.Router();
const { verifyMember, rateLimiter } = require("../util");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
const { getHeroes } = require("../controllers/hero_controller");

router.get(["/heroes/:heroId", "/heroes"], rateLimiter, verifyMember, getHeroes);

module.exports = router;
