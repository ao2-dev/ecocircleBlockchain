import { BigNumber } from "ethers";

export interface TxReceiptT {
    to: string;
    from:string;
    contractAddress: string| null;
    transactionIndex: number,
    gasUsed:BigNumber;
    logsBloom: string;
    blockHash: string;
    transactionHash: string;
    logs:[],
    blockNumber: number;
    confirmations: number;
    cumulativeGasUsed: BigNumber;
    effectiveGasPrice: BigNumber;
    status: number;
    type: number;
    byzantium: boolean;
    events: []
}