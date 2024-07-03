const messageModel = require("../models/messageModel");

//createMessage
module.exports.createMessage = async (req,res) =>{
    const {senderId,text,chatId} = req.body;
    try{
    const message = await messageModel.create({
        senderId,
        text,
        chatId
    });
    return res.status(200).json(message)
    }catch(err){
        console.log(err);
        res.status(500).json({message : err.message})
    }
}

//getMessages
module.exports.getMessages = async (req,res) =>{
    const {chatId} = req.params;
    console.log(chatId) 
    try{
        const messages = await messageModel.find({
            chatId
        });
        res.status(200).json(messages)
    }catch(err){
        console.log(err);
        res.status(500).json({message : err.message})
    }

}
  //clear all messages with a user 
  module.exports.clearChat = async(req,res) =>{
    const {chatId} = req.params
    try{
        const chat = await messageModel.findByIdAndDelete(chatId);
        if(!chat) return console.log("error");

    }catch(err){

    }
}

//delete a specific message. This message would be deleted for everyone
module.exports.deleteMessage = async (req,res) =>{
    const {messageId} = req.body;
    try{
        const response = await messageModel.findByIdAndDelete(messageId);
        if(!response) return res.status(400).json({message :"unable to delete message try a again later"})
            res.status(200).json({message : "message deleted"})
    }catch(err){
        res.status(500).json({message : err.message})
    }
};

//delete multiple messages

module.exports.deleteMultipleMessages = async(req,res) =>{
    const {messages} = req.body
    try{
        const response = await messageModel.deleteMany({_id : {$in : [...messages]}});
        if(!response) throw new Error("Something went wrong")
        res.status(200).json({message : "Messages deleted successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}