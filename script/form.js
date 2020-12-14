"use strict";



import * as db from "../modules/db.mjs";
import * as anim from "../modules/animation.mjs";
import { prepareData } from "../modules/db.mjs";
// import * as Card from "card";

db.get(prepareData);

document.querySelector("#confirm-order").addEventListener("click", function(){
    sendOrder("#beer-cart-wrapper");
});
document.querySelector("#confirm-last-order").addEventListener("click", function(){
    sendOrder("#last-order-wrapper");
});
document.querySelector("#login-btn").addEventListener('click', function () {
    netlifyIdentity.open();
});
document.querySelector("#quick-order-login-btn").addEventListener('click', function () {
    netlifyIdentity.open();
});


netlifyIdentity.on('login', user => {
    console.log('login suscessfull. User:', user.user_metadata.full_name)
    checkLoggedIn();
    setTimeout(() => {
        addPreviousOrder();        
    }, 100);
    setTimeout(() => {
        netlifyIdentity.close();
    }, 1500); 
});
netlifyIdentity.on('logout', () => {
    console.log('Logged out')
    checkLoggedIn();   
});

let card = new Card({ form: 'form', container: '.card-wrapper'})

function checkLoggedIn(){
    const user = netlifyIdentity.currentUser();
    if (user == null) {
        document.querySelector("#logged-in-text").classList.remove("hidden");
        document.querySelector("#order .order-total").classList.add("hidden");
        document.querySelector("#last-order-wrapper").innerHTML = "";
        document.querySelector("#quick-order-login-btn").classList.remove("hidden");
        document.querySelector("#login-btn").textContent = "Log In";
    } else {
        document.querySelector("#order .order-total").classList.remove("hidden");
        document.querySelector("#logged-in-text").classList.add("hidden");
        document.querySelector("#quick-order-login-btn").classList.add("hidden");
        document.querySelector("#login-btn").textContent = "Log Out";
    }
}


setTimeout(() => {
    init();
}, 200);

function init() {
    addBeerTemplate(db.getData());

    document.querySelectorAll(".beer-text-wrapper .primary-btn").forEach(btn => btn.addEventListener("click", learnMore))

    const orderBtns = document.querySelectorAll(".order-btn-wrapper button");
    orderBtns.forEach(btn => btn.addEventListener("click", addBeerQuantity));
    checkLoggedIn();

    addRecommendedBeer();
}

function addRecommendedBeer(){
    let beers = document.querySelectorAll("#beers .beer-wrapper");
    let randomBeer = Math.floor(Math.random() * beers.length);
    let recommendedTexts = document.querySelectorAll("#recommended-texts p");
    let randomText = Math.floor(Math.random() * 3);
    recommendedTexts[randomText].classList.remove("hidden");
    console.log(beers[randomBeer]);
    addQuickTemplateFromTemplate(beers[randomBeer], "#recommended-wrapper", false)
}

function learnMore(e) {
    console.log("learnmore");
    e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}

function addBeerQuantity(e) {
    let orderAmount = e.target.parentNode.querySelector(".order-amount");

    if (e.target.textContent == "+") {
        orderAmount.textContent = parseInt(orderAmount.textContent) + 1;
    } else if (e.target.textContent == "-") {
        if (parseInt(orderAmount.textContent) >= 1)
            orderAmount.textContent = parseInt(orderAmount.textContent) - 1;
    }

    //if user clicks + - on the beers section
    if (e.target.parentNode.parentNode.parentNode.id == "beers" || e.target.parentNode.parentNode.parentNode.id == "recommended-wrapper" ) {
        addBeerToCart(e.target.parentNode.parentNode);
        updateCartTotal("#cart", "#beer-cart-wrapper");
    } else {
        changeBeerQuantity(e.target.parentNode.parentNode);
        updateCartTotal("#cart", "#beer-cart-wrapper");
    }
    if (e.target.parentNode.parentNode.parentNode.id == "last-order-wrapper"){
        updateCartTotal("#order", "#last-order-wrapper");
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

function updateCartTotal(source, countFrom){
    let totalPrice = 0;

    document.querySelectorAll(`${countFrom} .beer-wrapper`).forEach(beer => {
        totalPrice += parseInt(beer.querySelector(".beer-price").textContent) * parseInt(beer.querySelector(".order-amount").textContent);
    })

    document.querySelector(`${source} .order-total h2 span`).textContent = totalPrice;
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
            addQuickTemplateFromTemplate(beer, "#beer-cart-wrapper", true);
        }
    } else {
        if (parseInt(beer.querySelector(".order-amount").textContent) == 0) {
            existingBeer.parentNode.removeChild(existingBeer);
        } else
            existingBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;
    }

}

