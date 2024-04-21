<script setup>
import {
    Viewer,
    GeographicTilingScheme,
    Rectangle,
    WebMapTileServiceImageryProvider,
    DirectionalLight,
    Cartesian3,
    Math,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType
} from 'cesium'
// import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

onMounted(async () => {
    const container = document.getElementById('cesiumContainer')
    const viewer = new Viewer('cesiumContainer')
    const scene = viewer.scene
    const canvas = viewer.canvas
    const ellipsoid = scene.globe.ellipsoid

    const moonTilingScheme = new GeographicTilingScheme({
        rectangle: new Rectangle.fromDegrees(-180, -90, 180, 90),
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1
    })

    const moon = new WebMapTileServiceImageryProvider({
        url: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
        layer: 'LRO_WAC_Mosaic_Global_303ppd_v02',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'default028mm',
        tilingScheme: moonTilingScheme
    })

    const overlay = new WebMapTileServiceImageryProvider({
        url: 'https://trek.nasa.gov/tiles/Moon/EQ/Apollo15_MetricCam_ClrShade_Global_1024ppd/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
        layer: 'Apollo15_MetricCam_ClrShade_Global_1024ppd',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'default028mm',
        tilingScheme: moonTilingScheme
    })

    viewer.scene.imageryLayers.addImageryProvider(moon)
    viewer.imageryLayers.addImageryProvider(overlay)
    const sun = new DirectionalLight({
        direction: new Cartesian3(-96633.07372581658, -34602.63262598308, -106189.26505692085),
        intensity: 2.5
    })
    viewer.scene.light = sun
    viewer.shadows = true
    viewer.scene.sun.show = false
    viewer.scene.globe.showGroundAtmosphere = false
    viewer.scene.globe.enableLighting = true

    scene.screenSpaceCameraController.enableRotate = false
    scene.screenSpaceCameraController.enableTranslate = false
    scene.screenSpaceCameraController.enableZoom = false
    scene.screenSpaceCameraController.enableTilt = false
    scene.screenSpaceCameraController.enableLook = false
    viewer.camera.frustum.fov = Math.toRadians(5)
    viewer.camera.setView({
        //My guess is that 0,0 is the center of the flat tiling
        destination: Cartesian3.fromDegrees(0, 0, 400000000)
        //   orientation: {
        //     heading: Cesium.Math.toRadians(0),
        //     pitch: Cesium.Math.toRadians(-10),
        //     roll: 0.0
        // }
    })

    const handler = new ScreenSpaceEventHandler(canvas)

    let mousePosition = { x: 0, y: 0 }

    handler.setInputAction(function (movement) {
        mousePosition.x = movement.endPosition.x
        mousePosition.y = movement.endPosition.y
    }, ScreenSpaceEventType.MOUSE_MOVE)

    function customMoveRight(rightSpeedFactor) {
        console.log(rightSpeedFactor)
        var moveAmount = Cartesian3.multiplyByScalar(
            viewer.camera.right,
            rightSpeedFactor,
            new Cartesian3()
        )
        Cartesian3.add(viewer.camera.position, moveAmount, viewer.camera.position)
    }

    function customMoveUp(upSpeedFactor) {
        console.log(upSpeedFactor)
        var moveAmount = Cartesian3.multiplyByScalar(
            viewer.camera.up,
            upSpeedFactor,
            new Cartesian3()
        )
        Cartesian3.add(viewer.camera.position, moveAmount, viewer.camera.position)
    }

    handler.setInputAction(function (scrollSpeed) {
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const x_from_center = mousePosition.x - width / 2
        const y_from_center = -mousePosition.y + height / 2
        const cameraHeight = ellipsoid.cartesianToCartographic(viewer.camera.position).height
        const moveRate = cameraHeight / 100.0
        //console.log(mousePosition);
        //console.log(x,y);
        if (scrollSpeed > 0) {
            viewer.camera.moveForward(moveRate * 10)
        } else if (scrollSpeed < 0) {
            viewer.camera.moveBackward(moveRate * 10)
        }
    }, ScreenSpaceEventType.WHEEL)
    let isDragging = false
    let initialMouseX, initialMouseY
    let translateX = 0
    let translateY = 0
    function updateTransform() {
        const cameraToMoon = ellipsoid.cartesianToCartographic(viewer.camera.position)
        console.log(cameraToMoon)
        const cameraHeight = cameraToMoon.height
        console.log(translateX, translateY)
        customMoveRight((-translateX * cameraHeight) / 100000)
        customMoveUp((translateY * cameraHeight) / 100000)
    }
    container.addEventListener('mousemove', function (event) {
        if (isDragging) {
            translateX += event.clientX - initialMouseX
            translateY += event.clientY - initialMouseY
            initialMouseX = event.clientX
            initialMouseY = event.clientY
            updateTransform()
        }
    })
    container.addEventListener('mousedown', function (event) {
        event.preventDefault()
        isDragging = true
        initialMouseX = event.clientX
        initialMouseY = event.clientY
    })
    container.addEventListener('mouseup', function (event) {
        isDragging = false
    })

    container.addEventListener('mouseleave', function (event) {
        isDragging = false
    })
})
</script>
<template>
    <div id="cesiumContainer"></div>
</template>
<style scoped>
#cesiumContainer {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}
</style>
