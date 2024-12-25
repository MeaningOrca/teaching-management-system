// Display section based on button clicked
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}


// Logout function (simple demo, replace with actual functionality)
function logout() {
    document.getElementById('student-page').style.display = 'none';
    document.getElementById('teacher-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'none';
    document.getElementById('counselor-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
}

function getCSRFToken() {
    const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
}

// Simulate user login process based on role
function simulateLogin(role) {
    if (role === 'student') {
        showPage('student-page', 'Student');
    } else if (role === 'teacher') {
        showPage('teacher-page', 'Teacher');
    } else if (role === 'admin') {
        showPage('admin-page', 'Admin');
    } else if (role === 'counselor') {
        showPage('counselor-page', 'Counselor');
    }
}

// Function to show the appropriate user page and set the welcome message
function showPage(pageId, username) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the specific user page
    document.getElementById(pageId).style.display = 'block';

    // Set the welcome message
    document.querySelector(`#${pageId} .dashboard-header h2 span`).innerText = username;
}

// Logout function
function logout() {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the login page
    document.getElementById('login-page').style.display = 'block';
}

// Function to display specific sections
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => (section.style.display = "none"));
    document.getElementById(sectionId).style.display = "block";
}

// Function to display user management forms
function showUserForm(action) {
    const container = document.getElementById("user-form-container");
    container.innerHTML = ""; // Clear existing content

    if (action === "add") {
        container.innerHTML = `
            <h4>Add User</h4>
            <label for="user-type">Select User Type:</label>
            <select id="user-type" onchange="showUserTypeFields()">
                <option value="">--Select Type--</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="counselor">Counselor</option>
            </select>
            <div id="user-fields"></div>
            <button onclick="submitUser('add')">Submit</button>
        `;
    } else if (action === "modify") {
        container.innerHTML = `
            <h4>Modify User</h4>
            <label for="search-user-id">Search by ID/Name:</label>
            <input type="text" id="search-user-id">
            <button onclick="searchUser()">Search</button>
            <div id="modify-user-fields"></div>
            <button onclick="submitUser('modify')">Update</button>
        `;
    } else if (action === "delete") {
        container.innerHTML = `
            <h4>Delete User</h4>
            <label for="delete-user-id">Search by ID/Name:</label>
            <input type="text" id="delete-user-id">
            <button onclick="deleteUser()">Delete</button>
        `;
    }
}

// Function to display course management forms
function showCourseForm(action) {
    const container = document.getElementById("course-form-container");
    container.innerHTML = ""; // Clear existing content

    if (action === "add") {
        container.innerHTML = `
            <h4>Add Course</h4>
            <label for="course-id">Course ID:</label>
            <input type="text" id="course-id">
            <label for="course-name">Course Name:</label>
            <input type="text" id="course-name">
            <label for="course-semester">Semester:</label>
            <input type="text" id="course-semester">
            <label for="course-teacher">Select Teacher:</label>
            <select id="course-teacher"></select>
            <button onclick="submitCourse('add')">Submit</button>
        `;
        fetchTeachers();
    } else if (action === "modify") {
        container.innerHTML = `
            <h4>Modify Course</h4>
            <label for="search-course-id">Search by Course ID:</label>
            <input type="text" id="search-course-id">
            <button onclick="searchCourse()">Search</button>
            <div id="modify-course-fields"></div>
            <button onclick="submitCourse('modify')">Update</button>
        `;
    } else if (action === "delete") {
        container.innerHTML = `
            <h4>Delete Course</h4>
            <label for="delete-course-id">Search by Course ID:</label>
            <input type="text" id="delete-course-id">
            <button onclick="deleteCourse()">Delete</button>
        `;
    }
}

