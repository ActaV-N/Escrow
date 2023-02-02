import {expect, assert} from 'chai';
import { BigNumber, Contract, Signer } from 'ethers';
import {ethers} from 'hardhat'

describe('Escrow Contract test', () => {
    let contract: Contract;
    let depositer: Signer, arbiter: Signer, beneficiary: Signer;
    const deposit: BigNumber = ethers.utils.parseEther('1');

    beforeEach(async () => {
        depositer = ethers.provider.getSigner(0);
        arbiter = ethers.provider.getSigner(1);
        beneficiary = ethers.provider.getSigner(2);

        const EscrowFactory = await ethers.getContractFactory('Escrow');
        contract = await EscrowFactory.connect(depositer).deploy(arbiter.getAddress(), beneficiary.getAddress(), {value: deposit});

        // Wait until contract be deployed
        await contract.deployed();
    })

    describe("before approve", () => {
        it('should have 1 ether in contract balance', async () => {
            const balance = await ethers.provider.getBalance(contract.address);
            expect(balance).to.eq(deposit);
        })
    })

    describe('approval', () => {
        it('should revert when approve be called by another address', async () => {
            await expect(contract.connect(beneficiary).approve()).to.be.reverted;
        })

        it('should approve be called by arbiter', async () => {
            await expect(contract.connect(arbiter).approve()).to.not.be.reverted;
        })
    })

    describe('after approve', () => {
        let beforeBalance: BigNumber;
        beforeEach(async () => {
            beforeBalance = await ethers.provider.getBalance(beneficiary.getAddress());
            await contract.connect(arbiter).approve()
        })

        it("should added deposit at beneficiary's balance", async ()=>{
            const balance: BigNumber = await ethers.provider.getBalance(beneficiary.getAddress());

            expect(balance.sub(beforeBalance)).to.eq(deposit);
        })
    })
})