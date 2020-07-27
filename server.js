const express = require('express');
const connectDB = require('./config/db');
const app = express();

//brought in cors
const cors = require('cors');

// Connect Database
connectDB();

//init middleware
app.use(express.json({ extended: false }));

//add cors to connect to front end
app.get(cors());

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
