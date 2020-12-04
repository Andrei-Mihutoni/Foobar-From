"use strict";

import * as db from "../modules/db.mjs";



let activeSection = "beers";

document.querySelectorAll("li").forEach(btn => btn.addEventListener("click", changeSection));
document.querySelectorAll(".beer-text-wrapper .primary-btn").forEach(btn => btn.addEventListener("click", learnMore));
document.querySelectorAll("input[type=radio]").forEach(btn => {btn.addEventListener("click", setActivePaymentOption)
console.log(btn)});

function setActivePaymentOption(e){
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

    console.log(e.target.id.split("-")[0]);
}

function learnMore(e) {
    console.log("learnmore");
    e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}

// post the orders to the Heroku server
db.post(db.prepareData);