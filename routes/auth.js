const express = require ('express');
const router =express.Router();
const User=require('../models/User')

const bcrypt = require('bcryptjs');



const { body, validationResult } = require('express-validator');

var jwt = require('jsonwebtoken');

const JWT_Secret= 'Harryisgoodb$oy';

var fetchuser=require('../middlewre/fetchuser');


// Routee 1 :Create a User using : POST "/api/auth/createuser" Login not required 
router.post('/createuser',[
  body('email','Enter a valid email').isEmail(),
  body('name','Enter a valid name').isLength({ min: 3 }),
  body('password','Enter a valid password').isLength({ min: 5 }),
], async(req,res)=>{   
   let success=false;
  //if there are errors, return bad request and the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

//try an catch method
try {
  
// check whether the user with this email exists already
      let user=await User.findOne({email:req.body.email});
      if (user){
        return res.status(400).json({success,error:"Sorry a user with this email already exists"})
      }

//Hashing passwords using bcryptjs in Nodejs
const salt = await bcrypt.genSaltSync(10);
const secpass=await bcrypt.hashSync(req.body.password, salt) 

//create a new user
    user=await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secpass //password hash me ganret hoga
  })

  // .then(user => res.json(user))
  
  // .catch(err=>{console.log(err)
  // res.json({error:'Please enter a unique value for email',message:err.message})})



//Jwt tokan for user verificetion
  const data ={
    user:{
      id:user.id
    }
  }
  const authtoken = jwt.sign(data, JWT_Secret);
  // console.log(jwtData)

  // res.json(user)
  success=true;
  res.json({success,authtoken})  // route 1 se hame pure data ka eg. name, email, password + jwt_ secret ka tokan milega like in incripted ke rup me

  //try an catch method
} catch (error) {
  console.error(error.message)
  res.status(500).send("Internal server error");
}

})


//Route 2: Creating Login Endpoint & sending Auth token

// Route 2: Authenticate a User using : POST "/api/auth/login" Login not required 

router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists(),
], async(req,res)=>{   

  let success=false;
   //if there are errors, return bad request and the errors 
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({success, errors: errors.array() });
   }



   const {email , password}= req.body;
   try {
    let user = await User.findOne({email});
    if(!user){
      success= false
      return res.status(400).json({success, error:"Please try to login with carrect credentials"})
    }
    const passwordcompare= await bcrypt.compare(password,user.password);
    if(!passwordcompare){
      success= false
      return res.status(400).json({success, error:"Please try to login with carrect credentials"})
    }

    //else
    const data ={
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_Secret); //isse se hame pure data ka eg. name, email, password + jwt_ secret ka tokan milega like in incripted ke rup me
    let success=true;
    res.json({success,authtoken})
   } catch (error) {
      console.error(error.message)
      res.status(500).send("Internal server error");
   }

})

    //Creating a middleware to decode user from a JWT
   // Route 3: get loggedin User Details using : POST "/api/auth/getuser". Login required 
   router.post('/getuser',fetchuser, async(req,res)=>{   
   try {
    userId=req.user.id; //ye id hame token me se fetchuser nikal ke denga
    const user = await User.findById(userId).select("-password")
    res.send(user)
   } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
   }

  })

module.exports=router