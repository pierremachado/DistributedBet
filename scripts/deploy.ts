import { ethers } from "hardhat";

async function main() {
  // Pegando a conta que será usada para deploy
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  // Compilando o contrato
  const Contract = await ethers.getContractFactory("BetContract");

  // Fazendo o deploy do contrato
  const contract = await Contract.deploy();

  // Aguardando a confirmação do deploy
  await contract.deploymentTransaction;

  // Mostrando o endereço do contrato implantado
  console.log("Contrato inteligente implantado no endereço:", await contract.getAddress());
}

// Executando o script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
