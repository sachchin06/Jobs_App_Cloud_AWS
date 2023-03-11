require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers

const jobsAwsRouter = require("./routes/jobs-aws");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

// routes

app.use("/api/v1/jobs", authenticateUser, jobsAwsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// connectDB(process.env.MONGO_URI);
connectDB(
  "mongodb+srv://Sachchin06:ceylonuni@cluster0.jiqdoh2.mongodb.net/Jobs-Crud?retryWrites=true&w=majority"
);
console.log("DB Connected ...");

module.exports = app;
