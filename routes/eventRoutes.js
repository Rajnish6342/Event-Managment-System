const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const eventController = require("./../controllers/eventController");

//create new event

router.post("/", authController.protect, eventController.newEvent);

//api/event/list
// api/event/list?page=1&size=2
// api/event/list?start=2020-04-12&end=2020-04-15
// api/event/list?sort=-name
router.get("/list", authController.protect, eventController.list);

//event detail route
//api/event/event/5ff9f257036ec24e7c2f14d7
router.get("/event/:id", authController.protect, eventController.detail);

//update
// api/event/event/5ff9f257036ec24e7c2f14d7
router.patch("/event/:id", authController.protect, eventController.updateEvent);

//api/event/search?name=ritesh
router.get("/search", authController.protect, eventController.search);

router.put("/invite/:id", authController.protect, eventController.invite);

module.exports = router;
