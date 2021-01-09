const mongoose = require("mongoose");
const Event = require("./../models/eventModel");
const User = require("./../models/userModel");

const catchAsync = require("./../utils/catchAsync");

exports.newEvent = catchAsync(async (req, res, next) => {
  const newevent = await Event.create({
    name: req.body.name,
    description: req.body.description,
    eventDate: req.body.eventDate,
    createdByUser: req.user._id,
  });

  res.status(201).json({
    status: "success",

    data: {
      newevent,
    },
  });
});

exports.invite = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: "Invalid ID" });
  const event = await Event.findById(req.params.id);
  if (event.invitedUsers.some((eve) => eve.mail === req.body.email)) {
    return res.status(400).json({ msg: "user already invited" });
  }

  event.invitedUsers.unshift({ mail: req.body.email });

  await event.save();

  return res.json(event.invitedUsers);
});

exports.list = catchAsync(async (req, res, next) => {
  const event = await Event.find({
    $or: [
      {
        createdByUser: req.user.id,
      },
      {
        "invitedUsers.mail": req.user.email,
      },
    ],
  }).populate("createdByUser", "name");
  if (!event) {
    return res.status(400).json({ msg: "There is no event for this user" });
  }

  res.json(event);
});
