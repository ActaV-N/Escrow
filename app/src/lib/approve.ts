import { Contract, ContractTransaction, Signer } from "ethers";

export async function approve(contract: Contract, signer: Signer){
    const tx:ContractTransaction = await contract.connect(signer).approve();
    await tx.wait();
}