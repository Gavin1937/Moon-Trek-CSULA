import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import cesium from 'vite-plugin-cesium'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), cesium()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // setting the base path to be `http://host:port/`
    base: './',
    build: {
        target: "ES2022"
    },
})