// Function to display dynamic fields based on user type
function showUserTypeFields() {
    const userType = document.getElementById("user-type").value;
    const userFields = document.getElementById("user-fields");
    userFields.innerHTML = ""; // Clear existing fields

    if (userType === "student") {
        userFields.innerHTML = `
            <label for="student-id">ID:</label>
            <input type="text" id="student-id">
            <label for="student-name">Name:</label>
            <input type="text" id="student-name">
            <label for="student-gender">Gender:</label>
            <select id="student-gender">
                <option value="m">Male</option>
                <option value="f">Female</option>
            </select>
            <label for="student-birthdate">Birthdate:</label>
            <input type="date" id="student-birthdate">
            <label for="student-class">Class:</label>
            <input type="text" id="student-class">
            <label for="student-major">Major:</label>
            <select id="student-major">
                <option value="">--Select Major--</option>
                <option value="computer-science">Computer Science</option>
                <option value="engineering">Engineering</option>
                <option value="mathematics">Mathematics</option>
            </select>
        `;
    } else if (userType === "teacher") {
        userFields.innerHTML = `
            <label for="teacher-id">ID:</label>
            <input type="text" id="teacher-id">
            <label for="teacher-name">Name:</label>
            <input type="text" id="teacher-name">
            <label for="teacher-gender">Gender:</label>
            <select id="teacher-gender">
                <option value="m">Male</option>
                <option value="f">Female</option>
            </select>
            <label for="teacher-department">Department:</label>
            <select id="teacher-department">
                <option value="">--Select Department--</option>
                <option value="computer-science">Computer Science</option>
                <option value="mathematics">Mathematics</option>
                <option value="engineering">Engineering</option>
            </select>
            <label for="teacher-contact">Contact:</label>
            <input type="text" id="teacher-contact">
        `;
    } else if (userType === "admin") {
        userFields.innerHTML = `
            <label for="admin-id">ID:</label>
            <input type="text" id="admin-id">
            <label for="admin-name">Admin Name:</label>
            <input type="text" id="admin-name">
        `;
    } else if (userType === "counselor") {
        userFields.innerHTML = `
            <label for="counselor-id">ID:</label>
            <input type="text" id="counselor-id">
            <label for="counselor-name">Name:</label>
            <input type="text" id="counselor-name">
            <label for="counselor-course">Course:</label>
            <select id="counselor-course">
                <option value="">--Select Course--</option>
                <option value="course1">Course 1</option>
                <option value="course2">Course 2</option>
                <option value="course3">Course 3</option>
            </select>
        `;
    }
}

// Fetch teachers and populate dropdown
function fetchTeachers() {
    const teacherSelect = document.getElementById("course-teacher");
    fetch("/api/teachers") // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            teacherSelect.innerHTML = data
                .map(teacher => `<option value="${teacher.teacher_id}">${teacher.teacher_name}</option>`)
                .join("");
            console.log(data);
        })
        .catch(error => console.error("Error fetching teachers:", error));
}

function submitUser(action) {
    const data = {}; // Collect user data dynamically
    const userType = document.getElementById("user-type").value;

    data.type = userType;

    let isValid = true; 

    if (userType === "student") {
        data.id = document.getElementById("student-id").value;
        data.name = document.getElementById("student-name").value;
        data.gender = document.getElementById("student-gender").value;

        const birthdateInput = document.getElementById("student-birthdate").value;
        if (birthdateInput) {
            const formattedDate = formatDateToYYYYMMDD(birthdateInput);
            if (!formattedDate) {
                alert("Invalid date format. Please use yyyy-mm-dd.");
                isValid = false;
            } else {
                data.birthdate = formattedDate;
            }
        }

        data.class = document.getElementById("student-class").value;
        data.major = document.getElementById("student-major").value; // Major from the select
    } else if (userType === "teacher") {
        data.id = document.getElementById("teacher-id").value;
        data.name = document.getElementById("teacher-name").value;
        data.gender = document.getElementById("teacher-gender").value;
        data.department = document.getElementById("teacher-department").value; // Department from the select
        data.contact = document.getElementById("teacher-contact").value;
    } else if (userType === "admin") {
        data.id = document.getElementById("admin-id").value;
        data.name = document.getElementById("admin-name").value;
    } else if (userType === "counselor") {
        data.id = document.getElementById("counselor-id").value;
        data.name = document.getElementById("counselor-name").value;
        data.course = document.getElementById("counselor-course").value; // Course from the select
    }

    // Validate that id and name are not empty and the ID is an integer
    if (!data.id || !data.name) {
        alert("Both ID and Name are required!");
        isValid = false; // Set the flag to false if validation fails
    }

    // Validate that the ID is a valid integer
    if (isNaN(data.id) || !Number.isInteger(parseFloat(data.id))) {
        alert("ID must be a valid integer!");
        isValid = false;
    }

    if (!isValid) {
        return; // Stop function execution if validation fails
    }

    console.log(data); // Log the collected data for debugging

    // Determine the API endpoint based on the action
    const endpoint = action === "add" ? "/api/users/add" : "/api/users/modify";

    // Submit the data to the server using the Fetch API
    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((result) => {
            alert("User operation successful!");
            console.log("Server response:", result);
        })
        .catch((error) => {
            console.error("Error submitting user data:", error);
            alert("Failed to perform the operation. Please try again.");
        });
}

