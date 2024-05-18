import { reactive } from 'vue'
export const data = reactive({
    newUpload: false,
    longitude: 0,
    latitude: 0,
    timeStamp: '',
    relativeImageName: '',
    images: {
        userImgFile: null,
        modelImgFile: null
    },
    outputImg: null,
    layerFilenames: [],
    layerAttributes: [],
    registrationAlgortihm: 'SIFT', // default registration algorithm
    circleDetectVals: null,
    moon_circle:null, // TODO: cleanup these two variables
    moonCircle: null, // TODO: cleanup these two variables
    positions: null,
    librations: null,
    earthToMoon: null,
    earthToSun: null,
})
