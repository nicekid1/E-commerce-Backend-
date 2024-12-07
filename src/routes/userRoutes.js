const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async(req, res)=>{
  const{email, password}=req.body
  try {
    const user = await User.findOne({email})
    if(!user)
      return res.status(404).json({message: 'Email or password is invalid'})
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
      return res.status(400).json({message: 'Email or password is invalid'})
    const token = jwt.sign({userId:user._id, role:user.role},process.env.SECRET_KEY,{expiresIn:"1h"})
    res.status(200).json({token})
  } catch (err) {
    res.status(500).json({message:'Server error'})
  }
})

module.exports = router;
