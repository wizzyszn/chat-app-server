    const chatModel = require("../models/chatModel");
//create chat
    module.exports.createChat = async(req,res,next) =>{
        const {firstId,secondId} = req.body;
        try{
            const existingChat = await chatModel.findOne({members : {$all : [firstId,secondId], $size : 2}});
            if(existingChat) return res.status(200)
            const chat = await chatModel.create({
                members : [firstId,secondId]
            });
            return res.status(201).json(chat)
        }catch(err){
            res.status(500).json({message : err.message})
        }
    }

    //find a users chat
    module.exports.findUserChats = async (req,res,next)=>{
        const {userId} = req.params
        try{
            const userChats = await chatModel.find({members : {$in : [userId]}});
            if(userChats.length < 1) return res.status(400).json({message : 'chats not available with this user'});
            return res.status(200).json(userChats);
        }catch(err){
            console.log(err);
        res.status(500).json({message : err.message})
        }
    }

    //find a single chat
    module.exports.findChat = async (req,res,next) =>{
        try{    
        const {firstId , secondId} = req.params;
        const chat = await chatModel.findOne({
        members : {$all : [firstId,secondId]}
    })
    console.log("chat:", chat)
    
    return res.status(200).json(chat);
        }catch(err){
            console.log(err)
            res.status(500).json({
                message : err
            })
        }
    }

  