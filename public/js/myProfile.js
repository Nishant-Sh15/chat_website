console.log("hello");
let more=document.querySelector(".icon");
console.log("hello");
let options=document.querySelector(".options");
more.addEventListener("click",()=>{
    console.log("inside");
    if(options.style.visibility=="hidden"||options.style.visibility==""){
        options.style.visibility="visible";            
    }else{
        options.style.visibility="hidden";      
    }
});
// more.addEventListener("click", () => {
//     if (options.style.display === "none") {
//         options.style.display = "block";
//     } else {
//         options.style.display = "none";
//     }
// });

console.log(options);
console.log(more);