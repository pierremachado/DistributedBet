import { JsonRpcProvider } from "ethers";
import { ethers } from "ethers";
import { BetContract__factory } from "../../../typechain-types/factories";
import { BetContract } from "../../../typechain-types/BetContract";


const contractAddress = "0xeb6b8172cABE847639A8689D69a824d690EE148F"

export class ContractService {
    private provider!: JsonRpcProvider;
    private contract;
    private static instance: ContractService;

    private constructor (){
        this.provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        this.contract = new ethers.Contract(contractAddress, BetContract__factory.abi, this.provider) as unknown as BetContract;
    }

    public getProvider() {
        return this.provider;
    }

    public getContract() {
        return this.contract;
    }

    public setContract(contract: BetContract) {
        console.log("contract updated")
        this.contract = contract;
        
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new ContractService()
        }
        return this.instance;
    }

}

