import React, {useState} from 'react';
import loginService from './services/login'
import './App.css';

function App() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMsg, setErrorMsg] = useState()
  const [post, setPost] = useState('')
  const [URL, setURL] = useState('')
  const [likes, setLikes] = useState('')

  const handleLogin = async (event) =>{
    //Impedir o comportamento default do form que é de recarregar a página
    event.preventDefault()
    try{
      //Chamar função de login e receber objeto com token, nome e nome de usuário
      const user = await loginService.login({
        userName, password
      })
      setUser(user)
      setUserName('')
      setPassword('')

    }catch(e){
      setErrorMsg(e.message)
      setTimeout(()=>{
        setErrorMsg(null)
      }, 3000)
    }
  }

  const handlePostChange = (event) => {
    setPost(event)
  }

  const handleURLChange = (event) => {
    setURL(event)
  }

  const handleLikesChange = (event) => {
    setLikes(event)
  }

  const addPost = () => {

  }

  const Notification = ({message})=>{
    if(message===null || message===undefined){
      return null
    }
    return(
      <div className='error'>
        {message}
      </div>
    )
  }

  const loginForm = () => {
    return(
      <form onSubmit={handleLogin}>
        <div className='div-form'>
          Username
          <input type="text" value={userName} onChange={({target})=>setUserName(target.value)}/>
        </div>
        <div className='div-form'>
          Password
          <input type="text" value={password} onChange={({target})=>setPassword(target.value)}/>
        </div>
        <button type="submit">Login</button>
      </form>
    )
  }

  const blogPost = () =>{
    return(
      <form onSubmit={addPost}>
        <div className='div-form'>
          Post Title
          <input type="text" onChange={({target})=>handlePostChange(target.value)}/>
        </div>
        <div className='div-form'>
          Post URL
          <input type="text" value={URL} onChange={({target})=>handleURLChange(target.value)}/>
        </div>
        <div className='div-form'>
          Likes
          <input type="number" value={likes} onChange={({target})=>handleLikesChange(target.value)}/>
        </div>
        <button type="submit">Save Post</button>
      </form>
    )
  }

  return (
    <div className="App">
      <h1>Bloglist</h1>
      <Notification message={errorMsg}/>
      {user!==null && blogPost()}
      {user===null && loginForm()}
    </div>
  );
}

export default App;
