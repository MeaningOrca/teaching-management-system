// Display section based on button clicked
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}


function loadCourses(elementID) {
    fetch('/get-courses/')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById(elementID);
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

async function searchUser() {
    const baseUrl = "http://localhost:8000/api/users/search";
    const params = {
        user_id: document.getElementById("search-user-id").value,
    };

    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

    try {
        const response = await fetch(url.toString());
        if (response.ok) {
            const result = await response.json();
            console.log("API Response:", result);  // Log the response to inspect the data
            displayResultsAsTable(result);
        } else {
            const error = await response.json();
            alert('Failed to find user: ' + error.message);
        }
    } catch (error) {
        alert('Error connecting to server: ' + error.message);
    }
}


function displayResultsAsTable(data) {
    const tableContainer = document.getElementById("table-container");

    if (!tableContainer) {
        console.error("Error: table-container not found.");
        return;
    }

    // Clear any existing table content
    tableContainer.innerHTML = "";

    // Create table and header row
    const table = document.createElement("table");
    table.setAttribute("border", "1");
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Add table headers
    const headers = [
        "User Type", "ID", "Name", "Gender", "Birthday", "Class/Department", "Contact", "Actions"
    ];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    header.appendChild(headerRow);
    table.appendChild(header);

    // Create a body section for the table
    const tbody = document.createElement("tbody");

    // Process the response and display each user type (admin, counselor, student, teacher)
    const userTypes = ["admin", "counselor", "student", "teacher"];

    userTypes.forEach(userType => {
        if (data[userType]) {
            const user = data[userType];

            const row = document.createElement("tr");

            // Add user type column
            const userTypeCell = document.createElement("td");
            userTypeCell.textContent = capitalizeFirstLetter(userType);
            row.appendChild(userTypeCell);

            // Add ID column
            const idCell = document.createElement("td");
            idCell.textContent = user[`${userType}_id`] || "N/A";
            row.appendChild(idCell);

            // Add Name column
            const nameCell = document.createElement("td");
            nameCell.textContent = user[`${userType}_name`] || "N/A";
            row.appendChild(nameCell);

            // Add Gender column (only for student and teacher)
            const genderCell = document.createElement("td");
            genderCell.textContent = user.gender || "N/A";
            row.appendChild(genderCell);

            // Add Birthday column (only for student)
            const birthdayCell = document.createElement("td");
            birthdayCell.textContent = user.birthday || "N/A";
            row.appendChild(birthdayCell);

            // Add Class/Department column
            const classDeptCell = document.createElement("td");
            classDeptCell.textContent = user.class_assigned || user.department || "N/A";
            row.appendChild(classDeptCell);

            // Add Contact column (only for teacher)
            const contactCell = document.createElement("td");
            contactCell.textContent = user.contact || "N/A";
            row.appendChild(contactCell);

            // Add Edit/Delete actions
            const actionsCell = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = function() { editUser(user, userType); };  // Pass user and userType
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function() { deleteUser(user, userType); };  // Pass user and userType

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        }
    });

    // Append body and table to the container
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}


// Helper function to capitalize first letter of user type
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function editUser(user, userType) {
    // You can create a modal or use a form to allow the user to edit
    const formContainer = document.getElementById("edit-form-container");

    if (!formContainer) {
        console.error("Form container not found.");
        return;
    }

    // Clear any existing content
    formContainer.innerHTML = "";

    // Create the form
    const form = document.createElement("form");

    // Generate form fields based on the user type
    const userFields = {
        student: ["student_name", "gender", "birthday", "class_assigned", "department"],
        teacher: ["teacher_name", "gender", "contact", "department"],
        counselor: ["counselor_name", "department", "class_assigned", "course"],
        admin: ["admin_name"]
    };

    // Create form elements for all fields
    userFields[userType].forEach(field => {
        const label = document.createElement("label");
        label.textContent = field.replace(/_/g, " ").toUpperCase() + ":";
        const input = document.createElement("input");
        input.type = "text";
        input.id = field;
        input.value = user[field] || "";  // Allow null or empty field to be edited
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement("br"));
    });

    // Add Save Button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Changes";
    saveButton.type = "button";
    saveButton.onclick = function() {
        saveUserChanges(user, userType);  // Pass user and userType
    };
    form.appendChild(saveButton);

    // Append form to the container
    formContainer.appendChild(form);
}

