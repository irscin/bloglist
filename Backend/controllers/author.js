const bcrypt = require('bcrypt')
const authorRouter = require('express').Router()
const Author = require('../models/author')

authorRouter.post('/', async (req, res)=>{
    let alreadyRegistered = false
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    const authorsAlreadyRegisted = await Author.find({})
    authorsAlreadyRegisted.forEach(e => {
        if(e.userName==req.body.userName){
            alreadyRegistered=true
        }
    });
    if(alreadyRegistered){
        return res.status(400).json('`username` to be unique')
    }else{
        const author = new Author({
            name: req.body.name,
            userName: req.body.userName,
            passwordHash
        })
    
        const savedAuthor = await author.save()
    
        res.json(savedAuthor)
    }
})

authorRouter.get('/', async (req, res)=>{
    const allAuthors = await Author.find({}).populate('posts', {title: 1, likes: 1})
    return res.json(allAuthors)
})

module.exports = authorRouter