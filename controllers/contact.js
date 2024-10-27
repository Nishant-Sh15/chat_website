// importing mongoose models
const User = require("../models/users");
const Contact = require("../models/contacts");
const Chat = require("../models/chat");
const Message = require("../models/messages");

// ------------create new chat----------

module.exports.create = async (req, res, next) => {
    let { usrId, conId } = req.params;
    if (usrId == conId) {
        res.redirect(`/home/${usrId}`);
    } else {
        let user = await User.findById(usrId);
        let con = await User.findById(conId);
        let usrCont = await Contact.findById(user.contacts);
        let conCont = await Contact.findById(con.contacts);
        let exist = false;
        for (contact of usrCont.arr) {
            if (contact.person == conId) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            let chat = new Chat({ contributors: [usrId, conId], mssgs: [] });
            chat.save();
            usrCont.arr.splice(0, 0, { person: conId, conversation: chat });
            await usrCont.save();
        }
        exist = false;
        for (contact of conCont.arr) {
            if (contact.person == usrId) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            let chat = new Chat({ contributors: [usrId, conId], mssgs: [] });
            chat.save();
            conCont.arr.splice(0, 0, { person: usrId, conversation: chat });
            await conCont.save();
        }
        res.redirect(`/show/${usrId}/${conId}`);
    }
}
// --------------------------------------


// ---------------delete chat-------------
module.exports.delete = async (req, res, next) => {
    let { usrId, conId } = req.body;
    let user = await User.findById(usrId);
    let userCont = await Contact.findById(user.contacts);
    let index = 0;
    // console.log(req.body);
    // console.log(userCont.arr);
    for (contact of userCont.arr) {
        if (contact.person == conId) {
            break;
        }
        index++;
    }
    // console.log(user.contacts.arr[index]);
    let chat = await Chat.findById(userCont.arr[index].conversation);
    if (index < userCont.arr.length) {
        userCont.arr.splice(index, 1);
    }
    // console.log(userCont.arr);
    userCont.save();


    let con = await User.findById(conId);
    let conCont = await Contact.findById(con.contacts);

    index = 0;
    for (contact of conCont.arr) {
        if (contact.person == usrId) {
            break;
        }
        index++;
    }
    if (index >= conCont.arr.length) {
        for (mssg of chat.mssgs) {
            await Message.findOneAndDelete({ _id: mssg });
        }
    }
    conCont.save();
    await Chat.findOneAndDelete({ _id: chat._id });
    await user.save();
    res.redirect(`/home/${usrId}`);
    // res.json({ data: "deleted" });
}