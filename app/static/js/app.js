// NGO Management Application - Client-Side Scripts

document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (sidebarToggle && sidebar && backdrop) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('show');
      backdrop.classList.toggle('show');
    });

    backdrop.addEventListener('click', function () {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
    });
  }

  // 2. Attendance Sheet Quick Mark Helpers
  const markAllPresentBtn = document.getElementById('markAllPresent');
  const markAllAbsentBtn = document.getElementById('markAllAbsent');
  const markAllLateBtn = document.getElementById('markAllLate');

  function setAllAttendance(status) {
    const radioButtons = document.querySelectorAll(`input[type="radio"][value="${status}"]`);
    radioButtons.forEach(radio => {
      radio.checked = true;
      // Trigger change event to update visual card styling
      radio.dispatchEvent(new Event('change'));
    });
    updateAttendanceCounters();
  }

  if (markAllPresentBtn) {
    markAllPresentBtn.addEventListener('click', () => setAllAttendance('Present'));
  }
  if (markAllAbsentBtn) {
    markAllAbsentBtn.addEventListener('click', () => setAllAttendance('Absent'));
  }
  if (markAllLateBtn) {
    markAllLateBtn.addEventListener('click', () => setAllAttendance('Late'));
  }

  function updateAttendanceCounters() {
    const presentCount = document.querySelectorAll('input[type="radio"][value="Present"]:checked').length;
    const absentCount = document.querySelectorAll('input[type="radio"][value="Absent"]:checked').length;
    const lateCount = document.querySelectorAll('input[type="radio"][value="Late"]:checked').length;

    const badgePresent = document.getElementById('badgePresentCount');
    const badgeAbsent = document.getElementById('badgeAbsentCount');
    const badgeLate = document.getElementById('badgeLateCount');

    if (badgePresent) badgePresent.textContent = presentCount;
    if (badgeAbsent) badgeAbsent.textContent = absentCount;
    if (badgeLate) badgeLate.textContent = lateCount;
  }

  // Listen to any attendance radio changes
  const attendanceRadios = document.querySelectorAll('.attendance-radio');
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', updateAttendanceCounters);
  });

  // Initial calculation on page load
  if (attendanceRadios.length > 0) {
    updateAttendanceCounters();
  }

  // 3. Auto dismiss flash alerts after 5 seconds
  setTimeout(function () {
    const alerts = document.querySelectorAll('.alert.alert-dismissible');
    alerts.forEach(alert => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    });
  }, 5000);

  // 4. Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
