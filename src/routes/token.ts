import express,{Request, Response, NextFunction, Router}  from 'express';
import { Token } from '../contracts';
import * as dotenv from 'dotenv'
import {ethers, utils } from 'ethers';
import { hexZeroPad } from 'ethers/lib/utils';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { OWNER, provider, tokenSC, tokenSCSigned, tokenSCWeb3 } from '.';
import { TxReceiptT,} from '../models';
dotenv.config()

interface EventT<T>{
  blockNumber:number;
  blockHash:string;
  transactionHash:string;
  idx:number;
  args: T;
}
interface TransferArgsT {
  from:string;
  to:String;
  amount:number;
};


const router: Router = express.Router();

//middleware
const onlyOwner=(req:Request, res:Response, next:NextFunction)=>{
  const owner=req.get('OWNER');
  if(owner){
    if(owner===OWNER){
      req.owner=owner;
      console.log(owner);
      next();
    }else {
      res.status(400).json({success:false, message: `불일치` ,  data:null});
    }
 
  }else {
    res.status(400).json({success:false, message: `owner 값 없음` ,  data:null});
  }
}


/**
   * @swagger
   * tags:
   *   name: Token
   *   description: 토큰 관련 API
   */
/**
   * @swagger
   * /token:
   *   get:
   *     summary: 토큰 이름, 심볼 조회 [T-1]
   *     tags:
   *      - Token
   *     description: 토큰 이름, 심볼 조회 [T-1]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     name: 
   *                       type: string
   *                     symbol:
   *                       type: integer
   *                   example:
   *                     name: ecocircle
   *                     symbol: ECC
   *             
   *         
   */
router.get('/', async (req:Request, res:Response, next:NextFunction)=>{
  try {
    const tokenName=await tokenSC.name();
    const symbol=await tokenSC.symbol();
    res.status(200).json({success:true, message:'토큰정보조회 성공', data:{
      name:tokenName,
      symbol:symbol,
    }});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰정보조회 실패:${err}`, data:null});
  }
});




/**
   * @swagger
   * /token/owner:
   *   get:
   *     summary: 토큰 컨트랙트 배포 계정주소(owner) 조회 [T-2]
   *     tags:
   *      - Token
   *     description: 토큰 컨트랙트 배포 계정주소(owner) 조회 [T-2]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: string 
   *                   example: 0x...
   * 
   *             
   *         
   */
router.get('/owner', onlyOwner,async (req:Request, res:Response, next:NextFunction)=>{
  try {
    const owner=await tokenSC.owner();
    res.status(200).json({success:true, message:'토큰 owner주소 조회 성공', data: owner});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 owner주소 조회 실패:${err}`, data:null});
  }
});


/**
   * @swagger
   * /token/owner/change:
   *   post:
   *     summary: 토큰 컨트랙트 owner변경 [T-3]
   *     requestBody:
   *       description: 변경될 Owner계정을 보내주세요
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               newOwner:
   *                 type: string
   *         
   *     tags:
   *      - Token
   *     description: 토큰 컨트랙트 owner변경 [T-3]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */

router.post('/owner/change',onlyOwner, async (req:Request, res:Response, next:NextFunction)=>{
  const newOwner=req.body.newOwner;
  try {
    const tx=await tokenSCSigned.transferOwnership(newOwner);
    console.log(`owner change in hash: ${tx.hash}`);
   res.status(200).json({success:true, message:'owner 변경 성공', data:{
   txHash: tx.hash
   }});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`owner 변경 실패:${err}`, data:null});
  }
})



//추가발행

/**
   * @swagger
   * /token/mint:
   *   post:
   *     summary: 토큰 추가 발행 [T-4]
   *     parameters:
   *       - in: header
   *         name: OWNER
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *     requestBody:
   *       description: 추가할 양을 보내주세요
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               amount:
   *                 type: integer
   *     tags:
   *      - Token
   *     description: 토큰 추가 발행 [T-4]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *             
   *         
   */
