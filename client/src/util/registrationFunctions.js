import config from '../config/config.json'
import axios from 'axios'
import {
    ImageHandler,
    draw_layer_image,
    draw_layer_image_no_compute,
    RegistrationAlgorithms
} from '../moon-registration/index.js'

export const performRegistration = async (
    algoString,
    userImgFile,
    modelImgFile,
    layerImgFile,
    transparency = 1.0,
    filter_px = '0xff000000'
) => {
    const algorithm = convertToAlgo(algoString)
    const tp = Number(transparency)
    const fpx = Number(filter_px)
    console.log('transparency', transparency)
    console.log('tp', tp)
    console.log('filter_px', filter_px)
    console.log('fpx', fpx)
    let userImgHandler = new ImageHandler()
    let modelImgHandler = new ImageHandler()
    let layerImgHandler = new ImageHandler()
    let outputImgHandler = new ImageHandler()
    try {
        console.log('checking inputs inputs')
        console.log(typeof algoString, algoString)
        console.log('algorithm', algorithm)
        console.log('userImgFile', userImgFile)
        console.log('modelImgFile', modelImgFile)
        console.log('layerImgFile', layerImgFile)

        await userImgHandler.load_from_fileobject(userImgFile)
        await modelImgHandler.load_from_fileobject(modelImgFile)
        await layerImgHandler.load_from_fileobject(layerImgFile)

        console.log('userImgHandler', userImgHandler)
        console.log('modelImgHandler', modelImgHandler)
        console.log('layerImgHandler', layerImgHandler)

        if (algoString === 'SURF') {
            //call python API for surf homography matrix then call draw_layer_no_compute (registration given homography matrix)
            const homographyMatrix = await retrieveHomographyMatrixFromAPI(
                algoString,
                userImgFile,
                modelImgFile
            )
            outputImgHandler = await performRegistrationGivenHomographyMatrix(
                userImgHandler,
                modelImgHandler,
                layerImgHandler,
                homographyMatrix,
                transparency,
                filter_px
            )
        } else {
            outputImgHandler = await draw_layer_image(
                userImgHandler,
                modelImgHandler,
                layerImgHandler,
                algorithm,
                tp,
                fpx
            )
        }
        console.log('output image:', outputImgHandler)

        const userImgWidth = userImgHandler.img_width
        const userImgHeight = userImgHandler.img_height
        const outputImgWidth = outputImgHandler.img_width
        const outputImgHeight = outputImgHandler.img_height

        const userImgData = await userImgHandler.to_ImageData()
        const outputImgData = await outputImgHandler.to_ImageData()

        await userImgHandler.destroy_image()
        await modelImgHandler.destroy_image()
        await layerImgHandler.destroy_image()
        await outputImgHandler.destroy_image()

        console.log('userImgData', userImgData)
        console.log('outputImgData', outputImgData)

        return {
            userImg: {
                data: userImgData,
                width: userImgWidth,
                height: userImgHeight
            },
            outputImg: {
                data: outputImgData,
                width: outputImgWidth,
                height: outputImgHeight
            }
        }
    } catch (error) {
        //if memory out of bounds call python API
        // if (error.message === '') {
        //     const homographyMatrix = await retrieveHomographyMatrixFromAPI(
        //         algorithm,
        //         userImgFile,
        //         modelImgFile
        //     )
        //     const outputImgHandler = await performRegistrationGivenHomographyMatrix(
        //         userImgHandler,
        //         modelImgHandler,
        //         homographyMatrix,
        //         transparency,
        //         filter_px
        //     )
        //     console.log(outputImgHandler)
        //     return outputImgHandler
        console.log(error)
    }
    //else if homography matrix problem display error
    // else console.log(error)
}

const convertToAlgo = (word) => {
    if (word === 'SIFT') return RegistrationAlgorithms.SIFT
    else if (word === 'SURF') return RegistrationAlgorithms.SURF
    else if (word === 'AKAZE') return RegistrationAlgorithms.AKAZE
    else if (word === 'BRISK') return RegistrationAlgorithms.BRISK
    else if (word === 'ORB') return RegistrationAlgorithms.ORB
}

const performRegistrationGivenHomographyMatrix = async (
    userImgHandler,
    modelImgHandler,
    layerImgHandler,
    homographyMatrix,
    transparency = 1.0,
    filter_px = '-1'
) => {
    try {
        const outputImgHandler = await draw_layer_image_no_compute(
            userImgHandler,
            modelImgHandler,
            layerImgHandler,
            homographyMatrix,
            transparency,
            filter_px
        )
        console.log(outputImgHandler)
        return outputImgHandler
    } catch (error) {
        console.log(error)
    }
}

const retrieveHomographyMatrixFromAPI = async (algoString, userImgFile, modelImgFile) => {
    try {
        const formData = new FormData()
        formData.append('user-file', userImgFile)
        formData.append('model-file', modelImgFile)
        const response = await axios.post(`${config.python_server}/${algoString}`, formData)
        if (response.data.ok) {
            console.log(response.data.payload.homography_matrix)
            return response.data.payload.homography_matrix
        } else console.log(response.error)
    } catch (error) {
        console.log(error)
    }
}
