import unittest
import os
from datetime import date, time
from app import create_app
from app.extensions import db
from app.models import User, Student, Session, Attendance, Feedback
from app.utils import generate_student_id


class NGOTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Create Admin
        self.admin = User(
            username='srinivas',
            email='srinivas@test.org',
            full_name='Srinivas',
            role='admin'
        )
        self.admin.set_password('srinivasngo')
        db.session.add(self.admin)

        # Create Teacher
        self.teacher = User(
            username='teacher',
            email='teacher@test.org',
            full_name='Staff Teacher',
            role='teacher'
        )
        self.teacher.set_password('srinivasngo')
        db.session.add(self.teacher)

        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def login(self, username, password):
        return self.client.post('/login', data={
            'username_or_email': username,
            'password': password
        }, follow_redirects=True)

    def logout(self):
        return self.client.get('/logout', follow_redirects=True)

    # 1. Auth Tests
    def test_login_and_logout(self):
        # Valid login
        res = self.login('srinivas', 'srinivasngo')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Dashboard & Insights', res.data)

        # Logout
        res = self.logout()
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Sign In', res.data)

        # Invalid login
        res = self.login('srinivas', 'wrongpassword')
        self.assertIn(b'Invalid username/email or password', res.data)

    # 2. RBAC Tests
    def test_admin_route_protection(self):
        # Teacher logged in
        self.login('teacher', 'srinivasngo')
        res = self.client.get('/users/', follow_redirects=True)
        self.assertIn(b'Access denied. Administrator privileges are required.', res.data)

        # Admin logged in
        self.logout()
        self.login('srinivas', 'srinivasngo')
        res = self.client.get('/users/', follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Staff & User Accounts', res.data)

    # 3. Student Auto ID Generation & CRUD Tests
    def test_student_auto_id_and_creation(self):
        self.login('srinivas', 'srinivasngo')
        
        # Test ID generation format
        gen_id = generate_student_id()
        self.assertTrue(gen_id.startswith('NGO-'))
        self.assertTrue(gen_id.endswith('-0001'))

        # Register Student
        res = self.client.post('/students/new', data={
            'full_name': 'Test Student',
            'gender': 'Male',
            'grade_class': 'Class 10',
            'school_name': 'Test High School',
            'joining_date': '2026-08-14',
            'status': 'Active'
        }, follow_redirects=True)
        
        self.assertEqual(res.status_code, 200)
        student = Student.query.filter_by(full_name='Test Student').first()
        self.assertIsNotNone(student)
        self.assertEqual(student.student_id, gen_id)

        # Next ID should increment to 0002
        next_id = generate_student_id()
        self.assertTrue(next_id.endswith('-0002'))

    # 4. Weekly Feedback & Rating Calculations
    def test_weekly_feedback_and_average_rating(self):
        self.login('teacher', 'srinivasngo')

        student = Student(
            student_id='NGO-2026-0001',
            full_name='Feedback Test Student',
            joining_date=date.today(),
            status='Active'
        )
        db.session.add(student)
        db.session.commit()

        # Submit Feedback 1 (Rating 4)
        self.client.post('/feedback/new', data={
            'student_id': student.id,
            'feedback_date': '2026-08-10',
            'subject_area': 'Mathematics',
            'attendance_obs': 'Regular & Punctual',
            'rating': '4',
            'academic_progress': 'Good grasp of concepts',
            'behaviour': 'Polite'
        }, follow_redirects=True)

        # Submit Feedback 2 (Rating 5)
        self.client.post('/feedback/new', data={
            'student_id': student.id,
            'feedback_date': '2026-08-14',
            'subject_area': 'Science',
            'attendance_obs': 'Regular & Punctual',
            'rating': '5',
            'academic_progress': 'Excellent performance'
        }, follow_redirects=True)

        # Verify average rating: (4 + 5) / 2 = 4.5
        db.session.refresh(student)
        self.assertEqual(student.average_rating, 4.5)
        self.assertEqual(student.feedbacks.count(), 2)

    # 5. Sessions & Attendance Marking Tests
    def test_session_creation_and_attendance(self):
        self.login('teacher', 'srinivasngo')

        student1 = Student(student_id='NGO-2026-0001', full_name='Student One', joining_date=date.today(), status='Active')
        student2 = Student(student_id='NGO-2026-0002', full_name='Student Two', joining_date=date.today(), status='Active')
        db.session.add_all([student1, student2])
        db.session.commit()

        session_obj = Session(
            title='Physics Workshop',
            date=date.today(),
            start_time=time(10, 0),
            end_time=time(11, 30),
            teacher_id=self.teacher.id,
            session_type='Skill Workshop',
            status='Scheduled'
        )
        db.session.add(session_obj)
        db.session.commit()

        # Mark Attendance: Student 1 = Present, Student 2 = Absent
        res = self.client.post(f'/sessions/{session_obj.id}/attendance', data={
            f'status_{student1.id}': 'Present',
            f'remarks_{student1.id}': 'On time',
            f'status_{student2.id}': 'Absent',
            f'remarks_{student2.id}': 'Illness',
            'mark_completed': '1'
        }, follow_redirects=True)

        self.assertEqual(res.status_code, 200)

        # Verify session status is completed
        db.session.refresh(session_obj)
        self.assertEqual(session_obj.status, 'Completed')

        # Check attendance stats
        summary = session_obj.attendance_summary
        self.assertEqual(summary['total'], 2)
        self.assertEqual(summary['present'], 1)
        self.assertEqual(summary['absent'], 1)

        # Check student 1 attendance %
        db.session.refresh(student1)
        self.assertEqual(student1.attendance_stats['percentage'], 100.0)

        # Check student 2 attendance %
        db.session.refresh(student2)
        self.assertEqual(student2.attendance_stats['percentage'], 0.0)

    # 6. Reports & CSV Export Tests
    def test_reports_and_csv_export(self):
        self.login('srinivas', 'srinivasngo')

        student = Student(student_id='NGO-2026-0001', full_name='Export Student', joining_date=date.today(), status='Active')
        db.session.add(student)
        db.session.commit()

        # Test Student report CSV
        res = self.client.get(f'/reports/students?student_id={student.id}&export=csv')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, 'text/csv')
        self.assertIn(b'Export Student', res.data)
        self.assertIn(b'NGO-2026-0001', res.data)

        # Test Attendance report CSV
        res = self.client.get('/reports/attendance?export=csv')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, 'text/csv')
        self.assertIn(b'NGO MANAGEMENT APPLICATION - ATTENDANCE REPORT', res.data)


if __name__ == '__main__':
    unittest.main()
