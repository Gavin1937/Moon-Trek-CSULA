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
        <!--
        <div class="columns is-centered">
            <div class="column is-8">
                <p>
                    Moon Trek Telescope is an application that allows you to submit your own images
                    of the moon and receive useful information within the field of view, such as
                    annotations, layering, etc.
                </p>
            </div>
        </div>
        <div class="columns is-centered">
            <div class="column is-8">
                <p>
                    Begin by selecting your image of the moon. For best registration results
                    consider: clear, non blurry images with at least 50% of the moon.
                </p>
            </div>
        </div>
        <div class="columns is-centered">
            <div class="column is-8">
                <p>
                    Our application will attempt image registration. If the image registers
                    properly, we will be able to annotate your image. If registration fails, then
                    you will have to resubmit a better image.
                </p>
            </div>
        </div>

        <div class="columns is-centered">
            <div class="column has-text-centered">
                <router-link to="upload"> Get Started </router-link>
            </div>
        </div>
        -->
        </div>

        <div class="AdditionContent">
            More info...

        </div>


        </div>
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
    background-image: url('../public/longbackground.png');
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
    transition: all 300ms ease;
    background-color: rgb(216,57,51,0.3);
}

.getStarted:after {
  width: 300%;
  height: 300%;
  left: -300%;
  transform: rotate(45deg);
  background-color: #f21170;
  transition: all 300ms ease;
}
.getStarted:hover .getStartedText {
  color: #fff;
  z-index: 10;

}
.getStarted:hover::after {
  left: -100%;
}

.getStarted:hover {
  border: 2px solid #f21170;
  cursor: pointer;
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
    margin-top: 600px;
    widows: 100%;
    height: auto;
    text-align: center;
    
}

/* FONTS AND TITLES */
.lunarTitle{
    opacity: 50%;
    font-family: 'Gill Sans';

}

h1 {
    font-size: 4.5rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.getStartedDescription{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.getStartedText{
    font-family: 'Gill Sans';
    height: 40%;
    font-size: 1.8rem;
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
    font-family: 'Gill Sans';

}
.MoonTrekDescriptionTitle{
    font-size: 1.85rem;
    font-family: 'Gill Sans';

}

</style>
