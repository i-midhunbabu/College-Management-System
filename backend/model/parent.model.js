const mongoose = require ('mongoose');

const parentloginSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    usertype:{
        type: Number,
        default: 4
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Date
    },
    parentdetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentAddParent'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const chatSchema = mongoose.Schema({
    requestId: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const parentlogmodel = mongoose.model('Parentlogin', parentloginSchema);
const Chat = mongoose.model('Chat', chatSchema);
module.exports= {parentlogmodel, Chat};