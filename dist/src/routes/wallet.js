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
const express_1 = __importDefault(require("express"));
const web3_1 = __importDefault(require("web3"));
const uuid_1 = require("uuid");
const dotenv = __importStar(require("dotenv"));
const ethers_1 = require("ethers");
dotenv.config();
const router = express_1.default.Router();
const { OWNER_PRIVATE_KEY, INFURA_ROPSTEN_SERVER, OWNER_ADDRESS, INFURA_API_KEY } = process.env;
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(INFURA_ROPSTEN_SERVER));
const provider = new ethers_1.ethers.providers.InfuraProvider("ropsten", INFURA_API_KEY);
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: 지갑 관련 API
 */
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ success: true, message: '성공', data: 'wallet' });
}));
/**
   * @swagger
   * /wallet/create:
   *   post:
   *     summary: 최초 지갑 생성 하기 [W-2]
   *     requestBody:
   *       description: 비밀번호 필요
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *     tags:
   *      - Wallet
   *     description: 최초 지갑 생성 하기 [W-2]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/WalletT'
   *
   *
   */
router.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    try {
        const wallet = ethers_1.Wallet.createRandom();
        wallet.connect(provider).encrypt(password, (progress) => {
            console.log("Encrypting: " + parseInt(progress) * 100 + "% complete");
        }).then((keystore) => {
            const address = web3.eth.accounts.privateKeyToAccount(`${wallet.privateKey}`);
            const walletMnemonic = wallet.mnemonic; // 있음 
            const uuid = (0, uuid_1.v5)(`${wallet.mnemonic.phrase}`, '1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
            const saving = {
                keystore: keystore,
                addresses: [address],
                uuid: uuid,
                mnemonic: walletMnemonic.phrase,
            };
            res.status(200).json({ success: true, message: '지갑 생성 완료', data: saving });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, err: err });
    }
}));
/**
   * @swagger
   * /wallet/accounts:
   *   get:
   *     summary: 지갑 계좌주소리스트 조회 [W-3] [사용x]
   *     parameters:
   *       - in: header
   *         name: UUID
   *         schema:
   *           type: string
   *         required: true
   *     tags:
   *      - Wallet
   *     description: 지갑 계좌주소리스트 조회 [W-3] [사용x]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *
   *
   */
router.get('/accounts', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = req.body.wallet;
    try {
        const d = wallet;
        res.status(200).json({ success: true, message: '주소 리스트 조회 성공', data: d.addresses });
    }
    catch (err) {
        res.status(500).json({ success: false, message: `주소 리스트 조회 실패:${err}`, data: null });
    }
}));
/**
   * @swagger
   * /wallet/accounts/add/new:
   *   post:
   *     summary: 새로운 주소 만들고 지갑에 추가하기 [W-4]
   *     requestBody:
   *       description: 월렛 정보 보내주세요.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               wallet:
   *                 $ref: '#/components/schemas/WalletT'
   *     tags:
   *      - Wallet
   *     description: 새로운 주소 만들고 지갑에 추가하기 [W-4]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/WalletT'
   *
   */
//랜덤 계좌 추가
router.post('/accounts/add/new', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = req.body.wallet;
    try {
        const newAccount = web3.eth.accounts.create();
        console.log(newAccount);
        const d = wallet;
        const originKS = JSON.parse(d.keystore);
        const originAddress = originKS.address; //keystore에 저장되어있는 주소
        let addrList = [];
        if (typeof originAddress === typeof []) {
            //주소 여러개 있을때
            addrList = originAddress;
        }
        else {
            //1개만 있을 때
            addrList = [originAddress];
        }
        const newKS = Object.assign(Object.assign({}, originKS), { address: addrList.push(newAccount.address) });
        const renewedWallet = Object.assign(Object.assign({}, d), { keystore: JSON.stringify(newKS), addresses: [
                ...d.addresses,
                newAccount,
            ] });
        res.status(200).json({ success: true, message: '추가계좌개설 성공', data: renewedWallet });
    }
    catch (err) {
        res.status(500).json({ success: false, message: `추가계좌개설 실패:${err}`, data: null });
    }
}));
router.post('/keystore', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = req.body.wallet;
    const d = wallet;
    const originKS = JSON.parse(d.keystore);
    console.log(originKS);
    res.status(200).json({ success: true, message: '추가계좌개설 성공', data: originKS });
}));
//  다른 곳에 보유중인 계좌 추가
/**
   * @swagger
   * /wallet/accounts/add/origin:
   *   post:
   *     summary: 다른곳에 보유한 내 주소 가져와서 지갑에 추가하기 [W-5]
   *     requestBody:
   *       description: 추가할 주소의 비공개키(privateKey)와 월렛정보 보내주세요.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               privateKey:
   *                 type: string
   *               wallet:
   *                 $ref: '#/components/schemas/WalletT'
   *     tags:
   *      - Wallet
   *     description: 다른곳에 보유한 내 주소 가져와서 지갑에 추가하기 [W-5]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/WalletT'
   *
   *
   */
router.post('/accounts/add/origin', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = req.body.wallet;
    const privateKey = req.body.privateKey;
    try {
        const newAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log(newAccount);
        const d = wallet;
        const renewdWallet = Object.assign(Object.assign({}, d), { addresses: [
                ...d.addresses,
                newAccount,
            ] });
        res.status(200).json({ success: true, message: '주소 추가 성공', data: renewdWallet });
    }
    catch (err) {
        res.status(500).json({ success: false, message: `주소 추가 실패:${err}`, data: null });
    }
}));
/**
   * @swagger
   * /wallet/accounts/add/origin:
   *   post:
   *     summary: 지갑에서 주소 삭제 [W-6]
   *     parameters:
   *       - in: path
   *         name: address
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: 삭제 할 주소(0x...)
   *     requestBody:
   *       description: 월렛정보 보내주세요.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               wallet:
   *                 $ref: '#/components/schemas/WalletT'
   *     tags:
   *      - Wallet
   *     description: 지갑에서 주소 삭제 [W-6]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/WalletT'
   *
   *
   */
