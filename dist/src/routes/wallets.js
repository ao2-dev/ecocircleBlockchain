"use strict";
// import express,{Request, Response, NextFunction, Router}  from 'express';
// import Web3 from 'web3';
// import lightwallet from 'eth-lightwallet';
// import fs from 'fs';
// import {v5} from 'uuid';
// import * as dotenv from 'dotenv'
// import { ethers, Wallet } from 'ethers';
// import { Token } from '../contracts';
// import { randomBytes } from 'crypto';
// interface AddressT{
//     address:string;
//     privateKey:string;
// }
// interface UserWalletInfoT {
//     keystore: string;
//     addresses: AddressT[];
//     uuid: string;
//     mnemonic: string;
// }
// dotenv.config()
// const router: Router = express.Router();
// const {OWNER_PRIVATE_KEY,INFURA_ROPSTEN_SERVER,OWNER_ADDRESS,INFURA_API_KEY} = process.env;
// const provider= new ethers.providers.InfuraProvider("ropsten",
// INFURA_API_KEY
// )
// const sc=new ethers.Contract( Token.address, Token.abi , provider);
// const signer = new ethers.Wallet(OWNER_PRIVATE_KEY!, provider);
// export const needUserUUID=(req:Request, res:Response, next:NextFunction)=>{
//     //header에서 'UUID' 값을 주어야함.
//   const uuid=req.get('UUID');
//   if(uuid){
//     req.uuid=uuid;
//     console.log(uuid);
//     next();
//   }else {
//     res.status(400).json({success:false, message: `uuid값 없음` ,  data:null});
//   }}
// // 신규 지갑 생성 : 니모닉은 지갑을 구분하는 문구임. privatekey만 있으면 account는 가져올 수 있음
// //생성시 provider 없음
// router.post('/create/new', async(req:Request, res:Response, next:NextFunction)=> {
//     const password=req.body.password;
//     try{
//        // 월렛 생성
//        const wallet=Wallet.createRandom();
//        //wallet.connect(provider);
//     //    console.log('----path----')
//     //    console.log(wallet.path);
//     wallet.connect(provider).encrypt(password, (progress:any)=>{
//         console.log("Encrypting: " + parseInt(progress)*100 + "% complete");
//        }).then((json)=>{
//         console.log('===wallet===')
//        console.log(wallet);
//        console.log('----address----')
//        const address= wallet.address;
//        console.log(wallet.address);
//        console.log('----privatekey----')
//        const privateKey=wallet.privateKey;
//        console.log(wallet.privateKey);
//        console.log('----provider----')
//        const walletProvider=wallet.provider;
//        console.log(wallet.provider);
//        console.log('----mnemonic----')
//        const mnemonic=wallet.mnemonic; // 있음 
//        console.log(wallet.mnemonic);
// //        ----mnemonic----
// // {
// //   phrase: 'lucky change puppy swallow future shy brother involve lift boost total pole',
// //   path: "m/44'/60'/0'/0/0",
// //   locale: 'en'
// // }
//         console.log(wallet);
//         console.log("=-------privider----");
//         console.log(wallet.provider);
//         console.log(json);
//         console.log("-====---walet provider----")
//         console.log(walletProvider);
//         // const  mnemonic = lightwallet.keystore.generateRandomSeed();
//         const uuid=v5(`${wallet.mnemonic}`,'1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
//         console.log(uuid);
//         const saving:UserWalletInfoT={keystore:json, privateKey:`${wallet.privateKey}`, address:`${wallet.address}`,uuid:uuid, mnemonic: `${wallet.mnemonic}`};
//         fs.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving) ,(err)=> console.log(err));
//         res.status(200).json({success:true, message:'지갑 생성 완료', data:{wallet, json, saving}});
//        })
//       // res.status(200).json({success:true, message:'지갑 생성 완료', data:{wallet,address, privateKey, provider:walletProvider, devProvider:provider, mnemonic }});
//     } catch(err){
//         console.log(err);
//         res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
//     }
// });
// //기존에 account가 있고 아직 wallet 은 없을 때, 기존에 보유한 account 만 있으면 자동 월렛 생성
// //생성시 provider 없이 가고, mnemonic 생성해주어야 함
// router.post('/create/from',  async(req:Request, res:Response, next:NextFunction)=> {
//   const privateKey=req.body.privateKey;
//   const password= req.body.password;
//   try{
// //     const  mnemonic = lightwallet.keystore.generateRandomSeed();
// //    const walletMnemonic = Wallet.fromMnemonic(mnemonic);
// //    const walletPrivateKey=new Wallet(walletMnemonic.privateKey);
//    const wallet= new Wallet(privateKey);
//    console.log('===wallet===')
//    console.log(wallet);
//    console.log('----address----')
//    const address= wallet.address;
//    console.log(wallet.address);
//    console.log('----privatekey----')
//    const walletPrivateKey=wallet.privateKey;
//    console.log(wallet.privateKey);
//    console.log('----provider----')
//    const walletProvider=wallet.provider;
//    console.log(wallet.provider);
//    console.log('----mnemonic----')
//    const mnemonic=wallet.mnemonic;
//    console.log(wallet.mnemonic);
//    wallet.encrypt(password, (progress:any)=>{
//     console.log("Encrypting: " + parseInt(progress)*100 + "% complete");
//    }).then((json)=>{
//     console.log(wallet);
//     console.log(json);
//     console.log("-====---walet provider----")
//     console.log(walletProvider);
//     const  mnemonic = lightwallet.keystore.generateRandomSeed();
//   const uuid=v5(mnemonic,'1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
//     console.log(uuid);
//     const saving:UserWalletInfoT={keystore:json, privateKey:`${wallet.privateKey}`, address:`${wallet.address}`,uuid:uuid, mnemonic: `${wallet.mnemonic}`};
//     fs.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving) ,(err)=> console.log(err));
//     res.status(200).json({success:true, message:'지갑 생성 완료', data:{wallet, json, saving}});
//    })
// } catch(err){
//     console.log(err);
//     res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
// }
// });
// //기존 account가 있고 아직 wallet 은 없을 때, 기존에 보유한 account 만 있으면 자동 월렛 생성
// //생성시 provider 없이 가고, mnemonic 생성해주어야 함
// router.post('/create/mnemonic',  async(req:Request, res:Response, next:NextFunction)=> {
//     const mnemonic=req.body.mnemonic;
//     const password= req.body.password;
//     try{
//   //     const  mnemonic = lightwallet.keystore.generateRandomSeed();
//   //    const walletMnemonic = Wallet.fromMnemonic(mnemonic);
//   //    const walletPrivateKey=new Wallet(walletMnemonic.privateKey);
//      const wallet= Wallet.fromMnemonic(mnemonic);
//      wallet.encrypt(password, (progress:any)=>{
//       console.log("Encrypting: " + parseInt(progress)*100 + "% complete");
//      }).then((json)=>{
//       console.log(wallet);
//       console.log(json);
//       console.log('===wallet===')
//      console.log(wallet);
//      console.log('----addresses----');
//      const addresses=wallet.getAddress();
//      console.log(addresses);
//      console.log('----address----')
//      const address= wallet.address;
//      console.log(wallet.address);
//      console.log('----privatekey----')
//      const walletPrivateKey=wallet.privateKey;
//      console.log(wallet.privateKey);
//      console.log('----provider----')
//      const walletProvider=wallet.provider;
//      console.log(wallet.provider);
//      console.log('----mnemonic----')
//      const walletMnemonic=wallet.mnemonic;
//      console.log(wallet.mnemonic);
//     //   console.log(uuid);
//     //   const saving:UserWalletInfoT={keystore:json, privateKey:`${wallet.privateKey}`, address:`${wallet.address}`,uuid:uuid, mnemonic: `${wallet.mnemonic}`};
//     //   fs.writeFile(`./db/keystores/${uuid}.json`, JSON.stringify(saving) ,(err)=> console.log(err));
//       res.status(200).json({success:true, message:'지갑 생성 완료', data:{wallet, json,addresses,walletPrivateKey, walletProvider,walletMnemonic}});
//      })
//   } catch(err){
//       console.log(err);
//       res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
//   }
//   });
// router.post('/accounts/add',needUserUUID, async(req:Request, res:Response, next:NextFunction)=> {
//     const password=req.body.password;
//     try {
//         fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
//             const d:UserWalletInfoT = JSON.parse(data);
//            await Wallet.fromEncryptedJson(d.keystore, password).then((wallet)=> {
//             const walletMnemonic=Wallet.fromMnemonic(wallet.mnemonic.phrase);
//                 const walletPrivateKey =new Wallet(walletMnemonic.privateKey);
//                  const addresses=walletMnemonic.getAddress();
//                  console.log(addresses);
//                 res.status(200).json({success:true, message:'지갑 정보 얻기 완료', data:{addresses}});
//             })
//           })
//     }catch(err){
//     }
// });
// router.post('/decrypted',needUserUUID,async(req:Request, res:Response, next:NextFunction)=>{
//     const password=req.body.password;
//     try {
//         fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
//             const d:UserWalletInfoT = JSON.parse(data);
//            await Wallet.fromEncryptedJson(d.keystore, password).then((wallet)=> {
//                 console.log('===wallet===')
//                 console.log(wallet);
//                 console.log('----address----')
//                 const address= wallet.address;
//                 console.log(wallet.address);
//                 console.log('----privatekey----')
//                 const walletPrivateKey=wallet.privateKey;
//                 console.log(wallet.privateKey);
//                 console.log('----provider----')
//                 const walletProvider=wallet.provider;
//                 console.log(wallet.provider);
//                 console.log('----mnemonic----')
//                 let mnemonic;
//                 if(wallet.mnemonic===null){
//                     mnemonic=d.mnemonic;
//                 }else {
//                     mnemonic=wallet.mnemonic;
//                 }
//                 console.log(mnemonic);
//                 res.status(200).json({success:true, message:'지갑 정보 얻기 완료', data:{wallet, address, walletPrivateKey, walletProvider, mnemonic}});
//             })
//           })
//     }catch(err){
//     }
// } )
// // // 처음으로 지갑 생성 : 니모닉 + 
// // router.get('/create', async(req:Request, res:Response, next:NextFunction)=> {
// //     const password=req.body.password;
// //     try{
// //         //니모닉 생성
// //         const  mnemonic = lightwallet.keystore.generateRandomSeed();
// //         //uuid 생성
// //         const uuid=v5(mnemonic,'1a30bae5-e589-47b1-9e77-a7da2cdbc2b8');
// //       //니모닉 으로부터 지갑 생성 , 이때 address 랜덤 생성됨
// //         const path = "m/44'/60'/1'/0/0";
// //        const wallet= Wallet.fromMnemonic(mnemonic);
// //        console.log(wallet.privateKey);
// //        res.status(200).json({success:true, message:'지갑 생성 완료', data:wallet});
// //     } catch(err){
// //         console.log(err);
// //         res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
// //     }
// // });
// // 프라이빗 키로 가져와서 월렛 생성
// router.get('/create/privatekey', async(req:Request, res:Response, next:NextFunction)=> {
//     try{
//         const privateKey="27f886d160e9c58c73edeb6da00fbf1a2e7073a2f353e6d04241231fc9c15dde"
//        const wallet= new Wallet(privateKey,provider);
//        const encryptPromise=wallet.encrypt("12345", (progress:any)=>{
//         console.log("Encrypting: " + parseInt(progress)*100 + "% complete");
//        }).then((json)=>{
//         console.log(wallet);
//         console.log(json);
//         res.status(200).json({success:true, message:'지갑 생성 완료', data:{wallet, json}});
//        })
//     } catch(err){
//         console.log(err);
//         res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
//     }
// });
// // 니모닉으로 월렛 생성
// router.get('/create/mnemonic', async(req:Request, res:Response, next:NextFunction)=> {
//     try{
//         const mnemonic="wealth steak high hunt mad family coil result book tuition erosion mountain"
//         const path = "m/44'/60'/1'/0/0";
//        const wallet= ethers.Wallet.fromMnemonic(mnemonic,path);
//        console.log(wallet.privateKey);
//        res.status(200).json({success:true, message:'지갑 생성 완료', data:wallet});
//     } catch(err){
//         console.log(err);
//         res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
//     }
// });
// // router.get('/encrypt', async(req:Request, res:Response, next:NextFunction)=> {
// //     try{
// //        const encryptPromise= ether
// //        res.status(200).json({success:true, message:'지갑 생성 완료', data:wallet});
// //     } catch(err){
// //         console.log(err);
// //         res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, err:err})
// //     }
// // });
// export default router;
//# sourceMappingURL=wallets.js.map