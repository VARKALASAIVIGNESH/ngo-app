'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial pre-seeded mock dataset
const INITIAL_USERS = [
  { id: 1, username: 'srinivas', password: 'srinivasngo', fullName: 'Srinivas (Director)', email: 'srinivas@ngo.org', role: 'admin', phone: '+1 555 019 2831' },
  { id: 2, username: 'teacher', password: 'srinivasngo', fullName: 'Staff Teacher', email: 'teacher@ngo.org', role: 'teacher', phone: '+1 555 014 9922' },
  { id: 3, username: 'david.kumar', password: 'srinivasngo', fullName: 'David Kumar', email: 'david.kumar@ngo.org', role: 'teacher', phone: '+1 555 017 4488' }
];

const INITIAL_STUDENTS = [
  {
    id: 1,
    studentId: 'NGO-2026-0001',
    fullName: 'Aarav Sharma',
    dob: '2012-05-14',
    gender: 'Male',
    parentName: 'Ramesh Sharma',
    phone: '+1 555 101 0001',
    email: 'aarav.sharma@example.com',
    address: 'Flat 4B, Sunrise Enclave, East District',
    joiningDate: '2025-09-01',
    gradeClass: 'Class 7',
    schoolName: 'Greenwood Public School',
    status: 'Active',
    notes: 'Shows high aptitude for STEM subjects. Enthusiastic learner.'
  },
  {
    id: 2,
    studentId: 'NGO-2026-0002',
    fullName: 'Ananya Patel',
    dob: '2011-08-22',
    gender: 'Female',
    parentName: 'Kavita Patel',
    phone: '+1 555 101 0002',
    email: 'ananya.p@example.com',
    address: '22 Lakeview Road, Ward 5',
    joiningDate: '2025-09-01',
    gradeClass: 'Class 8',
    schoolName: 'St. Jude Academy',
    status: 'Active',
    notes: 'Excels in reading comprehension and creative arts.'
  },
  {
    id: 3,
    studentId: 'NGO-2026-0003',
    fullName: 'Rohan Gupta',
    dob: '2013-03-10',
    gender: 'Male',
    parentName: 'Sanjay Gupta',
    phone: '+1 555 101 0003',
    email: '',
    address: 'Sector 12, Block C, Metro Housing',
    joiningDate: '2025-10-15',
    gradeClass: 'Class 6',
    schoolName: 'City Model High School',
    status: 'Active',
    notes: 'Needs support in basic numeracy. Very polite and respectful.'
  },
  {
    id: 4,
    studentId: 'NGO-2026-0004',
    fullName: 'Priya Nair',
    dob: '2010-11-30',
    gender: 'Female',
    parentName: 'Meera Nair',
    phone: '+1 555 101 0004',
    email: 'priya.nair@example.com',
    address: '18 Rose Garden Lane',
    joiningDate: '2025-08-10',
    gradeClass: 'Class 9',
    schoolName: 'National High School',
    status: 'Active',
    notes: 'Demonstrates exceptional leadership and debate skills.'
  },
  {
    id: 5,
    studentId: 'NGO-2026-0005',
    fullName: 'Bilal Ahmed',
    dob: '2012-01-18',
    gender: 'Male',
    parentName: 'Tariq Ahmed',
    phone: '+1 555 101 0005',
    email: '',
    address: 'Plot 90, Central Avenue',
    joiningDate: '2025-11-05',
    gradeClass: 'Class 7',
    schoolName: 'Govt. Boys Middle School',
    status: 'Active',
    notes: 'Loves sports and hands-on scientific experiments.'
  },
  {
    id: 6,
    studentId: 'NGO-2026-0006',
    fullName: 'Fatima Sheikh',
    dob: '2011-07-09',
    gender: 'Female',
    parentName: 'Zainab Sheikh',
    phone: '+1 555 101 0006',
    email: 'fatima.s@example.com',
    address: '45 Heritage Square',
    joiningDate: '2025-09-15',
    gradeClass: 'Class 8',
    schoolName: 'St. Jude Academy',
    status: 'Active',
    notes: 'Consistent attendance and very attentive during sessions.'
  },
  {
    id: 7,
    studentId: 'NGO-2026-0007',
    fullName: 'Karan Verma',
    dob: '2014-04-25',
    gender: 'Male',
    parentName: 'Deepak Verma',
    phone: '+1 555 101 0007',
    email: '',
    address: '77 Market Road, North Zone',
    joiningDate: '2026-01-10',
    gradeClass: 'Class 5',
    schoolName: 'Primary Learning Center',
    status: 'Active',
    notes: 'Younger beneficiary; developing foundational reading skills.'
  },
  {
    id: 8,
    studentId: 'NGO-2026-0008',
    fullName: 'Sneha Mukherjee',
    dob: '2009-12-12',
    gender: 'Female',
    parentName: 'Debashis Mukherjee',
    phone: '+1 555 101 0008',
    email: 'sneha.m@example.com',
    address: '12 Old Town Street',
    joiningDate: '2024-06-01',
    gradeClass: 'Class 10',
    schoolName: 'National High School',
    status: 'Graduated',
    notes: 'Successfully graduated our senior youth empowerment track!'
  },
  {
    id: 9,
    studentId: 'NGO-2026-0009',
    fullName: 'Arjun Das',
    dob: '2012-09-05',
    gender: 'Male',
    parentName: 'Bikram Das',
    phone: '+1 555 101 0009',
    email: '',
    address: '84 Railway Colony',
    joiningDate: '2025-10-01',
    gradeClass: 'Class 7',
    schoolName: 'Greenwood Public School',
    status: 'On Leave',
    notes: 'On temporary family medical leave until next month.'
  },
  {
    id: 10,
    studentId: 'NGO-2026-0010',
    fullName: 'Diya Sen',
    dob: '2013-06-17',
    gender: 'Female',
    parentName: 'Mitali Sen',
    phone: '+1 555 101 0010',
    email: 'diya.sen@example.com',
    address: '33 Palm Grove',
    joiningDate: '2026-02-01',
    gradeClass: 'Class 6',
    schoolName: 'City Model High School',
    status: 'Active',
    notes: 'Recently enrolled. Showing eager participation in peer groups.'
  }
];