//지갑에서 주소 삭제
router.delete('/accounts/delete/:address', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params['address'];
    const wallet = req.body.wallet;
    try {
        const d = wallet;
        const renewdWallet = Object.assign(Object.assign({}, d), { addresses: d.addresses.filter(item => item.address !== address) });
        res.status(200).json({ success: true, message: '주소 삭제 성공', data: renewdWallet });
    }
    catch (err) {
        res.status(500).json({ success: false, message: `주소 삭제 실패:${err}`, data: null });
    }
}));
/**
   * @swagger
   * /wallet/balance/{address}:
   *   get:
   *     summary: 이더리움 잔액 조회 [W-7]
   *     parameters:
   *       - in: path
   *         name: address
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: 잔액 조회하고자 하는 주소
   *     tags:
   *      - Wallet
   *     description: 이더리움 잔액 조회 [W-7]
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
        res.status(200).json({ success: true, message: `이더리움 잔액조회 성공`, data: `${balance}` }); //balance 는 bigNumber 이고, bigNumber  는  .toString() 해주어야함.
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `이더리움 잔액조회 실패:${err}`, data: null });
    }
}));
/**
   * @swagger
   * /wallet/restore:
   *   post:
   *     summary: 니모닉으로 내 지갑정보 복구하기(단, 첫번째 주소만 불러와짐) [W-8]
   *     requestBody:
   *       description: 월렛 정보 보내주세요.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               wallet:
   *                 $ref: '#/components/schemas/WalletT'
   *     tags:
   *      - Wallet
   *     description: 니모닉으로 내 지갑정보 복구하기(단, 첫번째 주소만 불러와짐) [W-8]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/WalletT'
   *
   */
//동일한 니모닉으로 다시 지갑 생성
router.post('/restore', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mnemonic = req.body.mnemonic;
    try {
        const wallet = yield ethers_1.Wallet.fromMnemonic(mnemonic);
        console.log(wallet);
        console.log(wallet.getAddress());
        console.log(wallet.mnemonic.phrase);
        const encryptPromise = wallet.encrypt("12345", (percent) => {
            console.log("Encrypting: " + parseInt(percent) * 100 + "% complete");
        });
        encryptPromise.then((keystore) => {
            const address = web3.eth.accounts.privateKeyToAccount(`${wallet.privateKey}`);
            const walletMnemonic = wallet.mnemonic; // 있음 
            const uuid = (0, uuid_1.v5)(`${wallet.mnemonic.phrase}`, '1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
            const saving = {
                keystore: keystore,
                addresses: [address],
                uuid: uuid,
                mnemonic: walletMnemonic.phrase,
            };
            res.status(200).json({ success: true, message: `이더리움 잔액조회 성공`, data: saving });
            //console.log(json.)
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑복구 실패:${err}`, data: null });
    }
}));
/**
   * @swagger
   * /wallet/accounts/name/{address}:
   *   patch:
   *     summary: 주소에 대한 이름 생성 및 변경 [W-9]
   *     parameters:
   *       - in: path
   *         name: address
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: 잔액 조회하고자 하는 주소
   *     requestBody:
   *       description: 월렛 정보 보내주세요.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               wallet:
   *                 $ref: '#/components/schemas/WalletT'
   *     tags:
   *      - Wallet
   *     description: 주소에 대한 이름 생성 및 변경 [W-9]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/WalletT'
   *
   *
   */
//주소에 대한 이름 생성 및 변경
router.patch('/accounts/name/:address', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const address = req.params['address'];
    const wallet = req.body.wallet;
    try {
        const d = wallet;
        const addrList = d.addresses;
        const changedAddr = d.addresses.filter(item => item.address === address)[0];
        const changedAddrIndex = d.addresses.indexOf(changedAddr);
        delete addrList[changedAddrIndex];
        const newAddr = Object.assign(Object.assign({}, changedAddr), { name: name });
        addrList.splice(changedAddrIndex, 1, newAddr);
        const renewedWallet = Object.assign(Object.assign({}, d), { addresses: addrList });
        res.status(200).json({ success: true, message: `주소에 대한 이름 생성 및 변경 성공`, data: renewedWallet });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `주소에 대한 이름 생성 및 변경 실패:${err}`, data: null });
    }
}));
////==========================보류 ===============================///
//[x]  아직 보류 !!~!// 신규 지갑 생성 : 니모닉은 지갑을 구분하는 문구임. privatekey만 있으면 account는 가져올 수 있음 ==> 프론트에서 secure storage 저장
//생성시 provider 없음
router.post('/create/web3/new', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newWallet = web3.eth.accounts.wallet.create(1);
        const newAddress = web3.eth.accounts.create();
        console.log(`==-=====ADDRESS=====`);
        console.log(newAddress);
        console.log('==================');
        newWallet.add({
            privateKey: newAddress.privateKey,
            address: newAddress.address,
        });
        console.log(newWallet);
        console.log(newWallet["0"]);
        const keystore = newWallet.encrypt("12345");
        console.log(keystore);
        res.status(200).json({ success: true, message: '지갑 생성 완료', data: null });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, err: err });
    }
}));
exports.default = router;
//# sourceMappingURL=wallet.js.map