// Your JavaScript code here
function logout() {
    localStorage.removeItem('accessToken');
    window.location.href = 'index.html';
}

// Fetch and display users here...
async function fetchUsers() {
    try {
        const response = await fetch(`${SERVER_PROTOCOL}//${SERVER_IP}:3000/users`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            console.error('Error fetching users:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display the list of users
function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <span class="username">${user.username}</span>
            <span class="button-container">
                <button class="w3-btn w3-teal" onclick="viewComments('${user.id}')">View Comments</button>
                <button class="w3-btn w3-black" onclick="deleteUser('${user.id}')">Delete User</button>
            </span>
        `;
        userList.appendChild(userItem);
    });
}

async function viewComments(userId) {
    const userComments = document.getElementById('user-comments');
    userComments.innerHTML = ''; // Clear existing comments

    try {
        const response = await fetch(`${SERVER_PROTOCOL}//${SERVER_IP}:3000/users/${userId}/comments`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        if (response.ok) {
            // Get the username of the user whose comments are being viewed
            const username = await fetchUsername(userId);

            // Create a heading to display whose comments are being viewed
            const heading = document.createElement('h2');
            heading.textContent = `Comments posted by "${username}"`;
            userComments.appendChild(heading);

            const comments = await response.json();
            comments.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.className = 'comment-item';
                commentItem.innerHTML = comment.comment; // Update to comment.comment
                userComments.appendChild(commentItem);
            });
        } else {
            console.error('Error fetching comments:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function resetComments() {
    fetch(`${SERVER_PROTOCOL}//${SERVER_IP}:3000/reset-comments`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result.success) {
            console.log('Comments reset successfully:', result.message);
            const userComments = document.getElementById('user-comments');
            userComments.innerHTML = ''; // Clear existing comments
            const heading = document.createElement('h2');
            heading.textContent = `All user comments have been cleared!`;
            userComments.appendChild(heading);
        } else {
            console.error('Error resetting comments:', result.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to fetch the username of a user by their userId
async function fetchUsername(userId) {
    try {
        const response = await fetch(`${SERVER_PROTOCOL}//${SERVER_IP}:3000/users/${userId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        if (response.ok) {
            const user = await response.json();
            return user.username;
        } else {
            console.error('Error fetching username:', response.statusText);
            return 'Unknown User';
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Unknown User';
    }
}

async function deleteUser(userId) {
    try {
        console.log("Deleting user: " + userId);
        const response = await fetch(`${SERVER_PROTOCOL}//${SERVER_IP}:3000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        if (response.ok) {
            fetchUsers(); // Refresh the user list
        } else {
            console.error('Error deleting user:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Load users when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});
