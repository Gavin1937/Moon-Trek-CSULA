require("dotenv").config();
var config = null;
if (process.env.NODE_ENV === "production") {
  config = require("./config/production.config.json");
} else {
  config = require("./config/dev.config.json");
}
var logger = require("./logger.js")(config.log_file, config.log_level);

const express = require('express');
const cors = require('cors');
// Module to interact with Natalie's API
const jpl = require('jpl')(config.dataServer, logger);
const positions_endpoint = require('./endpoint/positions')(jpl, logger);
const timezone_endpoint = require('./endpoint/timezone')(logger);


const app = express();
const port = 8888;

// Tell our server to use CORS (Cross Origin Resource Sharing)
app.use(cors());

// Our server's responses will be in JSON
app.use(express.json());

// Endpoint for static content such as images, fonts, textures
app.use('/api/static/assets', express.static('static/assets'));

// Endpoint for getting all positions of celestial bodies
app.use('/api/positions', positions_endpoint);

// Endpoint for converting local time to UTC
app.use('/api/timezone', timezone_endpoint);

// Start our server up
app.listen(port, () => {
  logger.info(`Server is listening on port: ${port}`);
  logger.info(`Server logging level: ${config.log_level}`);
});
