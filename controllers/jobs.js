const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')



const getAllJobs = async(req,res)=>{
const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt') 
res.status(StatusCodes.OK).json({jobs,count:jobs.length})
} 
const getJob = async(req,res)=>{
  //destructing the user id and the params id 
  const {user:{userId}, params:{id:jobId}} = req

  const job = await Job.findOne({_id:jobId,createdBy:userId})
  if(!job){
    throw new NotFoundError(`no job found in the id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const createJob = async(req,res)=>{
//passin the req.body.createdby to get the userid
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}
const updateJob = async(req,res)=>{
  const {body:{company,position},
  user:{userId}, params:{id:jobId}} = req

  if(company==='' || position===''){
    throw new BadRequestError('company and position can not be empty')
  }
  const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId},req.body,{new:true,
    runValidators:true})
    if(!job){
      throw new NotFoundError(`no job found in the id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async(req,res)=>{
  const {user:{userId}, params:{id:jobId}} = req
  const job = await  Job.findByIdAndRemove({_id:jobId,createdBy:userId})
  if(!job){
    throw new NotFoundError(`no job found in the id ${jobId}`)
  }
  res.status(StatusCodes.OK).send('Removed job')
}
module.exports = {
  getAllJobs, 
  getJob,
  createJob,
  updateJob,
  deleteJob,
}

