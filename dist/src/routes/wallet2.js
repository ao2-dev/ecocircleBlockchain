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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.needUserUUID = void 0;
const express_1 = __importDefault(require("express"));
const web3_1 = __importDefault(require("web3"));
const eth_lightwallet_1 = __importDefault(require("eth-lightwallet"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const dotenv = __importStar(require("dotenv"));
const ethers_1 = require("ethers");
const contracts_1 = require("../contracts");
dotenv.config();
const router = express_1.default.Router();
const { OWNER_PRIVATE_KEY, INFURA_ROPSTEN_SERVER, OWNER_ADDRESS, INFURA_API_KEY } = process.env;
const provider = new ethers_1.ethers.providers.InfuraProvider("ropsten", INFURA_API_KEY);
const sc = new ethers_1.ethers.Contract(contracts_1.Token.address, contracts_1.Token.abi, provider);
const signer = new ethers_1.ethers.Wallet(OWNER_PRIVATE_KEY, provider);
const scWithSigner = sc.connect(signer);
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(INFURA_ROPSTEN_SERVER));
const needUserUUID = (req, res, next) => {
    //header에서 'UUID' 값을 주어야함.
    const uuid = req.get('UUID');
    if (uuid) {
        req.uuid = uuid;
        console.log(uuid);
        next();
    }
    else {
        res.status(400).json({ success: false, message: `uuid값 없음`, data: null });
    }
};
exports.needUserUUID = needUserUUID;
/**
   * @swagger
   * tags:
   *   name: Wallet
   *   description: 토큰 관련 API
   */
//니모닉 코드와 비밀번호로 지갑 및 계좌 1개 동시 생성하기.
//참고 : https://velog.io/@dannsrud/MnemonicWallet
/**
   * @swagger
   * /wallet/create:
   *   post:
   *     summary: 니모닉 코드와 비밀번호로 지갑 및 계좌 1개 동시 생성하기
   *     requestBody:
   *       description: 변경될 Owner계정을 보내주세요
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *                 description: 지갑에 사용될 비밀번호
   *
   *     tags:
   *      - Wallet
   *     description: 니모닉 코드와 비밀번호로 지갑 및 계좌 1개 동시 생성하기
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *
   *
   */
router.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    try {
        const mnemonic = eth_lightwallet_1.default.keystore.generateRandomSeed();
        const uuid = (0, uuid_1.v5)(mnemonic, '1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
        eth_lightwallet_1.default.keystore.createVault({
            password: password,
            seedPhrase: mnemonic,
            //hdPathString:"m/0'/0'/0'"
            hdPathString: "m/44'/1'/0'/0"
        }, function (err, ks) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(ks);
                ks.keyFromPassword(password, function (err, pwDerivedKey) {
                    ks.generateNewAddress(pwDerivedKey, 1);
                    const address = (ks.getAddresses()).toString();
                    const keystore = ks.serialize();
                    const saving = { keystore, address: address, uuid: uuid, mnemonic: mnemonic };
                    fs_1.default.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving), (err) => console.log(err));
                    res.status(200).json({ success: true, message: '지갑 생성 완료', data: saving });
                    //uuid 는 프론트가 받아서 백엔드 정보로 넘겨주어야함.
                });
            });
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, err: err });
    }
}));
//유저 계좌조회
/**
   * @swagger
   * /wallet/accounts:
   *   get:
   *     summary: 등록된 주소 리스트 조회
   *     parameters:
   *       - in: header
   *         name: UUID
   *         schema:
   *           type: string
   *           foramt: uuid
   *           description: 유저의 uuid 를 보내주세요
   *         required: true
   *     tags:
   *      - Wallet
   *     description: 등록된 주소 리스트 조회
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *
   *
   */
router.get('/accounts', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            const d = JSON.parse(data);
            const keystore = yield eth_lightwallet_1.default.keystore.deserialize(d.keystore);
            const addresses = (keystore.getAddresses());
            res.status(200).json({ success: true, message: '계정 추가 완료', data: { address: addresses } });
        }));
    }
    catch (err) {
        res.status(500).json({ success: false, message: '계좌(주소)리스트 조회 실패', data: null });
    }
}));
/**
   * @swagger
   * /wallet/accounts/add:
   *   post:
   *     summary: 지갑에 주소 추가하기
   *     parameters:
   *       - in: header
   *         name: UUID
   *         schema:
   *           type: string
   *           foramt: uuid
   *           description: 유저의 uuid 를 보내주세요
   *         required: true
   *     requestBody:
   *       description: 지갑 주소에 필요한 body파라미터
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *                 description: 지갑생성시 사용 된 비밀번호
   *
   *     tags:
   *      - Wallet
   *     description: 지갑에 주소 추가하기
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *
   *
   */
