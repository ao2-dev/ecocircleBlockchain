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
    wallet: object;
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

  // 신규 지갑 생성 : 니모닉은 지갑을 구분하는 문구임. privatekey만 있으면 account는 가져올 수 있음 ==> 프론트에서 secure storage 저장
//생성시 provider 없음
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
                wallet:wallet,
                keystore:keystore,
                addresses:[address],
                uuid:uuid,
                mnemonic:walletMnemonic.phrase,
            };

            fs.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving) ,(err)=> console.log(err));
            res.status(200).json({success:true, message:'지갑 생성 완료', data:{wallet:saving}});
          })
    } catch(err){
        console.log(err);
        res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
    }
});








//유저 지갑 계좌 모두 조회
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


//랜덤 계좌 추가
router.get('/accounts/add/new',needUserUUID,async(req:Request, res:Response, next:NextFunction)=> {
    try {
       const newAccount=web3.eth.accounts.create();
       console.log(newAccount);
       fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
           const d:WalletT = JSON.parse(data);
           const renewdWallet:WalletT={
               ...d,
               addresses:[
                   ...d.addresses,
                   newAccount,
               ]
           }
           fs.writeFile(`./db/keystores/${req.uuid}.json`, JSON.stringify(renewdWallet) ,(err)=> console.log(err));
           res.status(200).json({success:true, message:'추가계좌개설 성공', data:{renewdWallet}})
   
       });
    } catch(err){
        res.status(500).json({success:false, message:`추가계좌개설 실패:${err}`, data:null});
    }
});


// 기존 다른 곳에 보유중인 계좌 추가
router.post('/accounts/add/from',needUserUUID,async(req:Request, res:Response, next:NextFunction)=> {
  const privateKey=req.body.privateKey;
    
    try {
        const newAccount:Web3AddressT =web3.eth.accounts.privateKeyToAccount(privateKey);
       console.log(newAccount);
       fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
           const d:WalletT = JSON.parse(data);
           const renewdWallet:WalletT={
               ...d,
               addresses:[
                   ...d.addresses,
                   newAccount,
               ]
           }
           fs.writeFile(`./db/keystores/${req.uuid}.json`, JSON.stringify(renewdWallet) ,(err)=> console.log(err));
           res.status(200).json({success:true, message:'주소 추가 성공', data:{renewdWallet}})
   
       });
    } catch(err){
        res.status(500).json({success:false, message:`주소 추가 실패:${err}`, data:null});
    }
});


//이더리움 잔액조회
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