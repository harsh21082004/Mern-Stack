const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment'); // Import moment for handling dates
const FormDataModel = require('./models/FormData');
const StudentModel = require('./models/StundentData');
const AttendanceModel = require('./models/AttendanceData'); // Import attendance model
const axios = require('axios')
const app = express();
app.use(express.json());
app.use(cors(
  {
    origin:["https://mern-stack-murex.vercel.app"],
    methods:["POST","GET"},
    credentials:true
  }
));

mongoose.connect('mongodb://127.0.0.1:27017/practice_mern');

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  FormDataModel.findOne({ email: email })
    .then(user => {
      if (user) {
        res.json("Already registered");
      } else {
        FormDataModel.create(req.body)
          .then(log_reg_form => res.json(log_reg_form))
          .catch(err => res.json(err));
      }
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  FormDataModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("Wrong password");
        }
      } else {
        res.json("No records found!");
      }
    });
});

app.get('/students', async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/home', async (req, res) => {
  const { naam, branch, attendance } = req.body;

  console.log('Received request with data:', naam, branch);
  try {
    const existingStudent = await StudentModel.findOne({ naam: naam });
    if (existingStudent) {
      console.log('Student already exists:', existingStudent);
      res.json("Student already exists in the database.");
    } else {
      const newStudent = await StudentModel.create(req.body);
      console.log('New student added:', newStudent);
      res.json(newStudent);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/submit-attendance', async (req, res) => {
    const updatedStudents = req.body;
    const currentDate = moment().startOf('day');
  
    try {
      for (const student of updatedStudents) {
        const studentData = await StudentModel.findById(student._id);
        if (!studentData) {
          console.log('Student not found:', student._id);
          continue; // Move to the next student in the loop
        }
        
        const existingAttendance = await AttendanceModel.findOne({
          studentId: student._id,
          date: currentDate,
        });
  
        if (existingAttendance) {
          await AttendanceModel.findByIdAndUpdate(existingAttendance._id, {
            status: student.attendanceStatus,
          });
        } else {
          const newAttendance = new AttendanceModel({
            studentId: student._id,
            studentName: studentData.naam,
            studentBranch: studentData.branch,
            date: currentDate,
            status: student.attendanceStatus,
          });
  
          await newAttendance.save();
        }
      }
  
      res.json('Attendance data updated successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).json('Error updating attendance');
    }
  });
app.get('/attendance/:date', async (req, res) => {
  const { date } = req.params;
  const searchDate = moment(date, 'YYYY-MM-DD').toDate();

  try {
    const attendanceRecords = await AttendanceModel.find({
      date: {
        $gte: searchDate,
        $lt: moment(searchDate).endOf('day').toDate(),
      },
    }).populate('studentId');

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json('Error retrieving attendance');
  }
});

app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});
