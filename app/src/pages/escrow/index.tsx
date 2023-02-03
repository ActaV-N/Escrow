import Escrow, {EscrowT} from '@/components/Escrow'
import { useAccount } from '@/hooks/useAccount'
import { approve } from '@/lib/approve'
import { deploy } from '@/lib/deploy'
import { loadEscrow } from '@/lib/loadEscrow'
import { ethers, Signer } from 'ethers'
import Head from 'next/head'
import {useRouter} from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'

export default function EscrowPage() {
  const [escrows, setEscrows] = useState<EscrowT[]>([])
  const [createMode, setCreateMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  const {signer, getAccounts, account} = useAccount()
  const router = useRouter();

  useEffect(() => {
    if(account){
        setEscrows(escrows => {
            return escrows.map(escrow => ({
                ...escrow,
                isArbiter: `${account}` === escrow.arbiter.toLowerCase()
            }))
        })
    }
  }, [account])

  useEffect(() => {
    async function checkAccount(){
        const accounts = await getAccounts();
        if(accounts.length === 0){
            console.log("?")
            router.replace('/');
        }
    }

    checkAccount();
  }, [])

  useEffect(() => {
    if(signer) setIsLoading(false);
    async function getContracts(){
        const response = await fetch('/api/contracts');
        const contracts = await response.json();
        
        const res: EscrowT[] = []
        for(const contract of contracts){
            const escrow = await loadEscrow(contract.address, signer as Signer) as EscrowT;
            if(escrow) res.push(escrow);
        }
        
        setEscrows(res);
    }

    getContracts();
  }, [signer])

  useEffect(() => {
    if(escrows){
        for(const escrow of escrows){
            if(escrow.isApproved){
                const btn = (document.getElementById(escrow.contract) as HTMLElement).querySelector('.approve-button');
                btn!.classList.add('pointer-events-none');
                btn!.classList.add('opacity-75');
                btn!.classList.add('cursor-not-allowed');
                btn!.innerHTML = "APPROVED";
            }
        }
    }
  }, [escrows])

  const handleCreateMode = (mode: boolean) => {
    setCreateMode(mode);
  }

  const handleSubmit:FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formElement:HTMLFormElement = event.target as HTMLFormElement;

    const arbiterElement = formElement.querySelector('#arbiter') as HTMLInputElement;
    const beneficiaryElement = formElement.querySelector('#beneficiary') as HTMLInputElement;
    const amountOfEtherElement = formElement.querySelector('#deposit') as HTMLInputElement;
    const productElement = formElement.querySelector('#product') as HTMLInputElement;

    const arbiterAddress = arbiterElement.value;
    const beneficiaryAddress = beneficiaryElement.value;
    const amountOfEther = ethers.utils.parseEther(amountOfEtherElement.value);
    const product = productElement.value;

    
    const contract = await deploy(signer as Signer, arbiterAddress, beneficiaryAddress, product, amountOfEther);
    const depositer = await contract.signer.getAddress();

    const escrow: EscrowT = {
        depositer: depositer,
        contract: contract.address.toString(),
        arbiter: arbiterAddress,
        beneficiary: beneficiaryAddress,
        product: product,
        deposit: amountOfEther.toString(),
        isArbiter: `${account}` === arbiterAddress.toLowerCase(),
        handleApprove: async () => {
            contract.on('Approved', () => {
                const btn = (document.getElementById(contract.address.toString()) as HTMLElement).querySelector('.approve-button');
                btn!.classList.add('pointer-events-none');
                btn!.classList.add('opacity-75');
                btn!.classList.add('cursor-not-allowed');
                btn!.innerHTML = "APPROVED";
            })
            await approve(contract, signer as Signer);
        }
    }

    console.log('S')
    await fetch('/api/contracts', {
        method:'POST',
        body:JSON.stringify({
            contract: contract.address.toString()
        })
    });
    console.log('F')

    setEscrows([...escrows, escrow]);

    setCreateMode(false);
    arbiterElement.value = '';
    beneficiaryElement.value = '';
    amountOfEtherElement.value = '';
    productElement.value = '';
  }
  
  if(!signer) 
  return <main className='h-screen bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center'>
    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
  </main>

  return (
    <>
      <Head>
        <title>Escrow</title>
        <meta name="description" content="Escrow dApp with solidity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='h-screen bg-gradient-to-r from-sky-500 to-indigo-500 flex justify-center py-12'>
        <div className='w-3/4 max-w-3xl grid grid-rows-[auto_1fr] gap-y-5 justify-items-stretch content-center'>
            <div className='bg-[#f7f7f7] px-5 py-3 rounded-sm flex items-center'>
                <span className='bg-[#5E6CF0] select-none px-2 py-1 rounded-sm text-[0.5rem] text-white uppercase'>My address</span>
                <span className='text-[0.7rem] pl-2'>{account}</span>
            </div>
            {createMode ? 
            <div  className='bg-[#f7f7f7] overflow-y-auto px-5 py-5 rounded-sm'>
                <div className='relative right-2 bottom-2'>
                    <button onClick={() => handleCreateMode(false)} className='block p-2 rounded-md w-10 h-10 hover:bg-slate-400 duration-200 ease-in-out aspect-square'>
                        ←
                    </button>
                </div>
                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <label className='mb-8 block relative pt-5'>
                        <input type="text" id="arbiter" placeholder=' ' className='peer/input text-sm w-full bg-[transparent] outline-none border-b-2 focus:border-[#5E6CF0] border-slate-400 py-1 duration-200 ease-out' />
                        <span className='tracking-tight text-sm peer-focus/input:text-[#5E6CF0] block absolute text-slate-400 peer-focus/input:text-[#5E6CF0] peer-placeholder-shown/input:translate-y-0 peer-focus/input:translate-y-full translate-y-full peer-placeholder-shown/input:left-1 bottom-full peer-focus/input:bottom-full peer-placeholder-shown/input:bottom-1 peer-focus/input:left-0 left-0 duration-300 ease-in-out cursor-text peer-placeholder-shown/input:cursor-text'>
                            Arbiter Address
                        </span>
                    </label>
                    <label className='mb-8 block relative pt-5'>
                        <input type="text" id="beneficiary" placeholder=' ' className='peer/input text-sm w-full bg-[transparent] outline-none border-b-2 focus:border-[#5E6CF0] border-slate-400 py-1 duration-200 ease-out' />
                        <span className='text-sm peer-focus/input:text-[#5E6CF0] block absolute text-slate-400 peer-focus/input:text-[#5E6CF0] peer-placeholder-shown/input:translate-y-0 peer-focus/input:translate-y-full translate-y-full peer-placeholder-shown/input:left-1 bottom-full peer-focus/input:bottom-full peer-placeholder-shown/input:bottom-1 peer-focus/input:left-0 left-0 duration-300 ease-in-out cursor-text peer-placeholder-shown/input:cursor-text'>
                            Beneficiary Address
                        </span>
                    </label>
                    <label className='mb-8 block relative pt-5'>
                        <input type="number" id="deposit" step='0.01' placeholder=' ' className='peer/input text-sm w-full bg-[transparent] outline-none border-b-2 focus:border-[#5E6CF0] border-slate-400 py-1 duration-200 ease-out' />
                        <span className='text-sm peer-focus/input:text-[#5E6CF0] block absolute text-slate-400 peer-focus/input:text-[#5E6CF0] peer-placeholder-shown/input:translate-y-0 peer-focus/input:translate-y-full translate-y-full peer-placeholder-shown/input:left-1 bottom-full peer-focus/input:bottom-full peer-placeholder-shown/input:bottom-1 peer-focus/input:left-0 left-0 duration-300 ease-in-out cursor-text peer-placeholder-shown/input:cursor-text'>
                            Deposit amount (Ether)
                        </span>
                    </label>
                    <label className='mb-8 block relative pt-5'>
                        <input type="text" id="product" step='0.01' placeholder=' ' className='peer/input text-sm w-full bg-[transparent] outline-none border-b-2 focus:border-[#5E6CF0] border-slate-400 py-1 duration-200 ease-out' />
                        <span className='text-sm peer-focus/input:text-[#5E6CF0] block absolute text-slate-400 peer-focus/input:text-[#5E6CF0] peer-placeholder-shown/input:translate-y-0 peer-focus/input:translate-y-full translate-y-full peer-placeholder-shown/input:left-1 bottom-full peer-focus/input:bottom-full peer-placeholder-shown/input:bottom-1 peer-focus/input:left-0 left-0 duration-300 ease-in-out cursor-text peer-placeholder-shown/input:cursor-text'>
                            What kind of product/service do you have to get from beneficiary?
                        </span>
                    </label>
                    <button className='duration-200 ease-in-out hover:bg-[transparent] hover:text-[#1EA1EA] self-end py-3 px-5 bg-[#1EA1EA] border-solid border border-[#1EA1EA] text-[#fff] rounded-sm' type='submit'>
                        Deploy Contract
                    </button>
                </form>
            </div> : 
            <div className='overflow-auto'>
                <div className='bg-[#f7f7f7] overflow-y-auto px-5 py-5 rounded-sm grid grid-cols-autofill gap-5'>
                    {isLoading ? 
                    <div className='h-screen bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center'>
                        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div> :<>
                        <Escrow escrows={escrows}/>
                        <div className='flex items-center justify-center aspect-square border-dotted border-2 border-slate-700 rounded-sm'>
                            <button className='cursor-pointer w-full h-full block' onClick={() => handleCreateMode(true)}>
                                +
                            </button>
                        </div>
                    </>}
                </div>
            </div>}
        </div>
      </main>
    </>
  )
}
