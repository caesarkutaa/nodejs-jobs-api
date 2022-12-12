const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError,UnauthenticatedError } = require('../errors')


const register = async(req,res)=>{
  const user =  await User.create({...req.body})
  //creating a token and gettinng the user name (code found in models.user)
   const token = user.createjwt()
   res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

const login = async(req,res)=>{
  const {email,password} = req.body
  if(!email || !password){
    throw new BadRequestError('place provide email and password')
  }
  const user = await User.findOne({ email  })
  //checking if there is a user
  if(!user){
    throw new UnauthenticatedError('Invalid user')
  }
  //compare password using bycrypt in the models    
  const ispasswordcorrect = await user.comparepassword(password)
  if(!ispasswordcorrect){
    throw new UnauthenticatedError('Invalid password')
  }
  //creating a token and geting the user name (code found in models.user)
  const token = user.createjwt()
  res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {
  register,
  login
}