"use strict";



import * as db from "../modules/db.mjs";
import * as anim from "../modules/animation.mjs";
import { prepareData } from "../modules/db.mjs";

db.get(prepareData);

document.querySelector("#confirm-order").addEventListener("click", sendOrder)

setTimeout(() => {
    init();
}, 100);

function init() {
    addBeerTemplate(db.getData());

    document.querySelectorAll(".beer-text-wrapper .primary-btn").forEach(btn => btn.addEventListener("click", learnMore))

    const orderBtns = document.querySelectorAll(".order-btn-wrapper button");
    orderBtns.forEach(btn => btn.addEventListener("click", orderBeer))
}

function learnMore(e) {
    console.log("learnmore");
    e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}

function orderBeer(e) {
    let orderAmount = e.target.parentNode.querySelector(".order-amount");

    if (e.target.textContent == "+") {
        orderAmount.textContent = parseInt(orderAmount.textContent) + 1;
    } else if (e.target.textContent == "-") {
        if (parseInt(orderAmount.textContent) >= 1)
            orderAmount.textContent = parseInt(orderAmount.textContent) - 1;
    }

    //if user clicks + - on the beers section
    if (e.target.parentNode.parentNode.parentNode.id == "beers") {
        addBeerToCart(e.target.parentNode.parentNode);
        updateCartTotal();
    } else {
        changeBeerQuantity(e.target.parentNode.parentNode);
        updateCartTotal();
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

function updateCartTotal(){
    let totalPrice = 0;

    document.querySelectorAll("#beer-cart-wrapper .beer-wrapper").forEach(beer => {
        totalPrice += parseInt(beer.querySelector(".beer-price").textContent) * parseInt(beer.querySelector(".order-amount").textContent);
    })

    document.querySelector("#cart .order-total h2 span").textContent = totalPrice;
}


function addBeerToCart(beer) {

    let isExistingBeer = false;
    let existingBeer;

    //check if there is a beer in cart with same id as beer in beers section
    const cartBeers = document.querySelectorAll("#beer-cart-wrapper .beer-wrapper");
    for (let cartBeer of cartBeers) {
        if (cartBeer.id == beer.id)
            isExistingBeer = true;
        existingBeer = cartBeer;
    }

    console.log(parseInt(beer.querySelector(".order-amount").textContent))

    //create new template in cart
    if (!isExistingBeer) {
        if (parseInt(beer.querySelector(".order-amount").textContent) != 0) {
            const newBeer = document.querySelector("#beer-template-quick").content.cloneNode(true);

            newBeer.querySelector("h2").textContent = beer.querySelector("h2").textContent;
            newBeer.querySelector(".beer-type").textContent = beer.querySelector(".beer-type").textContent;
            newBeer.querySelector(".beer-alc").textContent = beer.querySelector(".beer-alc").textContent;
            newBeer.querySelector(".beer-price").textContent = beer.querySelector(".beer-price").textContent;
            newBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;

            const orderBtns = newBeer.querySelectorAll(".order-btn-wrapper");
            orderBtns.forEach(btn => btn.addEventListener("click", orderBeer))

            //give random id to match beer
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

// post the orders to the Heroku server

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

    console.log(postingData);


    if(postingData.length!=0){
    db.post(postingData);
    //need timeout to get response
    setTimeout(() => {
        let response = db.getResponse();       
        
        if (response.status == 500){ 
            document.querySelector("#order-response-text").textContent = response.message;
        }else{
            toggleOrderScreen("Order was successfully added!", true);
            document.querySelector("#beer-cart-wrapper").innerHTML = "";
            updateCartTotal();
        }
    }, 100);
    }

};

function toggleOrderScreen(message, showQueue){

    let orderFeedbackScreen = document.querySelector("#order-feedback-screen");

    if(showQueue){
        orderFeedbackScreen.querySelector("p").classList.add("hidden");
    }

    orderFeedbackScreen.querySelector("h1").textContent = message;

    orderFeedbackScreen.classList.toggle("hidden");
}

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



const user = netlifyIdentity.currentUser();
// console.log(user);
// console.log(user);
// console.log(user.user_metadata.full_name);

