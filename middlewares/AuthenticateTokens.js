const jwt = require('jsonwebtoken')
module.exports =  AuthenticateTokens = (req,res,next) =>{
    const {token} = req.cookies;
    if(!token) return res.sendStatus(401);
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if (err) {
            // Token verification failed
            if (err.name === 'TokenExpiredError') {
              return res.status(403).json({ message: 'Token expired' });
            }
            if (err.name === 'JsonWebTokenError') {
              return res.status(403).json({ message: 'Invalid token' });
            }
            return res.sendStatus(403); // Forbidden for other errors
          };
          req.user = user;
          next();
    })

}
