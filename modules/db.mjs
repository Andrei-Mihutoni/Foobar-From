"use strict";


const postServerURL = "https://foobarserver.herokuapp.com/order"; //Heroku server url link for POSTing to queue
// const restDbAPIKey = "5fbf87774af3f9656800cf33" //RestDB API key 

const getURL = "https://foobarserver.herokuapp.com/beertypes";



let rootData = "";
let response = "";


// POST TO DB
export function post(data) {

    const postData = JSON.stringify(data);
    fetch(postServerURL, {
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "x-apikey": restDbAPIKey,
            // "cache-control": "no-cache"
        },
        body: postData
    })
        .then(res => res.json())
        .then(data => {console.log(data)
            response = data;
        });
}

export function get(callback) {
    fetch(getURL)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        });
};

export function prepareData(data) {
    showData(data);
    rootData = data;
};

function showData(data){
    console.log(data);
}

export function getData(){
    return rootData;
}

export function getResponse(){
    return response;
}