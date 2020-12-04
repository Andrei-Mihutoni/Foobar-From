"use strict";


const postServerURL = "https://foobarserver.herokuapp.com/order"; //Heroku server url link for POSTing to queue
// const restDbAPIKey = "5fbf87774af3f9656800cf33" //RestDB API key 




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
        .then(data => console.log(data));
}
