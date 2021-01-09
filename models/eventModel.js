const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter event name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter description!"],
  },
  eventDate: {
    type: Date,
    required: [true, "Please enter a date"],
  },
  invitedUsers: [
    {
      mail: {
        type: String,
      },
    },
  ],
  createdByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
