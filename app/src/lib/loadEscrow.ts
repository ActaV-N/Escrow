import { ethers, Signer } from "ethers";
import Escrow from '@/contracts/Escrow.sol/Escrow.json';
import { EscrowT } from "@/components/Escrow";
import { approve } from "./approve";

export async function loadEscrow(contractAddress: string, signer: Signer){
    if(signer){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const escrowContract = new ethers.Contract(contractAddress, Escrow.abi, signer);

        const depositWei = await provider.getBalance(contractAddress);
        const depositEther = ethers.utils.formatEther(depositWei.toString());
        const isArbiter = `${(await signer.getAddress()).toLowerCase()}` === `${await (escrowContract.arbiter())}`.toLowerCase()
        
        const approveEvent = () => {
            const btn = (document.getElementById(escrowContract.address.toString()) as HTMLElement).querySelector('.approve-button');
            btn!.classList.add('pointer-events-none');
            btn!.classList.add('opacity-75');
            btn!.classList.add('cursor-not-allowed');
            btn!.innerHTML = "APPROVED";
        }

        const result: EscrowT = {
            depositer: await escrowContract.depositer(),
            deposit: depositEther,
            arbiter: await escrowContract.arbiter(),
            product: await escrowContract.product(),
            beneficiary:await escrowContract.beneficiary(),
            contract:contractAddress,
            isArbiter: isArbiter,
            isApproved: await escrowContract.isApproved(),
            handleApprove: async () => {
                escrowContract.on('Approved', approveEvent)
                await approve(escrowContract, signer as Signer);
            }
        }

        return result;
    }
}