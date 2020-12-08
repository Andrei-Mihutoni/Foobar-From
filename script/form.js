"use strict";



import * as db from "../modules/db.mjs";



let activeSection = "beers";

document.querySelectorAll("li").forEach(btn => btn.addEventListener("click", changeSection));
document.querySelectorAll(".beer-text-wrapper .primary-btn").forEach(btn => btn.addEventListener("click", learnMore));
document.querySelectorAll("input[type=radio]").forEach(btn => {
    btn.addEventListener("click", setActivePaymentOption)
    console.log(btn)
});

function setActivePaymentOption(e) {
    console.log(e.target);
    e.target.parentNode.parentNode.querySelectorAll("div").forEach(div => div.classList.remove("selected"));
    e.target.parentNode.classList.add("selected");
}

function changeSection(e) {

    activeSection = e.target.id.split("-")[0];


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

function learnMore(e) {
    console.log("learnmore");
    e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}

// post the orders to the Heroku server
let postingData = [
    { name: "Hoppily Ever After", amount: 55 },
    { name: "Row 26", amount: 2 }
];

db.post(postingData);





// *** Log in - netlify identity ***


//open login modal on button click
document.querySelector("#login-btn").addEventListener('click', function () {
    netlifyIdentity.open();
});


// Bind to login/logout events and log the user name
netlifyIdentity.on('login', user => console.log('login suscessfull. User:', user.user_metadata.full_name));
netlifyIdentity.on('logout', () => console.log('Logged out'));



// const user = netlifyIdentity.currentUser();
// console.log(user);
// console.log(user.user_metadata.full_name);