router.post('/mint',onlyOwner,async(req:Request, res:Response, next:NextFunction)=>{
  const amount=req.body.amount;
  try {
    const tx=await tokenSCSigned.mint(parseInt(amount))
     console.log(`Mined in hash: ${tx.hash}`);
    res.status(200).json({success:true, message:'토큰 추가 발행 성공', data:null});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 추가 발행 실패:${err}`, data:null});
  }
});

// // 토큰소각
// /**
//    * @swagger
//    * /token/owner/burn:
//    *   post:   
//    *     summary: 토큰 소각 [T-5-1]
//    *     parameters:
//    *       - in: header
//    *         name: OWNER
//    *         schema:
//    *           type: string
//    *           foramt: 0x..
//    *         required: true
//    *     requestBody:
//    *       description: 소각 할 양을 보내주세요
//    *       required: true
//    *       content:
//    *         application/json:
//    *           schema:
//    *             type: object
//    *             properties:
//    *               amount:
//    *                 type: integer     
//    *     tags:
//    *      - Token
//    *     description: 토큰 소각 [T-5-1]
//    *     responses:
//    *       200:
//    *         content:
//    *           application/json:
//    *             schema:
//    *               $ref: '#/components/schemas/ResponseT'
//    *             
//    *         
//    */
// router.post('/owner/burn',onlyOwner,async(req:Request, res:Response, next:NextFunction)=>{
//   const amount=req.body.amount;
//   try {
//     const tx=await tokenSCSigned.burnFromOwner(parseInt(amount))
//      console.log(`Burn from owner in hash: ${tx.hash}`);
//     res.status(200).json({success:true, message:'토큰 소각 성공', data:{txHash:tx.hash}});
//   }catch(err){
//     console.log(err);
//     res.status(500).json({success:false, message:`토큰 소각 실패:${err}`, data:null});
//   }
// });


// 토큰소각
/**
   * @swagger
   * /token/burn:
   *   post:   
   *     summary: 토큰 소각 [T-5]
   *     parameters:
   *     requestBody:
   *       description: address는 소각하려고자 하는 주소, amount는 소각 할 양
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               address:
   *                 type: string
   *               amount:
   *                 type: integer     
   *     tags:
   *      - Token
   *     description: 토큰 소각 [T-5]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */
router.post('/burn', async(req:Request, res:Response, next:NextFunction)=>{
    // const pv=req.body.privateKey;
    const address= req.body.address;
    const amount = req.body.amount;

    try {
      // const signer= new ethers.Wallet(pv, provider);
      // const signed=tokenSC.connect(signer);
      const tx=await tokenSCSigned.burn(address,parseInt(amount));
      console.log(`Burn in hash ${tx.hash} `);
      res.status(200).json({success:true, message:'토큰 소각 성공', data:{txHash:tx.hash}});

    }catch(err){
      console.log(err);
      res.status(500).json({success:false, message:`토큰 소각 실패:${err}`, data:null});
    }

});

//토탈발행량 조회
/**
   * @swagger
   * /token/totalsupply:
   *   get:
   *     summary: 토큰 현재까지의 총 공급량 조회 [T-6]
   *     parameters:
   *       - in: header
   *         name: OWNER
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *     tags:
   *      - Token
   *     description: 토큰 현재까지의 총 공급량 조회 [T-6]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: string 
   *                   example: 10000000
   *             
   *         
   */
router.get('/totalsupply',onlyOwner, async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const totalSupply=await tokenSCSigned.totalSupply();
    if(totalSupply){
      console.log(totalSupply);
      console.log(totalSupply["type"])
      res.status(200).json({success:true, message:'토큰 총공급량 조회 성공', data: `${totalSupply}`});
    }
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 총공급량 조회 실패:${err}`, data:null});
  }
});



//토큰 밸런스 조회
/**
   * @swagger
   * /token/balance/{address}:
   *   get:
   *     summary: 토큰 잔액(밸런스)조회 [T-7]
   *     parameters:
   *       - in: path
   *         name: address
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: 잔액 조회하고자 하는 주소
   *     tags:
   *      - Token
   *     description: 토큰 잔액(밸런스)조회 [T-7]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: string
   *             
   *         
   */
