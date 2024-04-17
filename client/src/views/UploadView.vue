<script setup>
import axios from 'axios'
import ExifReader from 'exifreader'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { data } from '../data.js'
import SideBar from '../components/SideBar.vue'
import config from '../config/config.json'

const router = useRouter()
const formData = reactive({
    name: 'Select Image',
    imageFile: null,
    hasExif: true,
    longitude: 0,
    latitude: 0,
    date: '',
    time: '',
    previewImage: new Image()
})

const errorHandler = reactive({
    hasError: false,
    message: ''
})

const resetError = () => {
    errorHandler.hasError = false
    errorHandler.message = ''
}

const fetchLayersFile = async () => {
    //we only place one layer on Moon model to include points of interest in the layer image, the rest we
    //use the layer images directly for registration. If more than one layer selected, first layer
    //is the one we place on Moon model to get points of interest, the rest we fetch the images from
    //backend
    if (data.layerFilenames.length > 1) {
        try {
            let response
            let layerBlob
            let layerFile
            for (let i = 1; i < data.layerFilenames.length; i++) {
                console.log('layer file name at i', i, data.layerFilenames[i])
                response = await axios.get(
                    `${config.backend_server}/static/assets/textures/${data.layerFilenames[i]}.png`,
                    {
                        responseType: 'arraybuffer'
                    }
                )
                layerBlob = new Blob([response.data], { type: 'image/png' })
                layerFile = new File([layerBlob], `${data.layerFilenames[i]}`, {
                    type: 'image/png'
                })
                console.log('layerfile i', data.layerFilenames[i], layerFile)
                data.images.layerImgFile.push(layerFile)
            }
        } catch (error) {
            console.log('error fetching layer files from backend', error)
        }
    }
}

// This is called whenever a new image is selected
const imageSelected = async () => {
    try {
        // Get the image from input
        const file = document.getElementById('moonImage').files[0]
        // Read the exif meta data
        const tags = await ExifReader.load(file)

        // Update the input text to the selected image's name
        formData.name = file.name
        // Update the preview to the selected image

        formData.previewImage.src = URL.createObjectURL(
            // document.getElementById('moonImage').files[0]
            file
        )

        formData.imageFile = file

        // data.images.user = document.getElementById('moonImage').files[0]

        // Check if the meta data we want is present
        if (tags.GPSLongitude && tags.GPSLatitude && tags.DateTimeOriginal) {
            // If so, keep formData.hasExif true
            formData.hasExif = true
            // Set the date
            formData.date = tags.DateTimeOriginal.description

            // Keep all North latitude values positive
            // and make South latitude values negative
            if (tags.GPSLatitudeRef.value[0] === 'N') {
                formData.latitude = tags.GPSLatitude.description
            } else {
                formData.latitude = -1 * tags.GPSLatitude.description
            }

            // Keep all East longitude values positive
            // and make West longitude values negative
            if (tags.GPSLongitudeRef.value[0] === 'E') {
                formData.longitude = tags.GPSLongitude.description
            } else {
                formData.longitude = -1 * tags.GPSLongitude.description
            }
        } else {
            // If no meta data, reset all values and display the form
            formData.hasExif = false
            formData.longitude = 0
            formData.latitude = 0
            formData.date = ''
            formData.time = ''
        }
    } catch (error) {
        console.log(error)
    }
}

const inputIsValid = () => {
    if (data.layerFilenames.length === 0 || data.registrationAlgortihm === '') {
        errorHandler.hasError = true
        if (data.layerFilenames.length === 0)
            errorHandler.message = 'Please select at least one layer to place on your image'
        else if (data.registrationAlgortihm === '')
            errorHandler.message = 'Please select a registration algorithm'
        else
            errorHandler.message =
                'Please select at least one layer and registration algorithm first'
        return false
    }
    return true
}

// This is called whenever an image is submitted
const imageSubmitted = async () => {
    //check first that overlay and registration algorithm has been chosen
    fetchLayersFile()
    if (!inputIsValid()) return
    let local
    data.newUpload = true
    // Date is read differently from exif meta data and html inputs
    // so we'll adjust our string based on the case
    if (formData.hasExif) {
        const splt = formData.date.split(/\D/g)
        local = `${splt[0]}-${splt[1]}-${splt[2]}T${splt[3]}:${splt[4]}:${splt[5]}`
    } else {
        local = `${formData.date}T${formData.time}:00`
    }

    // Convert the local time stamp to UTC
    const convert = await axios.get('http://localhost:8888/timezone/toUtc', {
        params: {
            latitude: formData.latitude,
            longitude: formData.longitude,
            timeStamp: local
        }
    })

    console.log(`\nCoordinates: ${formData.latitude}, ${formData.longitude}`)
    console.log(`Local Date: ${local}`)
    console.log(`UTC Date: ${convert.data.timeStampUTC}`)

    // Set data.newUpload so ModelGenerator knows registration needs to be performed
    data.newUpload = true

    // Store all submitted data
    data.latitude = formData.latitude
    data.longitude = formData.longitude
    data.timeStamp = convert.data.timeStampUTC
    data.images.userImgFile = formData.imageFile

    // Forward to registration page
    router.push('/registration')
}
</script>

