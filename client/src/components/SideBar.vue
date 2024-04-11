<script setup>
import jsonLayers from '../assets/overlays.json'
import { data } from '../data.js'
import { ref, defineEmits } from 'vue'

const selectedLayer = ref('')
const emit = defineEmits(['layerSet'])
const setLayerImage = (layerName) => {
    data.layerFileName = layerName
    selectedLayer.value = layerName
    emit('layerSet')
}
</script>
<template>
    <div>
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
            class="offcanvas offcanvas-start"
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
                    class="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                ></button>
            </div>
            <div class="offcanvas-body bg-secondary">
                <div class="list-group">
                    <div v-for="(layer, index) in jsonLayers.layers" :key="index">
                        <button
                            class="w-100 m-1 p-1"
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
                            <div class="card card-body">
                                <img :src="layer.imageURL" :alt="layer.title" />
                                <p class="bg-white text-black mx-auto p-2 m-1 h-5 overflow-auto">
                                    {{ layer.description }}
                                </p>

                                <a
                                    class="m-2 p-2 bg-primary text-white text-decoration-none text-center rounded"
                                    :href="layer.metadataURL"
                                    >View metadata on another tab</a
                                >
                                <button
                                    v-if="layer.fileName === selectedLayer"
                                    class="rounded border-0 bg-danger text-white p-2 m-2"
                                    @click="setLayerImage('')"
                                >
                                    Remove layer from image
                                </button>
                                <button
                                    v-else
                                    class="rounded text-white p-2 m-2"
                                    @click="setLayerImage(layer.fileName)"
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
