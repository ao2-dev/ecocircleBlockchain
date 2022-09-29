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
const eth_lightwallet_1 = __importDefault(require("eth-lightwallet"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const dotenv = __importStar(require("dotenv"));
const ethers_1 = require("ethers");
const contracts_1 = require("../contracts");
dotenv.config();
const router = express_1.default.Router();
const { OWNER_PRIVATE_KEY, INFURA_ROPSTEN_SERVER, OWNER, INFURA_API_KEY } = process.env;
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(INFURA_ROPSTEN_SERVER));
const provider = new ethers_1.ethers.providers.InfuraProvider("ropsten", INFURA_API_KEY);
const sc = new ethers_1.ethers.Contract(contracts_1.Token.address, contracts_1.Token.abi, provider);
const signer = new ethers_1.ethers.Wallet(OWNER_PRIVATE_KEY, provider);
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
// 신규 지갑 생성 : 니모닉은 지갑을 구분하는 문구임. privatekey만 있으면 account는 가져올 수 있음
//생성시 provider 없음
router.post('/create/new', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    try {
        const wallet = web3.eth.accounts.wallet.create(1);
        wallet.save(password);
        console.log(wallet);
        res.status(200).json({ success: true, message: '지갑 생성 완료', data: { wallet: wallet } });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑  생성 실패:${err}`, err: err });
    }
}));
router.get('/accounts/add', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const password=req.body.password;
    try {
        const result = web3.eth.accounts.wallet.add('0x9b0664be44c5c7be113ad1b699abbee84cf83dcfc60028b2d27074752c17b83f');
        console.log(result);
        const wallet = web3.eth.accounts.wallet;
        console.log("======wallet======");
        console.log(wallet);
        res.status(200).json({ success: true, message: '지갑 추가 완료', data: { wallet: result } });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 추가 실패:${err}`, err: err });
    }
}));
//기존에 account가 있고 아직 wallet 은 없을 때, 기존에 보유한 account 만 있으면 자동 월렛 생성
//생성시 provider 없이 가고, mnemonic 생성해주어야 함
router.post('/create/from', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const privateKey = req.body.privateKey;
    const password = req.body.password;
    try {
        //     const  mnemonic = lightwallet.keystore.generateRandomSeed();
        //    const walletMnemonic = Wallet.fromMnemonic(mnemonic);
        //    const walletPrivateKey=new Wallet(walletMnemonic.privateKey);
        const wallet = new ethers_1.Wallet(privateKey);
        console.log('===wallet===');
        console.log(wallet);
        console.log('----address----');
        const address = wallet.address;
        console.log(wallet.address);
        console.log('----privatekey----');
        const walletPrivateKey = wallet.privateKey;
        console.log(wallet.privateKey);
        console.log('----provider----');
        const walletProvider = wallet.provider;
        console.log(wallet.provider);
        console.log('----mnemonic----');
        const mnemonic = wallet.mnemonic;
        console.log(wallet.mnemonic);
        wallet.encrypt(password, (progress) => {
            console.log("Encrypting: " + parseInt(progress) * 100 + "% complete");
        }).then((json) => {
            console.log(wallet);
            console.log(json);
            console.log("-====---walet provider----");
            console.log(walletProvider);
            const mnemonic = eth_lightwallet_1.default.keystore.generateRandomSeed();
            const uuid = (0, uuid_1.v5)(mnemonic, '1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
            console.log(uuid);
            const saving = { keystore: json, privateKey: `${wallet.privateKey}`, address: `${wallet.address}`, uuid: uuid, mnemonic: `${wallet.mnemonic}` };
            fs_1.default.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving), (err) => console.log(err));
            res.status(200).json({ success: true, message: '지갑 생성 완료', data: { wallet, json, saving } });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, err: err });
    }
}));
router.post('/decrypted', exports.needUserUUID, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    try {
        fs_1.default.readFile(`./db/keystores/${req.uuid}.json`, 'utf8', (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            const d = JSON.parse(data);
            yield ethers_1.Wallet.fromEncryptedJson(d.keystore, password).then((wallet) => {
                console.log('===wallet===');
                console.log(wallet);
                console.log('----address----');
                const address = wallet.address;
                console.log(wallet.address);
                console.log('----privatekey----');
                const walletPrivateKey = wallet.privateKey;
                console.log(wallet.privateKey);
                console.log('----provider----');
                const walletProvider = wallet.provider;
                console.log(wallet.provider);
                console.log('----mnemonic----');
                let mnemonic;
                if (wallet.mnemonic === null) {
                    mnemonic = d.mnemonic;
                }
                else {
                    mnemonic = wallet.mnemonic;
                }
                console.log(mnemonic);
                res.status(200).json({ success: true, message: '지갑 정보 얻기 완료', data: { wallet, address, walletPrivateKey, walletProvider, mnemonic } });
            });
        }));
    }
    catch (err) {
    }
}));
// // 처음으로 지갑 생성 : 니모닉 + 
// router.get('/create', async(req:Request, res:Response, next:NextFunction)=> {
//     const password=req.body.password;
//     try{
//         //니모닉 생성
//         const  mnemonic = lightwallet.keystore.generateRandomSeed();
//         //uuid 생성
//         const uuid=v5(mnemonic,'1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
//       //니모닉 으로부터 지갑 생성 , 이때 address 랜덤 생성됨
//         const path = "m/44'/60'/1'/0/0";
//        const wallet= Wallet.fromMnemonic(mnemonic);
//        console.log(wallet.privateKey);
//        res.status(200).json({success:true, message:'지갑 생성 완료', data:wallet});
//     } catch(err){
//         console.log(err);
//         res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
//     }
// });
// 프라이빗 키로 가져와서 월렛 생성
router.get('/create/privatekey', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privateKey = "27f886d160e9c58c73edeb6da00fbf1a2e7073a2f353e6d04241231fc9c15dde";
        const wallet = new ethers_1.Wallet(privateKey, provider);
        const encryptPromise = wallet.encrypt("12345", (progress) => {
            console.log("Encrypting: " + parseInt(progress) * 100 + "% complete");
        }).then((json) => {
            console.log(wallet);
            console.log(json);
            res.status(200).json({ success: true, message: '지갑 생성 완료', data: { wallet, json } });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, err: err });
    }
}));
// 니모닉으로 월렛 생성
router.get('/create/mnemonic', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mnemonic = "wealth steak high hunt mad family coil result book tuition erosion mountain";
        const path = "m/44'/60'/1'/0/0";
        const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic, path);
        console.log(wallet.privateKey);
        res.status(200).json({ success: true, message: '지갑 생성 완료', data: wallet });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, err: err });
    }
}));
// router.get('/encrypt', async(req:Request, res:Response, next:NextFunction)=> {
//     try{
//        const encryptPromise= ether
//        res.status(200).json({success:true, message:'지갑 생성 완료', data:wallet});
//     } catch(err){
//         console.log(err);
//         res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
//     }
// });
exports.default = router;
//# sourceMappingURL=wallet1.js.map