import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { ContractService } from "../services/ContractService";

const Login = () => {
  const [secretKey, setSecretKey] = useState("")
  const navigate = useNavigate()
  const [_signer, setSigner] = useState<ethers.Wallet | null>(null);

  const register = async () => {
    try {
      const instance = ContractService.getInstance();
      if (instance.getContract()) {
        const signer = new ethers.Wallet(secretKey, instance.getProvider());
        setSigner(signer);

        const signed = instance.getContract().connect(signer);
        console.log(signed)
        instance.setContract(signed);

        const tx = await signed.register();
        await tx.wait(); // Aguarda a confirmação da transação

        const tx2 = await signed.getBalance();
        console.log(tx2)

        console.log("Usuário registrado com sucesso");
        navigate("/home");
      }
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION") {
        navigate("/home");
        console.error("Erro ao registrar usuário:", error.reason || error.message);
      } else {
        console.error("Erro desconhecido:", error);
      }
    }
    navigate("/home");

  };

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSecretKey(event.target.value);
  };


  return (
    <>
      <h1>Insira sua chave secreta</h1>
      <input value={secretKey} onChange={changeValue} type="text" />
      <button onClick={register} type="submit">Entrar</button>
    </>
  )
}

export default Login
