import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { BetContract } from "../../../typechain-types/BetContract"; // Importando o tipo do contrato gerado pelo TypeChain
import { BetContract__factory } from "../../../typechain-types/factories/index"

const contractAddress = "0x4515Ef6D6F149b262C5C47842DE7c96cf83f714e";

const Login = () => {
  const [secretKey, setSecretKey] = useState("")
  const [contract, setContract] = useState<BetContract | null>(null); // Tipando a variável contract com BetContract
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null); // Corrigido para Ethers.js v6
  const navigate = useNavigate()
  
  const [_signer, setSigner] = useState<ethers.Wallet | null>(null);

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    setProvider(provider);
    const contract = new ethers.Contract(contractAddress, BetContract__factory.abi, provider) as unknown as BetContract;
    setContract(contract);
  }, []);

  const register = async () => {
    if (contract) {
      try {
        const signer = new ethers.Wallet(secretKey, provider);
        setSigner(signer);    

        const signed = contract.connect(signer)

        setContract(contract.connect(signer));

        const tx = await signed.register();
        console.log("Transação enviada:", tx);
        await tx.wait();
        console.log("Usuário registrado com sucesso!");
        navigate("/app")
      } catch (error) {
        console.error("Erro ao chamar o contrato:", error);
      }
    }
  }

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
