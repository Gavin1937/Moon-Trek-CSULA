<script setup>
import ModelGenerator from '../components/ModelGenerator.vue'
import { reactive } from 'vue'
import { data } from '../data.js'
import { useRouter } from 'vue-router'
import { performRegistration } from '../util/registrationFunctions.js'

const router = useRouter()
const imgData = reactive({
    user: null,
    output: null
})

// Returns the URL to the given processed image type
const getUrl = (type) => {
    if (type === 'resized') {
        return `http://localhost:8888/static/processed/${type}-${data.relativeImageName}`
    } else {
        return `http://localhost:8888/static/processed/${type}-${algorithm.value}-${data.relativeImageName}`
    }
}

const redirectToModel = () => {
    router.push('/model')
}

const redirectToUpload = () => {
    router.push('/upload')
}

const displayOnImgsCanvas = () => {
    const userImgCanvas = document.getElementById('user-img')
    userImgCanvas.width = imgData.user.width
    userImgCanvas.height = imgData.user.height
    const userImgCtx = userImgCanvas.getContext('2d', {
        colorSpace: 'srgb'
    })
    userImgCtx.putImageData(imgData.user.data, 0, 0)

    const outputImgCanvas = document.getElementById('output-img')
    outputImgCanvas.width = imgData.output.width
    outputImgCanvas.height = imgData.output.height
    const outputImgCtx = outputImgCanvas.getContext('2d', {
        colorSpace: 'srgb'
    })
    outputImgCtx.putImageData(imgData.output.data, 0, 0)
}

const registrate = async () => {
    try {
        const response = await performRegistration(
            data.registrationAlgortihm,
            data.images.userImgFile,
            data.images.modelImgFile,
            data.images.layerImgFile,
            data.transparency,
            data.filterPx
        )

        console.log(response)
        // [inputImgData, outputImgData]
        // console.log('input data', inputImgData)
        // console.log('output data', outputImgData)

        imgData.user = response.userImg
        console.log(response.userImg)
        imgData.output = response.outputImg
        console.log(response.outputImg)
        displayOnImgsCanvas()
    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <main>
        <!-- data.newUpload is only set to true when the user uploads a new image -->
        <!-- and is set to false when ModelGenerator in "registrate" mode finishes -->
        <ModelGenerator mode="registrate" @model-and-layer-set="registrate" />
        <!-- <div v-else-if="data.relativeImageName !== ''">
            <div class="columns is-centered">
                <div class="column has-text-centered is-5">
                    <div class="select">
                        <select v-model="algorithm">
                            <option value="SURF">SURF</option>
                            <option value="SIFT">SIFT</option>
                            <option value="ORB">ORB</option>
                            <option value="AKAZE">AKAZE</option>
                            <option value="BRISK">BRISK</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column has-text-centered is-5">
                    <img :src="data.images.user.src" />
                </div>
                <div class="column has-text-centered is-5">
                    <img :src="getUrl('resized')" />
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column has-text-centered is-5">
                    <img :src="data.images.model.src" />
                </div>
                <div class="column has-text-centered is-5">
                    <img :src="data.images.layer.src" />
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column has-text-centered is-10">
                    <img :src="getUrl('registration')" />
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column has-text-centered is-5">
                    <img :src="getUrl('transformed')" />
                </div>
                <div class="column has-text-centered is-5">
                    <img :src="getUrl('layered')" />
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column has-text-centered is-3">
                    <img :src="getUrl('green')" />
                </div>
                <div class="column has-text-centered is-3">
                    <img :src="getUrl('red')" />
                </div>
                <div class="column has-text-centered is-3">
                    <img :src="getUrl('stacked')" />
                </div>
            </div>
        </div> -->

        <div>
            <form>
                <label>Choose another registration algorithm:</label>
                <select v-model="data.registrationAlgortihm" :selected="data.registrationAlgortihm">
                    <option value="SURF">SURF</option>
                    <option value="SIFT">SIFT</option>
                    <option value="AKAZE">AKAZE</option>
                    <option value="BRISK">BRISK</option>
                    <option value="ORB">ORB</option>
                </select>
                <label>Overlay transparency:</label>
                <input type="number" min="0" max="1" step="0.01" v-model="data.transparency" />
                <label>Filter px</label>
                <input type="number" v-model="data.filterPx" />
            </form>
            <div>
                <canvas id="user-img"></canvas>
                <canvas id="output-img"></canvas>
            </div>
            <button :on-click="redirectToModel">View model</button>
            <button :on-click="redirectToUpload">Upload another image</button>
            <button>Try infinite zoom on your image</button>
        </div>
    </main>
</template>

<style scoped>
main {
    min-height: 100vh;
    padding: 1rem;
}
</style>
