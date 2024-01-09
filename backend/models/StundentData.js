const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: Number,
  naam: String,
  branch: String,
  attendanceStatus: String,
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;