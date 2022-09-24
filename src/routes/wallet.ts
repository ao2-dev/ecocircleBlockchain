import express,{Request, Response, NextFunction, Router}  from 'express';
import Web3 from 'web3';
import lightwallet from 'eth-lightwallet';
import fs from 'fs';
import {v5} from 'uuid';
import * as dotenv from 'dotenv'
import { ethers, Wallet } from 'ethers';
import { Token } from '../contracts';
import { randomBytes } from 'crypto';

interface Web3AddressT{
    index?: number;
    address: string;
    privateKey: string;
    signTransaction: (tx:any)=>void;
    sign: (data:any)=>void;
    encrypt: (password:string)=>void;
}


interface WalletT {
    keystore: string;
    addresses: Web3AddressT[];
    uuid: string;
    mnemonic: string;
}

dotenv.config()

const router: Router = express.Router();

const {OWNER_PRIVATE_KEY,INFURA_ROPSTEN_SERVER,OWNER_ADDRESS,INFURA_API_KEY} = process.env;
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_ROPSTEN_SERVER!));
const provider= new ethers.providers.InfuraProvider("ropsten",
INFURA_API_KEY
);

export const needUserUUID=(req:Request, res:Response, next:NextFunction)=>{
    //header에서 'UUID' 값을 주어야함.
  const uuid=req.get('UUID');
  if(uuid){
    req.uuid=uuid;
    console.log(uuid);
    next();
  }else {
    res.status(400).json({success:false, message: `uuid값 없음` ,  data:null});
  }}


//   export const needWallet=(req:Request, res:Response, next:NextFunction)=>{
//     //header에서 'UUID' 값을 주어야함.
//   const wallet=req.get('WALLET');
//   if(wallet){
//     req.uuid=wallet;
//     console.log(wallet);
//     next();
//   }else {
//     res.status(400).json({success:false, message: `uuid값 없음` ,  data:null});
//   }}


  /**
   * @swagger
   * tags:
   *   name: Wallet
   *   description: 지갑 관련 API
   */


/**
   * @swagger
   * /wallet:
   *   get:
   *     summary: 월렛 정보 조회 [W-1]  [사용 x]
   *     parameters:
   *       - in: header
   *         name: UUID
   *         schema:
   *           type: string
   *         required: true
   *     tags:
   *      - Wallet
   *     description: 월렛 정보 조회 [W-1] [사용 x]
   *     responses:
   *       200:
   *         description: data 는 
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'

   *             
   *         
   */

router.get('/', async(req:Request, res:Response, next:NextFunction)=> {
    
    try {
        fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
            const d: WalletT = JSON.parse(data);
            res.status(200).json({success:true, message:'월렛정보 조회 성공', data:{walletInfo:d}})
    
        });
    }catch(err){
        res.status(500).json({success:false, message:`월렛정보 조회 실패:${err}`, data:null});
    }
});

  // 신규 지갑 생성 : 니모닉은 지갑을 구분하는 문구임. privatekey만 있으면 account는 가져올 수 있음 ==> 프론트에서 secure storage 저장
//생성시 provider 없음
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
router.post('/create', async(req:Request, res:Response, next:NextFunction)=> {
    const password=req.body.password;
    try {
        const wallet=Wallet.createRandom();
          wallet.connect(provider).encrypt(password, (progress:any)=>{
            console.log("Encrypting: " + parseInt(progress)*100 + "% complete");
          }).then((keystore)=>{
            
            const address:Web3AddressT =web3.eth.accounts.privateKeyToAccount(`${wallet.privateKey}`);
         
           console.log(`==-=====ADDRESS=====`)
            console.log(address);
            console.log('==================');
            console.log(`==-=====KEYSTORE=====`)
            console.log(keystore);
            console.log('==================');
       
            const walletMnemonic=wallet.mnemonic; // 있음 

            const uuid=v5(`${wallet.mnemonic.phrase}`,'1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
            const saving:WalletT={
                keystore:keystore,
                addresses:[address],
                uuid:uuid,
                mnemonic:walletMnemonic.phrase,
            };

            fs.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving) ,(err)=> console.log(err));
            res.status(200).json({success:true, message:'지갑 생성 완료', data:saving});
          })
    } catch(err){
        console.log(err);
        res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
    }
});








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
router.get('/accounts', needUserUUID, async(req:Request, res:Response, next:NextFunction)=> {
    try {
        fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
            const d: WalletT = JSON.parse(data);
            res.status(200).json({success:true, message:'주소 리스트 조회 성공', data:d.addresses})
    
        });
    }catch(err){
        res.status(500).json({success:false, message:`주소 리스트 조회 실패:${err}`, data:null});
    }
});


// router.get('/accounts/add/new2',needUserUUID,async(req:Request, res:Response, next:NextFunction)=> {
//     try {
//        const newAccount=web3.eth.accounts.create();
//        console.log(newAccount);
//        fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
//            const d:WalletT = JSON.parse(data);
//            const renewdWallet:WalletT={
//                ...d,
//                addresses:[
//                    ...d.addresses,
//                    newAccount,
//                ]
//            }
//            fs.writeFile(`./db/keystores/${req.uuid}.json`, JSON.stringify(renewdWallet) ,(err)=> console.log(err));
//            res.status(200).json({success:true, message:'추가계좌개설 성공', data:{renewdWallet}})
   
