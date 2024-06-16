import blogs from "../models/blogModel.js";
import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";

export const getUserDetails = async (req, res) => {
  try {
    const user = req.params["id"];
    const username = res.locals.username;
    const userDetails = await userModel.findOne({ username: user }).lean();

    if (!userDetails) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const userBlogs = await blogs.find({ author: user });
    return res.status(200).json({
      ...userDetails,
      blogs: userBlogs,
      auth: user === username ? true : false,
    });
  } catch (error) {
    console.error("Error:\n", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  const ref = req.params["username"].toLowerCase();
  if (ref === "all" || !ref) {
    const users = await userModel.find({});
    res.status(200).json(users);
  } else {
    try {
      const user = await userModel.find({
        $or: [
          { firstname: { $regex: ref, $options: "i" } },
          { lastname: { $regex: ref, $options: "i" } },
          { username: { $regex: ref, $options: "i" } },
        ],
      });
      if (user.length >= 0) {
        res.status(200).json(user);
      } else {
        res.status(404).error({ message: "User not found." });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal error." });
    }
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = res.locals.user._id;
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bio: req.body.bio,
    };

    await userModel.findOneAndUpdate(userId, data);
    return res.status(200).json({ message: "Profile Updated!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = res.locals.user._id;
    const username = res.locals.user.username;
    await userModel.findOneAndDelete({ _id: userId });

    const allBlogs = await blogs.find({ author: username });
    if (allBlogs.length > 0) {
      const blogsId = allBlogs.map((item) => item._id);
      await commentModel.deleteMany({ blogId: { $in: blogsId } });
      await blogs.deleteMany({ author: username });
    }

    res.status(200).json({
      message: "Account closed.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal error.",
    });
  }
};
