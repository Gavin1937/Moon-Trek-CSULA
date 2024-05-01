<script setup>
import { data } from '../data.js'
// import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted, ref } from 'vue'
import {
    Viewer,
    GeographicTilingScheme,
    Rectangle,
    WebMapTileServiceImageryProvider,
    DirectionalLight,
    Cartesian3,
    Math as csMath,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType
} from 'cesium'

const boundingBoxes = {
    infiniteZoom: null,
    cesium: null,
    image: null
}
const zoomImage = ref(null)
const imageContainer = ref(null)
const infiniteZoomContainer = ref(null)
const cesiumContainer = ref(null)
const DISTANCE_EARTH_MOON = 384400000 //In meters
const EARTH_RADIUS = 6357000 // In meters
const MOON_RADIUS = 1740000
// This is width in meters of the camera's plane relative to the scene.
let start_canvas_width = null
// This height in meters  of the camera's plane relative to the scene.
let start_canvas_height = null
// The model is the size of the earth. This is needed to keep scale with the moon.
const SYSTEM_CONV = MOON_RADIUS / EARTH_RADIUS
const STARTHEIGHT = DISTANCE_EARTH_MOON * SYSTEM_CONV
//----User image variables----
const ZOOM_SPEED = 0.1
const MIN_SCALE = 0.1
const MAX_SCALE = 7

const moonCenter = { x: data.moonCircle.x, y: data.moonCircle.y } // Center point from top left hand corner from WASM library circle detect
//taken from Natalie's API, also used for 3 body solution in three js
const librations = data.librations
const earthToMoon = data.earthToMoon
const earthToSun = data.earthToSun
const moonToSun = {
    x: (earthToSun.x - earthToMoon.x) * SYSTEM_CONV,
    y: (earthToSun.y - earthToMoon.y) * SYSTEM_CONV,
    z: (earthToSun.z - earthToSun.z) * SYSTEM_CONV
}
const moonToSunDistance = Math.sqrt(moonToSun.x ** 2 + moonToSun.y ** 2 + moonToSun.z ** 2)
console.log(moonToSun, moonToSunDistance)
const sunSphericalCoords = {
    dist: moonToSunDistance,
    lat: (Math.asin(moonToSun.z / moonToSunDistance) * 180) / Math.PI,
    long: 180 - (Math.atan(moonToSun.x / moonToSun.y) * 180) / Math.PI
}
console.log('Sun is here:', sunSphericalCoords)

//selected overlays
const layers = data.layerFilenames
const moonRotation = 30 // Moons rotation in the image
const moonRadiusImage = data.moonCircle.radius // Radius of the moon in the image
// ***Variables to integrate with MoonTrek in the future***

