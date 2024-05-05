const express = require('express');
const cors = require('cors');

const app = express();
const port = 8888;

// Tell our server to use CORS (Cross Origin Resource Sharing)
app.use(cors());

// Our server's responses will be in JSON
app.use(express.json());

// Endpoint for static content such as images, fonts, textures
app.use('/api/static/assets', express.static('static/assets'));

// Endpoint for getting all positions of celestial bodies
app.use('/api/positions', require('./endpoint/positions'));

// Endpoint for converting local time to UTC
app.use('/api/timezone', require('./endpoint/timezone'));

// Start our server up
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
