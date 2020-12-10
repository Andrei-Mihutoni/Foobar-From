"use strict";


let activeSection = "beers";


document.querySelectorAll("li").forEach(btn => btn.addEventListener("click", changeSection));
document.querySelectorAll("input[type=radio]").forEach(btn => {
    btn.addEventListener("click", setActivePaymentOption)
    console.log(btn)
});
document.querySelectorAll("#side-menu").forEach(btn => btn.addEventListener("click", toggleSideMenu));

function changeSection(e) {

    activeSection = e.target.id.split("-")[0];

    if (document.querySelector(".side-menu").classList.contains("extended"))
        document.querySelector(".side-menu").classList.toggle("extended")

    //show only activeSection
    document.querySelectorAll("main > section").forEach(section => {
        if (section.id == activeSection) {
            section.classList.remove("hidden");
        } else {
            section.classList.add("hidden");
        }
    })


    document.querySelectorAll("li").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    // hide the login section and redirect the user to "Beers" section
    if (e.target.id.split("-")[0] == "login") {
        document.querySelector("#beers").classList.remove("hidden");
        document.querySelector("#login").classList.add("hidden");
        document.querySelectorAll("li").forEach(btn => btn.classList.remove("active"));
        document.querySelector("#beers-btn").classList.add("active");
    }


    console.log(e.target.id.split("-")[0]);


}

function toggleSideMenu() {
    document.querySelector(".side-menu").classList.toggle("extended");
}

function setActivePaymentOption(e) {
    console.log(e.target);
    e.target.parentNode.parentNode.querySelectorAll("div").forEach(div => div.classList.remove("selected"));
    e.target.parentNode.classList.add("selected");
}


function learnMore(e) {
    console.log("learnmore");
    e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}

