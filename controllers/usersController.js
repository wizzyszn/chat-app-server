const usersModel = require('../models/usersModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const   Nodemailer =   require("nodemailer");
//const  crypto = require('crypto')
//register user
module.exports.registerUsers = async (req, res) => {
  const { email, password, username, firstName, lastName,} = req.body
  try {
    const userExists = await usersModel.findOne({ email })
    if (userExists)
      return res.status(400).json({ message: 'User already exists' })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await usersModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      username
    })
    const cleanCopy = user.toObject();
    delete cleanCopy.password;
    return res.status(201).json({
      ...cleanCopy,
    status : true
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.message
    })
  }
}
//login user
module.exports.loginUsers = async (req, res) => {
  const { email, password } = req.body
  console.log(password)
  try {
    const user = await usersModel.findOne({ email })
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' })
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log(isPasswordValid)
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid email or password' })
    //create token
    const token = jwt.sign(
      {
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '50s'
      }
    );
    res.cookie('token',token,{
        httpOnly : true,
        sameSite : 'None',
    })
    const decode = jwt.decode(token);
    const {exp} = decode;
    const cleanCopy = user.toObject();
    delete cleanCopy.password;
    return res.status(200).json({
        ...cleanCopy,
        expiry : exp * 1000,
        status : true
    });

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.message
    })
  }
}
//logout user
module.exports.logoutUsers = async(req,res) =>{
  res.clearCookie('token');
  res.status(200).json({message : 'Logged out successfully'})
}
//set profile picture
module.exports.setAvi = async (req,res) =>{
  try{
    const {_id, imageUrl} = req.body;
    console.log("imageUrl : ", imageUrl)  
    console.log("_id : ", _id)
    const user = await usersModel.findById(_id);
    user.avatar = imageUrl;
    user.isAvatarImageSet = true;
    await user.save();
    return res.status(200).json({
      message : "Congratulations you've successfuly setup your profile picture"
    })
   }catch(err){
    console.log(err);
    return res.status(500).json({message : 'something went wrong'})
  }
}

//reset password
module.exports.resetPassword = async(req,res) =>{
  const {email} = req.body
    try{
      if(!email) return res.status(400).json({message : 'Please provide an email '})
        const user  = await usersModel.findOne({email});
        if(!user) return res.status(400).json({message : 'This Email is not registered with us'})
        //generate reset token
        const resetToken = jwt.sign({
          email : email,
          userId : user._id
        }, process.env.JWT_SECRET_KEY,
        {
          expiresIn : '1h'
        }
      ) 
        //create a mail transport
        const transport = Nodemailer.createTransport({
            service : "Yahoo",
            secure: false,
            auth : {
                user : process.env.EMAIL,
                pass : process.env.EMAIL_PASSWORD
            }
        });
       await transport.sendMail({
        from :  process.env.EMAIL,
        to : email,
        subject : "Password reset",
        text: `You are receiving this because you have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        https://chat-app-client-gamma-two.vercel.app/confirm-reset/${resetToken}
        If you did not intiate this request, please ignore this email and your password will remain unchanged.`
       })
       return res.status(200).json({message : "Password reset link has been sent to the Email"})
    }catch(err){
        res.status(500).json({message : err.message})
        throw new Error(err.message);
        
    }

}
//confirm reset
module.exports.confirmReset = async (req,res) =>{
const {token ,newPassword} = req.body;
try{
  const verified = jwt.verify(token,process.env.JWT_SECRET_KEY);
  const user  = await usersModel.findOne({email : verified.email , _id :verified.userId });
  if(!user){
    return res.status(401).json({message : 'Invalid or expired token'})
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({message : 'password reset successful'})

}catch(err){
  console.log(err);
  return res.status(500).json({message: err.message})
}


}

//fetch a specific user

module.exports.findUser  = async (req,res,next) =>{
  const userId = req.params.userId;
  try{
      const user = await usersModel.findById({_id : userId});
      if(user){
          return res.status(200).json(user)
      }
  }catch(err){
      console.log(err);
      res.status(500).json({
          message : err.message
      })
  }   

}
//get all users

module.exports.getAllUsers  = async (req,res) =>{
  const {userId}  = req.params;
  try{
      const user = await usersModel.find({_id : {$ne : userId}});
      if(user){
          return res.status(200).json(user)
      }
  }catch(err){
      console.log(err);
      res.status(500).json({
          message : err.message
      })
  }   

}
