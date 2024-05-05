<script setup>
import config from '../config/config.json'
import ModelGenerator from '../components/ModelGenerator.vue'
import { reactive } from 'vue'
import { data } from '../data.js'
import { useRouter } from 'vue-router'
import { drawNLayers } from '../util/registrationFunctions.js'
import SideBar from '../components/SideBar.vue'
const router = useRouter()
const imgData = reactive({
    user: null,
    output: null
})

const errorHandler = reactive({
    hasError: false,
    message: ''
})

const redirectToModel = () => {
    router.push('/model')
}

const redirectToUpload = () => {
    router.push('/upload')
}

const redirectToInfiniteZoom = () => {
    router.push('/zoom')
}

const displayImgOnCanvas = async () => {
    const outputImgCanvas = document.getElementById('output-img')
    outputImgCanvas.width = imgData.output.width
    outputImgCanvas.height = imgData.output.height
    const outputImgCtx = outputImgCanvas.getContext('2d', {
        colorSpace: 'srgb'
    })
    outputImgCtx.putImageData(imgData.output, 0, 0)
    errorHandler.hasError = false
}

const registrate = async () => {
    try {
        const outputImgData = await drawNLayers(
            data.layerAttributes.length,
            data.registrationAlgortihm,
            data.layerAttributes,
            data.images.userImgFile,
            data.images.modelImgFile
        )

        imgData.output = outputImgData
        // console.log('outputImgData', outputImgData)
        // console.log('imgData.output', imgData.output)
        await displayImgOnCanvas()
    } catch (error) {
        console.log(error)
        errorHandler.hasError = true
        errorHandler.message =
            "Can't perform registration on your image. Try other algorithms or upload another image"
    }
}
</script>

<template>
    <main>
        <SideBar />

        <ModelGenerator mode="registrate" @model-and-layer-set="registrate" />

        <div>
            <p v-if="errorHandler.hasError">{{ errorHandler.message }}</p>
            <form>
                <label>Choose another registration algorithm:</label>
                <select
                    v-model="data.registrationAlgortihm"
                    :selected="data.registrationAlgortihm"
                    class="ChooseAnother"
                >
                    <option v-if="config.MR_ENABLE_OPENCV_NONFREE" value="SURF">SURF</option>
                    <option value="SIFT">SIFT</option>
                    <option value="AKAZE">AKAZE</option>
                    <option value="BRISK">BRISK</option>
                    <option value="ORB">ORB</option>
                </select>
            </form>
            <div>
                <canvas id="user-img"></canvas>
                <canvas id="output-img"></canvas>
            </div>
            <button @click="redirectToModel" class="textColor ModelButton">View model</button>
            <button @click="redirectToUpload" class="textColor UploadButton">
                Upload another image
            </button>
            <button @click="redirectToInfiniteZoom" class="textColor ZoomButton">
                Try infinite zoom on your image
            </button>
        </div>
    </main>
</template>

<style scoped>
main {
    min-height: 100vh;
    padding: 1rem;
    background: #13161c;
}
.ChooseAnother {
    color: rgb(0, 0, 0);
    height: auto;
    border: 1px solid black;
    background-color: #c7c7c7;
}

.textColor:hover {
    color: red;
    border: 1px solid transparent;
    background-color: transparent;
    transition: 0.2s all ease-in;
}

.UploadButton,
.ZoomButton {
    margin-left: 20px;
}
.textColor {
    color: rgb(193, 192, 192);
    height: 50px;
    /* border: 1px solid black; */
    border-top: 1px solid red;
    border-bottom: 1px solid red;
    border-left: 0;
    border-right: 0;
    background-color: #13161c;
}

.textColor:hover {
    color: red;
    border: 0;
    background-color: transparent;
    transition: 0.2s all ease-in;
}
.ModelButton {
}
.UploadButton,
.ZoomButton {
    margin-left: 20px;
}
</style>
