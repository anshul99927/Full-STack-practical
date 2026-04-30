const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  number: {
    type: Number,
    required: true,
  },
  coursesEnrolled: [
    {
      courseName: { type: String },
    },
  ],
});

// Adds username, hash, salt fields + helper methods
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
