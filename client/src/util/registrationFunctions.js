import config from '../config/config.json'
import axios from 'axios'
import {
    ImageHandler,
    draw_layer_image,
    draw_layer_image_no_compute,
    RegistrationAlgorithms,
    detect_moon,
    cut_image_from_circle
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
    let croppedImgHandler = new ImageHandler()
    let modelImgHandler = new ImageHandler()
    let layerImgHandler = new ImageHandler()
    let outputImgHandler = new ImageHandler()
    let croppedImgFile = null

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

        //get circle/Moon in user image
        const croppedImg = await getCroppedImageOfMoon(userImgFile)

        croppedImgHandler = croppedImg[0]
        const croppedImgData = await croppedImgHandler.to_ImageData()
        croppedImgFile = await getCroppedImageFile(croppedImgData)
        console.log('croppedImgFile', croppedImgFile)

        if (algoString === 'SURF') {
            //call python API for surf homography matrix then call draw_layer_no_compute (registration given homography matrix)
            const homographyMatrix = await retrieveHomographyMatrixFromAPI(
                algoString,
                croppedImgFile,
                modelImgFile
            )
            outputImgHandler = await performRegistrationGivenHomographyMatrix(
                croppedImgHandler,
                modelImgHandler,
                layerImgHandler,
                homographyMatrix,
                transparency,
                filter_px
            )
        } else {
            outputImgHandler = await draw_layer_image(
                croppedImgHandler,
                modelImgHandler,
                layerImgHandler,
                algorithm,
                tp,
                fpx
            )
        }
        console.log('output image:', outputImgHandler)

        const userImg = await getImageData(userImgHandler)
        const outputImg = await getImageData(outputImgHandler)

        return {
            userImg,
            outputImg
        }
    } catch (error) {
        console.log(error)
        console.log(error.message)

        if (error.message.includes('memory access out of bounds')) {
            try {
                const homographyMatrix = await retrieveHomographyMatrixFromAPI(
                    algoString,
                    croppedImgFile,
                    modelImgFile
                )
                const outputImgHandler = await performRegistrationGivenHomographyMatrix(
                    croppedImgHandler,
                    modelImgHandler,
                    homographyMatrix,
                    transparency,
                    filter_px
                )
                const userImg = await getImageData(userImgHandler)
                const outputImg = await getImageData(outputImgHandler)

                return {
                    userImg,
                    outputImg
                }
            } catch (error) {
                console.log('error fetching homography matrix from python API', error)
            }
        }
    } finally {
        await userImgHandler.destroy_image()
        await modelImgHandler.destroy_image()
        await layerImgHandler.destroy_image()
        await outputImgHandler.destroy_image()
    }
}

const getCroppedImageFile = async (imgData) => {
    // try {
    //     const imgData = await imgHandler.to_ImageData()
    //     const canvas = document.createElement('canvas')
    //     canvas.width = imgData.width
    //     canvas.height = imgData.height

    //     const ctx = canvas.getContext('2d', { colorSpace: 'srgb' })
    //     ctx.putImageData(imgData, 0, 0)

    //     canvas.toBlob((blob) => {
    //         const croppedImgFile = new File([blob], 'croppedImage', { type: 'image/png' })
    //         return croppedImgFile
    //     })
    // } catch (error) {
    //     console.log(error)
    // }
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas')
            canvas.width = imgData.width
            canvas.height = imgData.height

            const ctx = canvas.getContext('2d', { colorSpace: 'srgb' })
            ctx.putImageData(imgData, 0, 0)

            canvas.toBlob((blob) => {
                const file = new File([blob], 'croppedImgFile', { type: 'image/png' })

                resolve(file)
            })
        } catch (error) {
            reject(error)
        }
    })
}

const detectMoonFromImg = async (imgHandler) => {
    try {
        const moon_circle = await detect_moon(imgHandler)
        return moon_circle
    } catch (error) {
        console.log('error running detect_moon', error)
    }
}

const getCroppedImageOfMoon = async (imgFile) => {
    try {
        const imgHandler = new ImageHandler()
        await imgHandler.load_from_fileobject(imgFile)
        const moon_circle = await detectMoonFromImg(imgHandler)
        const [croppedImgHandler, rectangle] = await cut_image_from_circle(
            imgHandler,
            moon_circle,
            200
        )
        return [croppedImgHandler, rectangle]
    } catch (error) {
        console.log('error cropping Moon image', error)
    }
}

const getImageData = async (imgHandler) => {
    const imgHeight = imgHandler.img_height
    const imgWidth = imgHandler.img_width
    const imgData = await imgHandler.to_ImageData()

    return {
        height: imgHeight,
        width: imgWidth,
        data: imgData
    }
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
        const response = await axios.post(
            `${config.python_server}/api/registrar/${algoString}`,
            formData
        )
        if (response.data.ok) {
            console.log(response.data.payload.homography_matrix)
            return response.data.payload.homography_matrix
        } else console.log(response.error)
    } catch (error) {
        console.log(error)
    }
}
