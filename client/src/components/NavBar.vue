<script setup>
import { ref } from 'vue'
let active = ref(false)

const btnEllist = document.querySelectorAll('.nav-link');

btnEllist.forEach(btnEl => {
    btnEl.addEventListener('click',() => {
        document.querySelector('.focus')?.classList.remove('focus')
        btnEl.classList.add('focus');
    });
});

function openNav() {
  document.getElementById("mySidebar").style.width = "550px";
  document.getElementById("main").style.marginRight = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginRight= "0";
}


</script>

<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<!-- Sidebar div-->
<div id="mySidebar" class="sidebar">
            <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
</div>
<!-- Sidebar div-->


    <nav class="navbar" role="navigation" aria-label="main navigation">
       <!-- <div class="navbar-brand">
            <a
                role="button"
                class="navbar-burger"
                :class="active ? 'is-active' : ''"
                @click="active = !active"
                data-target="nav"
                aria-label="menu"
                aria-expanded="false"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

    -->



        <div id="nav" class="navbar-menu" :class="active ? 'is-active' : ''">
                    <div onclick="/" class="logoBox"></div>
                    
            <div class="navbar-start">
                <router-link to="/" class="nav-link" v-bind:class="{ 'color-nav': $route.path == '/' }"> Home </router-link>
                <router-link to="upload" class="nav-link" v-bind:class="{ 'color-nav': $route.path == '/upload' }"> Upload </router-link>
                <router-link to="registration" class="nav-link" v-bind:class="{ 'color-nav': $route.path == '/registration' }"> Registration </router-link>
                <router-link to="model" class="nav-link" v-bind:class="{ 'color-nav': $route.path == '/model' }"> Model </router-link>
                <div class="filler"> </div>
                <div id="main">
                    <button class="burgerbox extraLinks openbtn" onclick="openNav()" v-bind:class="{ 'color-nav': $route.path == '/about' }">
                        <i style="font-size:24px" class="fa">&#xf0c9;</i>
                     </button>
                </div>


            </div>
        </div>

        <!--
        <div class="burger"> Burger box
            <a
                role="button"
                class="navbar-burger"
                data-target="nav"
                aria-label="menu"
                aria-expanded="false"
            >

            </a>
        </div>
        -->
    </nav>
</template>

<style scoped>

/* Sidebar */
.sidebar {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0px;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidebar a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidebar a:hover {
  color: #f1f1f1;
}

.sidebar .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

.openbtn {
  font-size: 20px;
  cursor: pointer;
  background-color: #111;
  color: white;
  padding: 0px 0px;
  border: none;
}

#main {
  transition: margin-left .5s;
  background-color: black;
}

.navbar{
    display: flex;
    width: 100%;
    padding: 0;
}
.logoBox{
    float: left;
    width: 15%;
    background-color: black;
    background-image: url('/logoTest.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;

}

.navbar-menu{
    float: left;
    background-color: black;
    height: 100px;
    width: 50%;
    margin-left: auto;
    margin-right: 0;
}
.navbar-start {
    background-color: black;
    margin-right: 20px;
    margin-left: auto;
}

.nav-link {
    font-size: 1.25rem;
    margin: 2.2rem 1.2rem;
    padding-bottom: 40px;
    background-color: black;

}

.burgerbox {
    font-size: 1.25rem;
    margin: 2.2rem 1.2rem;
    background-color: black;
}

.nav-link:hover {
    cursor: pointer;
}

.color-nav {
    color: white;
    border-bottom: 2px solid red;
    transition:  1s ease;
}

.filler{
    border-left: 1px solid grey;
    background-color: black;
    height: 50%;
    margin: 1.6rem 1.2rem;


}

</style>
