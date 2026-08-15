"""
NGO Management Application - Database Initialization & Seed Script
Populates the SQLite database with realistic demonstration data for students,
teachers, sessions, attendance logs, and weekly evaluations.
"""

import os
from datetime import datetime, date, time, timedelta
from app import create_app
from app.extensions import db
from app.models import User, Student, Session, Attendance, Feedback


def populate_seed_data(db_instance):
    """Populate database models within an active app context."""
    # 1. Users (Admin & Teachers)
    admin = User(
        username='srinivas',
        email='srinivas@ngo.org',
        full_name='Srinivas (Director)',
        role='admin',
        phone='+1 555 019 2831',
        is_active=True
    )
    admin.set_password('srinivasngo')
    db_instance.session.add(admin)

    teacher1 = User(
        username='teacher',
        email='teacher@ngo.org',
        full_name='Staff Teacher',
        role='teacher',
        phone='+1 555 014 9922',
        is_active=True
    )
    teacher1.set_password('srinivasngo')
    db_instance.session.add(teacher1)

    teacher2 = User(
        username='david.kumar',
        email='david.kumar@ngo.org',
        full_name='David Kumar',
        role='teacher',
        phone='+1 555 017 4488',
        is_active=True
    )
    teacher2.set_password('srinivasngo')
    db_instance.session.add(teacher2)

    db_instance.session.commit()

    # 2. Students (10 diverse student records)
    students_data = [
        {
            'student_id': 'NGO-2026-0001',
            'full_name': 'Aarav Sharma',
            'dob': date(2012, 5, 14),
            'gender': 'Male',
            'parent_name': 'Ramesh Sharma',
            'phone': '+1 555 101 0001',
            'email': 'aarav.sharma@example.com',
            'address': 'Flat 4B, Sunrise Enclave, East District',
            'joining_date': date(2025, 9, 1),
            'grade_class': 'Class 7',
            'school_name': 'Greenwood Public School',
            'status': 'Active',
            'notes': 'Shows high aptitude for STEM subjects. Enthusiastic learner.'
        },
        {
            'student_id': 'NGO-2026-0002',
            'full_name': 'Ananya Patel',
            'dob': date(2011, 8, 22),
            'gender': 'Female',
            'parent_name': 'Kavita Patel',
            'phone': '+1 555 101 0002',
            'email': 'ananya.p@example.com',
            'address': '22 Lakeview Road, Ward 5',
            'joining_date': date(2025, 9, 1),
            'grade_class': 'Class 8',
            'school_name': 'St. Jude Academy',
            'status': 'Active',
            'notes': 'Excels in reading comprehension and creative arts.'
        },
        {
            'student_id': 'NGO-2026-0003',
            'full_name': 'Rohan Gupta',
            'dob': date(2013, 3, 10),
            'gender': 'Male',
            'parent_name': 'Sanjay Gupta',
            'phone': '+1 555 101 0003',
            'email': None,
            'address': 'Sector 12, Block C, Metro Housing',
            'joining_date': date(2025, 10, 15),
            'grade_class': 'Class 6',
            'school_name': 'City Model High School',
            'status': 'Active',
            'notes': 'Needs support in basic numeracy. Very polite and respectful.'
        },
        {
            'student_id': 'NGO-2026-0004',
            'full_name': 'Priya Nair',
            'dob': date(2010, 11, 30),
            'gender': 'Female',
            'parent_name': 'Meera Nair',
            'phone': '+1 555 101 0004',
            'email': 'priya.nair@example.com',
            'address': '18 Rose Garden Lane',
            'joining_date': date(2025, 8, 10),
            'grade_class': 'Class 9',
            'school_name': 'National High School',
            'status': 'Active',
            'notes': 'Demonstrates exceptional leadership and debate skills.'
        },
        {
            'student_id': 'NGO-2026-0005',
            'full_name': 'Bilal Ahmed',
            'dob': date(2012, 1, 18),
            'gender': 'Male',
            'parent_name': 'Tariq Ahmed',
            'phone': '+1 555 101 0005',
            'email': None,
            'address': 'Plot 90, Central Avenue',
            'joining_date': date(2025, 11, 5),
            'grade_class': 'Class 7',
            'school_name': 'Govt. Boys Middle School',
            'status': 'Active',
            'notes': 'Loves sports and hands-on scientific experiments.'
        },
        {
            'student_id': 'NGO-2026-0006',
            'full_name': 'Fatima Sheikh',
            'dob': date(2011, 7, 9),
            'gender': 'Female',
            'parent_name': 'Zainab Sheikh',
            'phone': '+1 555 101 0006',
            'email': 'fatima.s@example.com',
            'address': '45 Heritage Square',
            'joining_date': date(2025, 9, 15),
            'grade_class': 'Class 8',
            'school_name': 'St. Jude Academy',
            'status': 'Active',
            'notes': 'Consistent attendance and very attentive during sessions.'
        },
        {
            'student_id': 'NGO-2026-0007',
            'full_name': 'Karan Verma',
            'dob': date(2014, 4, 25),
            'gender': 'Male',
            'parent_name': 'Deepak Verma',
            'phone': '+1 555 101 0007',
            'email': None,
            'address': '77 Market Road, North Zone',
            'joining_date': date(2026, 1, 10),
            'grade_class': 'Class 5',
            'school_name': 'Primary Learning Center',
            'status': 'Active',
            'notes': 'Younger beneficiary; developing foundational reading skills.'
        },
        {
            'student_id': 'NGO-2026-0008',
            'full_name': 'Sneha Mukherjee',
            'dob': date(2009, 12, 12),
            'gender': 'Female',
            'parent_name': 'Debashis Mukherjee',
            'phone': '+1 555 101 0008',
            'email': 'sneha.m@example.com',
            'address': '12 Old Town Street',
            'joining_date': date(2024, 6, 1),
            'grade_class': 'Class 10',
            'school_name': 'National High School',
            'status': 'Graduated',
            'notes': 'Successfully graduated our senior youth empowerment track!'
        },
        {
            'student_id': 'NGO-2026-0009',
            'full_name': 'Arjun Das',
            'dob': date(2012, 9, 5),
            'gender': 'Male',
            'parent_name': 'Bikram Das',
            'phone': '+1 555 101 0009',
            'email': None,
            'address': '84 Railway Colony',
            'joining_date': date(2025, 10, 1),
            'grade_class': 'Class 7',
            'school_name': 'Greenwood Public School',
            'status': 'On Leave',
            'notes': 'On temporary family medical leave until next month.'
        },
        {
            'student_id': 'NGO-2026-0010',
            'full_name': 'Diya Sen',
            'dob': date(2013, 6, 17),
            'gender': 'Female',
            'parent_name': 'Mitali Sen',
            'phone': '+1 555 101 0010',
            'email': 'diya.sen@example.com',
            'address': '33 Palm Grove',
            'joining_date': date(2026, 2, 1),
            'grade_class': 'Class 6',
            'school_name': 'City Model High School',
            'status': 'Active',
            'notes': 'Recently enrolled. Showing eager participation in peer groups.'
        }
    ]

    students = []
    for s_data in students_data:
        s = Student(**s_data)
        db_instance.session.add(s)
        students.append(s)
        
    db_instance.session.commit()

    # 3. Sessions
    today = date.today()
    sessions_data = [
        {
            'title': 'Mathematics & Geometry Foundations',
            'date': today - timedelta(days=14),
            'start_time': time(9, 30),
            'end_time': time(11, 0),
            'teacher_id': teacher1.id,
            'location': 'Learning Room A',
            'description': 'Covered 2D geometry, angles, triangles, and interactive problem solving.',
            'session_type': 'Academic',
            'status': 'Completed'
        },
        {
            'title': 'English Literacy & Essay Writing Workshop',
            'date': today - timedelta(days=10),
            'start_time': time(14, 0),
            'end_time': time(15, 30),
            'teacher_id': teacher2.id,
            'location': 'Community Hall Library',
            'description': 'Vocabulary enrichment and short story composition practice.',
            'session_type': 'Academic',
            'status': 'Completed'
        },
        {
            'title': 'Hands-on Science & Physics Experiments',
            'date': today - timedelta(days=7),
            'start_time': time(10, 0),
            'end_time': time(12, 0),
            'teacher_id': teacher1.id,
            'location': 'Science Lab 1',
            'description': 'Simple circuit building, magnetism, and basic thermodynamics principles.',
            'session_type': 'Skill Workshop',
            'status': 'Completed'
        },
        {
            'title': 'Life Skills, Hygiene & Digital Literacy',
            'date': today - timedelta(days=3),
            'start_time': time(11, 0),
            'end_time': time(12, 30),
            'teacher_id': teacher2.id,
            'location': 'Computer Lab B',
            'description': 'Basics of keyboard navigation, safe internet browsing, and health habits.',
            'session_type': 'Life Skills',
            'status': 'Completed'
        },
        {
            'title': 'Peer Mentorship & Career Guidance Circle',
            'date': today + timedelta(days=3),
            'start_time': time(10, 0),
            'end_time': time(11, 30),
            'teacher_id': admin.id,
            'location': 'Auditorium Room 2',
            'description': 'Goal setting, overcoming study obstacles, and career pathways discussion.',
            'session_type': 'Mentorship',
            'status': 'Scheduled'
        },
        {
            'title': 'Art, Music & Creative Expressions',
            'date': today + timedelta(days=7),
            'start_time': time(15, 0),
            'end_time': time(16, 30),
            'teacher_id': teacher1.id,
            'location': 'Activity Lawn',
            'description': 'Painting, rhythm exercises, and confidence building through creative arts.',
            'session_type': 'Extracurricular',
            'status': 'Scheduled'
        }
    ]

    sessions = []
    for sess_data in sessions_data:
        sess = Session(**sess_data)
        db_instance.session.add(sess)
        sessions.append(sess)
        
    db_instance.session.commit()

    # 4. Attendance
    attendance_statuses = ['Present', 'Present', 'Present', 'Present', 'Late', 'Present', 'Absent', 'Present']
    completed_sessions = [s for s in sessions if s.status == 'Completed']
    active_students = [s for s in students if s.status == 'Active']
    
    for i, sess in enumerate(completed_sessions):
        for j, student in enumerate(active_students):
            status = attendance_statuses[(i + j) % len(attendance_statuses)]
            remarks = "Traffic delay" if status == "Late" else ("Sick leave" if status == "Absent" else None)
            
            att = Attendance(
                session_id=sess.id,
                student_id=student.id,
                status=status,
                remarks=remarks,
                marked_by_id=sess.teacher_id or admin.id
            )
            db_instance.session.add(att)
            
    db_instance.session.commit()

    # 5. Weekly Feedbacks
    feedbacks_data = [
        {
            'student_id': students[0].id,
            'teacher_id': teacher1.id,
            'feedback_date': today - timedelta(days=12),
            'subject_area': 'Mathematics & Geometry',
            'attendance_obs': 'Regular & Punctual',
            'rating': 5,
            'academic_progress': 'Grasped geometry formulas very quickly. Solved all challenge problems.',
            'behaviour': 'Extremely courteous, collaborative with lab partner.',
            'participation': 'Asked insightful questions regarding real-world area calculation.',
            'strengths': 'Strong analytical mind, quick arithmetic speed.',
            'improvement_areas': 'Could write down intermediate working steps more clearly.',
            'comments': 'Aarav is an outstanding student with high motivation.'
        },
        {
            'student_id': students[0].id,
            'teacher_id': teacher2.id,
            'feedback_date': today - timedelta(days=5),
            'subject_area': 'Physics & Circuit Workshop',
            'attendance_obs': 'Regular & Punctual',
            'rating': 4,
            'academic_progress': 'Successfully constructed parallel and series circuits.',
            'behaviour': 'Helpful to teammates who were struggling with components.',
            'participation': 'Active participant throughout the 2-hour session.',
            'strengths': 'Hands-on dexterity and problem-solving initiative.',
            'improvement_areas': 'Needs to document observations simultaneously.',
            'comments': 'Consistent high performance.'
        },
        {
            'student_id': students[1].id,
            'teacher_id': teacher2.id,
            'feedback_date': today - timedelta(days=10),
            'subject_area': 'English Literacy & Creative Writing',
            'attendance_obs': 'Regular & Punctual',
            'rating': 5,
            'academic_progress': 'Wrote an evocative short story demonstrating advanced vocabulary.',
            'behaviour': 'Exemplary focus and quiet diligence.',
            'participation': 'Read her narrative aloud with poise and confidence.',
            'strengths': 'Creative imagination, natural storytelling, excellent grammar.',
            'improvement_areas': 'Encourage participation in technical/math tracks as well.',
            'comments': 'Ananya is a gifted writer.'
        },
        {
            'student_id': students[2].id,
            'teacher_id': teacher1.id,
            'feedback_date': today - timedelta(days=14),
            'subject_area': 'Mathematics & Numeracy',
            'attendance_obs': 'Mostly Regular',
            'rating': 2,
            'academic_progress': 'Struggling with multi-digit fractions and division operations.',
            'behaviour': 'Well-behaved but becomes shy when called upon to answer.',
            'participation': 'Hesitant to volunteer without 1-on-1 encouragement.',
            'strengths': 'Willing to learn and tries repeatedly until guided.',
            'improvement_areas': 'Needs additional 1-on-1 remedial practice in fractions.',
            'comments': 'Recommend paired tutoring with extra practice sheets.'
        },
        {
            'student_id': students[2].id,
            'teacher_id': teacher1.id,
            'feedback_date': today - timedelta(days=6),
            'subject_area': 'Basic Science Experiments',
            'attendance_obs': 'Regular & Punctual',
            'rating': 3,
            'academic_progress': 'Much more engaged during visual and tactile experiments.',
            'behaviour': 'Enthusiastic and respectful.',
            'participation': 'Showed curiosity in magnetism demonstrations.',
            'strengths': 'Visual-spatial learning ability.',
            'improvement_areas': 'Recall of formal scientific terminology.',
            'comments': 'Progressing well compared to last week!'
        },
        {
            'student_id': students[3].id,
            'teacher_id': teacher2.id,
            'feedback_date': today - timedelta(days=8),
            'subject_area': 'Social Studies & Life Skills',
            'attendance_obs': 'Regular & Punctual',
            'rating': 4,
            'academic_progress': 'Articulated nuanced perspectives on environmental conservation.',
            'behaviour': 'Natural leader; helps keep group discussion constructive.',
            'participation': 'High engagement throughout.',
            'strengths': 'Public speaking and critical reasoning.',
            'improvement_areas': 'Time management during timed written tests.',
            'comments': 'Priya is emerging as a role model among peers.'
        },
        {
            'student_id': students[4].id,
            'teacher_id': teacher1.id,
            'feedback_date': today - timedelta(days=7),
            'subject_area': 'General Science',
            'attendance_obs': 'Frequently Late',
            'rating': 3,
            'academic_progress': 'Good grasp of concepts once settled in class.',
            'behaviour': 'Energetic; occasionally gets distracted by classmates.',
            'participation': 'Volunteers enthusiastically for lab demonstrations.',
            'strengths': 'High energy, curiosity, mechanical intuition.',
            'improvement_areas': 'Punctuality and sustained focus during lectures.',
            'comments': 'Follow up with guardian regarding bus transit timing.'
        },
        {
            'student_id': students[5].id,
            'teacher_id': teacher2.id,
            'feedback_date': today - timedelta(days=4),
            'subject_area': 'Digital Literacy',
            'attendance_obs': 'Regular & Punctual',
            'rating': 4,
            'academic_progress': 'Mastered spreadsheet data entry and typing exercises quickly.',
            'behaviour': 'Polite, disciplined, very supportive to peers.',
            'participation': 'Steady, reliable contributor in group assignments.',
            'strengths': 'Attention to detail and methodological approach.',
            'improvement_areas': 'Could be encouraged to voice independent opinions more.',
            'comments': 'Consistently high standard of work.'
        }
    ]

    for fb_data in feedbacks_data:
        fb = Feedback(**fb_data)
        db_instance.session.add(fb)
        
    db_instance.session.commit()


def seed_database(app=None):
    if app is None:
        app = create_app()
        
    with app.app_context():
        print("=" * 60)
        print("[*] Initializing NGO Management Application Database...")
        print("=" * 60)

        db.drop_all()
        db.create_all()
        populate_seed_data(db)

        print("[+] Created users, students, sessions, attendance, and feedback.")
        print("=" * 60)
        print("[SUCCESS] Database seeded successfully!")
        print("=" * 60)
        print("DEFAULT LOGIN CREDENTIALS:")
        print("  - Admin:   Username: 'srinivas'  Password: 'srinivasngo'")
        print("  - Teacher: Username: 'teacher'   Password: 'srinivasngo'")
        print("=" * 60)


if __name__ == '__main__':
    seed_database()