//계좌 추가 개설하기
router.post('/accounts/add', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //  const address=req.params['address'];
    const password = req.body.password;
    try {
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            const d = JSON.parse(data);
            const keystore = yield eth_lightwallet_1.default.keystore.deserialize(d.keystore);
            yield keystore.keyFromPassword(password, (err, pwDerivedKey) => {
                keystore.generateNewAddress(pwDerivedKey, 1);
                const addresses = (keystore.getAddresses());
                const newKeystore = keystore.serialize();
                const saving = Object.assign(Object.assign({}, d), { keystore: newKeystore });
                fs_1.default.writeFile(`./db/keystores/${req.uuid}.json`, JSON.stringify(saving), (err) => console.log(err));
                res.status(200).json({ success: true, message: '계정 추가 완료', data: { address: addresses[addresses.length - 1] } });
            });
        }));
    }
    catch (err) {
        res.status(500).json({ success: false, message: '계좌 추가하기 실패', data: null });
    }
}));
// 기존의 계좌 더하기
router.post('/accounts/add/from', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    try {
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            const d = JSON.parse(data);
            const keystore = yield eth_lightwallet_1.default.keystore.deserialize(d.keystore);
            yield keystore.keyFromPassword(password, (err, pwDerivedKey) => {
                console.log('------DerivedKey-------');
                console.log(pwDerivedKey);
                console.log('-------------');
            });
        }));
    }
    catch (err) {
        res.status(500).json({ success: false, message: '계좌 추가하기 실패', data: null });
    }
}));
//프라이빗키 조회
/**
   * @swagger
   * /wallet/privatekey/{address}:
   *   post:
   *     summary: 지갑에 주소 추가하기
   *     parameters:
   *       - in: path
   *         name: address
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: 조회하고자하는 주소(0x..)
   *       - in: header
   *         name: UUID
   *         schema:
   *           type: string
   *           foramt: uuid
   *           description: 유저의 uuid 를 보내주세요
   *         required: true
   *     requestBody:
   *       description: 지갑 주소에 필요한 body파라미터
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *                 description: 지갑생성시 사용 된 비밀번호
   *
   *     tags:
   *      - Wallet
   *     description: 지갑에 주소 추가하기
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *
   *
   */
router.post('/privatekey/:address', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params['address'];
    const password = req.body.password;
    try {
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data) {
                const d = JSON.parse(data);
                console.log("------");
                console.log(d);
                console.log("------");
                const keystore = yield eth_lightwallet_1.default.keystore.deserialize(d.keystore);
                yield keystore.keyFromPassword(password, (err, pwDerivedKey) => {
                    if (err) {
                        console.log("--errorororo--");
                        res.status(500).json({ success: false, message: `프라이빗 정보조회 실패:${err}`, data: null });
                    }
                    const key = keystore.exportPrivateKey(address.toString(), pwDerivedKey);
                    const privateKey = '0x' + key;
                    res.status(200).json({ success: true, message: `프라이빗 정보조회 성공`, data: {
                            address: address,
                            privateKey: privateKey,
                        } });
                });
            }
        }));
    }
    catch (err) {
        res.status(500).json({ success: false, message: `프라이빗 정보조회 실패:${err}`, data: null });
    }
}));
//이더리움 잔액 조회
/**
   * @swagger
   * /wallet/balance/{address}:
   *   get:
   *     summary: 이더리움 잔액 조회
   *     parameters:
   *       - in: path
   *         name: address
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: 조회하고자하는 주소(0x..)
   *     tags:
   *      - Wallet
   *     description: 이더리움 잔액 조회
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *
   *
   */
router.get('/balance/:address', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params['address'];
    try {
        const balance = yield provider.getBalance(address);
        console.log(balance);
        res.status(200).json({ success: true, message: `이더리움 잔액조회 성공`, data: { balance: balance.toString() } });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `이더리움 잔액조회 실패:${err}`, data: null });
    }
}));
//이더리움 보내기
/**
   * @swagger
   * /wallet/send/ether:
   *   post:
   *     summary: 이더리움 송금
   *     requestBody:
   *       description: 이더리움 송금에 필요한 body파라미터
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               privateKey:
   *                 type: string
   *                 description: 보내는 이의 비공개키
   *               to:
   *                 type: string
   *                 description: 이더를 보낼 주소
   *               amount:
   *                 type: integer
   *                 description: 이더 양
   *
   *     tags:
   *      - Wallet
   *     description: 이더리움 송금
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *
   *
   */
router.post('/send/ether', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const privateKey = req.body.privateKey; // 보내는 사람의 프라이빗키
    const to = req.body.to;
    const amount = req.body.amount;
    try {
        const tx = {
            to: to,
            value: ethers_1.ethers.utils.parseEther(amount),
        };
        const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
        wallet.sendTransaction(tx).then((txObj) => {
            console.log('txHash', txObj.hash);
            res.status(200).json({ success: true, message: `이더리움 전송 성공`, data: { txHash: txObj.hash, to: to, amount: amount } });
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: `이더리움 전송 실패:${err}`, data: { privateKey, to, amount } });
    }
}));
exports.default = router;
// //지갑생성에 필요한 니모닉 코드
// router.get('/create/random', async(req:Request, res:Response, next:NextFunction)=> {
//   const password=req.body.password;
//   try {
//     const  newWallet = ethers.Wallet.createRandom();
//     const mnemonic=newWallet.mnemonic;
//     const privateKey=newWallet.privateKey;
//    //const walletMnemonic=Wallet.fromMnemonic(mnemonic.phrase);
//    //console.log(`walletMnenomic: ${walletMnemonic}`)
//    const data={wallet:newWallet, mnenomic: mnemonic, privateKey};
//     // const result= await ethers.Wallet.fromEncryptedJson(JSON.stringify(data), password);
//     // if(result){
//     //   console.log('=======encrypt result======')
//     //   console.log(result);
//     //   console.log('=========')
//     // }else {
//     //   console.log("---failed-----")
//     // }
//     res.status(200).json({success:true, message:'월렛 생성 성공', data:data})
//   } catch(err){
//   res.status(500).json({success:false, message:`월렛 생성 실패 :${err}`, data:null})
//   }
// });
// router.get('/encrypt',  async(req:Request, res:Response, next:NextFunction)=> {
//   const password=req.body.password;
// })
//# sourceMappingURL=wallet2.js.map