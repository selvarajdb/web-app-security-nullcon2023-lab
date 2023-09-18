const fs = require('fs');
const https = require('https');
const tls = require('tls'); // Import the tls module for constants
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const port = 3000;
const SECRET_KEY = 'secret-key';
const SALT_ROUNDS = 10;

const app = express();
const db = new sqlite3.Database('database.db');

// Load your SSL certificate and private key files
const privateKey = fs.readFileSync('server-key.pem', 'utf8');
const certificate = fs.readFileSync('server-cert.pem', 'utf8');
console.log(require('tls'));

// Disable certificate verification (NOT recommended for production)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Create an options object for the SSL context
const credentials = {
  key: privateKey,
  cert: certificate,
  minVersion: tls.DEFAULT_MIN_VERSION
};

// Create an HTTPS server with the SSL context
const httpsServer = https.createServer(credentials, app); // Use 'app' as an Express app

// Middleware
const corsOptions = {
  origin: '*', // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Apply the verifyToken middleware to specific routes
app.use('/search', verifyToken);
// app.use('/register', verifyToken);
// app.use('/login', verifyToken);
app.use('/protected', verifyToken);
app.use('/comment', verifyToken);
// app.use('/comments', verifyToken);
app.use('/reset-comments', verifyToken);
app.use('/users/:userId', verifyToken);
app.use('/users/:userId/comments', verifyToken);
app.use('/users', verifyToken);
// app.use('/create-admin', verifyToken);
app.use('/users/:userId', verifyToken);

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)`, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('Users table created or already exists');
  }
});

// Create comments table if not exists
db.run(`CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, user_id INTEGER, comment TEXT)`, (err) => {
  if (err) {
    console.error('Error creating comments table:', err);
  } else {
    console.log('Comments table created or already exists');
  }
});

// Simulated list of available search keywords
const availableKeywords = ['apple', 'banana', 'cherry'];

// Endpoint to handle search requests
app.get('/search', (req, res) => {
  const searchQuery = req.query.q;

  // Check if the search query is in the list of available keywords
  if (availableKeywords.includes(searchQuery.toLowerCase())) {
    res.send(`A match was found for: ${searchQuery}`);
  } else {
    res.send(`No results found for: ${searchQuery}`);
  }
});


// User registration route
// User registration route
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Server-side validation: Check if username is "admin" and role is "user"
  if (username === "admin" && role === "user") {
    return res.status(403).json({ error: 'Registration not allowed for this user.' });
  }

  // Check if the user already exists in the database
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, existingUser) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'An error occurred' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Store user in the database
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], (err) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        console.log('User registered successfully:', username);
        res.json({ message: 'User registered successfully!' });
      }
    });
  });
});


// User login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'An error occurred' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT and assign the user role as a claim
    const token = jwt.sign({ id: user.id, username, role: user.role }, SECRET_KEY);

    // Redirect user based on role
    if (user.role === 'admin') {
      res.json({ role: 'admin', token });
    } else {
      res.json({ role: 'user', token });
    }
  });
});

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You have access to protected content!' });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        res.sendStatus(403); // Forbidden
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
}

app.post('/comment', verifyToken, (req, res) => {
  const comment = req.body.comment;
  const userId = req.user.id; // Assuming you're storing user info in req.user after authentication

  db.run('INSERT INTO comments (user_id, comment) VALUES (?, ?)', [userId, comment], (err) => {
    if (err) {
      console.error('Error inserting comment:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      console.log('Comment inserted:', comment);
      res.json({ success: true });
    }
  });
});

app.get('/comments', (req, res) => {
  db.all('SELECT comment FROM comments', [], (err, rows) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      const comments = rows.map(row => row.comment);
      console.log('Sending comments:', comments);
      res.json(comments);
    }
  });
});

app.post('/reset-comments', (req, res) => {
  // Clear the comments array or delete rows from the SQLite database
  comments = []; // If you're using an array to store comments

  // If you're using SQLite, you can use a query to delete all comments
  db.run('DELETE FROM comments', [], function(err) {
      if (err) {
          console.error('Error clearing comments:', err);
          res.json({ "success": false });
      } else {
          console.log('Comments cleared');
          res.json({ "success": true });
      }
  });
});

// Get username from user ID
app.get('/users/:userId', verifyToken, async (req, res) => {
  const userId = req.params.userId;
  const loggedInUserId = req.user.id; // Get the logged-in user's ID

  try {
      const user = await getUserById(userId);
      res.json(user);
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'An error occurred' });
  }
});

// Add a route to get comments for a specific user
app.get('/users/:userId/comments', verifyToken, (req, res) => {
  const userId = req.params.userId;
  console.log("Viewing comments for userid: " + userId);

  // Check if the requester is not the owner of the comments and not an admin
  if (req.user.id !== userId && req.user.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
  }

  getCommentsForUser(userId, (comments) => {
      res.json(comments);
  });
});

// Function to get comments for a specific user
function getCommentsForUser(userId, callback) {
  db.all('SELECT * FROM comments WHERE user_id = ?', [userId], (err, rows) => {
      if (err) {
          console.error('Error fetching comments:', err);
          callback([]);
      } else {
          rows.forEach(row => {
            console.log('Row:', row);
          });
          callback(rows);
      }
  });
}

app.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await getUsersFromDatabase();
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = {
  getCommentsForUser
};

// This function fetches the list of users from the database
async function getUsersFromDatabase() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username FROM users', [], (err, rows) => {
      if (err) {
        console.error('Error fetching users:', err);
        reject(err);
      } else {
        const users = rows.map(row => ({ id: row.id, username: row.username }));
        resolve(users);
      }
    });
  });
}

// Create admin user route
app.post('/create-admin', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Store the admin user in the database with the admin role
  // curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "password321"}' http://localhost:3000/create-admin
  db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'admin'], (err) => {
    if (err) {
      console.error('Error creating admin user:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      console.log('Admin user created successfully:', username);
      res.json({ message: 'Admin user created successfully!' });
    }
  });
});

// Delete a user by ID
app.delete('/users/:userId', verifyToken, async (req, res) => {
  const userId = req.params.userId;
  const loggedInUserId = req.user.id; // Get the logged-in user's ID
  console.log("Deleteing user having following ID:" + loggedInUserId);
  try {
      const user = await getUserById(userId);

      // Check if the logged-in user is an admin or the user being deleted is themselves
      if (req.user.role === 'admin' || userId === loggedInUserId) {
          await deleteUser(userId);
          res.json({ message: 'User deleted successfully' });
      } else {
          res.status(403).json({ error: 'Unauthorized' });
      }
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'An error occurred' });
  }
});

// Function to get a user by ID
function getUserById(userId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

// Function to delete a user by ID
function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});