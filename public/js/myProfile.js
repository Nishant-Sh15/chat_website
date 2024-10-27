
let more=document.querySelector(".icon");
let options=document.querySelector(".options");
more.addEventListener("click",()=>{
    if(options.style.visibility=="hidden"||options.style.visibility==""){
        options.style.visibility="visible";            
    }else{
        options.style.visibility="hidden";      
    }
});