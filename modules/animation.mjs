"use strict";


let activeSection = "beers";

document.querySelectorAll("li").forEach(btn => btn.addEventListener("click", changeSection));
document.querySelectorAll("input[type=radio]").forEach(btn => {
    btn.addEventListener("click", setActivePaymentOption)
});
document.querySelectorAll("#side-menu").forEach(btn => btn.addEventListener("click", toggleSideMenu));
document.querySelector("#order-feedback-screen button").addEventListener("click", toggleOrderScreen);

function toggleOrderScreen(){
    document.querySelector("#order-feedback-screen").classList.add("hidden");
    document.querySelector("#order-confirm-screen").classList.add("hidden");
}

function changeSection(e) {

    activeSection = e.target.id.split("-")[0];

    //close side menu on change section
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

    //add active class to active section button
    document.querySelectorAll("li").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");


    if(activeSection == "payment") {
        const user = netlifyIdentity.currentUser();
        if(user==null){
            netlifyIdentity.open();
            document.querySelector("#beers").classList.remove("hidden");
            document.querySelector("#login").classList.add("hidden");
            document.querySelectorAll("li").forEach(btn => btn.classList.remove("active"));
            document.querySelector("#beers-btn").classList.add("active");
            activeSection = "beers";
        }
    }

    // hide the login section and redirect the user to "Beers" section
    if (activeSection == "login") {
        document.querySelector("#beers").classList.remove("hidden");
        document.querySelector("#login").classList.add("hidden");
        document.querySelectorAll("li").forEach(btn => btn.classList.remove("active"));
        document.querySelector("#beers-btn").classList.add("active");
        activeSection = "beers";
    }



    console.log("[INFO] ACTIVE SECTION: " + activeSection);
}

function toggleSideMenu() {
    document.querySelector(".side-menu").classList.toggle("extended");
}

function setActivePaymentOption(e) {
    console.log("[INFO] ACTIVE PAYMENT OPTION: " + e.target);
    e.target.parentNode.parentNode.querySelectorAll("div").forEach(div => div.classList.remove("selected"));
    e.target.parentNode.classList.add("selected");
}

