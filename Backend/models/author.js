const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    userName: String,
    name: String,
    passwordHash: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

authorSchema.set('toJSON', {
    transform: (doc, returned)=>{
        returned.id=returned._id.toString()
        delete returned._id
        delete returned.__v
        delete returned.passwordHash
    }
})


module.exports = mongoose.model('Author', authorSchema)

