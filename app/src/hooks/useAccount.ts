import { ethers, Signer } from "ethers";
import { useEffect, useState } from "react";

export const useAccount = () => {
    const [account, _setAccount] = useState();
    const [signer, setSigner] = useState<Signer>();
    const [loading, setLoading] = useState(true);

    const getAccounts = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);

        return accounts;
    }

    const setAccount = (account: any) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        _setAccount(account);
        setSigner(provider.getSigner());
    }

    useEffect(() => {
        async function checkAccount(){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send('eth_accounts', []);
            
            if(accounts[0]){
                _setAccount(accounts[0]);
                setSigner(provider.getSigner());
            } else{
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
            }
        }

        setInterval(checkAccount, 100);
    }, [])

    return {account, loading, setAccount, getAccounts, signer}
}