const INITIAL_SESSIONS = [
  {
    id: 1,
    title: 'Mathematics & Geometry Foundations',
    date: '2026-08-01',
    startTime: '09:30',
    endTime: '11:00',
    teacherId: 2,
    location: 'Learning Room A',
    description: 'Covered 2D geometry, angles, triangles, and interactive problem solving.',
    sessionType: 'Academic',
    status: 'Completed'
  },
  {
    id: 2,
    title: 'English Literacy & Essay Writing Workshop',
    date: '2026-08-05',
    startTime: '14:00',
    endTime: '15:30',
    teacherId: 3,
    location: 'Community Hall Library',
    description: 'Vocabulary enrichment and short story composition practice.',
    sessionType: 'Academic',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Hands-on Science & Physics Experiments',
    date: '2026-08-08',
    startTime: '10:00',
    endTime: '12:00',
    teacherId: 2,
    location: 'Science Lab 1',
    description: 'Simple circuit building, magnetism, and basic thermodynamics principles.',
    sessionType: 'Skill Workshop',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'Life Skills, Hygiene & Digital Literacy',
    date: '2026-08-12',
    startTime: '11:00',
    endTime: '12:30',
    teacherId: 3,
    location: 'Computer Lab B',
    description: 'Basics of keyboard navigation, safe internet browsing, and health habits.',
    sessionType: 'Life Skills',
    status: 'Completed'
  },
  {
    id: 5,
    title: 'Peer Mentorship & Career Guidance Circle',
    date: '2026-08-18',
    startTime: '10:00',
    endTime: '11:30',
    teacherId: 1,
    location: 'Auditorium Room 2',
    description: 'Goal setting, overcoming study obstacles, and career pathways discussion.',
    sessionType: 'Mentorship',
    status: 'Scheduled'
  },
  {
    id: 6,
    title: 'Art, Music & Creative Expressions',
    date: '2026-08-22',
    startTime: '15:00',
    endTime: '16:30',
    teacherId: 2,
    location: 'Activity Lawn',
    description: 'Painting, rhythm exercises, and confidence building through creative arts.',
    sessionType: 'Extracurricular',
    status: 'Scheduled'
  }
];

