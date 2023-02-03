import type { NextApiRequest, NextApiResponse } from 'next';
import {Contract, PrismaClient} from '@prisma/client'

type ContractData = {
  contractAddress: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const prisma = new PrismaClient();
    
    if(req.method === 'POST'){
        // Çreate contract
        try{
            const {contract} = JSON.parse(req.body);
            
            const newContract = await prisma.contract.create({
                data:{
                    address: contract
                }
            });

            res.status(200).json(newContract);
        } catch(e){
            res.status(500);
        }
    } else if(req.method === 'GET'){
        // Get all contracts
        try{
            const contracts = await prisma.contract.findMany();
            res.status(200).json(contracts);
        } catch(e){
            res.status(500);
        }
    }
}
