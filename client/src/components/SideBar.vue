<script setup>
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TODO: move this overlay metadata to the server,
// TODO: so it can be dynamically update. We can
// TODO: easily update our overlays without rebuilding
// TODO: the client
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import jsonLayers from '../assets/overlays.json'

import { data } from '../data.js'
import { ref } from 'vue'

const layerTransparency = ref(1.0)
const emit = defineEmits(['selectedLayer'])

const addLayer = (layerName) => {
    //only append layer name if not already in list or if list is empty
    if (!data.layerFilenames.includes(layerName)) data.layerFilenames.push(layerName)
    const element = data.layerAttributes.find((layer) => layer.fileName === layerName)
    if (!element || data.layerAttributes.length === 0) {
        data.layerAttributes.push({
            fileName: layerName,
            layerTransparency: 1.0,
            layerImgFile: null
        })
    }
    //emit to upload page to remove error message to select an overlay first
    emit('selectedLayer')
}

const setLayerTransparency = (layerName, transparency) => {
    const floatTransparency = Number(transparency)
    const overlay = data.layerAttributes.find((layer) => layer.fileName === layerName)
    if (overlay) {
        overlay.layerTransparency = floatTransparency
    }
}

const removeLayer = (layerName) => {
    const idxToRemoveInLayerFileNames = data.layerFilenames.indexOf(layerName)
    const idxToRemoveInLayerAttributes = data.layerAttributes.findIndex(
        (layer) => layer.fileName === layerName
    )
    if (idxToRemoveInLayerFileNames > -1 && idxToRemoveInLayerAttributes > -1) {
        data.layerFilenames.splice(idxToRemoveInLayerFileNames, 1)
        data.layerAttributes.splice(idxToRemoveInLayerAttributes, 1)
    }
}
</script>
<template>
    <div class="sidebarLayers">
        <button
            class="btn btn-primary"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasScrolling"
            aria-controls="offcanvasScrolling"
        >
            Choose overlay
        </button>

        <div
            class="offcanvas offcanvas-start sidebarLayers"
            data-bs-scroll="true"
            data-bs-backdrop="false"
            tabindex="-1"
            id="offcanvasScrolling"
            aria-labelledby="offcanvasScrollingLabel"
        >
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Layers</h5>
                <button
                    type="button"
                    class="btn-close button1"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                ></button>
            </div>
            <div class="offcanvas-body bg-secondary sidebarLayers">
                <div class="list-group">
                    <div v-for="(layer, index) in jsonLayers.layers" :key="index">
                        <button
                            class="w-100 m-1 p-1 sidebarLayers"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`#${index}`"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                        >
                            <div class="d-flex flex-row text-center">
                                <img
                                    width="50"
                                    height="50"
                                    class="position-start"
                                    :src="layer.imageURL"
                                    :alt="layer.title"
                                />
                                <h6 class="ms-2">{{ layer.title }}</h6>
                            </div>
                        </button>
                        <div class="collapse" :id="index">
                            <div class="card card-body sidebarLayers">
                                <img :src="layer.imageURL" :alt="layer.title" />
                                <p class="bg-white text-black mx-auto p-2 m-1 h-5 overflow-auto">
                                    {{ layer.description }}
                                </p>

                                <a
                                    class="m-2 p-2 text-white text-decoration-none text-center rounded metaDataLink"
                                    :href="layer.metadataURL"
                                    target="_blank"
                                    >View metadata on another tab</a
                                >
                                <div v-if="data.layerFilenames.includes(layer.fileName)">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step=".01"
                                        v-model="layerTransparency"
                                    />
                                    <p class="text-white">{{ layerTransparency }}</p>
                                    <button class="buttonTransparency rounded border-0 text-white p-2"
                                        @click="
                                            setLayerTransparency(layer.fileName, layerTransparency)
                                        "
                                    >
                                        Set layer transparency
                                    </button>
                                    <button
                                        class="removeLayer rounded border-0 bg-danger text-white p-2 m-2"
                                        @click="removeLayer(layer.fileName)"
                                    >
                                        Remove layer from image
                                    </button>
                                </div>

                                <button
                                    v-else
                                    class="rounded text-white p-2 m-2 bg-primary sidebarButtons sidebarLayers"
                                    @click="addLayer(layer.fileName)"
                                >
                                    Add layer to image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.buttonTransparency{
    width: 94%;
    background-color: black;
}
.buttonTransparency:hover{
       text-decoration: underline;
       cursor: pointer;
}

.removeLayer{
    width: 94%;
}

.sidebarLayers {
    background: #13161c;
    color: white;
}

.metaDataLink {
    background: #13161c;
    border: 1px solid grey;
}

.sidebarButtons {
    background: #13161c;
    color: white;
}

.sidebarButtons:hover {
    background: #0b5ed7 !important;
}

.button1 {
    background-color: rgb(255, 255, 255);
}
</style>
