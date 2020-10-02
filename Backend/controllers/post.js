const postRouter = require('express').Router()
const Post = require('../models/posts')
const Author = require('../models/author')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}

postRouter.get('/', (request, response) => {
  Post
    .find({}).populate('author', {userName: 1, name: 1})
    .then(posts => {
      response.status(200).json(posts)
    })
})
  
postRouter.post('/', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken=null
  try{
    decodedToken = jwt.verify(token, process.env.SECRET)
  }catch(e){
    response.status(400).json({error: e})
  }

  if(!token || !decodedToken.id){
    response.status(401).json({error: 'token missing or invalid'})
  }
  if(!request.body.likes){
    request.body.likes=0
  }
  if(!request.body.title || !request.body.url){
    return response.status(400).end()
  }
  const author = await Author.findById(decodedToken.id)
  const post = new Post(request.body)
  post.author=author._id
  const savedPost = await post.save()
  author.posts=author.posts.concat(savedPost._id)
  await author.save()
  response.json(savedPost)
})

postRouter.get('/:id', async(req, res)=>{
  const post = await Post.findById(req.params.id)
  if(post){
    res.json(post)
  }else{
    res.stauts(400).end()
  }
})

postRouter.delete('/:id', async (req, res)=>{
  const result = await Post.deleteOne({_id: req.params.id})
  if(result){
    res.status(204).json(result)
  }else{
    res.status(400).end()
  }
})

postRouter.put('/:id', async (req, res)=>{
  await Post.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(result=>res.status(200).json(result))
})

module.exports = postRouter