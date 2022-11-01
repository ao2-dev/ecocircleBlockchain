"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.bip39 = exports.CoinGeckoClient = exports.tokenSCWeb3 = exports.web3 = exports.tokenSCSigned = exports.signer = exports.tokenSC = exports.provider = exports.POLYGONSCAN_APIKEY = exports.POLYGON_MUMBAI_RPC = exports.INFURA_ROPSTEN_WEBSOCKET = exports.OWNER = exports.INFURA_ROPSTEN_SERVER = exports.INFURA_API_KEY = exports.OWNER_PRIVATE_KEY = void 0;
const express_1 = __importDefault(require("express"));
const token_1 = __importDefault(require("./token"));
const wallet_1 = __importDefault(require("./wallet"));
const socket_1 = __importDefault(require("./socket"));
const coin_1 = __importDefault(require("./coin"));
const dotenv = __importStar(require("dotenv"));
const ethers_1 = require("ethers");
const contracts_1 = require("../contracts");
const web3_1 = __importDefault(require("web3"));
const coingecko_api_1 = __importDefault(require("coingecko-api"));
//env
dotenv.config();
_a = process.env, exports.OWNER_PRIVATE_KEY = _a.OWNER_PRIVATE_KEY, exports.INFURA_API_KEY = _a.INFURA_API_KEY, exports.INFURA_ROPSTEN_SERVER = _a.INFURA_ROPSTEN_SERVER, exports.OWNER = _a.OWNER, exports.INFURA_ROPSTEN_WEBSOCKET = _a.INFURA_ROPSTEN_WEBSOCKET, exports.POLYGON_MUMBAI_RPC = _a.POLYGON_MUMBAI_RPC, exports.POLYGONSCAN_APIKEY = _a.POLYGONSCAN_APIKEY;
//router
const router = express_1.default.Router();
router.use('/token', token_1.default);
router.use('/wallet', wallet_1.default);
router.use('/socket', socket_1.default);
router.use('/coin', coin_1.default);
//ethers.js
// export const provider= new ethers.providers.InfuraProvider("maticmum",
// INFURA_API_KEY
// )
exports.provider = new ethers_1.ethers.providers.JsonRpcProvider(exports.POLYGON_MUMBAI_RPC);
exports.tokenSC = new ethers_1.ethers.Contract(contracts_1.Token.address, contracts_1.Token.abi, exports.provider);
exports.signer = new ethers_1.ethers.Wallet(exports.OWNER_PRIVATE_KEY, exports.provider);
exports.tokenSCSigned = exports.tokenSC.connect(exports.signer);
//web3.js
exports.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(exports.POLYGON_MUMBAI_RPC));
exports.tokenSCWeb3 = new exports.web3.eth.Contract(contracts_1.Token.abi, contracts_1.Token.address);
// //websocket
// export const wsProvider= new ethers.providers.WebSocketProvider(INFURA_ROPSTEN_WEBSOCKET!,"ropsten");
//external api
exports.CoinGeckoClient = new coingecko_api_1.default();
//bip39
exports.bip39 = require('bip39');
/**
 * @swagger
 * components:
 *  schemas:
 *    ResponseT:
 *      description: API 응답데이터 형식(모두 동일)
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *        message:
 *          type: string
 *        data:
 *          anyOf:
 *          - type: object
 *          - type: integer
 *          - type: string
 *          nullable: true
 *    WalletT:
 *      description: 지갑 정보가 담길 테이블(타입) 입니다.
 *      type: object
 *      properties:
 *        hash:
 *          type: string
 *        addresses:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/AddressT'
 *        mnenomic:
 *          type: string
 *    AddressT:
 *      description: 지갑 내에 저장될 주소 테이블(타입) 입니다.
 *      type: object
 *      properties:
 *        idx:
 *          type: integer
 *        address:
 *          type: string
 *        privateKey:
 *          type: string
 *    TokenT:
 *      description: 토큰 기본 정보
 *      type: object
 *      properties:
 *        idx:
 *          type: integer
 *        address:
 *          type: string
 *        name:
 *          type: string
 *        symbol:
 *          type: string
 *        decimals:
 *          type: integer
 *        totalSupply:
 *          type: integer
 *        logoURI:
 *          type: string
 *
 *    EventT:
 *      description: 트랜잭션 이벤트 타입
 *      type: object
 *      properties:
 *        blockNumber:
 *          type: integer
 *        blockHash:
 *          type: string
 *        transactionHash:
 *          type: string
 *        idx:
 *          type: integer
 *        args:
 *          $ref: '#/components/schemas/TransferArgsT'
 *    TransferArgsT:
 *      description: (토큰 혹은 이더리움) 송금 이벤트(로그) 타입
 *      type: object
 *      properties:
 *        from:
 *          type: string
 *        to:
 *          type: string
 *        amount:
 *          type: integer
 *
 */
/**
   * @swagger
   * tags:
   *   name: Index
   *   description: User management and login
   */
/**
  * @swagger
  * /:
  *   get:
  *     tags:
  *      - Index
  *     description: 테스트
  *     responses:
  *       200:
  *         description: {success:true, message:'인덱스', data:'환영합니다'}
  */
router.get('/', (req, res, next) => {
    res.status(200).json({ success: true, message: '인덱스', data: '환영합니다' });
});
// router.get('/', async (req:Request, res:Response, next:NextFunction)=> {
//     try {
//         const accounts = await web3.eth.getAccounts();
// //0번째 주소 가져올 때 사용법
// //         account = (await web3.eth.getAccounts())[0];
// // i.addVoter(account);
//         const  data={
//             accounts,
//         }
//       res.status(200).json({data:data, key:OWNER_PRIVATE_KEY});
//     }catch(err){
//         console.log(err);
//         res.status(500).send();
//     }
// });
router.get('/welcome', (req, res, next) => {
    res.send('welcome!!!');
});
exports.default = router;
//# sourceMappingURL=index.js.map