router.get('/balance/:address', async(req:Request, res:Response, next:NextFunction)=>{
  const address=req.params['address'];
  try {
    const balance=await tokenSCSigned.balanceOf(address);
      res.status(200).json({success:true, message:'토큰 밸런스(잔액) 조회 성공', data: `${balance}`});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 밸런스(잔액) 조회 실패:${err}`, data:null});
  }
});


//owner로 부터 토큰 전송
/**
   * @swagger
   * /token/transfer/owner:
   *   post:   
   *     summary: owner로부터 토큰 전송 [T-8]
   *     parameters:
   *       - in: header
   *         name: OWNER
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *     requestBody:
   *       description: 토큰을 보낼 주소와 토큰 양을 보내주세요.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               to:
   *                 type: string
   *                 description: 토큰을 보낼 주소
   *               amount:
   *                 type: integer     
   *                 description: 토큰 양
   *     tags:
   *      - Token
   *     description: owner로부터 토큰 전송 [T-8]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     to: 
   *                       type: string
   *                     amount:
   *                       type: integer
   *                   example:
   *                     to: 0x...
   *                     amount: 30000
   *             
   *         
   */
router.post('/transfer/owner',onlyOwner,async(req:Request, res:Response, next:NextFunction)=>{

 const to=req.body.to; 
  const amount=req.body.amount;
  try{

      const tx=await tokenSCSigned.transfer(to, amount);
      console.log(`====txHash: ${tx.hash}`);
       await tx.wait().then( (result:object) =>{
            
            const receipt:TxReceiptT = result as TxReceiptT;
            console.log(`GAS USED:!!! +==>>>  ${receipt.gasUsed}`)
        res.status(200).json({success:true, message:'owner 토큰 전송 성공', data:{from:OWNER,
          to: to, amount:amount, txHash:tx.hash, receipt:receipt,
          }});

       })

  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`owner 토큰 전송 실패:${err}`, data:null});
  }
});

//일반 토큰전송 (비공개키 필요: wallet에서 가져온 후 호출하기)
/**
   * @swagger
   * /token/transfer:
   *   post:   
   *     summary: 일반 토큰 전송 [T-9]
   *     requestBody:
   *       description: 토큰을 보낼 주소와 토큰 양을 보내주세요.
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
   *                 description: 토큰을 보낼 주소
   *               amount:
   *                 type: integer     
   *                 description: 토큰 양
   *     tags:
   *      - Token
   *     description: 일반 토큰 전송 [T-9]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     to: 
   *                       type: string
   *                     amount:
   *                       type: integer
   *                   example:
   *                     to: 0x...
   *                     amount: 30000
   *             
   *         
   */
router.post('/transfer',async(req:Request, res:Response, next:NextFunction)=>{
  const privateKey=req.body.privateKey;
  const to=req.body.to; 
  const amount=req.body.amount;

  // const signer = new ethers.Wallet(OWNER_PRIVATE_KEY!, provider);
  // const tokenSCSigned=tokenSC.connect(signer);
  try{
      const fromSigner = new ethers.Wallet(privateKey, provider);
      const contract=tokenSC.connect(fromSigner);
      const tx=await contract.transfer(to, amount);
      await tx.wait().then((result:object)=>{

        const receipt:TxReceiptT = result as TxReceiptT;
        console.log(`GAS USED:!!! +==>>>  ${receipt.gasUsed}`)
        // console.log(receipt);
        res.status(200).json({success:true, message:'owner 토큰 전송 성공', data:{from:fromSigner.address,
          to: to, amount:amount, txHash:tx.hash, receipt:receipt
          }});
  
       })

  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 전송 실패:${err}`, data:null});
  }
});




//일반 토큰전송  (비공개키 필요: wallet에서 가져온 후 호출하기)
/**
   * @swagger
   * /token/gas/transfer:
   *   post:   
   *     summary: 일반 토큰 전송 예상 가스비 조회[T-9-1]
   *     requestBody:
   *       description: 토큰을 보낼 주소와 토큰 양을 보내주세요.
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
   *                 description: 토큰을 보낼 주소
   *               amount:
   *                 type: integer     
   *                 description: 토큰 양
   *     tags:
   *      - Token
   *     description: 일반 토큰 전송 예상 가스비 조회[T-9-1]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     wei: 
   *                       description: wei단위의 가스비 산출
   *                       type: string
   *                     ehter:
   *                       description: ether 단위의 가스비 산출
   *                       type: string
   *                   example:
   *                     wei: 54242
   *                     ether: 0.000000000000054242
   *             
   *         
   */
