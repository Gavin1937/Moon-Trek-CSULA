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
    registrationAlgortihm: '',
    moonCircle: null,
    librations: null,
    earthToMoon: null,
    earthToSun: null
})
