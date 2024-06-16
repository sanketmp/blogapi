import mongoose from "mongoose";

const commentschema = mongoose.Schema(
  {
    blogId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const commentModel = mongoose.model("comments", commentschema);
export default commentModel;
