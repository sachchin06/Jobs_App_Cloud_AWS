const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 3,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
