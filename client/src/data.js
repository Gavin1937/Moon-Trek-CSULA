import { reactive } from 'vue'
export const data = reactive({
    newUpload: false,
    longitude: 0,
    latitude: 0,
    timeStamp: '',
    relativeImageName: '',
    images: {
        userImgFile: null,
        modelImgFile: null,
        layerImgFile: null
    },
    layerName: 'Apollo',
    registrationAlgortihm: 'SURF',
    transparency: 0,
    filterPx: -1
})
