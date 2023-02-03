import { ethers } from 'ethers'
import Head from 'next/head'
import { useEffect } from 'react'
import {useRouter} from 'next/router'
import { useAccount } from '@/hooks/useAccount';

export default function Home() {
  const router = useRouter();
  const {account, setAccount, loading} = useAccount();

  useEffect(() => {
    if(account){
      router.replace('/escrow');
    }
  }, [account])


  const handleConnect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if(accounts[0]){
      setAccount(accounts[0]);
    }
  }

  if(loading) 
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
      <main className='h-screen bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center'>
        <div className='w-3/4 max-w-2xl bg-[#f7f7f7] px-8 py-6 rounded-md'>
          <div>
            <h1 className='text-3xl mb-3'>Welcome to the Escrow dApp for goerli testnet!</h1>
            <h3 className='text-xl leading-normal'>Howdy!👋🏻</h3>
          </div>

          <div className='text-right leading-5'>
            <p className='text-left'>
              Before you start this, please connect the wallet! 😎
            </p>
            <p className='text-sm mt-5 mb-2 '>(Be sure you are in goerli network!)</p>
            <button onClick={handleConnect} className='px-4 py-2 bg-[#5E6CF0] hover:bg-[#f7f7f7] border-2 text-base border-solid border-[#5E6CF0] rounded-md text-white hover:text-[#5E6CF0] ease-in-out duration-200'>💳 Connect Wallet 💳</button>
          </div>
        </div>
      </main>
    </>
  )
}
