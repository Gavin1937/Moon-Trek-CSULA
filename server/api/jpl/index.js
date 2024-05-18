const axios = require('axios');


// exporting a function that will return this module
module.exports = (dataServerConfig, logger) => {

const adjustPositions = (positions) => {
    // -------swap-------
    // x, y, z = x, z, -y
    const temp = -1 * positions.y;
    positions.y = positions.z;
    positions.z = temp;

    // ------scale------
    positions.x /= 1000;
    positions.y /= 1000;
    positions.z /= 1000;

    return positions;
};

const latToRect = async (origin, destination, longitude, latitude, timeStamp) => {
    try {
        const response = await axios.get(
            `http://${ dataServerConfig.ip }:${ dataServerConfig.port }/lat-to-rect/${ origin }/${ destination }/${ longitude }/${ latitude }/${ timeStamp }`
        );

        return adjustPositions(response.data.positions[destination]);
    } catch (error) {
        logger.error(error);
    }
};

const planetVector = async (origin, destination, timeStamp) => {
    try {
        const response = await axios.get(
            `http://${ dataServerConfig.ip }:${ dataServerConfig.port }/planet-vector-search/${ origin }/${ destination }/${ timeStamp }`
        );

        return adjustPositions(response.data.positions[destination]);
    } catch (error) {
        logger.error(error);
    }
};

const nearestPoint = async (origin, destination, longitude, latitude, timeStamp) => {
    try {
        const response = await axios.get(
            `http://${ dataServerConfig.ip }:${ dataServerConfig.port }/nearest-point/${ origin }/${ destination }/${ longitude }/${ latitude }/${ timeStamp }`
        );

        return response.data;
    } catch (error) {
        logger.error(error);
    }
};

const lunarLibration = async (timeStamp) => {
    try {
        const response = await axios.get(
            `http://${ dataServerConfig.ip }:${ dataServerConfig.port }/get-lunar-librations/${ timeStamp }`
        );

        return response.data;
    } catch (error) {
        logger.error(error);
    }
};

return {
    latToRect,
    planetVector,
    nearestPoint,
    lunarLibration
};

};
