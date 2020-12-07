"use strict";



import * as db from "../modules/db.mjs";



let activeSection = "beers";

document.querySelectorAll("li").forEach(btn => btn.addEventListener("click", changeSection));
document.querySelectorAll(".beer-text-wrapper .primary-btn").forEach(btn => btn.addEventListener("click", learnMore));
document.querySelectorAll("input[type=radio]").forEach(btn => {btn.addEventListener("click", setActivePaymentOption)
console.log(btn)});
document.querySelectorAll("#side-menu").forEach(btn => btn.addEventListener("click", toggleSideMenu));

const orderBtns = document.querySelectorAll(".order-btn-wrapper");
orderBtns.forEach(btn => btn.addEventListener("click", orderBeer));

function orderBeer(e){
    let orderAmount = e.target.parentNode.querySelector(".order-amount");

    if(e.target.textContent == "+"){
        orderAmount.textContent = parseInt(orderAmount.textContent) + 1;
    } else if (e.target.textContent == "-") {
        if(parseInt(orderAmount.textContent)>=1)
        orderAmount.textContent = parseInt(orderAmount.textContent) - 1;
    }
}









function toggleSideMenu(){
    document.querySelector(".side-menu").classList.toggle("extended");
}

function setActivePaymentOption(e){
    console.log(e.target);
    e.target.parentNode.parentNode.querySelectorAll("div").forEach(div => div.classList.remove("selected"));
    e.target.parentNode.classList.add("selected");
}

function changeSection(e) {

    activeSection = e.target.id.split("-")[0];

    if(document.querySelector(".side-menu").classList.contains("extended"))
        document.querySelector(".side-menu").classList.toggle("extended")

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

let postingData = [
    { name: "Hoppily Ever After", amount: 55 },
    { name: "Row 26", amount: 2 }
];

db.post(postingData);

