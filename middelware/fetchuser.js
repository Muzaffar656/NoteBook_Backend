const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

const fetchuser = (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
     res.status(401).json({error :"please enter a valid token"})
    }
    try {
        
    const data = jwt.verify(token,SECRET_KEY) 
    console.log(data)
    req.user = data.user;
 
    next()
    }catch (error) {
     res.status(401).json({error : "please enter a valid token"}) }
}

module.exports = fetchuser