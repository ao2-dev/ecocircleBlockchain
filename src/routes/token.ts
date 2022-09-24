import express,{Request, Response, NextFunction, Router}  from 'express';
import { Token } from '../contracts';
import * as dotenv from 'dotenv'
import {ethers } from 'ethers';
dotenv.config()


const router: Router = express.Router();
const {OWNER_PRIVATE_KEY,OWNER_ADDRESS,INFURA_API_KEY} = process.env;
//const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_GORLI_SERVER!));
// const signer = web3.eth.accounts.privateKeyToAccount(
// OWNER_PRIVATE_KEY!
// );
//token contract 
//const sc=new web3.eth.Contract(Token.abi as AbiItem[] , Token.address);
const provider= new ethers.providers.InfuraProvider("ropsten",
INFURA_API_KEY
)
const sc=new ethers.Contract( Token.address, Token.abi , provider);
const signer = new ethers.Wallet(OWNER_PRIVATE_KEY!, provider);
const scWithSigner=sc.connect(signer);

//middleware
const onlyOwner=(req:Request, res:Response, next:NextFunction)=>{
  const owner=req.get('OWNER');
  if(owner){
    if(owner===OWNER_ADDRESS){
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
   *     summary: 토큰 이름, 심볼 조회
   *     tags:
   *      - Token
   *     description: 토큰 이름, 심볼 조회
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *           text/plain:
   *             schema:
   *               type: string
   *             
   *         
   */
router.get('/', async (req:Request, res:Response, next:NextFunction)=>{
  try {
    const tokenName=await sc.name();
    const symbol=await sc.symbol();
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
   *     summary: 토큰 컨트랙트 배포 계정주소(owner) 조회
   *     tags:
   *      - Token
   *     description: 토큰 컨트랙트 배포 계정주소(owner) 조회
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */
router.get('/owner', onlyOwner,async (req:Request, res:Response, next:NextFunction)=>{
  try {
    const owner=await sc.owner();
    res.status(200).json({success:true, message:'토큰 owner주소 조회 성공', data:{
    owner:owner
    }});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 owner주소 조회 실패:${err}`, data:null});
  }
});


/**
   * @swagger
   * /token/owner/change:
   *   post:
   *     summary: 토큰 컨트랙트 owner변경
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
   *     description: 토큰 컨트랙트 owner변경
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
    const tx=await scWithSigner.transferOwnership(newOwner);
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
   *     summary: 토큰 추가 발행
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
   *     description: 토큰 추가 발행
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *           text/plain:
   *             schema:
   *               type: string
   *             
   *             
   *         
   */
router.post('/mint',onlyOwner,async(req:Request, res:Response, next:NextFunction)=>{
  const amount=req.body.amount;
  try {
    const tx=await scWithSigner.mint(parseInt(amount))
     console.log(`Mined in hash: ${tx.hash}`);
    res.status(200).json({success:true, message:'토큰 추가 발행 성공', data:{
    amount
    }});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 추가 발행 실패:${err}`, data:null});
  }
});

// 토큰소각
/**
   * @swagger
   * /token/burn:
   *   post:   
   *     summary: 토큰 소각
   *     parameters:
   *       - in: header
   *         name: OWNER
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *     requestBody:
   *       description: 소각 할 양을 보내주세요
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
   *     description: 토큰 소각
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *           text/plain:
   *             schema:
   *               type: string
   *             
   *         
   */
router.post('/burn',onlyOwner,async(req:Request, res:Response, next:NextFunction)=>{
  const amount=req.body.amount;
  try {
    const tx=await scWithSigner.burn(parseInt(amount))
     console.log(`Burn in hash: ${tx.hash}`);
    res.status(200).json({success:true, message:'토큰 소각 성공', data:{
    amount
    }});
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
   *     summary: 토큰 현재까지의 총 발행량 조회
   *     parameters:
   *       - in: header
   *         name: OWNER
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *     tags:
   *      - Token
   *     description: 토큰 현재까지의 총 발행량 조회
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */
router.get('/totalsupply',onlyOwner, async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const totalSupply=await scWithSigner.totalSupply();
    if(totalSupply){
      console.log(totalSupply);
      console.log(totalSupply["type"])
      res.status(200).json({success:true, message:'토큰 총발행량 조회 성공', data: `${totalSupply}`});
    }
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 총발행량 조회 실패:${err}`, data:null});
  }
});



//토큰 밸런스 조회
/**
   * @swagger
   * /token/balance/{address}:
   *   get:
   *     summary: 토큰 잔액(밸런스)조회
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
   *     description: 토큰 잔액(밸런스)조회
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */
router.get('/balance/:address', async(req:Request, res:Response, next:NextFunction)=>{
  const address=req.params['address'];
  try {
    const balance=await scWithSigner.balanceOf(address);
      res.status(200).json({success:true, message:'토큰 밸런스(잔액) 조회 성공', data: `${balance}`});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 밸런스(잔액) 조회 실패:${err}`, data:null});
  }
});


// router.post('/transfer/:from',needUserUUID,async(req:Request, res:Response, next:NextFunction)=>{
//   const uuid=req.uuid;
//   const from=req.params['from'];
//  const to=req.body.to; 
//   const amount=req.body.amount;
//   const password=req.body.password;
//   // const signer = new ethers.Wallet(OWNER_PRIVATE_KEY!, provider);
//   // const scWithSigner=sc.connect(signer);
//   try{
//     fs.readFile(`./db/keystores/${req.uuid}.json`,'utf8',async(err, data)=>{
//       if(data){
//         const keystore=await lightwallet.keystore.deserialize(data);
//         await keystore.keyFromPassword(password,async(err:any, pwDerivedKey:any)=>{
//           if(err){       
//             console.log("--errorororo--")
//          res.status(500).json({success:false, message:`프라이빗 정보조회 실패:${err}`, data: null});
//          }
//          const key=keystore.exportPrivateKey(from.toString(), pwDerivedKey)
//          const privateKey='0x'+key;


//           const fromSigner = new ethers.Wallet(privateKey, provider);
//            const contract=sc.connect(fromSigner);
//          const tx=await contract.transfer(to, amount);
//          console.log(`Transfer in hash: ${tx.hash}`);
//         res.status(200).json({success:false, message:'토큰 전송 성공', data:{
//         to: to, amount:amount,
//         }});
//         })
//       }
//     });

//   }catch(err){
//     console.log(err);
//     res.status(500).json({success:false, message:`토큰 전송 실패:${err}`, data:null});
//   }
// });

//owner로 부터 토큰 전송
/**
   * @swagger
   * /token/transfer/owner:
   *   post:   
   *     summary: owner로부터 토큰 전송
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
   *     description: owner로부터 토큰 전송
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */
router.post('/transfer/owner',onlyOwner,async(req:Request, res:Response, next:NextFunction)=>{

 const to=req.body.to; 
  const amount=req.body.amount;

  // const signer = new ethers.Wallet(OWNER_PRIVATE_KEY!, provider);
  // const scWithSigner=sc.connect(signer);
  try{
      
      const tx=await scWithSigner.transfer(to, amount);
      console.log(`Transfer in hash: ${tx.hash}`);
    res.status(200).json({success:false, message:'owner 토큰 전송 성공', data:{
    to: to, amount:amount,
    }});

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
   *     summary: 일반 토큰 전송
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
   *     description: 일반 토큰 전송
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */
router.post('/transfer',async(req:Request, res:Response, next:NextFunction)=>{
  const privateKey=req.body.privateKey;
  const to=req.body.to; 
  const amount=req.body.amount;

  // const signer = new ethers.Wallet(OWNER_PRIVATE_KEY!, provider);
  // const scWithSigner=sc.connect(signer);
  try{
      const fromSigner = new ethers.Wallet(privateKey, provider);
      const contract=sc.connect(fromSigner);
      const tx=await contract.transfer(to, amount);
      console.log(`Transfer in hash: ${tx.hash}`);
    res.status(200).json({success:false, message:'토큰 전송 성공', data:{
    to: to, amount:amount,
    }});

  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`토큰 전송 실패:${err}`, data:null});
  }
});






//////=====================  사용 x ==========
//msgSender 조회 (테스트용)
router.get('/sender', async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const msgSender=await scWithSigner.test()
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
    const contract=sc.connect(fromSigner);
    const msgSender=await contract.test();
 
    res.status(200).json({success:true, message:'msgSender 조회 성공', data:{
      msgSender
    }});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, message:`msgSender 조회 실패:${err}`, data:null});
  }
});




export default router;