const INITIAL_ATTENDANCE = [
  // Session 1
  { id: 1, sessionId: 1, studentId: 1, status: 'Present', remarks: '', markedById: 2 },
  { id: 2, sessionId: 1, studentId: 2, status: 'Present', remarks: '', markedById: 2 },
  { id: 3, sessionId: 1, studentId: 3, status: 'Present', remarks: '', markedById: 2 },
  { id: 4, sessionId: 1, studentId: 4, status: 'Present', remarks: '', markedById: 2 },
  { id: 5, sessionId: 1, studentId: 5, status: 'Late', remarks: 'Bus delay', markedById: 2 },
  { id: 6, sessionId: 1, studentId: 6, status: 'Present', remarks: '', markedById: 2 },
  { id: 7, sessionId: 1, studentId: 7, status: 'Absent', remarks: 'Sick leave', markedById: 2 },
  { id: 8, sessionId: 1, studentId: 10, status: 'Present', remarks: '', markedById: 2 },
  // Session 2
  { id: 9, sessionId: 2, studentId: 1, status: 'Present', remarks: '', markedById: 3 },
  { id: 10, sessionId: 2, studentId: 2, status: 'Present', remarks: '', markedById: 3 },
  { id: 11, sessionId: 2, studentId: 3, status: 'Late', remarks: 'Traffic', markedById: 3 },
  { id: 12, sessionId: 2, studentId: 4, status: 'Present', remarks: '', markedById: 3 },
  { id: 13, sessionId: 2, studentId: 5, status: 'Present', remarks: '', markedById: 3 },
  { id: 14, sessionId: 2, studentId: 6, status: 'Present', remarks: '', markedById: 3 },
  { id: 15, sessionId: 2, studentId: 7, status: 'Present', remarks: '', markedById: 3 },
  { id: 16, sessionId: 2, studentId: 10, status: 'Absent', remarks: 'Family event', markedById: 3 },
  // Session 3
  { id: 17, sessionId: 3, studentId: 1, status: 'Present', remarks: '', markedById: 2 },
  { id: 18, sessionId: 3, studentId: 2, status: 'Present', remarks: '', markedById: 2 },
  { id: 19, sessionId: 3, studentId: 3, status: 'Present', remarks: '', markedById: 2 },
  { id: 20, sessionId: 3, studentId: 4, status: 'Present', remarks: '', markedById: 2 },
  { id: 21, sessionId: 3, studentId: 5, status: 'Present', remarks: '', markedById: 2 },
  { id: 22, sessionId: 3, studentId: 6, status: 'Present', remarks: '', markedById: 2 },
  { id: 23, sessionId: 3, studentId: 7, status: 'Late', remarks: 'Late arrival', markedById: 2 },
  { id: 24, sessionId: 3, studentId: 10, status: 'Present', remarks: '', markedById: 2 },
  // Session 4
  { id: 25, sessionId: 4, studentId: 1, status: 'Present', remarks: '', markedById: 3 },
  { id: 26, sessionId: 4, studentId: 2, status: 'Present', remarks: '', markedById: 3 },
  { id: 27, sessionId: 4, studentId: 3, status: 'Absent', remarks: 'Medical visit', markedById: 3 },
  { id: 28, sessionId: 4, studentId: 4, status: 'Present', remarks: '', markedById: 3 },
  { id: 29, sessionId: 4, studentId: 5, status: 'Present', remarks: '', markedById: 3 },
  { id: 30, sessionId: 4, studentId: 6, status: 'Present', remarks: '', markedById: 3 },
  { id: 31, sessionId: 4, studentId: 7, status: 'Present', remarks: '', markedById: 3 },
  { id: 32, sessionId: 4, studentId: 10, status: 'Present', remarks: '', markedById: 3 }
];

