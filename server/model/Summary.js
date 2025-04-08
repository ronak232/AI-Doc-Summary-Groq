import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
    unique: true,
  },
  summary: {
    type: String,
    required: true,
  },
  parseToText: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Summary = mongoose.model('summary', summarySchema);

export {Summary};