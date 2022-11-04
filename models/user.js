const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: { type: String, unique: true, required: true },
  //   username: {type: String, unique: true, required: true},
  password: { type: String, required: true },
});
// ```` unique: true ``` = keeps the mongo _id/key the same, same data cannot be posted twice, doing so will result in an error
const User = mongoose.model("User", userSchema);

module.exports = User;
