<script setup>
import { ref } from 'vue'
let active = ref(false)
let showingContent = ref(false)
let sidebarContent = ref('')

const btnEllist = document.querySelectorAll('.nav-link')

btnEllist.forEach((btnEl) => {
    btnEl.addEventListener('click', () => {
        document.querySelector('.focus')?.classList.remove('focus')
        btnEl.classList.add('focus')
    })
})

// Toggle sidebar visibility
function toggleNav(content = '') {
    const sidebar = document.getElementById('mySidebar')
    if (content) {
        sidebarContent.value = content
        showingContent.value = true
        sidebar.style.width = '550px' // Explicit width when open
    } else {
        sidebar.style.width = sidebar.style.width === '550px' ? '0' : '550px'
    }
}

function closeNav() {
    document.getElementById('mySidebar').style.width = '0'
    showingContent.value = false // Reset to menu view when closing
}

function showMenu() {
    showingContent.value = false // Back to showing menu
}
</script>

<template>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />

    <!-- Sidebar div-->
    <div id="mySidebar" class="sidebar">
        <a href="javascript:void(0)" class="closebtn" @click="closeNav">×</a>

        <!-- Menu links -->
        <div v-show="!showingContent">
            <br />
            <br />
            <a href="#" @click="toggleNav('about')">About</a>
            <a href="#" @click="toggleNav('contact')">Contact</a>
        </div>

        <!-- Content display -->
        <div v-show="showingContent">
            <button
                class="back-button"
                @click="showMenu"
                style="background-color: white; color: black"
            >
                Back
            </button>
            <div v-if="sidebarContent === 'about'">
                <h2>About Us</h2>
                <p>We are Moontrek and Moontrek is Us :)</p> <!-- We can fill this out very soon-->
            </div>
            <div v-if="sidebarContent === 'contact'">
                <h2>Contact Us</h2>
                <p>Might Delete this</p>
            </div>
        </div>
    </div>

    <!-- Sidebar div-->

    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div id="nav" class="navbar-menu" :class="active ? 'is-active' : ''">
            <!-- Router Link as a clickable logo area -->
            <router-link to="/" class="logoBox" aria-label="Home"></router-link>

            <!-- Navigation Links -->
            <div class="navbar-start">
                <router-link to="/" class="nav-link" :class="{ 'color-nav': $route.path === '/' }"
                    >Home</router-link
                >
                <router-link
                    to="/upload"
                    class="nav-link"
                    :class="{ 'color-nav': $route.path === '/upload' }"
                    >Upload</router-link
                >
                <router-link
                    to="/registration"
                    class="nav-link"
                    :class="{ 'color-nav': $route.path === '/registration' }"
                    >Registration</router-link
                >
                <router-link
                    to="/model"
                    class="nav-link"
                    :class="{ 'color-nav': $route.path === '/model' }"
                    >Model</router-link
                >
                <div class="filler"></div>
                <div id="main">
                    <button class="burgerbox extraLinks openbtn" @click="toggleNav()">
                        <i class="fa fa-bars" style="font-size: 24px"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
/* Sidebar */
.sidebar {
    height: 100%;
    width:  20%;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0px;
    background-color: rgba(17, 17, 17, 1); /* #111 in*/
    overflow-x: hidden;
    overflow-y: auto;
    transition:  0.5s;
    padding-top: 60px;
    opacity: 0.95;
}

.back-button {
    position: absolute;
    top: 140px;
    right: 10px;
    padding: 5px 10px;
    background-color: #f1f1f1;
    color: #111;
    border: none;
    cursor: pointer;
    z-index: 1050;
}

.sidebar a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s;
}

.sidebar a:hover,
.sidebar a:focus {
    color: #ffffff;
}

.sidebar .closebtn {
    position:absolute;
    top: 80px;
    right: 25px;
    font-size: 36px;
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
    transition: margin-left 0.5s;
    background-color: black;
}

.navbar {
    display: flex;
    width: 100%;
    padding: 0;
}
.logoBox {
    float: left;
    width: 15%;
    background-color: black;
    background-image: url('/logoTest.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
}

.navbar-menu {
    float: left;
    background-color: rgb(0, 0, 0);
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
    background-color: rgb(0, 0, 0);
    color: white;
}

.burgerbox {
    font-size: 1.25rem;
    margin: 2.2rem 1.2rem;
    background-color: black;
}

.nav-link:hover {
    cursor: pointer;
    color: #8e8e8e;
}

.color-nav {
    color: white;
    border-bottom: 2px solid red;
    transition: 0.5s ease;
}

.filler {
    border-left: 1px solid grey;
    background-color: black;
    height: 50%;
    margin: 1.6rem 1.2rem;
}

</style>