<template>
    <main>
        <div class="main-container">
            <div class="container">
                <div class="overlayMenu">
                    <div class="overlaymenuLeft">
                        <SideBar @selected-layer="resetError" />
                    </div>
                    <div class="overlayMenuRight">
                        <form>
                            <label>Choose registration algorithm:</label>
                            <select
                                v-model="data.registrationAlgortihm"
                                :selected="data.registrationAlgortihm"
                            >
                                <option value="SURF">SURF</option>
                                <option value="SIFT">SIFT</option>
                                <option value="AKAZE">AKAZE</option>
                                <option value="BRISK">BRISK</option>
                                <option value="ORB">ORB</option>
                            </select>
                        </form>
                    </div>
                </div>
                <!-- <SideBar /> -->
                <div class="columns is-centered">
                    <div class="column has-text-centered">
                        <h1>Upload Your Moon Image</h1>

                        <form @submit.prevent="imageSubmitted" class="file-upload-form">
                            <label class="file-label">
                                <input
                                    class="file-input"
                                    type="file"
                                    id="moonImage"
                                    @change="imageSelected"
                                />
                                <span class="file-cta">
                                    <span class="file-icon">
                                        <i class="fas fa-upload"></i>
                                    </span>
                                    <span class="file-label">
                                        {{ formData.name || 'Choose a file' }}
                                    </span>
                                </span>
                            </label>
                            <input class="button" type="submit" value="Upload" />
                        </form>
                    </div>
                </div>
                <!-- <form>
                    <label>Choose registration algorithm:</label>
                    <select
                        v-model="data.registrationAlgortihm"
                        :selected="data.registrationAlgortihm"
                    >
                        <option value="SURF">SURF</option>
                        <option value="SIFT">SIFT</option>
                        <option value="AKAZE">AKAZE</option>
                        <option value="BRISK">BRISK</option>
                        <option value="ORB">ORB</option>
                    </select>
                </form> -->
            </div>
            <div v-if="errorHandler.hasError">
                <h3>{{ errorHandler.message }}</h3>
            </div>
            <div class="container-two" v-if="formData.previewImage.src">
                <div class="content-with-sidebar">
                    <div class="image-container">
                        <img :src="formData.previewImage.src" />
                    </div>
                    <div class="info-container">
                        <div class="field">
                            <label class="label">Latitude:</label>
                            <input
                                class="input"
                                type="number"
                                placeholder="latitude"
                                v-model="formData.latitude"
                            />
                        </div>
                        <div class="field">
                            <label class="label">Longitude:</label>
                            <input
                                class="input"
                                type="number"
                                placeholder="longitude"
                                v-model="formData.longitude"
                            />
                        </div>
                        <div class="field">
                            <label class="label">Date:</label>
                            <input class="input" type="date" v-model="formData.date" />
                        </div>
                        <div class="field">
                            <label class="label">Time:</label>
                            <input class="input" type="time" v-model="formData.time" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
}

.main-container {
    font-family: monospace;
    padding: 30px;
    margin-top: 20px;
    background: #13161c;
    width: 100%;
}

.container {
    padding: 3%;
    color: white;
    border-radius: 25px;
}

.container-two {
    display: flex;
    justify-content: center;
    margin: 3% auto;
    max-width: 1000px;
}

.content-with-sidebar {
    display: flex;
    width: 100%;
    align-items: center;
}

.image-container {
    flex: 1;
    max-width: 50%;
}

.info-container {
    flex: 2;
    padding-left: 20px;
}

.field {
    margin-bottom: 10px;
}

.file-upload {
    margin-top: 20px;
    background-color: #13161c;
}

.overlayMenu {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin: 10px auto;
    margin-bottom: 40px;
}

.overlayMenuLeft,
.overlayMenuRight {
    margin: 0 10px;
}

.file-input {
    width: 10%;
    height: 10%;
    opacity: 0;
    position: absolute;
    cursor: pointer;
}

.file-label {
    width: fit-content;
}

h1 {
    font-size: 1.5rem;
}

img {
    max-width: 100%;
    height: auto;
}

::placeholder,
.file-cta,
label,
input {
    color: #d8dee9;
}

input,
.file-cta {
    background: #13161c;
    border-color: #5e81ac;
}

.file-cta:hover,
input:hover {
    border-color: #b48ead;
}

.button:hover {
    background: #b48ead;
    border-color: #b48ead;
}

.selectText {
    color: rgb(255, 255, 255);
}
</style>