const INITIAL_FEEDBACKS = [
  {
    id: 1,
    studentId: 1,
    teacherId: 2,
    feedbackDate: '2026-08-02',
    subjectArea: 'Mathematics & Geometry',
    attendanceObs: 'Regular & Punctual',
    rating: 5,
    academicProgress: 'Grasped geometry formulas very quickly. Solved all challenge problems.',
    behaviour: 'Extremely courteous, collaborative with lab partner.',
    participation: 'Asked insightful questions regarding real-world area calculation.',
    strengths: 'Strong analytical mind, quick arithmetic speed.',
    improvementAreas: 'Could write down intermediate working steps more clearly.',
    comments: 'Aarav is an outstanding student with high motivation.'
  },
  {
    id: 2,
    studentId: 1,
    teacherId: 3,
    feedbackDate: '2026-08-09',
    subjectArea: 'Physics & Circuit Workshop',
    attendanceObs: 'Regular & Punctual',
    rating: 4,
    academicProgress: 'Successfully constructed parallel and series circuits.',
    behaviour: 'Helpful to teammates who were struggling with components.',
    participation: 'Active participant throughout the 2-hour session.',
    strengths: 'Hands-on dexterity and problem-solving initiative.',
    improvementAreas: 'Needs to document observations simultaneously.',
    comments: 'Consistent high performance.'
  },
  {
    id: 3,
    studentId: 2,
    teacherId: 3,
    feedbackDate: '2026-08-05',
    subjectArea: 'English Literacy & Creative Writing',
    attendanceObs: 'Regular & Punctual',
    rating: 5,
    academicProgress: 'Wrote an evocative short story demonstrating advanced vocabulary.',
    behaviour: 'Exemplary focus and quiet diligence.',
    participation: 'Read her narrative aloud with poise and confidence.',
    strengths: 'Creative imagination, natural storytelling, excellent grammar.',
    improvementAreas: 'Encourage participation in technical/math tracks as well.',
    comments: 'Ananya is a gifted writer.'
  },
  {
    id: 4,
    studentId: 3,
    teacherId: 2,
    feedbackDate: '2026-08-01',
    subjectArea: 'Mathematics & Numeracy',
    attendanceObs: 'Mostly Regular',
    rating: 2,
    academicProgress: 'Struggling with multi-digit fractions and division operations.',
    behaviour: 'Well-behaved but becomes shy when called upon to answer.',
    participation: 'Hesitant to volunteer without 1-on-1 encouragement.',
    strengths: 'Willing to learn and tries repeatedly until guided.',
    improvementAreas: 'Needs additional 1-on-1 remedial practice in fractions.',
    comments: 'Recommend paired tutoring with extra practice sheets.'
  },
  {
    id: 5,
    studentId: 3,
    teacherId: 2,
    feedbackDate: '2026-08-08',
    subjectArea: 'Basic Science Experiments',
    attendanceObs: 'Regular & Punctual',
    rating: 3,
    academicProgress: 'Much more engaged during visual and tactile experiments.',
    behaviour: 'Enthusiastic and respectful.',
    participation: 'Showed curiosity in magnetism demonstrations.',
    strengths: 'Visual-spatial learning ability.',
    improvementAreas: 'Recall of formal scientific terminology.',
    comments: 'Progressing well compared to last week!'
  },
  {
    id: 6,
    studentId: 4,
    teacherId: 3,
    feedbackDate: '2026-08-06',
    subjectArea: 'Social Studies & Life Skills',
    attendanceObs: 'Regular & Punctual',
    rating: 4,
    academicProgress: 'Articulated nuanced perspectives on environmental conservation.',
    behaviour: 'Natural leader; helps keep group discussion constructive.',
    participation: 'High engagement throughout.',
    strengths: 'Public speaking and critical reasoning.',
    improvementAreas: 'Time management during timed written tests.',
    comments: 'Priya is emerging as a role model among peers.'
  },
  {
    id: 7,
    studentId: 5,
    teacherId: 2,
    feedbackDate: '2026-08-07',
    subjectArea: 'General Science',
    attendanceObs: 'Frequently Late',
    rating: 3,
    academicProgress: 'Good grasp of concepts once settled in class.',
    behaviour: 'Energetic; occasionally gets distracted by classmates.',
    participation: 'Volunteers enthusiastically for lab demonstrations.',
    strengths: 'High energy, curiosity, mechanical intuition.',
    improvementAreas: 'Punctuality and sustained focus during lectures.',
    comments: 'Follow up with guardian regarding bus transit timing.'
  },
  {
    id: 8,
    studentId: 6,
    teacherId: 3,
    feedbackDate: '2026-08-10',
    subjectArea: 'Digital Literacy',
    attendanceObs: 'Regular & Punctual',
    rating: 4,
    academicProgress: 'Mastered spreadsheet data entry and typing exercises quickly.',
    behaviour: 'Polite, disciplined, very supportive to peers.',
    participation: 'Steady, reliable contributor in group assignments.',
    strengths: 'Attention to detail and methodological approach.',
    improvementAreas: 'Could be encouraged to voice independent opinions more.',
    comments: 'Consistently high standard of work.'
  }
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [loaded, setLoaded] = useState(false);

  // Load from LocalStorage on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ngo_current_user');
      const savedStudents = localStorage.getItem('ngo_students');
      const savedSessions = localStorage.getItem('ngo_sessions');
      const savedAttendance = localStorage.getItem('ngo_attendance');
      const savedFeedbacks = localStorage.getItem('ngo_feedbacks');
      const savedUsers = localStorage.getItem('ngo_users');

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedStudents) setStudents(JSON.parse(savedStudents));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
      if (savedFeedbacks) setFeedbacks(JSON.parse(savedFeedbacks));
      if (savedUsers) setUsers(JSON.parse(savedUsers));
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }
    setLoaded(true);
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('ngo_current_user', currentUser ? JSON.stringify(currentUser) : '');
      localStorage.setItem('ngo_students', JSON.stringify(students));
      localStorage.setItem('ngo_sessions', JSON.stringify(sessions));
      localStorage.setItem('ngo_attendance', JSON.stringify(attendance));
      localStorage.setItem('ngo_feedbacks', JSON.stringify(feedbacks));
      localStorage.setItem('ngo_users', JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [currentUser, students, sessions, attendance, feedbacks, users, loaded]);

  // Auth methods
  const login = (username, password) => {
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username/email or password' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ngo_current_user');
  };

  // Student helper methods
  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const existingYearIds = students
      .map(s => s.studentId)
      .filter(id => id && id.startsWith(`NGO-${year}-`))
      .map(id => parseInt(id.split('-')[2], 10))
      .filter(n => !isNaN(n));
    const nextSeq = existingYearIds.length > 0 ? Math.max(...existingYearIds) + 1 : 1;
    return `NGO-${year}-${String(nextSeq).padStart(4, '0')}`;
  };

  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      studentId: studentData.studentId || generateStudentId()
    };
    setStudents(prev => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setAttendance(prev => prev.filter(a => a.studentId !== id));
    setFeedbacks(prev => prev.filter(f => f.studentId !== id));
  };

  // Attendance metrics helper
  const getStudentAttendanceStats = (studentId) => {
    const records = attendance.filter(a => a.studentId === studentId);
    const present = records.filter(a => a.status === 'Present').length;
    const late = records.filter(a => a.status === 'Late').length;
    const absent = records.filter(a => a.status === 'Absent').length;
    const total = records.length;
    const percentage = total > 0 ? Math.round(((present + (0.5 * late)) / total) * 100) : 0;
    return { present, late, absent, total, percentage, records };
  };

  // Feedback helper methods
  const getStudentAverageRating = (studentId) => {
    const list = feedbacks.filter(f => f.studentId === studentId);
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, f) => acc + Number(f.rating), 0);
    return Math.round((sum / list.length) * 10) / 10;
  };

  const addFeedback = (feedbackData) => {
    const newFeedback = {
      ...feedbackData,
      id: feedbacks.length > 0 ? Math.max(...feedbacks.map(f => f.id)) + 1 : 1,
      feedbackDate: feedbackData.feedbackDate || new Date().toISOString().split('T')[0]
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
    return newFeedback;
  };

  // Sessions helper methods
  const addSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1,
      status: sessionData.status || 'Scheduled'
    };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const updateSession = (id, updatedData) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const saveBatchAttendance = (sessionId, attendanceMap, markedById) => {
    setAttendance(prev => {
      const filtered = prev.filter(a => a.sessionId !== sessionId);
      const newRecords = Object.keys(attendanceMap).map((studentId, index) => ({
        id: (prev.length > 0 ? Math.max(...prev.map(p => p.id)) : 0) + index + 1,
        sessionId: Number(sessionId),
        studentId: Number(studentId),
        status: attendanceMap[studentId].status || 'Present',
        remarks: attendanceMap[studentId].remarks || '',
        markedById: markedById || currentUser?.id || 1
      }));
      return [...filtered, ...newRecords];
    });

    // Mark session as completed
    setSessions(prev => prev.map(s => s.id === Number(sessionId) ? { ...s, status: 'Completed' } : s));
  };

  // User management helper methods
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id, updatedData) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  const deleteUser = (id) => {
    if (id === currentUser?.id) return false;
    setUsers(prev => prev.filter(u => u.id !== id));
    return true;
  };

  // Reset demo dataset
  const resetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setSessions(INITIAL_SESSIONS);
    setAttendance(INITIAL_ATTENDANCE);
    setFeedbacks(INITIAL_FEEDBACKS);
    setUsers(INITIAL_USERS);
    localStorage.clear();
  };

  // CSV Export utility
  const exportToCSV = (filename, rows) => {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : String(row[k]);
          cell = cell.replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        loaded,
        currentUser,
        login,
        logout,
        users,
        addUser,
        updateUser,
        deleteUser,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        generateStudentId,
        getStudentAttendanceStats,
        getStudentAverageRating,
        sessions,
        addSession,
        updateSession,
        attendance,
        saveBatchAttendance,
        feedbacks,
        addFeedback,
        resetDemoData,
        exportToCSV
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
