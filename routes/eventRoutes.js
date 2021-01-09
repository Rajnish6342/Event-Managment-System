const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const eventController = require("./../controllers/eventController");

router.post("/", authController.protect, eventController.newEvent);
router.get("/", authController.protect, eventController.list);

router.put("/invite/:id", authController.protect, eventController.invite);

module.exports = router;
