import config from '../config/config.json'
import axios from 'axios'
import {
    ImageHandler,
    draw_layer_image_no_compute,
    RegistrationAlgorithms,
    detect_moon,
    cut_image_from_circle,
    compute_registration
} from '../moon-registration/index.js'
import { data } from '../data.js'
const convertToAlgo = (word) => {
    word = word.toUpperCase()
    if (word === 'SIFT') return RegistrationAlgorithms.SIFT
    else if (word === 'AKAZE') return RegistrationAlgorithms.AKAZE
    else if (word === 'BRISK') return RegistrationAlgorithms.BRISK
    else if (word === 'ORB') return RegistrationAlgorithms.ORB
}


export const getMoonCircle = async (userImgFile) => {
    const imgHandler = new ImageHandler()
    try {
        await imgHandler.load_from_fileobject(userImgFile)
        return await detect_moon(imgHandler)
    } catch (error) {
        console.log('error getting Moon circle', error)
    } finally {
        await imgHandler.destroy_image()
    }
}

export const drawNLayers = async (N, algoString, layerAttributes, userImgFile, modelImgFile) => {
    let inputImgHandler = new ImageHandler()
    const modelImgHandler = new ImageHandler()
    let layerImgHandler = new ImageHandler()
    let outputImgHandler = new ImageHandler()
    try {
        await modelImgHandler.load_from_fileobject(modelImgFile)
        await inputImgHandler.load_from_fileobject(userImgFile)

        //get cropped image of user image first
        const moon_circle = await detect_moon(inputImgHandler)
        data.moon_circle = moon_circle;
        const {latitude, longitude, timeStamp} = data;

        const resp = await axios.get(`${config.backend_server}/api/positions/`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                timeStamp: timeStamp
            }
        });
        data.positions = resp.data;

        //set default padding of circle in cropped image to 200px
        data.circleDetectVals = moon_circle;
        const cutImgPadding = Math.ceil(moon_circle.radius * 0.15); // use 15% of radius as padding
        const croppedImgData = await cut_image_from_circle(inputImgHandler, moon_circle, cutImgPadding);
        inputImgHandler = croppedImgData[0];
        //get croppedImgFile for homography matrix
        const croppedImgFile = new File([await inputImgHandler.to_Blob()], 'croppedImgFile', {
            type: 'image/png'
        });

        const homographyMatrix = await getHomographyMatrix(algoString, croppedImgFile, modelImgFile)

        for (let i = 0; i < N; i++) {
            await layerImgHandler.load_from_fileobject(layerAttributes[i].layerImgFile)

            outputImgHandler = await draw_layer_image_no_compute(
                inputImgHandler,
                modelImgHandler,
                layerImgHandler,
                homographyMatrix,
                layerAttributes[i].layerTransparency,
                '0xff000000'
            )
            await inputImgHandler.destroy_image()
            inputImgHandler = outputImgHandler
        }

        const outputImgData = await outputImgHandler.to_ImageData()
        return outputImgData
    } catch (error) {
        console.log('error', error)
    } finally {
        await inputImgHandler.destroy_image()
        await modelImgHandler.destroy_image()
        await layerImgHandler.destroy_image()
        await outputImgHandler.destroy_image()
    }
}

const getHomographyMatrix = async (algoString, userImgFile, modelImgFile) => {
    //get homography matrix from WASM library unless registration algorithm is SURF or WASM fails
    algoString = algoString.toUpperCase()
    const userImgHandler = new ImageHandler()
    const modelImgHandler = new ImageHandler()
    try {
        if (!algoString.includes('SURF')) {
            console.log('getting matrix from WASM library')
            const registrationAlgo = convertToAlgo(algoString)
            await userImgHandler.load_from_fileobject(userImgFile)
            await modelImgHandler.load_from_fileobject(modelImgFile)
            return await compute_registration(userImgHandler, modelImgHandler, registrationAlgo)
        } else return await retrieveHomographyMatrixFromAPI(algoString, userImgFile, modelImgFile)
    } catch (error) {
        return await retrieveHomographyMatrixFromAPI(algoString, userImgFile, modelImgFile)
    } finally {
        await userImgHandler.destroy_image()
        await modelImgHandler.destroy_image()
    }
}

const retrieveHomographyMatrixFromAPI = async (algoString, userImgFile, modelImgFile) => {
    try {
        const formData = new FormData()
        formData.append('user-file', userImgFile)
        formData.append('model-file', modelImgFile)
        const response = await axios.post(
            `${config.python_server}/pyapi/registrar/${algoString}`,
            formData
        )

        if (response.data.ok) {
            return response.data.payload.homography_matrix
        } else console.log(response.error)
    } catch (error) {
        console.log(error)
    }
}
