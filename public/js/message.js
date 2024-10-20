
if (conv!=null) {
    // -----------------------------hover krn p message ko delete krn k options---------
    let mymssgs = document.getElementsByClassName("me");
    let othermssgs = document.getElementsByClassName("other");

    function showevent(p) {
        p.addEventListener("mouseenter", () => {
            let icon = p.children[1];
            icon.style.visibility = "visible";
        })
    }
    function hideevent(p) {
        p.addEventListener("mouseleave", () => {
            let icon = p.children[1];
            icon.style.visibility = "hidden";
            p.children[2].style.visibility = "hidden";
        })
    }
    function showoptions(p) {
        p.addEventListener("click", () => {
            if (p.children[2].style.visibility == "visible") {
                p.children[2].style.visibility = "hidden";
            } else {
                p.children[2].style.visibility = "visible";
            }
        })
    }
    function delreq(element) {
        let del = element.children[2].children[0];
        del.addEventListener("click", () => {
            // console.log(element.children[1].id);
            axios.delete(`/${usrId}/${conId}`, { data: { msgId: `${element.children[1].id}` } })
                .then((response) => {
                    // console.log(response.data);
                    element.remove();
                });
        })
    }
    function unsendreq(element) {
        let unsend = element.children[2].children[1];
        unsend.addEventListener("click", () => {
            axios.delete(`/unsend/${usrId}/${conId}`, { data: { msgId: `${element.children[1].id}` } })
                .then((response) => {
                    element.remove();
                    // console.log(response.data);
                });
        })
    }
    for (element of mymssgs) {
        showevent(element);
        hideevent(element);
        showoptions(element);
        delreq(element);
        unsendreq(element);
    }
    for (element of othermssgs) {
        showevent(element);
        hideevent(element);
        showoptions(element);
        delreq(element);
    }

    // =====================================================================


    let send = document.querySelector(".send");
    let input = document.querySelector(".type");
    let msgbox = document.querySelector(".messages");
    let index=-1;
    let c=null;



    // -------------------------send message--------------------------------
    send.addEventListener("click", async () => {
        let text = input.value;
        let writer = usrId;

        let newd = document.createElement('div');
        newd.classList.add("me");
        msgbox.insertAdjacentElement('afterbegin', newd);
        newd.innerHTML = `<div>${text}</div>
                                    <i class="fa-solid fa-caret-down me-i" ></i>
                                    <div class="me-msg-options">
                                        <div>delete</div>   
                                        <div>unsend</div>
                                    </div>`;

        showevent(newd);
        hideevent(newd);
        showoptions(newd);
        delreq(newd);
        unsendreq(newd);
        axios.post(`/show/${usrId}/${conId}`, { author: writer, message: text })
            .then((response) => {
                newd.children[1].id = response.data.result;
                socket.emit("sendMessage",{usrId,conId,message:text,msgId:response.data.result});
            });
        input.value = '';

        let contactDesc = document.getElementById(`${conId}`);
        if(c!=contactDesc){
            contactDesc.style.order=index;
            index--;
            c=contactDesc;
        }
        // console.log(contactDesc);
        contactDesc.children[0].children[1].children[1].innerText = text;


    });
    // =======================================================================
}





