const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    
    company:{
        type:String,
        required:[true, 'please provide a company name'],
        maxlenght:50
    },
    position:{
        type:String,
        required:[true, 'please provide a position'],
        maxlenght:50
    },
    status:{
        type:String,
        enm:['interview', 'pending', 'declined'],
        default:'pending'
    },

    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'place provide a User'],
    },
},{ timestamps:true })


module.exports = mongoose.model('Jobs',jobSchema)