<script setup>
import axios from 'axios'
import ExifReader from 'exifreader'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { data } from '../data.js'

const router = useRouter()
const formData = reactive({
    name: 'Select Image',
    imageFile: null,
    hasExif: true,
    longitude: 0,
    latitude: 0,
    date: '',
    time: '',
    // algo: 'SURF',
    // layerName: '',
    previewImage: new Image()
})

const error = ref('')

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

// const setRegistrationAlgorithm = (value) => {
//     data.registrationAlgortihm = value
// }

// This is called whenever an image is submitted
const imageSubmitted = async () => {
    //check first that overlay and registration algorithm has been chosen
    if (!(data.layerName && data.registrationAlgortihm)) {
        error.value =
            'Please choose overlay and registration algorithm first before submitting image'
        return
    }

    let local

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
        <div class="columns is-centered">
            <div class="column has-text-centered">
                <h1>Upload Your Moon Image</h1>
            </div>
        </div>
        <form>
            <label>Choose registration algorithm:</label>
            <select v-model="data.registrationAlgortihm" :selected="data.registrationAlgortihm">
                <option value="SURF">SURF</option>
                <option value="SIFT">SIFT</option>
                <option value="AKAZE">AKAZE</option>
                <option value="BRISK">BRISK</option>
                <option value="ORB">ORB</option>
            </select>
            <!-- <label>Overlay transparency:</label>
            <input type="number" min="0" max="1" step="0.01" v-model="data.transparency" />
            <label>Filter px</label>
            <input type="number" v-model="data.filterPx" /> -->
        </form>
        <form @submit.prevent="imageSubmitted">
            <div class="field file has-addons has-addons-centered">
                <label class="file-label">
                    <div class="control">
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
                                {{ formData.name }}
                            </span>
                        </span>
                    </div>
                </label>
                <div class="control">
                    <input class="button" type="submit" value="Upload" />
                </div>
            </div>
            <p v-if="error">{{ error.value }}</p>
            <div v-if="!formData.hasExif" class="columns is-centered">
                <div class="column is-3-tablet is-2-desktop is-2-fullhd">
                    <div class="field">
                        <label class="label">Latitude:</label>
                        <div class="control">
                            <input
                                class="input"
                                type="number"
                                placeholder="latitude"
                                v-model="formData.latitude"
                            />
                        </div>
                    </div>
                </div>
                <div class="column is-3-tablet is-2-desktop is-2-fullhd">
                    <div class="field">
                        <label class="label">Longitude:</label>
                        <div class="control">
                            <input
                                class="input"
                                type="number"
                                placeholder="longitude"
                                v-model="formData.longitude"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!formData.hasExif" class="columns is-centered">
                <div class="column is-3-tablet is-2-desktop is-2-fullhd">
                    <div class="field">
                        <label class="label">Date:</label>
                        <div class="control">
                            <input class="input" type="date" v-model="formData.date" />
                        </div>
                    </div>
                </div>
                <div class="column is-3-tablet is-2-desktop is-2-fullhd">
                    <div class="field">
                        <label class="label">Time:</label>
                        <div class="control">
                            <input class="input" type="time" v-model="formData.time" />
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="columns is-centered">
            <div class="column has-text-centered">
                <img :src="formData.previewImage.src" />
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    min-height: 100vh;
    padding: 1rem;
}

h1 {
    font-size: 1.5rem;
}

img {
    margin: 1rem;
    max-width: 50%;
    max-height: 50%;
}

::placeholder,
file-cta,
label,
input {
    color: #d8dee9;
}

.file-cta {
    border-radius: 0.5rem 0rem 0rem 0.5rem;
}

input {
    border-radius: 0.5rem;
}

.file-cta,
.file-cta:hover,
input,
input:hover {
    background: #13161c;
}

.file-cta,
input {
    border-color: #5e81ac;
}

.file-cta:hover,
input:hover {
    border-color: #b48ead;
}

.button,
.button:hover {
    border-radius: 0rem 0.5rem 0.5rem 0rem;
}

.button {
    background: #5e81ac;
    border-color: #5e81ac;
    color: #13161c;
}

.button:hover {
    background: #b48ead;
    border-color: #b48ead;
}
</style>
