console.log("hello");
let more=document.querySelector(".icon");
console.log("hello");
let options=document.querySelector(".options");
more.addEventListener("click",()=>{
    console.log("inside");
    if(options.style.visibility=="hidden"){
        options.style.visibility="visible";            
    }else{
        options.style.visibility="hidden";      
    }
});
console.log("3");