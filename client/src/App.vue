<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
</script>

<template>
    <NavBar />
    <RouterView />
</template>

<style >
 body, .button1, h6  {
    font-family: Nunito;
    color: #d8dee9;
    background: #13161c;
}

a {
    color: #5e81ac;
} 

a:hover {
    color: #b48ead;
}
</style>
