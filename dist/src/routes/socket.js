"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { wsProvider } from ".";
const router = express_1.default.Router();
// router.get('/:tx', (req:Request, res:Response, next:NextFunction)=> {
//     const tx=req.params['tx']; //txHash
//    const network=wsProvider.getNetwork();
//    network.then(res=> console.log(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}`)) 
//    wsProvider.on("pending",(txHash)=>{
//     if(txHash){
//         if(txHash===tx){
//             console.log(`${txHash} pending......>.<`)
//             wsProvider.getTransaction(txHash).then((tx)=>{
//                 console.log(tx);
//               })
//         }
//     }
//    })
// })
exports.default = router;
// {
//     to: "0xBAa4cE417E7Ce6E4CF1b8eee4d83D67aA2586CC0",
//     from: "0xd228B760907231299B2e6C35470bc97C7E4ab514",
//     contractAddress: null,
//     transactionIndex: 18,
//     gasUsed: {
//       type: "BigNumber",
//       hex: "0x90fe"
//     },
//     logsBloom: "0x00000000000011000000000080000000000000000100000000000000000000080000000000000000000000000000000000008000082000000000000000000000000000000000000000000008000000800020000000002800040100000000000000000000000000000000000000000000000000000000000080000010000000000000000000000000000000000000000000000000008000000000000000000000200000000000000000000000000000000000000000000000000040000000006000000002000000000001000000000000000000000000000000100000000000010000000000000000000000000000000000000000000000000000000000100000",
//     blockHash: "0x466eaa68a4ec3a5483a8a757c4c0bc349e5dc61c28efd5e4d90c2d139c64ea61",
//     transactionHash: "0x0b5333acb43a52c41478fe46f3a5f6f9a0da8ca0f5c8000e41466e85d6488969",
//     logs: [
//       {
//         transactionIndex: 18,
//         blockNumber: 28694986,
//         transactionHash: "0x0b5333acb43a52c41478fe46f3a5f6f9a0da8ca0f5c8000e41466e85d6488969",
//         address: "0xBAa4cE417E7Ce6E4CF1b8eee4d83D67aA2586CC0",
//         topics: [
//           "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
//           "0x000000000000000000000000d228b760907231299b2e6c35470bc97c7e4ab514",
//           "0x00000000000000000000000013f62a9a810efd4c4b1b943e73fbfb5c00bfcb1f"
//         ],
//         data: "0x00000000000000000000000000000000000000000000000000000000000000c8",
//         logIndex: 72,
//         blockHash: "0x466eaa68a4ec3a5483a8a757c4c0bc349e5dc61c28efd5e4d90c2d139c64ea61"
//       },
//       {
//         transactionIndex: 18,
//         blockNumber: 28694986,
//         transactionHash: "0x0b5333acb43a52c41478fe46f3a5f6f9a0da8ca0f5c8000e41466e85d6488969",
//         address: "0xBAa4cE417E7Ce6E4CF1b8eee4d83D67aA2586CC0",
//         topics: [
//           "0x8e37437fd851b534f6b0da3a7b8b5b5bd2aea524c4397f0467438eccb095c7ba",
//           "0x000000000000000000000000d228b760907231299b2e6c35470bc97c7e4ab514",
//           "0x00000000000000000000000013f62a9a810efd4c4b1b943e73fbfb5c00bfcb1f"
//         ],
//         data: "0x00000000000000000000000000000000000000000000000000000000000000c8",
//         logIndex: 73,
//         blockHash: "0x466eaa68a4ec3a5483a8a757c4c0bc349e5dc61c28efd5e4d90c2d139c64ea61"
//       },
//       {
//         transactionIndex: 18,
//         blockNumber: 28694986,
//         transactionHash: "0x0b5333acb43a52c41478fe46f3a5f6f9a0da8ca0f5c8000e41466e85d6488969",
//         address: "0x0000000000000000000000000000000000001010",
//         topics: [
//           "0x4dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63",
//           "0x0000000000000000000000000000000000000000000000000000000000001010",
//           "0x000000000000000000000000d228b760907231299b2e6c35470bc97c7e4ab514",
//           "0x000000000000000000000000c275dc8be39f50d12f66b6a63629c39da5bae5bd"
//         ],
//         data: "0x000000000000000000000000000000000000000000000000000032a34fcea20000000000000000000000000000000000000000000000000122599686daa7646a000000000000000000000000000000000000000000000a457aa21de054e17a5c000000000000000000000000000000000000000000000001225963e38ad8c26a000000000000000000000000000000000000000000000a457aa25083a4b01c5c",
//         logIndex: 74,
//         blockHash: "0x466eaa68a4ec3a5483a8a757c4c0bc349e5dc61c28efd5e4d90c2d139c64ea61"
//       }
//     ],
//     blockNumber: 28694986,
//     confirmations: 1,
//     cumulativeGasUsed: {
//       type: "BigNumber",
//       hex: "0x99c6b0"
//     },
//     effectiveGasPrice: {
//       type: "BigNumber",
//       hex: "0x59682f0f"
//     },
//     status: 1,
//     type: 2,
//     byzantium: true,
//     events: [
//       {
//         transactionIndex: 18,
//         blockNumber: 28694986,
//         transactionHash: "0x0b5333acb43a52c41478fe46f3a5f6f9a0da8ca0f5c8000e41466e85d6488969",
//         address: "0xBAa4cE417E7Ce6E4CF1b8eee4d83D67aA2586CC0",
//         topics: [
//           "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
//           "0x000000000000000000000000d228b760907231299b2e6c35470bc97c7e4ab514",
//           "0x00000000000000000000000013f62a9a810efd4c4b1b943e73fbfb5c00bfcb1f"
//         ],
//         data: "0x00000000000000000000000000000000000000000000000000000000000000c8",
//         logIndex: 72,
//         blockHash: "0x466eaa68a4ec3a5483a8a757c4c0bc349e5dc61c28efd5e4d90c2d139c64ea61",
//         args: [
//           "0xd228B760907231299B2e6C35470bc97C7E4ab514",
//           "0x13F62a9a810EFD4C4b1B943e73fbFB5c00BFcB1F",
//           {
//             type: "BigNumber",
//             hex: "0xc8"
//           }
//         ],
//         event: "Transfer",
//         eventSignature: "Transfer(address,address,uint256)"
//       },
//       {
//         transactionIndex: 18,
//         blockNumber: 28694986,
//         transactionHash: "0x0b5333acb43a52c41478fe46f3a5f6f9a0da8ca0f5c8000e41466e85d6488969",
//         address: "0xBAa4cE417E7Ce6E4CF1b8eee4d83D67aA2586CC0",
//         topics: [
//           "0x8e37437fd851b534f6b0da3a7b8b5b5bd2aea524c4397f0467438eccb095c7ba",
//           "0x000000000000000000000000d228b760907231299b2e6c35470bc97c7e4ab514",
//           "0x00000000000000000000000013f62a9a810efd4c4b1b943e73fbfb5c00bfcb1f"
//         ],
//         data: "0x00000000000000000000000000000000000000000000000000000000000000c8",
//         logIndex: 73,
//         blockHash: "0x466eaa68a4ec3a5483a8a757c4c0bc349e5dc61c28efd5e4d90c2d139c64ea61",
//         args: [
//           "0xd228B760907231299B2e6C35470bc97C7E4ab514",
//           "0x13F62a9a810EFD4C4b1B943e73fbFB5c00BFcB1F",
//           {
//             type: "BigNumber",
//             hex: "0xc8"
//           }
//         ],
//         event: "MintOrBurn",
//         eventSignature: "MintOrBurn(address,address,uint256)"
//       },
//       {
//         transactionIndex: 18,
//         blockNumber: 28694986,
//         transactionHash: "0x0b5333acb43a52c41478fe46f3a5f6f9a0da8ca0f5c8000e41466e85d6488969",
//         address: "0x0000000000000000000000000000000000001010",
//         topics: [
//           "0x4dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63",
//           "0x0000000000000000000000000000000000000000000000000000000000001010",
//           "0x000000000000000000000000d228b760907231299b2e6c35470bc97c7e4ab514",
//           "0x000000000000000000000000c275dc8be39f50d12f66b6a63629c39da5bae5bd"
//         ],
//         data: "0x000000000000000000000000000000000000000000000000000032a34fcea20000000000000000000000000000000000000000000000000122599686daa7646a000000000000000000000000000000000000000000000a457aa21de054e17a5c000000000000000000000000000000000000000000000001225963e38ad8c26a000000000000000000000000000000000000000000000a457aa25083a4b01c5c",
//         logIndex: 74,
//         blockHash: "0x466eaa68a4ec3a5483a8a757c4c0bc349e5dc61c28efd5e4d90c2d139c64ea61"
//       }
//     ]
//   }
//# sourceMappingURL=socket.js.map