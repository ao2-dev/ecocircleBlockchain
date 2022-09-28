"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const express_1 = __importDefault(require("express"));
const contracts_1 = require("../contracts");
const router = express_1.default.Router();
const { OWNER_PRIVATE_KEY, INFURA_ROPSTEN_WEBSOCKET } = process.env;
const wsProvider = new ethers_1.ethers.providers.WebSocketProvider(INFURA_ROPSTEN_WEBSOCKET, "ropsten");
const sc = new ethers_1.ethers.Contract(contracts_1.Token.address, contracts_1.Token.abi, wsProvider);
const signer = new ethers_1.ethers.Wallet(OWNER_PRIVATE_KEY, wsProvider);
const scWithSigner = sc.connect(signer);
// interface ServerToClientEvents {
//     noArg: () => void;
//     basicEmit: (a: number, b: string, c: Buffer) => void;
//     withAck: (d: string, callback: (e: number) => void) => void;
//   }
//   interface ClientToServerEvents {
//     hello: () => void;
//   }
//   interface InterServerEvents {
//     ping: () => void;
//   }
//   interface SocketData {
//     name: string;
//     age: number;
//   }
//   const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();
router.get('/:tx', (req, res, next) => {
    const tx = req.params['tx']; //txHash
    const network = wsProvider.getNetwork();
    network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}`));
    wsProvider.on("pending", (txHash) => {
        if (txHash) {
            if (txHash === tx) {
                console.log(`${txHash} pending......>.<`);
                wsProvider.getTransaction(txHash).then((tx) => {
                    console.log(tx);
                });
            }
        }
    });
});
exports.default = router;
//# sourceMappingURL=socket.js.map