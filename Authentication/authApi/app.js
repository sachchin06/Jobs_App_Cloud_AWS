require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authCognitoRouter = require("./routes/auth-cognito");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

app.use("/api/v1/authCognito", authCognitoRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// connectDB(process.env.MONGO_URI);
connectDB(
  "mongodb+srv://Sachchin06:ceylonuni@cluster0.jiqdoh2.mongodb.net/Jobs-Crud?retryWrites=true&w=majority"
);

console.log("DB Connected ...");

module.exports = app;
