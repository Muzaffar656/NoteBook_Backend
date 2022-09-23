const express = require('express')
const router = express.Router()
const User = require('../models/User')
const fetchuser = require('../middelware/fetchuser')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY



router.post('/createuser',
[body('name','invalid name ').isLength({min : 5}),
body('password','invalid password').isLength({min : 5}),
body('email','invalid email').isEmail()],
async(req,res)=>{
    let success = false;
    // if there are they return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // check the user is exist and store the data in database
    try{
    let user = await User.findOne({email : req.body.email})
    if (user){
    return res.status(400).json({success, error : "Sorry a user already exists in this email"})
    }


    const salt =await bcrypt.genSalt(10);
    const SecPass = await bcrypt.hash(req.body.password,salt)

    user = await User.create({
        name: req.body.name,
        password: SecPass,
        email: req.body.email,
      })
    
    const data = {
        user : {
            id : user.id
        }
    }
    // console.log(data)
    // console.log(data+"auth data")

  const  authtoken = jwt.sign(data,SECRET_KEY)
//   console.log(authtoken+'auth token')
    let success = true
    //   .then(user => res.json(user)). catch(err => console.log(err))
    res.json({ success,authtoken})
    }catch(error) {
        console.error(error.message)
        res.status(500).send('some error occured')
    }

})


router.post('/login',[body('email','Email is already exists').exists(),
body('password','Password Cannot be blank').isLength({min : 5})],async(req,res)=>{
    let success = false;
    const errors = validationResult(req);
    if(!errors){
      return  res.status(400).json({errors : errors.array()})
    }

    const {email,password} = req.body;

    try {
        let user = await User.findOne({email})
        if(!user){
            success = false;
           return res.status(400).json({success,error:"Email is already Exists"})
        }

        const passwordCompare = await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            success = false;
           return res.status(400).json({success,error:"Password is not correct"})
        }

        const data = {
            user : {
                id : user.id
            }
        }
        // console.log(data)
    
      const  authtoken = jwt.sign(data,SECRET_KEY)
      success = true
      res.json({success,authtoken})
    } catch (error) {
        console.error(error)
        res.status(500).send('Some login and password error')
    }

})




router.post('/getuser',fetchuser,async(req,res)=>{
try {
    userId = req.user.id;
    const user = await User.findById(userId)
    res.send(user)
    // console.log(userId)
} catch (error) {
    console.error(error)
    res.status(500).send('Some login and password error')
}
})

module.exports = router 