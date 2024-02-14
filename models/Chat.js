import mongoose from "mongoose";
const moment = require('moment-timezone');

const ChatSchema = new mongoose.Schema({
    members: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        default: []
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    messages: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
        default: []
    },
    nameGroupChat: {
        type: String,
        default: ''
    },
    groupPhoto: {
        type: String,
        default: ''
    },
    createAt: {
        type: Date,
        default: () => moment().toDate()
    },
    lastMessageAt: {
        type: Date,
        default: () => moment().toDate()
    }
})

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema)

export default Chat