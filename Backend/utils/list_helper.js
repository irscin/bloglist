const dummy = (blogs) => {
    return 1
  }

const totalLikes=(blogs)=>{
    var sum=0
    blogs.forEach(element => {
        sum+=element.likes
    });
    return sum
}

const favoriteBlog =(blogs)=>{
    var mostLiked={
        title: '',
        author: '',
        likes: 0
    }
    blogs.forEach(e=>{
        if(e.likes>mostLiked.likes){
            mostLiked.title=e.title
            mostLiked.author=e.author
            mostLiked.likes=e.likes
        }
    })
    return mostLiked
}
const _ = require('lodash');
const mostBlogs = (blogs)=>{
    
    if (blogs.length === 0) return null;
  //map pega o campo autor de cada blog
  //countBy diz para contar as ocorrências
  //toPairs pega essas propriedades (nome, n de ocorrências) e agrupa em duplas
  //maxBy(last) diz para pegar o máximo valor pela segunda propriedade (n de ocorrências)
  //value, por fim, retorna esse esse valor
  const authorBlogsArray = _.chain(_.map(blogs, "author")).countBy().toPairs().maxBy(_.last).value();
  return {
      name: authorBlogsArray[0],
      blogs: authorBlogsArray[1]
  }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;
  
    const reducer = (acc, blog) => {
      return !acc[blog.author]
        ? { ...acc, [blog.author]: blog.likes }
        : { ...acc, [blog.author]: acc[blog.author] + blog.likes };
    };
  
    const likesTally = _.reduce(blogs, reducer, {});
  
    return {
        author: Object.keys(likesTally).reduce((a, b) => likesTally[a] > likesTally[b] ? a : b),
        likes: Math.max(...Object.values(likesTally))
    }
};
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }