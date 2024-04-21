<script setup>
import axios from 'axios'
import ExifReader from 'exifreader'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { data } from '../data.js'
import SideBar from '../components/SideBar.vue'
//import config from '../config/config.json'

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

        document.getElementById('SelectMoon').style.color = 'green'
        document.getElementsByClassName('HiddenBox')[0].style.display = 'flex'
        document.getElementsByClassName('HiddenBox')[1].style.display = 'flex'
        document.getElementsByClassName('HiddenBox')[2].style.display = 'flex'
        console.log(document.getElementsByClassName('HiddenBox')[0].style.display)

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
                        <SideBar />
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

                <div class="columns is-centered HiddenBox">
                    <div class="column has-text-centered">
                        <h1>Upload Your Moon Image</h1>
                    </div>
                </div>
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

            <form @submit.prevent="imageSubmitted" class="UploadBox">
                <input class="button HiddenBox" type="submit" value="Upload" />
            </form>
        </div>
    </main>
</template>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
}

.HiddenBox {
    display: none;
    height: auto;
    width: 100%;
}

.Col2 {
    margin-top: 30px;
}

.main-container {
    font-family: monospace;
    padding: 30px;
    margin-top: 20px;
    background: #13161c;
    width: 100%;
    height: 100vh;
}

.container {
    color: white;
    border-radius: 25px;
    width: 65rem;
}

.container-two {
    display: flex;
    justify-content: center;
    margin: 20px auto;
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
    margin-top: 40px;
    background-color: #13161c;
}
.file-upload-form {
    margin-top: 20px;
}
.UploadBox {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.overlayMenu {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin: 20px auto;
    margin-bottom: 60px;
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
    display: inline-flex;
}

h1 {
    font-size: 1.7rem;
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
    background: rgb(255, 0, 0, 0.5);
    border-color: transparent;
    cursor: pointer;
    color: white;
    transition: 0.3s all ease-in;
}

.selectText {
    color: rgb(255, 255, 255);
}
* {
    font-family: Nunito;
}
</style>
