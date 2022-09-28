"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_1 = __importDefault(require("./token"));
const wallet_1 = __importDefault(require("./wallet"));
const dotenv = __importStar(require("dotenv"));
const ethers_1 = require("ethers");
dotenv.config();
//const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_RPC_SERVER));
//const web3= new Web3(GANACHE_RPC_SERVER);
const { OWNER_PRIVATE_KEY, INFURA_API_KEY, TEST } = process.env;
// const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_GORLI_SERVER!));
const provider = new ethers_1.ethers.providers.InfuraProvider("ropsten", INFURA_API_KEY);
const router = express_1.default.Router();
//const payRouter:Router = require('./pay');
router.use('/token', token_1.default);
router.use('/wallet', wallet_1.default);
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
 *        keystore:
 *          type: string
 *        addresses:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Web3AddressT'
 *        uuid:
 *          type: string
 *        mnemonic:
 *          type: string
 *    Web3AddressT:
 *      description: 지갑 내에 저장될 주소 테이블(타입) 입니다.
 *      type: object
 *      properties:
 *        index:
 *          type: integer
 *        address:
 *          type: string
 *        privateKey:
 *          type: string
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
 *          type: interfer
 *    Dog:
 *      type: object
 *      properties:
 *        bark:
 *          type: boolean
 *        breed:
 *          type: string
 *          enum: [Dingo, Husky, Retriever, Shepherd]
 *    Cat:
 *      type: object
 *      properties:
 *        hunts:
 *          type: boolean
 *        age:
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