let scale = 1
let imageTranslateX = 0
let imageTranslateY = 0
// ----Cesium variables----
let moon_height_fov = null // FOV where moon matches the height of the container.
let fov = null
let user_image_visable = true
let viewer = null
let firstZoomTick = true
let cesiumTranslateX = 0
let cesiumTranslateY = 0
//Top Left coordinates of image WILL NOT MATCH image translate variables!!!!
let lastImageCoords = { x: 0, y: 0 }
//----Shared UI variables----
// Current mouse position
let mousePosition = { x: 0, y: 0 }
// Whether the image is currently being dragged
let isDragging = false
onMounted(() => {
    const updateBoundingBoxes = () => {
        boundingBoxes.infiniteZoom = infiniteZoomContainer.value.getBoundingClientRect()
        boundingBoxes.cesium = cesiumContainer.value.getBoundingClientRect()
        boundingBoxes.image = zoomImage.value.getBoundingClientRect()
        setFov()
    }
    updateBoundingBoxes()
    //Positions of mouse on original mouse down
    let initialMouseX, initialMouseY
    addEventListener('resize', () => {
        updateBoundingBoxes()
    })
    function setFov() {
        moon_height_fov =
            (Math.atan(
                (1000 / boundingBoxes.infiniteZoom.height) * Math.tan((18 * Math.PI) / 180)
            ) *
                180) /
            (Math.PI * 2)
        fov = moon_height_fov
        start_canvas_height = EARTH_RADIUS * 2
        start_canvas_width =
            (start_canvas_height * boundingBoxes.infiniteZoom.width) /
            boundingBoxes.infiniteZoom.height
    }
    function initCesium() {
        // Stops the zoom from continuing immediately from the user image.
        // Gives cesium time to load
        firstZoomTick = true
        cesiumContainer.value.style.height = '100%'
        viewer = new Viewer('cesiumContainer', {
            animation: false,
            timeline: false
        })
        updateBoundingBoxes()
        console.log(boundingBoxes, lastImageCoords)
        //Remove earth tiles!!!!!
        viewer.imageryLayers.removeAll()
        // Create handler for the scene.
        // This will handle our custom user inputs
        const handler = new ScreenSpaceEventHandler(viewer.canvas)

        //Check bbox and WAC capabilities xml
        const moonTilingScheme = new GeographicTilingScheme({
            rectangle: new Rectangle.fromDegrees(-180, -90, 180, 90),
            numberOfLevelZeroTilesX: 2,
            numberOfLevelZeroTilesY: 1
        })

        //place base Moon texture first before selected overlays
        for (let i = -1; i < layers.length; i++) {
            let layer
            if (i == -1) layer = 'LRO_WAC_Mosaic_Global_303ppd_v02'
            else layer = layers[i]
            const overlay = new WebMapTileServiceImageryProvider({
                url: `https://trek.nasa.gov/tiles/Moon/EQ/${layer}/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png`,
                layer: layer,
                style: 'default',
                format: 'image/jpeg',
                tileMatrixSetID: 'default028mm',
                tilingScheme: moonTilingScheme
            })
            viewer.imageryLayers.addImageryProvider(overlay)
        }

        const sun = new DirectionalLight({
            direction: new Cartesian3.fromDegrees(
                sunSphericalCoords.long,
                sunSphericalCoords.lat,
                sunSphericalCoords.dist
            ),
            intensity: 2.5
        })

        //Add lighting
        viewer.scene.light = sun
        viewer.shadows = true
        viewer.scene.sun.show = false
        viewer.scene.globe.showGroundAtmosphere = false
        viewer.scene.globe.enableLighting = true

        //Remove the default controls
        viewer.scene.screenSpaceCameraController.enableRotate = false
        viewer.scene.screenSpaceCameraController.enableTranslate = false
        viewer.scene.screenSpaceCameraController.enableZoom = false
        viewer.scene.screenSpaceCameraController.enableTilt = false
        viewer.scene.screenSpaceCameraController.enableLook = false

        //Set initial camera fov
        viewer.camera.frustum.fov = csMath.toRadians(fov)

        viewer.camera.setView({
            //My guess is that 0,0 is the center of the flat tiling
            // Cartesian -> Think Lat Long
            // TODO: Add wobble from registration when integrated
            destination: new Cartesian3.fromDegrees(-librations.long, -librations.lat, STARTHEIGHT)
        })

        const moonPosViewport = getMoonCenterFromMiddleOfViewport()
        const rect = boundingBoxes.infiniteZoom
        // Moves moon such that the center matches the center of the currently translated
        // and scaled user image.
        const rightMeters = start_canvas_width * (moonPosViewport.x / rect.width)
        const leftMeters = start_canvas_height * (moonPosViewport.y / rect.height)
        console.log(rightMeters, leftMeters, rect.height)
        viewer.camera.twistRight((moonRotation * Math.PI) / 180)
        viewer.camera.moveRight(rightMeters)
        viewer.camera.moveDown(leftMeters)

        // Handle dragging navigation in cesium
        handler.setInputAction(function (movement) {
            mousePosition.x = movement.endPosition.x
            mousePosition.y = movement.endPosition.y
        }, ScreenSpaceEventType.MOUSE_MOVE)

        // Handle scrolling navigation in cesium
        handler.setInputAction(function (scrollSpeed) {
            if (
                !user_image_visable &&
                (fov + 0.1 > moon_height_fov || fov - 0.1 > moon_height_fov) &&
                scrollSpeed < 0
            ) {
                // Switch to user image when MOON_HEIGHT_FOV is passed
                cesiumContainer.value.style.display = 'none'
                imageContainer.value.style.display = 'block'
                user_image_visable = true
                isDragging = false
                viewer.entities.removeAll()
                viewer.destroy()
            } else if (!firstZoomTick && !user_image_visable) {
                // Moverate is dictated by the fov itself.
                // The smaller the fov the smaller the change in fov.
                const moveRate = fov / 7
                if (scrollSpeed > 0) {
                    fov -= moveRate
                    viewer.camera.frustum.fov = csMath.toRadians(fov)
                } else if (scrollSpeed < 0 && fov < 60) {
                    // Maximum fov needs to be set. Sh*t gets weird at 180
                    fov += moveRate
                    viewer.camera.frustum.fov = csMath.toRadians(fov)
                }
            }
            firstZoomTick = false
        }, ScreenSpaceEventType.WHEEL)
    }
    function getMoonCenterFromMiddleOfViewport() {
        /*
        In order to get the vector of the center of the image from the moon we use the 
        two vectors provided to us...
        - The first vector is the one connecting the top left hand corner of the image 
        and the moon eg. moonCenter. This is given to us from circle detection.
        - The second is the vector connecting the top left hand corner of the image to
        the center of the image given to us by half the image height and half the image
        width.
        - The resulting vector is then scaled by the current image scale and translated
        by the current x and y translation from drag. This gives us the final 
        coordinates of the moon in relation to the center of the viewport.
        */
        const rect = boundingBoxes.infiniteZoom
        const moonFromTop = moonCenter.y * scale - lastImageCoords.y
        const moonFromLeft = moonCenter.x * scale + lastImageCoords.x
        return { x: -moonFromLeft + rect.width / 2, y: -moonFromTop + rect.height / 2 }
    }
    // function getViewportScale(){
    //     return boundingBoxes.infiniteZoom.width/image.naturalWidth;
    // }
    imageContainer.value.addEventListener('wheel', function (event) {
        event.preventDefault()
        const rect = boundingBoxes.infiniteZoom
        if (user_image_visable && scale * moonRadiusImage * 2 >= rect.height && event.deltaY < 0) {
            // Switch from user image to cesium when the scaled moon radius is larger than
            // the height of the image
            // Checking for a negative delta makes sure that you're currently scrolling
            // down during this change
            user_image_visable = false
            imageContainer.value.style.display = 'none'
            cesiumContainer.value.style.display = 'block'
            isDragging = false
            initCesium()
        } else if (user_image_visable) {
            const delta = event.deltaY * -0.007
            const newScale = Math.max(MIN_SCALE, Math.min(scale + delta * ZOOM_SPEED, MAX_SCALE))

            if (newScale !== scale) {
                // Set new scale
                scale = newScale
                // Apply the transformation
                updateTransform()
            }
        }
    })
    function updateTransform() {
        updateBoundingBoxes()
        const rect = boundingBoxes.infiniteZoom
        if (!user_image_visable) {
            // Calculates what percentage of the viewport the cesium moon has traveled
            const movePercentInX = ((cesiumTranslateX / rect.width) * fov) / moon_height_fov / 2
            const movePercentInY = ((cesiumTranslateY / rect.height) * fov) / moon_height_fov / 2

            // Moves the camera in space based on the percent traveled
            viewer.camera.moveLeft(start_canvas_width * movePercentInX)
            viewer.camera.moveUp(start_canvas_height * movePercentInY)

            // Moves the image viewport based on the percent traveled
            imageTranslateX += rect.width * movePercentInX
            imageTranslateY += rect.height * movePercentInY
        }
        zoomImage.value.style.transform = `translate(${imageTranslateX}px, ${imageTranslateY}px) scale(${scale})`
        const rect2 = boundingBoxes.image
        lastImageCoords.x = rect2.left - rect.left
        lastImageCoords.y = -rect2.top + rect.top
        console.log(lastImageCoords, rect, rect2)
    }

    cesiumContainer.value.addEventListener('mousemove', function (event) {
        if (isDragging) {
            // Mouse move portion of dragging cesium
            // It's important to keep the image translation
            // consistent while using cesium
            cesiumTranslateX = event.clientX - initialMouseX
            cesiumTranslateY = event.clientY - initialMouseY
            initialMouseX = event.clientX
            initialMouseY = event.clientY
            updateTransform()
        }
    })
    imageContainer.value.addEventListener('mousemove', function (event) {
        if (isDragging) {
            // Mouse move portion of dragging user image
            imageTranslateX += event.clientX - initialMouseX
            imageTranslateY += event.clientY - initialMouseY
            initialMouseX = event.clientX
            initialMouseY = event.clientY
            updateTransform()
        }
    })

    // Sets original mouse coordinates when dragging
    infiniteZoomContainer.value.addEventListener('mousedown', function (event) {
        event.preventDefault()
        console.log('hello')
        isDragging = true
        initialMouseX = event.clientX
        initialMouseY = event.clientY
    })

    // Set dragging to false on all mouse leaves
    infiniteZoomContainer.value.addEventListener('mouseleave', function () {
        isDragging = false
    })
    // Set dragging to false on all mouse up
    infiniteZoomContainer.value.addEventListener('mouseup', function () {
        isDragging = false
    })
})
</script>
<template>
    <div ref="infiniteZoomContainer" class="container">
        <div id="cesiumContainer" ref="cesiumContainer" class="container"></div>
        <div ref="imageContainer" class="container">
            <img
                ref="zoomImage"
                :src="data.outputImg.src"
                alt="moon"
                class="container"
                :width="data.outputImg.width"
                :height="data.outputImg.height"
            />
        </div>
    </div>
</template>
<style scoped>
#infiniteZoomContainer {
    overflow: hidden;
}
#cesiumContainer {
    margin: 0;
    padding: 0;
    display: 'none';
}
</style>
