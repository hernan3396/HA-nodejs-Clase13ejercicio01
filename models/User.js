const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true },
  socketId: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = model("User", userSchema);
