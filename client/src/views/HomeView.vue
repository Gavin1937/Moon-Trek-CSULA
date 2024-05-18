<script setup>
import BasicMoon from '../components/BasicMoon.vue'
</script>

<template>
    <main>
        <div class="background">
        <div class="infoBox">
        <div class="columns is-centered">
            <div class="column has-text-centered is-11">
                <h1>Moon Trek Telescope</h1>
                <h2 class="lunarTitle">- Elevate your lunar exploration -</h2>
            </div>
        </div>

       <div class="MoonBox">

            <div class="MoonBoxLeft">
                <h2 class="MoonTrekDescriptionTitle">How Does it Work? <hr> </h2>
                <p class="MoonTrekDescription">
                    Moon Trek Telescope is an application that allows you to submit your own images
                    of the moon and receive useful information within the field of view, such as
                    annotations, layering, etc.
                </p>

            </div>
            <div class="MoonBoxCenter">
                <BasicMoon />
            </div>
            <div class="MoonBoxRight">

                <h2 class="MoonTrekDescriptionTitle">Explore the moon <hr> </h2>
                <p class="MoonTrekDescription">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non pulvinar enim, ac pretium purus.
                    Donec pellentesque nec purus in luctus. Morbi enim nibh.
                </p>

            </div>
        </div>

        <div class="columns is-centered BelowMoonTitle">
            <div class="column has-text-centered is-8">
                <h2 class="getStartedDescription"> Begin with uploading a photo:</h2>
            </div>
        </div>

        <div class="columns is-centered">
            <div class="column has-text-centered">
                <router-link to="upload">

                    <button class="getStarted"> <p class="getStartedText"> GET STARTED </p> </button>


                </router-link>
            </div>
        </div>
        </div>

        </div>

        <footer class="AdditionContent">
            <div class="footerContainer">
                <div class="footerLeft">

                </div>

                <div class="footerCenter">
                    <p class="footerText"> California State University, Los Angeles <br> MoonTrek AR <br> Group 19 <br></p>

                </div>

                <div class="footerRight">

                </div>


            </div>

        </footer>
    </main>
</template>

<style scoped>

main {
    min-height: 100vh;
    /* padding: 1rem; */
    width: 100%;
    height: 100%;
    background-color: black;
}
.background{
    background-image: url('/longBackground.png');
    background-repeat: no-repeat;
    background-position: center 170px;
    height: 1600px;
    width: 100%;
}
.BelowMoonTitle{
    margin-top: 20px;
    
}
.getStarted{
    color: white;
    border: 1px solid red;
    border-radius: 50px;
    width: 420px;
    height: 75px;
    margin-top: -15px;
    overflow: hidden;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;


    background: red; /* default color */
    /* background-color: rgb(216,57,51,0.3); */
    background: linear-gradient(to left, rgb(216,57,51,0.3) 50%, rgba(91, 4, 1, 0.3)) right;
    background-size: 400%;
    transition: .5s ease-out;
    
}

.getStarted:hover{
    background-position: left;
}

.getStartedText{
    font-family: 'Gill Sans';
    height: 40%;
    font-size: 1.8rem;
}

.getStartedDescription{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}



.infoBox{
    width: 80%;
    justify-content: center;
    align-items: center;
    height: auto;
    margin: 0 auto;
}

.MoonBox{
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 30px;
}
.MoonBoxLeft{
    float: left;
    max-width: 25%;

}
.MoonBoxCenter{
    float: middle;
    width: 600px;
}
.MoonBoxRight{
    float: right;
    max-width: 25%;
}

.AdditionContent{
    margin-top: 0px;
    widows: 100%;
    height: auto;
    text-align: center;
    
}

.footerContainer{
    width: 100%;
    height: 150px;
    display: flex;
    background-color: ;
    border-top: 1px solid rgb(128,128,128,0.3);
    padding-top: 20px;
    justify-content: center;
}

.footerLeft{
    float: left;
    background-color: ;
    background-image: url('/logoCSULA.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: auto;
    width: 10%;
}

.footerCenter{
    float: center;
    height: auto;
    padding-top: 30px;
    text-align: left;
    width: 20%;
    margin-left: 0%;
}
.footerText{
    font-size: 1.1rem;
    line-height: 22px;
    color: grey;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.footerRight{
    float: right;
    background-color: ;
    background-image: url('/logoJPL.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: auto;
    width: 10%;
    margin-left: 0%;
}

/* FONTS AND TITLES */
.lunarTitle{
    opacity: 50%;
    font-family: 'Gill Sans MT';

}

h1 {
    font-size: 4.5rem;
    font-family:  'Gill Sans MT';
}


h2 {
    font-size: 1.75rem;
}
hr{
    margin: 5px 0px;
}
p,
a {
    font-size: 1.3rem;
}
.MoonTrekDescription{
    font-size: 1.45rem;
    font-family: 'Gill Sans MT';

}
.MoonTrekDescriptionTitle{
    font-size: 1.85rem;
    font-family: 'Gill Sans MT';

}

</style>
