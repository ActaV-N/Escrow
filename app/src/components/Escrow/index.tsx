export type EscrowT = {
    depositer: string,
    contract:string,
    arbiter:string,
    beneficiary:string,
    product:string,
    deposit:string,
    isArbiter: boolean,
    handleApprove: () => Promise<void>
};

const Escrow = ({escrows}: {escrows:EscrowT[]}) => {
    return <>
        {escrows.map(escrow => 
        <div key={escrow.contract} id={escrow.contract} className='py-1 px-2 aspect-square overflow-y-auto border-solid border border-slate-300 rounded-sm'>
        <div className="mb-5 text-ellipsis overflow-hidden">
            <span className='bg-[#5E6CF0] select-none px-2 py-1 rounded-sm text-[0.5rem] text-white uppercase'>
                Contract
            </span>
            <div className='text-[0.7rem] pl-1 mt-1'>{escrow.contract}</div>
        </div>
        <div className="mb-0 text-ellipsis overflow-hidden">
            <span className='bg-[#6741D9] select-none px-2 py-1 rounded-sm text-[0.5rem] text-white uppercase'>
                Depositer
            </span>
            <div className='text-[0.7rem] pl-1 mt-1'>{escrow.depositer}</div>
        </div>
        <div className="mb-5 text-ellipsis overflow-hidden">
            <span className='bg-[#6741D9] select-none px-2 py-1 rounded-sm text-[0.5rem] text-white uppercase'>
                Product / Service
            </span>
            <div className='text-[0.7rem] pl-1 mt-1'>{escrow.product}</div>
        </div>
        <div className="mb-0 text-ellipsis overflow-hidden">
            <span className='bg-[#AE3EC9] select-none px-2 py-1 rounded-sm text-[0.5rem] text-white uppercase'>
                Beneficiary
            </span>
            <div className='text-[0.7rem] pl-1 mt-1'>{escrow.beneficiary}</div>
        </div>
        <div className="mb-5 text-ellipsis overflow-hidden">
            <span className='bg-[#AE3EC9] select-none px-2 py-1 rounded-sm text-[0.5rem] text-white uppercase'>
                Deposit
            </span>
            <div className='text-[0.7rem] pl-1 mt-1'>{escrow.deposit}</div>
        </div>
        <div className="mb-0 text-ellipsis overflow-hidden">
            <span className='bg-[#5E6CF0] select-none px-2 py-1 rounded-sm text-[0.5rem] text-white uppercase'>
                Arbiter
            </span>
            <div className='text-[0.7rem] pl-1 mt-1'>{escrow.arbiter}</div>
        </div>
        <div className="mb-0 text-ellipsis overflow-hidden">
            <button onClick={escrow.handleApprove} disabled={!escrow.isArbiter} className='approve-button disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer mt-3 text-sm w-full duration-200 ease-in-out enabled:hover:bg-[transparent] enabled:hover:text-[#5E6CF0] self-end py-0.5 px-1 bg-[#5E6CF0] border-solid border border-[#5E6CF0] text-[#fff] rounded-sm' >
                APPROVE
            </button>
        </div>
    </div>)}
    </>
}

export default Escrow;