const mongoose = require("mongoose");
const Event = require("./../models/eventModel");
const User = require("./../models/userModel");

const catchAsync = require("./../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateEvent = catchAsync(async (req, res, next) => {
  //  not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "description", "eventDate");
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: "Invalid ID" });
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(400).json({ msg: "no event found" });
  }

  //  document
  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      event: updatedEvent,
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

exports.detail = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: "Invalid ID" });
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(400).json({ msg: "no event found" });
  }

  return res.json({ invitedUsers: event.invitedUsers, Detail: event });
});

exports.list = catchAsync(async (req, res, next) => {
  const size = Number(req.query.size) || 1;
  const page = Number(req.query.page) || 1;
  let date;
  if (req.query.start) {
    date = { eventDate: { $gte: req.query.start, $lte: req.query.end } };
  }
  const skip = (page - 1) * size;
  let query = Event.find({
    $or: [
      {
        "invitedUsers.mail": req.user.email,
      },
      {
        createdByUser: req.user._id,
      },
    ],
    ...date,
  });

  if (req.query.sort) {
    query.sort(req.query.sort);
  }

  // const query = Event.find({
  //   eventDate: { $gte: req.query.start, $lte: req.query.end },
  // }).populate("createdByUser", "name");

  if (req.query.page) {
    console.log(page);
    query.skip(skip).limit(size);
  }

  const event = await query.populate("createdByUser", "name");
  if (!event) {
    return res.status(400).json({ msg: "There is no event for this user" });
  }

  res.json({ count: event.length, data: { event } });
});

exports.search = catchAsync(async (req, res, next) => {
  const key = req.query.name
    ? {
        name: {
          $regex: req.query.name,
          $options: "i",
        },
      }
    : {};
  console.log(req.query.name);
  const query = await Event.find({
    ...key,
  });

  const event = await query;
  if (!event) {
    return res.status(400).json({ msg: "There is no event for this user" });
  }

  res.json({ count: event.length, data: { event } });
});
