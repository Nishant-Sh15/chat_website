// --------------------------------------error message-----------------------------------------
if(error.length>0){
    let btn=document.querySelector(".cross");
btn.addEventListener("click",(event)=>{
    btn.parentElement.remove();
});
}





// ---------------------------------------event listner to search through new icon-------------------------
let searchInput=document.querySelector("#contacts-heading-input");
let search=document.querySelector(".new-chat");
searchInput.addEventListener("input",(event)=>{
    search.href=`/profile/${usrId}/${searchInput.value}`;
});
// --------------------------------------------------------------------------




// -----------------------------------------show delete contact icon----------
let contacts=document.querySelectorAll(".contact");

function showevent(p) {
    p.addEventListener("mouseenter", () => {
        let icon = p.children[2];
        icon.style.visibility = "visible";
    })
}

function hideevent(p) {
    p.addEventListener("mouseleave", () => {
        let icon = p.children[2];
        icon.style.visibility = "hidden";
    })
}
function deleteContact(p){
    p.children[2].addEventListener("click",async (event)=>{
        event.stopPropagation();
        axios.delete("/Contact",{data:{usrId:usrId,conId:p.parentElement.id}})
             .then((response)=>{
                p.parentElement.remove();
                if(p.parentElement.id==conId){
                    document.querySelector(".keyboard").remove();
                    document.querySelector("/messages").remove();
                    console.log("deleted");
                }
             });
    })
}


for(contact of contacts){
    showevent(contact);
    hideevent(contact);
    deleteContact(contact);
}