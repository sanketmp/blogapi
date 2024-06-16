import mongoose from "mongoose";
import bcrypt from "bcrypt";
import pkg from "validator";
import dotenv from "dotenv";

dotenv.config();
const { isEmail } = pkg;

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      lowercase: true,
    },
    firstname: {
      type: String,
      required: [true, "first name is required"],
    },
    lastname: {
      type: String,
      required: [true, "last name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "incorrect password"],
    },
    bio: {
      type: String,
      default: "Bio.",
    },
  },
  { timestamps: true }
);

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(this.password, salt);

userSchema.pre("save", async function (next) {
  this.password = hashedPassword;
  next();
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