function saveUserChanges(user, userType) {
    // Get the updated values from the form
    const updatedData = {};
    const userFields = {
        student: ["student_name", "gender", "birthday", "class_assigned", "department"],
        teacher: ["teacher_name", "gender", "contact", "department"],
        counselor: ["counselor_name", "department", "class_assigned", "course"],
        admin: ["admin_name"]
    };

    // Retrieve updated data from form fields
    userFields[userType].forEach(field => {
        updatedData[field] = document.getElementById(field).value || null;  // Set null if empty
    });

    // Send updated data to the server (use PUT method for update)
    const url = `http://localhost:8000/api/users/update/${user[`${userType}_id`]}`;
    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
        alert("User updated successfully");
        searchUser();  // Re-fetch the data after saving changes
    })
    .catch(error => {
        console.error("Error updating user:", error);
    });
}

async function deleteUser(user) {
    // Prompt for the user type (this works without needing an HTML element)
    const userType = prompt("Please enter the user type (admin, student, teacher, counselor) to delete:").toLowerCase();

    // Check if the user provided a valid user type
    const validUserTypes = ["admin", "student", "teacher", "counselor"];
    if (!validUserTypes.includes(userType)) {
        alert("Invalid user type. Please enter a valid user type.");
        return;
    }

    // Dynamically get the user ID based on the type
    const userId = user[`${userType}_id`];  // Make sure `user` object has `${userType}_id`

    if (!userId) {
        alert("User ID not found.");
        return;
    }

    const url = `http://localhost:8000/api/users/delete/${userId}`;

    // Confirm the delete action
    const confirmDelete = confirm(`Are you sure you want to delete this ${userType}?`);
    if (!confirmDelete) return;

    try {
        const response = await fetch(url, { method: "DELETE",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() },

        });

        if (response.ok) {
            const result = await response.json();
            alert(`${capitalizeFirstLetter(userType)} deleted successfully!`);
            searchUser();  // Re-fetch the list of users after deletion
        } else {
            const error = await response.json();
            alert(`Failed to delete user: ${error.message}`);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting the user.");
    }
}

