import {BigNumber, Signer, ethers} from 'ethers';
import Escrow from '../contracts/Escrow.sol/Escrow.json';

export async function deploy(signer: Signer, arbiterAddress: string, beneficiaryAddress: string, product: string, amountOfEther: BigNumber){
    const EscrowFactory = new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer);
    return EscrowFactory.deploy(arbiterAddress, beneficiaryAddress, product, {value: amountOfEther});
}