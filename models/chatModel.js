const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    members: Array
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
