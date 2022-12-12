const user = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')


const auth = async (req,res,next)=>{
 //checking for the header
 const authHeader = req.headers.authorization
 if(!authHeader || !authHeader.startsWith('Bearer ')){
  throw new UnauthenticatedError('Authentication invaild')
 }
 const token = authHeader.split(' ')[1]
//  console.log(token)
 try {
   const payload = jwt.verify(token,process.env.JWT_SECRET)
   //attchin the user to the job routes by adding the jwt
   req.user = {userId:payload.userId, name:payload.name}
  next()
 } catch (error) {
   console.log(error);
   throw new UnauthenticatedError('Authentication invaildss')
 }
} 

module.exports = auth 
