const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

require('dotenv').config();
const port = process.env.PORT;

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL + process.env.MONGODB_NAME)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
