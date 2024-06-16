import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import router from "./routes/router.js";
import { checkUser } from "./middleware/auth.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(router);
app.use(express.static("./uploads"));

app.get("/", checkUser, (req, res) => {
  const username = res.locals.username;
  const response = {
    message: "Welcome to Blog-App!",
    isLogedin: username ? true : false,
  };
  if (username) {
    response.username = username;
  }
  res.status(200).json(response);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("> connected to database successfully.");
    app.listen(port, () => {
      console.log(`> Server has started on ${port}.`);
    });
  } catch (error) {
    console.log("> An error occurred.\n", error);
  }
};
connectDB();
