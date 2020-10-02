const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  url: String,
  likes: Number
})

postSchema.set('toJSON', {
  transform: (doc, returned)=>{
    returned.id=doc._id.toString()
    delete returned._id
    delete returned.__v
  }
})

module.exports = mongoose.model('Post', postSchema)