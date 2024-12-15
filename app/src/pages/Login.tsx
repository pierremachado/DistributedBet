import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [secretKey, setSecretKey] = useState("")
  const navigate = useNavigate()
  function sendData() {
    navigate("/app")
  }

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSecretKey(event.target.value);
    console.log(event.target.value)
  };


  return (
    <>
      <h1>Insira sua chave secreta</h1>
      <input value={secretKey} onChange={changeValue} type="text" />
      <button onClick={sendData} type="submit">Entrar</button>
    </>
  )
}

export default Login