//        });
//     } catch(err){
//         res.status(500).json({success:false, message:`추가계좌개설 실패:${err}`, data:null});
//     }
// });


//uuid 없이 . 계좌개성하기 
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
   *             
   *         
   */
//랜덤 계좌 추가
router.post('/accounts/add/new',async(req:Request, res:Response, next:NextFunction)=> {
    const wallet=req.body.wallet;
    try {
       const newAccount=web3.eth.accounts.create();
       console.log(newAccount);
       const d:WalletT = wallet as WalletT;
       const renewedWallet:WalletT={
        ...d,
        addresses:[
            ...d.addresses,
            newAccount,
        ]
    }
    res.status(200).json({success:true, message:'추가계좌개설 성공', data:renewedWallet})

    } catch(err){
        res.status(500).json({success:false, message:`추가계좌개설 실패:${err}`, data:null});
    }
});


// 기존 다른 곳에 보유중인 계좌 추가
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
   *             
   *         
   */

router.post('/accounts/add/origin',async(req:Request, res:Response, next:NextFunction)=> {
    const wallet=req.body.wallet;
  const privateKey=req.body.privateKey;
    
    try {
        const newAccount:Web3AddressT =web3.eth.accounts.privateKeyToAccount(privateKey);
       console.log(newAccount);
     
       const d:WalletT = wallet as WalletT;
       const renewdWallet:WalletT={
           ...d,
           addresses:[
               ...d.addresses,
               newAccount,
           ]
       }
       res.status(200).json({success:true, message:'주소 추가 성공', data:renewdWallet})
    } catch(err){
        res.status(500).json({success:false, message:`주소 추가 실패:${err}`, data:null});
    }
});


// router.post('/accounts/add/origin2',needUserUUID,async(req:Request, res:Response, next:NextFunction)=> {
//     const privateKey=req.body.privateKey;
      
//       try {
//           const newAccount:Web3AddressT =web3.eth.accounts.privateKeyToAccount(privateKey);
//          console.log(newAccount);
//          fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
//              const d:WalletT = JSON.parse(data);
//              const renewdWallet:WalletT={
//                  ...d,
//                  addresses:[
//                      ...d.addresses,
//                      newAccount,
//                  ]
//              }
//              fs.writeFile(`./db/keystores/${req.uuid}.json`, JSON.stringify(renewdWallet) ,(err)=> console.log(err));
//              res.status(200).json({success:true, message:'주소 추가 성공', data:{renewdWallet}})
     
//          });
//       } catch(err){
//           res.status(500).json({success:false, message:`주소 추가 실패:${err}`, data:null});
//       }
//   });
  
/**
   * @swagger
   * /wallet/balance/{address}:
   *   get:
   *     summary: 이더리움 잔액 조회 [W-6]
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
   *     description: 이더리움 잔액 조회 [W-6]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */
router.get('/balance/:address',async(req:Request, res:Response, next:NextFunction)=>{

    const address=req.params['address'];
        try {
  
            const balance=await provider.getBalance(address);
            console.log(balance);
            res.status(200).json({success:true, message: `이더리움 잔액조회 성공` ,  data:{balance: balance}});   //balance 는 bigNumber 이고, bigNumber  는  .toString() 해주어야함.
          
            }catch(err){
            console.log(err);
            res.status(500).json({success:false, message: `이더리움 잔액조회 실패:${err}` ,  data:null});
            }
  });



router.post('/decrypt',needUserUUID,async(req:Request, res:Response, next:NextFunction)=>{
    const uuid=req.get('UUID');
    const password=req.body.password;

    try {
        fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
            const d:WalletT = JSON.parse(data);
            res.status(200).json({success:true, message:'주소 리스트 조회 성공', data:d.addresses})
    
        });
    }catch(err){
        res.status(500).json({success:false, message:`주소 리스트 조회 실패:${err}`, data:null});
    }
});



router.post('/update',needUserUUID,async(req:Request, res:Response, next:NextFunction)=> {
     try {
        fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{

        });
     }catch(err){

     }
});


////==========================보류 ===============================///
  //[x]  아직 보류 !!~!// 신규 지갑 생성 : 니모닉은 지갑을 구분하는 문구임. privatekey만 있으면 account는 가져올 수 있음 ==> 프론트에서 secure storage 저장
//생성시 provider 없음
router.post('/create/web3/new', async(req:Request, res:Response, next:NextFunction)=> {
    try {

          const newWallet=web3.eth.accounts.wallet.create(1);

         
          const newAddress:Web3AddressT= web3.eth.accounts.create();
          console.log(`==-=====ADDRESS=====`)
           console.log(newAddress);
           console.log('==================')

          newWallet.add({
            privateKey:newAddress.privateKey,
            address:newAddress.address,
          });

          console.log(newWallet);
          console.log(newWallet["0"]);
     
        const keystore=newWallet.encrypt("12345");
        console.log(keystore);
     
            res.status(200).json({success:true, message:'지갑 생성 완료', data:null});
       
    } catch(err){
        console.log(err);
        res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
    }
});

export default router;