// Helper function to format the date to yyyy-mm-dd
function formatDateToYYYYMMDD(inputDate) {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
        return null; // Invalid date
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function deleteUser() {
    const userIdOrName = document.getElementById("delete-user-id").value;

    if (!userIdOrName) {
        alert("Please enter a user ID or name to delete.");
        return;
    }

    fetch(`/api/users/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: userIdOrName })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("User deleted successfully!");
            } else {
                alert("Error: " + result.message);
            }
        })
        .catch(error => console.error("Error deleting user:", error));
}

function deleteCourse() {
    const courseId = document.getElementById("delete-course-id").value;

    if (!courseId) {
        alert("Please enter a course ID to delete.");
        return;
    }

    fetch(`/api/courses/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: courseId })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Course deleted successfully!");
            } else {
                alert("Error: " + result.message);
            }
        })
        .catch(error => console.error("Error deleting course:", error));
}

function submitUser(action) {
    const data = {}; // Collect user data dynamically
    const userType = document.getElementById("user-type").value;

    data.type = userType;

    if (userType === "student") {
        data.id = document.getElementById("student-id").value;
        data.name = document.getElementById("student-name").value;
        data.gender = document.getElementById("student-gender").value;
        data.birthdate = document.getElementById("student-birthdate").value;
        data.class = document.getElementById("student-class").value;
        data.major = document.getElementById("student-major").value;
    } else if (userType === "teacher") {
        data.id = document.getElementById("teacher-id").value;
        data.name = document.getElementById("teacher-name").value;
        data.gender = document.getElementById("teacher-gender").value;
        data.department = document.getElementById("teacher-department").value;
        data.phone = document.getElementById("teacher-phone").value;
        data.email = document.getElementById("teacher-email").value;
    } else if (userType === "admin") {
        data.id = document.getElementById("admin-id").value;
        data.name = document.getElementById("admin-name").value;
    } else if (userType === "counselor") {
        data.id = document.getElementById("counselor-id").value;
        data.name = document.getElementById("counselor-name").value;
        data.course = document.getElementById("counselor-course").value;
    }

    console.log(data); // Log the collected data for debugging

    // Determine the API endpoint based on the action
    const endpoint = action === "add" ? "/api/users/add" : "/api/users/modify";

    // Submit the data to the server using the Fetch API
    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            alert("User operation successful!");
            console.log("Server response:", result);
        })
        .catch(error => {
            console.error("Error submitting user data:", error);
            alert("Failed to perform the operation. Please try again.");
        });
}

function addCourse() {
    // Collect course data from input fields
    const courseData = {
        id: document.getElementById("course-id").value,
        name: document.getElementById("course-name").value,
        semester: document.getElementById("course-semester").value,
        teacherId: document.getElementById("course-teacher").value
    };

    // Validate collected data
    if (!courseData.id || !courseData.name || !courseData.semester || !courseData.teacherId) {
        alert("All fields are required.");
        return;
    }

    // Submit course data to the server
    fetch("/api/courses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() },
        body: JSON.stringify(courseData)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Course added successfully!");
                document.getElementById("course-form-container").innerHTML = ""; // Clear form
            } else {
                alert("Error: " + result.message);
            }
        })
        .catch(error => console.error("Error adding course:", error));
}

function logout() {
    alert("Logged out successfully!");
    location.reload();
}


function loadCourses() {
    fetch('/get-courses/')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById("course-selection");
            // Очистить предыдущие опции
            selectElement.innerHTML = '<option value="">--Select a course--</option>';

            // Добавить новые опции
            data.courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.id;
                option.textContent = course.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading courses:', error));
}

// Загрузить курсы при загрузке страницы
window.onload = loadCourses;
