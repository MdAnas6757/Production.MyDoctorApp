const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  userId:
    {
        type:String,
        required:true,

    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const feedbackModel = mongoose.model('feedbacks', feedbackSchema);

module.exports = feedbackModel;
