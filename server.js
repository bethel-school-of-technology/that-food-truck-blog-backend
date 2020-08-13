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
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
// IMPORTANT RIGHT NOW OUR APP HAS OPEN BOARDERS WE NEED TO RESTRICT WHO CAN ACCESS THIS WHEN WE MOVE TO PRODUCTION IN L17 THE * MEANS ALL

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
