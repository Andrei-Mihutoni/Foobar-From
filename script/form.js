let activeSection = "beers";

document.querySelectorAll("li").forEach(btn => btn.addEventListener("click", changeSection));
document.querySelectorAll(".beer-text-wrapper .primary-btn").forEach(btn => btn.addEventListener("click", learnMore));


function changeSection(e){

    activeSection = e.target.id.split("-")[0];


    document.querySelectorAll("main > section").forEach(section=> {
        console.warn(section.id, "active: " + activeSection)
        if(section.id==activeSection){
            console.log("add")
            section.classList.remove("hidden");
        } else {
            console.warn("hide");
            section.classList.add("hidden");
        }
    })

    document.querySelectorAll("li").forEach(btn => btn.classList.remove("active"));

    e.target.classList.add("active");

    console.log(e.target.id.split("-")[0]);
}

function learnMore(e){
    console.log("learnmore");
    e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}