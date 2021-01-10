const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const eventRouter = require("./routes/eventRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
dotenv.config();

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

app.use(express.json({ limit: "10kb" }));

// sanitization
app.use(mongoSanitize());

//  parameter pollution
app.use(
  hpp({
    whitelist: ["sort", "page", "size", "start", "end", "sort"],
  })
);

// route
app.get("/", (req, res) => {
  res.send("API Running");
});
app.use("/api/event", eventRouter);
app.use("/api/user", userRouter);

app.all("*", (req, res, next) => {
  next(`Can't find ${req.originalUrl} on this server!`, 404);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
