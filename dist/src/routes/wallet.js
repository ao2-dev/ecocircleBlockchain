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
exports.needUserUUID = void 0;
const express_1 = __importDefault(require("express"));
const web3_1 = __importDefault(require("web3"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const dotenv = __importStar(require("dotenv"));
const ethers_1 = require("ethers");
dotenv.config();
const router = express_1.default.Router();
const { OWNER_PRIVATE_KEY, INFURA_ROPSTEN_SERVER, OWNER_ADDRESS, INFURA_API_KEY } = process.env;
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(INFURA_ROPSTEN_SERVER));
const provider = new ethers_1.ethers.providers.InfuraProvider("ropsten", INFURA_API_KEY);
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
// 신규 지갑 생성 : 니모닉은 지갑을 구분하는 문구임. privatekey만 있으면 account는 가져올 수 있음 ==> 프론트에서 secure storage 저장
//생성시 provider 없음
router.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    try {
        const wallet = ethers_1.Wallet.createRandom();
        wallet.connect(provider).encrypt(password, (progress) => {
            console.log("Encrypting: " + parseInt(progress) * 100 + "% complete");
        }).then((keystore) => {
            const address = web3.eth.accounts.privateKeyToAccount(`${wallet.privateKey}`);
            console.log(`==-=====ADDRESS=====`);
            console.log(address);
            console.log('==================');
            console.log(`==-=====KEYSTORE=====`);
            console.log(keystore);
            console.log('==================');
            const walletMnemonic = wallet.mnemonic; // 있음 
            const uuid = (0, uuid_1.v5)(`${wallet.mnemonic.phrase}`, '1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
            const saving = {
                wallet: wallet,
                keystore: keystore,
                addresses: [address],
                uuid: uuid,
                mnemonic: walletMnemonic.phrase,
            };
            fs_1.default.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving), (err) => console.log(err));
            res.status(200).json({ success: true, message: '지갑 생성 완료', data: { wallet: saving } });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, err: err });
    }
}));
//유저 지갑 계좌 모두 조회
router.get('/accounts', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            const d = JSON.parse(data);
            res.status(200).json({ success: true, message: '주소 리스트 조회 성공', data: d.addresses });
        }));
    }
    catch (err) {
        res.status(500).json({ success: false, message: `주소 리스트 조회 실패:${err}`, data: null });
    }
}));
//랜덤 계좌 추가
router.get('/accounts/add/new', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAccount = web3.eth.accounts.create();
        console.log(newAccount);
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            const d = JSON.parse(data);
            const renewdWallet = Object.assign(Object.assign({}, d), { addresses: [
                    ...d.addresses,
                    newAccount,
                ] });
            fs_1.default.writeFile(`./db/keystores/${req.uuid}.json`, JSON.stringify(renewdWallet), (err) => console.log(err));
            res.status(200).json({ success: true, message: '추가계좌개설 성공', data: { renewdWallet } });
        }));
    }
    catch (err) {
        res.status(500).json({ success: false, message: `추가계좌개설 실패:${err}`, data: null });
    }
}));
// 기존 다른 곳에 보유중인 계좌 추가
router.post('/accounts/add/from', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const privateKey = req.body.privateKey;
    try {
        const newAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log(newAccount);
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            const d = JSON.parse(data);
            const renewdWallet = Object.assign(Object.assign({}, d), { addresses: [
                    ...d.addresses,
                    newAccount,
                ] });
            fs_1.default.writeFile(`./db/keystores/${req.uuid}.json`, JSON.stringify(renewdWallet), (err) => console.log(err));
            res.status(200).json({ success: true, message: '주소 추가 성공', data: { renewdWallet } });
        }));
    }
    catch (err) {
        res.status(500).json({ success: false, message: `주소 추가 실패:${err}`, data: null });
    }
}));
//이더리움 잔액조회
router.get('/balance/:address', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params['address'];
    try {
        const balance = yield provider.getBalance(address);
        console.log(balance);
        res.status(200).json({ success: true, message: `이더리움 잔액조회 성공`, data: { balance: balance } }); //balance 는 bigNumber 이고, bigNumber  는  .toString() 해주어야함.
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `이더리움 잔액조회 실패:${err}`, data: null });
    }
}));
router.post('/decrypt', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.get('UUID');
    const password = req.body.password;
    try {
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            const d = JSON.parse(data);
            res.status(200).json({ success: true, message: '주소 리스트 조회 성공', data: d.addresses });
        }));
    }
    catch (err) {
        res.status(500).json({ success: false, message: `주소 리스트 조회 실패:${err}`, data: null });
    }
}));
router.post('/update', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        }));
    }
    catch (err) {
    }
}));
////==========================보류 ===============================///
//[x]  아직 보류 !!~!// 신규 지갑 생성 : 니모닉은 지갑을 구분하는 문구임. privatekey만 있으면 account는 가져올 수 있음 ==> 프론트에서 secure storage 저장
//생성시 provider 없음
router.post('/create/web3/new', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const password=req.body.password;
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
        //   wallet.add({
        //         privateKey:`${wallet.privateKey}`,
        //         address: `${wallet.address}`,
        //     });
        const keystore = newWallet.encrypt("12345");
        console.log(keystore);
        //  const uuid=v5(`${wallet.mnemonic.phrase}`,'1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
        //  const saving:UserWalletInfoT={
        //      keystore:keystore,
        //      addresses:[
        //          {address:defaultAddress,
        //          privateKey:privateKey,
        //          }
        //      ],
        //      uuid:uuid,
        //      mnemonic:walletMnemonic.phrase,
        //  };
        //fs.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving) ,(err)=> console.log(err));
        res.status(200).json({ success: true, message: '지갑 생성 완료', data: null });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, err: err });
    }
}));
exports.default = router;
//# sourceMappingURL=wallet.js.map