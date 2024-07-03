const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routes/usersRoutes')
const chatRoute = require('./routes/chatRoutes')
const messageRoute = require('./routes/messageRoute')
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const AuthenticateTokens = require('./middlewares/AuthenticateTokens');     
//middlewares
app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use('/api/users', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/messages',messageRoute);
app.get('/protected', AuthenticateTokens, async(req,res) =>{
    const {user} = req
    return res.status(200).send("you are authorized")
})
app.use(morgan('dev')); // Use morgan to log requests to the console
//connect to db
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser  : true,
    useUnifiedTopology : true
   }).then(() =>{
    app.listen(process.env.SERVER_PORT ||5000, () =>{
        console.log("listening on port 5000")
    })
}).catch((err) =>{
    console.log(err)
})