//quickTemplate is the short version of the template
function addQuickTemplateFromTemplate(beer, destination, giveId){
    const newBeer = document.querySelector("#beer-template-quick").content.cloneNode(true);

    newBeer.querySelector("h2").textContent = beer.querySelector("h2").textContent;
    newBeer.querySelector(".beer-type").textContent = beer.querySelector(".beer-type").textContent;
    newBeer.querySelector(".beer-alc").textContent = beer.querySelector(".beer-alc").textContent;
    newBeer.querySelector(".beer-price").textContent = beer.querySelector(".beer-price").textContent;
    newBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;
    newBeer.querySelector(".beer-label").src = beer.querySelector(".beer-label").src;

    const orderBtns = newBeer.querySelectorAll(".order-btn-wrapper");
    orderBtns.forEach(btn => btn.addEventListener("click", addBeerQuantity))

    //give random id to match beer
    if(giveId){
    const randId = Math.floor(Math.random() * Math.floor(300));
    beer.id = randId;
    newBeer.querySelector(".beer-wrapper").id = randId;
    }

    document.querySelector(destination).appendChild(newBeer);
}

// post the orders to the Heroku server

function sendOrder(source) {
    let postingData = [];

    let cartContent = document.querySelectorAll(`${source} .beer-wrapper`);
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

        const user = netlifyIdentity.currentUser();
        if (user!=null){
            localStorage.setItem(user.email, JSON.stringify(postingData));
            addPreviousOrder();
        }

        //need timeout to get response
        setTimeout(() => {
            let response = db.getResponse();       
            
            if (response.status == 500){ 
                document.querySelector("#order-response-text").classList.remove("hidden");
                document.querySelector("#order-response-text").textContent = response.message;
            }else{
                toggleOrderScreen("Order was successfully added!", true);
                resetBeerOrders();
                updateCartTotal("#cart", "#beer-cart-wrapper");
                document.querySelector("#order-response-text").classList.add("hidden");
            }
        }, 100);
    }

};

function addPreviousOrder(){
    const user = netlifyIdentity.currentUser();
    console.log(localStorage.getItem(user.email));
    const previousOrder = JSON.parse(localStorage.getItem(user.email));

    document.querySelector("#last-order-wrapper").innerHTML = "";

    for (let orderedBeer of previousOrder) {
        document.querySelectorAll("#beers .beer-wrapper").forEach(beerRef => {
            if(beerRef.querySelector("h2").textContent == orderedBeer.name) {
                addQuickTemplateFromTemplate(beerRef, "#last-order-wrapper", false);
            }
        })

        document.querySelectorAll("#last-order-wrapper .beer-wrapper").forEach(addedBeer => {
            if(addedBeer.querySelector("h2").textContent == orderedBeer.name) {
                addedBeer.querySelector(".order-amount").textContent = orderedBeer.amount;
            }
        })

        console.log(orderedBeer.name, orderedBeer.amount);
    }

    updateCartTotal("#order", "#last-order-wrapper");
}

function resetBeerOrders() {
    document.querySelector("#beer-cart-wrapper").innerHTML = "";

    document.querySelectorAll(".order-amount").forEach(el => el.textContent = 0);
}

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
        template.querySelector(".beer-label").src = "/assets/labels/" + data.label;


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



// Bind to login/logout events and log the user name

// console.log(user);
// console.log(user);
// console.log(user.user_metadata.full_name);