router.post('/gas/transfer',async(req:Request, res:Response, next:NextFunction)=>{
  const privateKey= req.body.privateKey;
  //const from = req.body.from; //보내는 주소
  const to=req.body.to; 
  const amount=req.body.amount;

  try{
      //const fromSigner = new ethers.Wallet(privateKey, provider);
      //const contract=tokenSCWeb3.methods.

      const fromSigner = new ethers.Wallet(privateKey, provider);
      const contract=tokenSC.connect(fromSigner);
     const gas= await contract.estimateGas.transfer(to, amount);
     console.log(`wei::${gas}`);
     const parsedGas= parseInt(`${gas}`) * 0.000000001;

      // await tokenSCWeb3.methods.transfer(to, amount).estimateGas({from:from}).then((gas:any)=>{
      //   console.log(`${gas}`);
      // const parsedGas=utils.formatEther(gas);
      // console.log("============PArsedGAs========")
      // console.log(parsedGas);
        res.status(200).json({success:false, message:'토큰 전송 성공', data:{gwei: `${gas}`, ether:parsedGas}});
      // })
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 전송 실패:${err}`, data:null});
  }
});



/**
   * @swagger
   * /token/event/transfer/{address}:
   *   get:   
   *     summary: 송금 이벤트(로그)리스트 조회 [T-9-2]
   *     parameters:
   *       - in: path
   *         name: address
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: 주소(0x..)
   *     tags:
   *      - Token
   *     description: 송금 이벤트(로그)리스트 조회 [T-9-2]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/EventT'
   *             
   *         
   */
router.get('/event/transfer/:address', async(req:Request, res:Response, next:NextFunction)=>{
const address=req.params['address'];

    try {
     const fromFilter = tokenSC.filters.Transfer(address);
      const toFilter=tokenSC.filters.Transfer(null, address);
 
     const fromEvents:ethers.Event[]=await tokenSC.queryFilter(fromFilter);
     const toEvents: ethers.Event[]=await tokenSC.queryFilter(toFilter);

    const allEvents=fromEvents.concat(toEvents);

     let eventList:EventT<TransferArgsT>[]=[];
         allEvents.map((event,idx)=>{
       if(event.args!==undefined){
   
        const item:EventT<TransferArgsT>= {
          blockNumber: event.blockNumber,
          blockHash:event.blockHash,
          transactionHash: event.transactionHash,
          idx: idx,
          args: {
          from: event.args[0],
          to: event.args[1],
          amount: parseInt(`${event.args[2]}`),
          }
      }
      eventList.push(item);
       } 
      });

      console.log(eventList);
      res.status(200).json({success:true, message:`송금 내역 가져오기 성공`, 
      data:eventList.sort((a,b)=>{
        return a.blockNumber-b.blockNumber
      })
    });
    } catch(err){
      console.log(err);
      res.status(500).json({success:false, message:`송금 내역 가져오기 실패:${err}`, data:null});
    }
});



// router.get('/event/mint', async(req:Request, res:Response, next:NextFunction)=>{
  
//       try {
//        const filter = tokenSC.filters.MintOrBurn(OWNER);
//        const events:ethers.Event[]=await tokenSC.queryFilter(filter);


  
//        let eventList:EventT<TransferArgsT>[]=[];
//            allEvents.map((event,idx)=>{
//          if(event.args!==undefined){
     
//           const item:EventT<TransferArgsT>= {
//             blockNumber: event.blockNumber,
//             blockHash:event.blockHash,
//             transactionHash: event.transactionHash,
//             idx: idx,
//             args: {
//             from: event.args[0],
//             to: event.args[1],
//             amount: parseInt(`${event.args[2]}`),
//             }
//         }
//         eventList.push(item);
//          } 
//         });
  
//         console.log(eventList);
//         res.status(200).json({success:false, message:`송금 내역 가져오기 성공`, 
//         data:eventList.sort((a,b)=>{
//           return a.blockNumber-b.blockNumber
//         })
//       });
//       } catch(err){
//         console.log(err);
//         res.status(500).json({success:false, message:`송금 내역 가져오기 실패:${err}`, data:null});
//       }
//   });
//////=====================  사용 x ==========
//msgSender 조회 (테스트용)
router.get('/sender', async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const msgSender=await tokenSCSigned.test()
    res.status(200).json({success:true, message:'msgSender 조회 성공', data:{
      msgSender
    }});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`msgSender 조회 실패:${err}`, data:null});
  }
});


router.get('/sender2', async(req:Request, res:Response, next:NextFunction)=>{
  const privateKey=req.body.privatekey;
  try {
    const fromSigner = new ethers.Wallet(privateKey, provider);
    const contract=tokenSC.connect(fromSigner);
    const msgSender=await contract.test();
 
    res.status(200).json({success:true, message:'msgSender 조회 성공', data:{
      msgSender
    }});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`msgSender 조회 실패:${err}`, data:null});
  }
});


const getBlockTimestamp=async(blockNumber:number)=>{
      const block=await provider.getBlock(blockNumber);
      return block.timestamp;
}

export default router;