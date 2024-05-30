const User = require('../models/userModel');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const handleErrorsSignUp = (err) =>{
    console.log(err.message, err.code);
    let errors = {email: '',password:''};

    //duplicate error code
    if(err.code === 11000){
        errors.email = 'that email is already registered';
        return errors;
    }
}

const handleErrorsLogIn = (err) =>{
    console.log(err.message, err.code);
    let errors = {email: '',password:''};

    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'that email is not registered'
    }

    //incorrect password 
    if(err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }
    return errors;
}

//Create a token and add a time limit for the token
const hourInMls = 3600000;
const createToken = (id) =>{
    return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: hourInMls / 4
    });
}

module.exports.signup_post = async(req, res) =>{
    const {email, password} = req.body;

    try {
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('JWT', token, {httpOnly: true, maxAge:hourInMls * 12})
        res.status(201).json({user: user._id});
    }catch (err){
        const errors = handleErrorsSignUp(err);
        res.status(400).send({errors})
    }
}

module.exports.login_post = async(req, res) =>{
    const {email, password} = req.body;

    try {
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('JWT', token, {httpOnly: true, maxAge:hourInMls * 12})
        res.status(200).json({user: user._id});
    }catch (err){
        const errors = handleErrorsLogIn(err);
        res.status(400).json({errors})
    }
}

module.exports.user_get = async (req, res) => {
    try {

      const token = req.cookies.JWT;
      if (!token) {
        throw new Error("Token not found");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decodedToken.id;
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error("User not found");
      }

      res.status(200).json({user});
    } catch (err) {
      console.error('Error in user_get:', err);
      res.status(401).json({ error: "Unauthorized" });
    }
  }

module.exports.logout_get = (req, res) =>{
    res.cookie('JWT','',{maxAge: 1});
    res.status(200).json({ message: "User logges out" });
}
