"use strict";



import * as db from "../modules/db.mjs";
import { prepareData } from "../modules/db.mjs";



let activeSection = "beers";

db.get(prepareData);

setTimeout(() => {
    init();
}, 100);

document.querySelectorAll("li").forEach(btn => btn.addEventListener("click", changeSection));
document.querySelectorAll("input[type=radio]").forEach(btn => {
    btn.addEventListener("click", setActivePaymentOption)
    console.log(btn)
});
document.querySelectorAll("#side-menu").forEach(btn => btn.addEventListener("click", toggleSideMenu));

function init() {
    addBeerTemplate(db.getData());
    document.querySelectorAll(".beer-text-wrapper .primary-btn").forEach(btn => btn.addEventListener("click", learnMore))

    const orderBtns = document.querySelectorAll(".order-btn-wrapper button");
    orderBtns.forEach(btn => btn.addEventListener("click", orderBeer))
}

function orderBeer(e) {
    let orderAmount = e.target.parentNode.querySelector(".order-amount");

    if (e.target.textContent == "+") {
        orderAmount.textContent = parseInt(orderAmount.textContent) + 1;
    } else if (e.target.textContent == "-") {
        if (parseInt(orderAmount.textContent) >= 1)
            orderAmount.textContent = parseInt(orderAmount.textContent) - 1;
    }

    if (e.target.parentNode.parentNode.parentNode.id == "beers") {
        addBeerToCart(e.target.parentNode.parentNode);
    } else {
        changeBeerQuantity(e.target.parentNode.parentNode);
    }
}

function changeBeerQuantity(beer) {

    let existingBeer;
    const allBeers = document.querySelectorAll("#beers .beer-wrapper");

    for (let beerOf of allBeers) {
        if (beer.id == beerOf.id)
            existingBeer = beerOf;
    }
    existingBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;

    if (parseInt(beer.querySelector(".order-amount").textContent) == 0)
        beer.parentNode.removeChild(beer);
}


function addBeerToCart(beer) {

    let isExistingBeer = false;
    let existingBeer;

    const cartBeers = document.querySelectorAll("#beer-cart-wrapper .beer-wrapper");
    for (let cartBeer of cartBeers) {
        if (cartBeer.id == beer.id)
            isExistingBeer = true;
        existingBeer = cartBeer;
    }

    console.log(parseInt(beer.querySelector(".order-amount").textContent))
    if (!isExistingBeer) {
        if (parseInt(beer.querySelector(".order-amount").textContent) != 0) {
            const newBeer = document.querySelector("#beer-template-quick").content.cloneNode(true);

            newBeer.querySelector("h2").textContent = beer.querySelector("h2").textContent;
            newBeer.querySelector(".beer-type").textContent = beer.querySelector(".beer-type").textContent;
            newBeer.querySelector(".beer-alc").textContent = beer.querySelector(".beer-alc").textContent;
            newBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;

            const orderBtns = newBeer.querySelectorAll(".order-btn-wrapper");
            orderBtns.forEach(btn => btn.addEventListener("click", orderBeer))

            const randId = Math.floor(Math.random() * Math.floor(300));
            beer.id = randId;
            newBeer.querySelector(".beer-wrapper").id = randId;

            document.querySelector("#beer-cart-wrapper").appendChild(newBeer);
        }
    } else {
        if (parseInt(beer.querySelector(".order-amount").textContent) == 0) {
            existingBeer.parentNode.removeChild(existingBeer);
        } else
            existingBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;
    }

}

function toggleSideMenu() {
    document.querySelector(".side-menu").classList.toggle("extended");
}

function setActivePaymentOption(e) {
    console.log(e.target);
    e.target.parentNode.parentNode.querySelectorAll("div").forEach(div => div.classList.remove("selected"));
    e.target.parentNode.classList.add("selected");
}

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

function learnMore(e) {
    console.log("learnmore");
    e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}

// post the orders to the Heroku server

document.querySelector("#confirm-order").addEventListener("click", sendOrder)

function sendOrder() {
    let postingData = [];

    let cartContent = document.querySelectorAll("#beer-cart-wrapper .beer-wrapper");
    cartContent.forEach(element => {
        let beerName = element.querySelector("h2").textContent;
        let beerAmount = element.querySelector(".order-amount").textContent;

        postingData.push({
            name: beerName,
            amount: beerAmount
        })
    });


    console.log(postingData)
    db.post(postingData);
};









function addBeerTemplate(dataArray) {
    for (let data of dataArray) {
        const template = document.querySelector("#beer-template").content.cloneNode(true);
        template.querySelector("h2").textContent = data.name;
        template.querySelector(".beer-type").textContent = data.category;
        template.querySelector(".beer-alc").textContent = data.alc;
        template.querySelector(".beer-desc").textContent = data.description.overallImpression;


        template.querySelector(".aroma").textContent = data.description.aroma;
        template.querySelector(".appearance").textContent = data.description.appearance;
        template.querySelector(".flavor").textContent = data.description.flavor;
        template.querySelector(".mouthfeel").textContent = data.description.mouthfeel;
        template.querySelector(".overall").textContent = data.description.overallImpression;

        document.querySelector("#beers").appendChild(template);
    }
}




// *** Log in - netlify identity ***

//! NETLIFY LINK FOR LOCAL TESTING: https://jovial-heisenberg-33c1c2.netlify.app

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

