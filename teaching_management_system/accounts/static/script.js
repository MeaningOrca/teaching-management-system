// Display section based on button clicked
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Simulate user login
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    // Assuming login success, display the student's page for now
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('student-page').style.display = 'block';
    document.getElementById('user-name').innerText = username; // Set the username dynamically
});

// Logout function (simple demo, replace with actual functionality)
function logout() {
    document.getElementById('student-page').style.display = 'none';
    document.getElementById('teacher-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'none';
    document.getElementById('counselor-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
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

async function addUser() {
    const userType = document.getElementById("user-type").value;

    // Collect user data based on the selected user type
    let userData = {};
    if (userType === "student") {
        userData = {
            id: document.getElementById("student-id").value,
            name: document.getElementById("student-name").value,
            gender: document.getElementById("student-gender").value,
            birthdate: document.getElementById("student-birthdate").value,
            class: document.getElementById("student-class").value,
            major: document.getElementById("student-major").value
        };
    } else if (userType === "teacher") {
        userData = {
            id: document.getElementById("teacher-id").value,
            name: document.getElementById("teacher-name").value,
            gender: document.getElementById("teacher-gender").value,
            department: document.getElementById("teacher-department").value,
            contact: {
                phone: document.getElementById("teacher-phone").value,
                email: document.getElementById("teacher-email").value
            }
        };
    } else if (userType === "admin") {
        userData = {
            id: document.getElementById("admin-id").value,
            adminName: document.getElementById("admin-name").value
        };
    } else if (userType === "counselor") {
        userData = {
            id: document.getElementById("counselor-id").value,
            name: document.getElementById("counselor-name").value,
            course: document.getElementById("counselor-course").value
        };
    }

    try {
        const response = await fetch('http://your-backend-server.com/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            alert('User added successfully: ' + JSON.stringify(result));
        } else {
            const error = await response.json();
            alert('Failed to add user: ' + error.message);
        }
    } catch (error) {
        alert('Error connecting to server: ' + error.message);
    }
}

async function searchUser() {
    const userIdOrName = document.getElementById("search-user-id").value;

    try {
        const response = await fetch(`http://your-backend-server.com/api/users?query=${encodeURIComponent(userIdOrName)}`);
        if (response.ok) {
            const result = await response.json();
            populateModifyUserFields(result);
        } else {
            const error = await response.json();
            alert('Failed to find user: ' + error.message);
        }
    } catch (error) {
        alert('Error connecting to server: ' + error.message);
    }
}

function populateModifyUserFields(user) {
    const modifyFields = document.getElementById("modify-user-fields");
    modifyFields.innerHTML = `
        <label for="modify-user-name">Name:</label>
        <input type="text" id="modify-user-name" value="${user.name}">
        <label for="modify-user-gender">Gender:</label>
        <select id="modify-user-gender">
            <option value="m" ${user.gender === "m" ? "selected" : ""}>Male</option>
            <option value="f" ${user.gender === "f" ? "selected" : ""}>Female</option>
        </select>
        <!-- Add other fields as needed -->
    `;
}

async function updateUser() {
    const userId = document.getElementById("search-user-id").value;
    const updatedData = {
        name: document.getElementById("modify-user-name").value,
        gender: document.getElementById("modify-user-gender").value
        // Collect other updated fields as needed
    };

    try {
        const response = await fetch(`http://your-backend-server.com/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('User updated successfully');
        } else {
            const error = await response.json();
            alert('Failed to update user: ' + error.message);
        }
    } catch (error) {
        alert('Error connecting to server: ' + error.message);
    }
}

async function searchUsersForDelete() {
    const query = document.getElementById("delete-user-id").value;

    try {
        const response = await fetch(`http://your-backend-server.com/api/users?query=${encodeURIComponent(query)}`);
        if (response.ok) {
            const users = await response.json();
            displayDeleteUserList(users);
        } else {
            const error = await response.json();
            alert('Failed to search for users: ' + error.message);
        }
    } catch (error) {
        alert('Error connecting to server: ' + error.message);
    }
}

function displayDeleteUserList(users) {
    const deleteList = document.getElementById("delete-user-list");
    deleteList.innerHTML = ""; // Clear previous results

    users.forEach(user => {
        const listItem = document.createElement("li");
        listItem.textContent = `ID: ${user.id}, Name: ${user.name}`;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteUser(user.id);
        listItem.appendChild(deleteButton);
        deleteList.appendChild(listItem);
    });
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`http://your-backend-server.com/api/users/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('User deleted successfully');
        } else {
            const error = await response.json();
            alert('Failed to delete user: ' + error.message);
        }
    } catch (error) {
        alert('Error connecting to server: ' + error.message);
    }
}
