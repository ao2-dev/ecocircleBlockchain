"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const router = express_1.default.Router();
router.get('/:tx', (req, res, next) => {
    const tx = req.params['tx']; //txHash
    const network = _1.wsProvider.getNetwork();
    network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}`));
    _1.wsProvider.on("pending", (txHash) => {
        if (txHash) {
            if (txHash === tx) {
                console.log(`${txHash} pending......>.<`);
                _1.wsProvider.getTransaction(txHash).then((tx) => {
                    console.log(tx);
                });
            }
        }
    });
});
exports.default = router;
//# sourceMappingURL=socket.js.map