function populateModifyUserFields(user) {
    console.log(user)
    const modifyFields = document.getElementById("modify-user-fields");
    modifyFields.innerHTML = `
        <label for="modify-user-name">Name:</label>
        <input type="text" id="modify-user-name" value="${user.data.name}">
        <label for="modify-user-gender">Gender:</label>
        <select id="modify-user-gender">
            <option value="m" ${user.gender === "m" ? "selected" : ""}>Male</option>
            <option value="f" ${user.gender === "f" ? "selected" : ""}>Female</option>
        </select>
        <!-- Add other fields as needed -->
    `;
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
            <div id="table-container"></div>
            <div id="edit-form-container"></div>
            <div id="modify-user-fields"></div>
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
            <label for="course-credits">Credits:</label>
            <input type="text" id="course-credit">
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
            <label for="counselor-class">Class:</label>
            <input type="text" id="counselor-class">
            <label for="counselor-course">Course:</label>
            <select id="counselor-department">
                <option value="">--Select Department--</option>
                <option value="computer-science">Computer Science</option>
                <option value="mathematics">Mathematics</option>
                <option value="engineering">Engineering</option>
            </select>
            <select id="counselor-course">
                <option value="">--Select Course--</option>
                <option value="course1">Course 1</option>
                <option value="course2">Course 2</option>
                <option value="course3">Course 3</option>
            </select>
        `;
        loadCourses("counselor-course");
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
        })
        .catch(error => console.error("Error fetching teachers:", error));
}

function submitUser(action) {
    const data = {}; // Collect user data dynamically
    const userType = document.getElementById("user-type").value;

    data.type = userType;

    let isValid = true; // Validation flag

    // Collect data based on user type
    if (userType === "student") {
        data.id = document.getElementById("student-id")?.value?.trim();
        data.name = document.getElementById("student-name")?.value?.trim();
        data.gender = document.getElementById("student-gender")?.value;
        data.class = document.getElementById("student-class")?.value?.trim();
        data.major = document.getElementById("student-major")?.value;

        const birthdateInput = document.getElementById("student-birthdate")?.value;
        if (birthdateInput) {
            const formattedDate = formatDateToYYYYMMDD(birthdateInput);
            if (!formattedDate) {
                alert("Invalid date format. Please use yyyy-mm-dd.");
                isValid = false;
            } else {
                data.birthdate = formattedDate;
            }
        }
    } else if (userType === "teacher") {
        data.id = document.getElementById("teacher-id")?.value?.trim();
        data.name = document.getElementById("teacher-name")?.value?.trim();
        data.gender = document.getElementById("teacher-gender")?.value;
        data.department = document.getElementById("teacher-department")?.value;
        data.contact = document.getElementById("teacher-contact")?.value?.trim();
    } else if (userType === "admin") {
        data.id = document.getElementById("admin-id")?.value?.trim();
        data.name = document.getElementById("admin-name")?.value?.trim();
    } else if (userType === "counselor") {
        data.id = document.getElementById("counselor-id")?.value?.trim();
        data.name = document.getElementById("counselor-name")?.value?.trim();
        data.course = document.getElementById("counselor-course")?.value;
        data.department = document.getElementById("counselor-department")?.value;
        data.class = document.getElementById("counselor-class").value
    } else {
        alert("Invalid user type selected.");
        return;
    }

    // Validate ID and Name
    if (!data.id || !data.name) {
        alert("Both ID and Name are required!");
        isValid = false;
    }

    // Validate ID as an integer
    if (isNaN(data.id) || !Number.isInteger(parseFloat(data.id))) {
        alert("ID must be a valid integer!");
        isValid = false;
    }

    if (!isValid) {
        return; // Stop execution if validation fails
    }

    console.log("Collected data:", data); // Debugging log

    // Determine API endpoint based on action
    const endpoint = action === "add" ? "/api/users/add" : "/api/users/modify";

    // Submit the data to the server
    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() },
        body: JSON.stringify(data),
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

// Function to submit the course (add or modify)
function submitCourse(action) {
    const data = {}; // Data to send
    let isValid = true;

    if (action === "add") {
        // Collect course data for adding
        data.courseId = document.getElementById("course-id")?.value?.trim();
        data.courseName = document.getElementById("course-name")?.value?.trim();
        data.semester = document.getElementById("course-semester")?.value?.trim();
        data.teacherId = document.getElementById("course-teacher")?.value;
        data.credits = document.getElementById("course-credit")?.value;

        // Validate the input
        if (!data.courseId || !data.courseName || !data.semester || !data.teacherId) {
            alert("All fields (Course ID, Course Name, Semester, Teacher) are required!");
            isValid = false;
        }

        // Ensure Course ID is required and valid
        if (!data.courseId) {
            alert("Course ID is required!");
            isValid = false;
        }
        if (isNaN(data.courseId) || !Number.isInteger(parseFloat(data.courseId))) {
            alert("Course ID must be a valid integer!");
            isValid = false;
        }

        // Ensure Course Name is required
        if (!data.courseName) {
            alert("Course Name is required!");
            isValid = false;
        }

        // Ensure Semester is required and valid
        if (!data.semester) {
            alert("Semester is required!");
            isValid = false;
        }
        if (isNaN(data.semester) || !Number.isInteger(parseFloat(data.semester))) {
            alert("Semester must be a valid integer!");
            isValid = false;
        }
    } else if (action === "modify") {
        // Collect data for modifying a course
        const searchCourseId = document.getElementById("search-course-id")?.value?.trim();
        if (!searchCourseId) {
            alert("Please enter the Course ID to search!");
            isValid = false;
        }

        // Optionally, collect modify fields here after searching the course
        data.courseId = searchCourseId;
    } else if (action === "delete") {
        // Collect course ID for deletion
        data.courseId = document.getElementById("delete-course-id")?.value?.trim();
        if (!data.courseId) {
            alert("Please enter the Course ID to delete!");
            isValid = false;
        }

        // Validate that the Course ID is an integer
        if (isNaN(data.courseId) || !Number.isInteger(parseFloat(data.courseId))) {
            alert("Course ID must be a valid integer!");
            isValid = false;
        }
    }

    if (!isValid) {
        return; // Stop the function if validation fails
    }

    console.log("Submitting course data:", data);

    // API endpoint based on action (add/modify/delete)
    let endpoint;
    if (action === "add") {
        endpoint = "/api/courses/add";
    } else if (action === "modify") {
        endpoint = "/api/courses/modify";
    } else if (action === "delete") {
        endpoint = "/api/courses/delete";
    }

    // Send the request to the API endpoint
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
            alert(`Course operation successful!`);
            console.log("Server response:", result);
        })
        .catch(error => {
            console.error("Error submitting course data:", error);
            alert("Failed to perform the operation. Please try again.");
        });
}

// Function to search a course (for modifying it)
function searchCourse() {
    const courseId = document.getElementById("search-course-id")?.value?.trim();
    if (!courseId) {
        alert("Please enter a valid Course ID!");
        return;
    }

    fetch(`/api/courses/${courseId}`) // Replace with your actual endpoint
        .then(response => response.json())
        .then(course => {
            if (course) {
                // Populate the form fields with the course details
                document.getElementById("modify-course-fields").innerHTML = `
                    <label for="course-name">Course Name:</label>
                    <input type="text" id="course-name" value="${course.name}">
                    <label for="course-semester">Semester:</label>
                    <input type="text" id="course-semester" value="${course.semester}">
                    <label for="course-teacher">Teacher:</label>
                    <select id="course-teacher">
                        ${course.teachers.map(teacher => `<option value="${teacher.id}">${teacher.name}</option>`).join("")}
                    </select>
                `;
            } else {
                alert("Course not found!");
            }
        })
        .catch(error => console.error("Error searching course:", error));
}

// Function to delete a course
function deleteCourse() {
    const courseId = document.getElementById("delete-course-id")?.value?.trim();
    if (!courseId) {
        alert("Please enter the Course ID to delete!");
        return;
    }

    fetch(`/api/courses/delete/${courseId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete course. Status: ${response.status}`);
            }
            alert("Course deleted successfully!");
        })
        .catch(error => {
            console.error("Error deleting course:", error);
            alert("Failed to delete course. Please try again.");
        });
}

function logout() {
    alert("Logged out successfully!");
    location.reload();
}

// Function to format date in yyyy-mm-dd
function formatDate(dateString) {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months are zero-indexed
    let dd = date.getDate();

    // Format month and day to always be two digits
    if (mm < 10) mm = "0" + mm;
    if (dd < 10) dd = "0" + dd;

    return `${yyyy}-${mm}-${dd}`;
}

// Function to submit the report data to the server
async function createReport(reportData) {
    const url = "http://localhost:8000/api/teachers/reports/add";  // API endpoint to create a report

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify(reportData),
        });

        if (response.ok) {
            const result = await response.json();
            displayFeedback("Report submitted successfully!", "success");
            console.log("Report Created:", result);
            document.getElementById("report-form").reset();  // Reset the form
        } else {
            const error = await response.json();
            displayFeedback(`Failed to submit report: ${error.message}`, "error");
        }
    } catch (error) {
        displayFeedback(`Error submitting report: ${error.message}`, "error");
    }
}

// Function to display feedback messages
function displayFeedback(message, type) {
    const feedbackMessageElement = document.getElementById("feedback-message");
    feedbackMessageElement.textContent = message;
    feedbackMessageElement.style.color = type === "error" ? "red" : "green";
    feedbackMessageElement.style.fontWeight = "bold";
}

// Загрузить курсы при загрузке страницы
window.onload = () => {
    loadCourses("course-selection");
    loadCourses("cancel-course-selection");
    loadCourses("manage-grade-course");
    loadCourses("report-course");
}
