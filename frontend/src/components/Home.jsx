import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newBranchName, setNewBranchName] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/students');
        console.log("the response is", response);
        setAttendanceData(response.data.map((student, index) => ({
          ...student,
          attendanceStatus: 'absent',
          id: index + 1
        })));
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleAttendanceMarking = (studentId, status) => {
    const updatedAttendanceData = attendanceData.map(student => {
      if (student.id === studentId) {
        return { ...student, attendanceStatus: status };
      }
      return student;
    });
    setAttendanceData(updatedAttendanceData);
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post('http://localhost:3001/home', {
        naam: newStudentName,
        branch: newBranchName
      });

      console.log('the result is', result);

      if (result.data === "Student already exists in the database.") {
        alert("Student already exists in the database.");
      } else {
        alert("Student added successfully!");

        const newStudent = {
          id: attendanceData.length + 1,
          naam: newStudentName,
          branch: newBranchName,
          attendanceStatus: 'absent',
        };

        setAttendanceData([...attendanceData, newStudent]);
        setNewStudentName('');
        setNewBranchName('');
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the student.");
    }
  };

  const handleSubmitAttendance = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/submit-attendance',
        attendanceData
      );
      alert("Attendance successfully added!")
      console.log('Attendance submitted:', response.data);
      // Optionally, you can update the UI to reflect that attendance has been submitted.
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  return (
    <div className="home-container">
  <h1>Student Attendance System</h1>
  
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Branch</th>
          <th>Attendance Status</th>
        </tr>
      </thead>
      <tbody>
        {attendanceData.map(student => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.naam}</td>
            <td>{student.branch}</td>
            <td>
              <select
                value={student.attendanceStatus}
                onChange={e => handleAttendanceMarking(student.id, e.target.value)}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  <form onSubmit={handleAddStudent} className="add-student-form">
    <h2>Add Student</h2>
    <input
      type="text"
      placeholder="Student Name"
      value={newStudentName}
      onChange={e => setNewStudentName(e.target.value)}
    />
    <input
      type="text"
      placeholder="Branch"
      value={newBranchName}
      onChange={e => setNewBranchName(e.target.value)}
    />
    <button type="submit">Add</button>
    <button className="submit-attendance-button" onClick={handleSubmitAttendance}>
    Submit Attendance
  </button>
  
  <Link to="/login" className="logout-button">
    Logout
  </Link>
  </form>
</div>

  
  );
};

export default Home;
