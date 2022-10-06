import express,  {Request, Response, NextFunction, Router} from 'express';
import { BigNumber, ethers} from 'ethers';
import { bip39, OWNER, OWNER_PRIVATE_KEY, POLYGONSCAN_APIKEY, provider, web3 } from '.';
import {hdkey} from 'ethereumjs-wallet';
import Wallet from 'ethereumjs-wallet';
import crypto from 'crypto';
import { needPK } from './middlewares';
import QRCode from 'qrcode-svg';

interface AddressT {
    address: string;
    privateKey:string;
    idx:number;
    tokens: TokenT[];
    name:string;
}

interface TokenT {
 address: string;
 chainId: number;
name:string;
symbol:string;
decimals:number;
totalSupply:number;
logoURI: string| null;
idx:number;
}
interface WalletT {
    hash:string;
    mnemonic:string;
    addresses:AddressT[];
}

interface TxResponseT {
    type:number;
    chainId:number;
    nonce: number;
    maxPriorityFeePerGas: BigNumber;
    maxFeePerGas: BigNumber;
    gasPrice: number|BigNumber| null;
    gasLimit: BigNumber;
    to: string;
    value: BigNumber;
    data: string;
    accessList: [];
    hash: string;
    v:number;
    r:string;
    s:string;
    from:string;
    confirmations:number;
}








const router: Router = express.Router();
const hashMethod='sha256';
const maxAccount=5;
const hdpath = "m/44'/60'/0'/0/";
router.get('/',  async(req:Request, res:Response, next:NextFunction)=> {
    res.status(200).json({success:true, message:'안녕하세요',data:'여긴 wallet'})
});


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
router.post('/create', async(req:Request, res:Response, next:NextFunction)=>{
    const password=req.body.password;
    try {   
        const mnemonic = await bip39.generateMnemonic();
        const hashedPassword=crypto.createHash(hashMethod,password).update(`${password}_${mnemonic}`).digest('hex');
        console.log("-------MNEMINIC--------")
        console.log(mnemonic);
        console.log("----------------------")
        const seed=await bip39.mnemonicToSeed(mnemonic);
        const hdwallet=hdkey.fromMasterSeed(seed);
    
        let accounts = [];
        for (let i = 0; i < 1; i++) {
            let wallet = hdwallet.derivePath(hdpath + i).getWallet();
            let address = '0x' + wallet.getAddress().toString("hex");
            let privateKey = wallet.getPrivateKey().toString("hex");
            let v3=wallet.toV3(hashedPassword);
            //const keystore=JSON.stringify((await v3).crypto);
            const newAddr:AddressT ={
                address:address,
                privateKey:privateKey,
                //keystore:keystore,
                idx:i,
                tokens:[],
                name:`Account ${i}`
            }
            accounts.push(newAddr);
        }
        const newWallet:WalletT={
            hash:hashedPassword,
            mnemonic: mnemonic,
            addresses: accounts,
        }
        res.status(200).json({success:true, message:` 지갑 생성 성공!!`, data:newWallet})
    
    } catch(err){
        console.log(`[ERROR]: ${err}`);
        res.status(500).json({success:false, message:`지갑 생성 실패 : ${err}`, data:null})
    }
  
 
});

/**
   * @swagger
   * /wallet/add:
   *   post:   
   *     summary: 주소 추가 [W-3]
   *     requestBody:
   *       description: 디바이스에 저장되어있는 월렛정보 보내주세요
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/WalletT'    
   *     tags:
   *      - Wallet
   *     description: 주소 추가 [W-3]
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
router.post('/add', async(req:Request, res:Response, next:NextFunction)=>{
    //몇번째 지갑을 생성하는 것인지 숫자 필요.
    const originWallet:WalletT=req.body.wallet;
    try {
        const seed=await bip39.mnemonicToSeed(originWallet.mnemonic);
        const hdwallet=hdkey.fromMasterSeed(seed);
        let wallet = hdwallet.derivePath(hdpath+originWallet.addresses.length).getWallet();
        let address = '0x' + wallet.getAddress().toString("hex");
        let privateKey = wallet.getPrivateKey().toString("hex");
        const newAddr:AddressT={
            address: address,
            privateKey:privateKey,
            idx: originWallet.addresses.length,
            tokens:[],
            name:`Account ${originWallet.addresses.length}`
        };
        const newWallet:WalletT ={
            ...originWallet,
            addresses: [
                ...originWallet.addresses,
                newAddr,
            ]
        };
        res.status(200).json({success:true, message:`주소 추가 성공!`, data:newWallet})
    }catch(err){
console.log(err);
        res.status(500).json({success:false, message:`주소 추가 실패 : ${err}`, data:null})
    }
});




/**
   * @swagger
   * /wallet/add/pk:
   *   post:   
   *     summary: 비공개키로 주소 추가 [W-3-1]
   *     requestBody:
   *       description: 디바이스에 저장되어있는 월렛정보 보내주세요
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
   *     description: 주소 추가 [W-3-1]
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
router.post('/add/pk', async(req:Request, res:Response, next:NextFunction)=>{
    const pk=req.body.privateKey;

    //몇번째 지갑을 생성하는 것인지 숫자 필요.
    const originWallet:WalletT=req.body.wallet;
    try {
        const privateKeyBuffer=Buffer.from(pk, "hex");
        const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
        const address = '0x' + wallet.getAddress().toString("hex");
        const privateKey = wallet.getPrivateKey().toString("hex");
        const newAddr:AddressT={
            address: address,
            privateKey:privateKey,
            idx: originWallet.addresses.length,
            tokens:[],
            name:`Account ${originWallet.addresses.length}`
        };
        const newWallet:WalletT ={
            ...originWallet,
            addresses: [
                ...originWallet.addresses,
                newAddr,
            ]
        };
        res.status(200).json({success:true, message:`주소 추가 성공!`, data:newWallet})
    }catch(err){
console.log(err);
        res.status(500).json({success:false, message:`주소 추가 실패 : ${err}`, data:null})
    }
});



/**
   * @swagger
   * /wallet/delete/{address}:
   *   delete:
   *     summary: 지갑에서 주소 삭제 [W-4]
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
   *     description: 지갑에서 주소 삭제 [W-4]
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
router.delete('/delete/:address',async(req:Request, res:Response, next:NextFunction)=> {
    const address=req.params['address'];
    const originWallet=req.body.wallet as WalletT;
    try {
    
        web3.eth.accounts.wallet.remove(address);
        const newWallet:WalletT ={
            ...originWallet,
            addresses: [
                ...originWallet.addresses.filter(addr=> addr.address!==address),
            ]
        };
       res.status(200).json({success:true, message:'주소 삭제 성공', data:newWallet})
    } catch(err){
        res.status(500).json({success:false, message:`주소 삭제 실패:${err}`, data:null});
    }

});


/**
   * @swagger
   * /wallet/restore:
   *   post:   
   *     summary: 지갑 복구 [W-5]
   *     requestBody:
   *       description: 비밀번호, 니모닉(복구문자)필요
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties: 
   *               password:
   *                 type: string
   *               mnemonic:
   *                 type: string   
   *     tags:
   *      - Wallet
   *     description: 주소 추가 [W-5]
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
//restore일 경우 하나만 우선 복구됨
router.post('/restore', async(req:Request, res:Response, next:NextFunction)=>{
    const password=req.body.password;
    const mnemonic=req.body.mnemonic;
    try {
        const hashedPassword=crypto.createHash(hashMethod,password).update(`${password}_${mnemonic}`).digest('hex');
        const seed=await bip39.mnemonicToSeed(mnemonic);
        const hdwallet=hdkey.fromMasterSeed(seed);
        let accounts=[];
        //최대 5개
        for (let i = 0; i <1; i++) {
            let wallet = hdwallet.derivePath(hdpath + i).getWallet();
            let address = '0x' + wallet.getAddress().toString("hex");
            let privateKey = wallet.getPrivateKey().toString("hex");
            ///let v3=wallet.toV3(password);
            //const keystore=JSON.stringify((await v3).crypto);
            const newAddr:AddressT ={
                address:address,
                privateKey:privateKey,
                //keystore:keystore,
                idx:i,
                tokens:[],
                name: `Account ${i}`
            }
            accounts.push(newAddr);
        }
        const newWallet:WalletT={
            hash:hashedPassword,
            mnemonic: mnemonic,
            addresses: accounts,
        }
 
        res.status(200).json({success:true, message:`지갑 복구 성공!`, data:newWallet})
    }catch(err){
console.log(err);
        res.status(500).json({success:false, message:`지갑 복구 실패 : ${err}`, data:null})
    }
   
})


/**
   * @swagger
   * /wallet/send:
   *   post:
   *     summary: 매틱 전송 [W-6]
   *     parameters:
   *       - in: header
   *         name: PK
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: privateKey of msg.sender
   *     requestBody:
   *       required: true
   *       description: 발신자의 privateKey를 헤더로보내기 필수, from은 발신인, to는 수신인, amount는 보내는 금액
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *              to:
   *                type: string
   *              amount:
   *                type: string
   *              
   *     tags:
   *      - Wallet
   *     description:  매틱 전송 [W-6]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT' 
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/WalletT'   
   */
//send matic
router.post('/send', needPK,async(req:Request, res:Response, next:NextFunction)=> {
    const from = req.body.from;
    const to=req.body.to;
    const amount=req.body.amount;
   // const from = req.body.from;
    console.log(`PARSED ETHER: ${ethers.utils.parseEther(amount)}`);
        try {

            const _signer= new ethers.Wallet(req.pk, provider);
            const txParams={
                from:from,
                to: to,
                data:'',
                value: ethers.utils.parseEther(amount),
                gasPrice: ethers.utils.hexlify(parseInt(`${await provider.getGasPrice()}`)),
    
            }
           await _signer.sendTransaction(txParams).then(tx =>{
            console.log("//////////////===TX===//////////////////")
            console.log(tx);
            console.log("////////////////////////////////////////")
            res.status(200).json({success:false, message:`매틱 전송 성공!`, data:tx})
           })
        }catch(err){
            console.log(err);
            res.status(500).json({success:false, message:`매틱 전송 실패 : ${err}`, data:null})
        }
    

});



/**
   * @swagger
   * /wallet/balance/{address}:
   *   get:
   *     summary: 매틱 잔액 조회 [W-7]
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
   *     description: 매틱 잔액 조회 [W-7]
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
                res.status(200).json({success:true, message: `매틱 잔액조회 성공` ,  data:`${balance}`});   //balance 는 bigNumber 이고, bigNumber  는  .toString() 해주어야함.
         
            }catch(err){
            console.log(err);
            res.status(500).json({success:false, message: `이더리움 잔액조회 실패:${err}` ,  data:null});
            }
  });



/**
   * @swagger
   * /wallet/name/{address}:
   *   patch:
   *     summary: 주소에 대한 이름 생성 및 변경 [W-10]
   *     parameters:
   *       - in: path
   *         name: address
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: 잔액 조회하고자 하는 주소
   *     requestBody:
   *       description: wallet은 월렛 정보, name은 주소에 대한 이름입니다.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               wallet:
   *                 $ref: '#/components/schemas/WalletT' 
   *               name:
   *                 type: string
   *     tags:
   *      - Wallet
   *     description: 주소에 대한 이름 생성 및 변경 [W-10]
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
router.patch('/name/:address',async(req:Request, res:Response, next:NextFunction)=>{
    const name=req.body.name;
    const address:string=req.params['address'];
    const wallet:WalletT=req.body.wallet;
    try {
        const searchedAddr=wallet.addresses.filter(addr=> addr.address===address)[0];
        searchedAddr.name=name;
       wallet.addresses.splice(searchedAddr.idx,1,searchedAddr);
        res.status(200).json({success:true, message: `주소에 대한 이름 생성 및 변경 성공` ,  data:wallet}); 

    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message: `주소에 대한 이름 생성 및 변경 실패:${err}` ,  data:null});
    }
});



/**
   * @swagger
   * /wallet/password:
   *   post:
   *     summary: 비밀번호 매칭 확인 [W-11]
   *     requestBody:
   *       required: true
   *       description: password는 지갑 패스워드, mnemonic 은 월렛의 니모닉코드, hash는 월렛의 해쉬
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *              password:
   *                description:
   *                type: string
   *              mnemonic:
   *                description: 유저 월렛정보의 니모닉코드
   *                type: string
   *              hash:
   *                description: 유저월렛정보의 해쉬
   *                type: string
   *              
   *     tags:
   *      - Wallet
   *     description: 비밀번호 매칭 확인 [W-11]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT' 
   *               properties:
   *                 data:
   *                   type: boolean
   *                   nullable: true
   * 
   *                     
   */
//비밀번호 매칭확인
router.post('/password',async(req:Request, res:Response, next:NextFunction)=>{
    const password=req.body.password;
    const mnemonic=req.body.mnemonic;
    const hash=req.body.hash;
    
       try {
           const hashedPassword=crypto.createHash(hashMethod,password).update(`${password}_${mnemonic}`).digest('hex');
           console.log()
           if(hash===hashedPassword)
           {
               res.status(200).json({success:true, message: `비밀번호 일치` ,  data:true}); 
           } else {
               res.status(200).json({success:true, message: `비밀번호 불일치` ,  data:false}); 
           }
    
       }catch(err){
           console.log(err);
           res.status(500).json({success:false, message: `비밀번호 매칭 확인 실패:${err}` ,  data:null});
       }
   });
   
   

/**
   * @swagger
   * /wallet/{qr}:
   *   get:
   *     summary: 상점 주소 QR 생성하기 (응답값:SVG) [W-12]
   *     parameters:
   *       - in: path
   *         name: qr
   *         schema:
   *           type: string
   *           foramt: 0x..
   *         required: true
   *         description: QR생성하고자 하는 상점의 address주소
   *     tags:
   *      - Wallet
   *     description: 상점의 주소 QR 생성하기 (응답값:SVG) [W-12]
   *     responses:
   *       200:
   *         content:
   *           application/svg:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 tag: 
   *                   type: string
   *                 type:
   *                   type: string
   *                 text:
   *                   type: string
   *                 fill:
   *                   type: string
   *                 src:
   *                   type: string     
   */


 router.get('/:qr',async(req:Request, res:Response, next:NextFunction)=>{

 
    try {
        var qrcode = new QRCode({
            content: `https://ecocircle.co.kr/${req.params.qr}`,
            padding: 4,
            width: 1080,
            height: 1080,
            color: "#000000",
            background: "#ffffff",
            ecl: "M",
          });
          res.setHeader('Content-type', 'image/svg+xml');
          const svg=qrcode.svg();
          res.status(200).send(svg);
      
        }catch(err){
        console.log(err);
        res.status(500).json({success:false, message: `qr code 실패:${err}` ,  data:null});
        }
});

// router.post('/token/balance',needNetwork,async(req:Request, res:Response, next:NextFunction)=>{
//     const wallet:WalletT=req.body.wallet;
//     const address=req.body.address;
//     const contract=req.body.contract;

//     if(req.network===NETWORKS.ropsten){

//         try {
//             const url=`${ETHERSCAN_ENDPOINT}?module=contract&action=getabi&address=${contract}&apikey=${ETHERSCAN_APIKEY}`
        
//             await axios.get(url).then(async(data)=>{
//              const sc=new ethers.Contract(contract, JSON.parse(data.data.result), provider_ropsten);
                 
//                 const balance= await sc.balanceOf(address);
//                const searchedAddr=wallet.addresses.filter(addr=> addr.address===address)[0]
//                 const searchedToken=searchedAddr.tokens.filter(token=> token.address===contract)[0];
//                 const renewedToken:TokenT={
//                     ...searchedToken,
//                     balance: balance,
//                 }
//                 searchedAddr.tokens=searchedAddr.tokens.splice(searchedToken.idx,1,renewedToken);
//                 wallet.addresses=wallet.addresses.splice(searchedAddr.idx,1, searchedAddr);
//                 res.status(200).json({success:true, message:`토큰 잔액 조회 성공!`, data:wallet});
                
//             });
//         } catch(err){
//             console.log(err);
//             res.status(500).json({success:false, message:`토큰 잔액 조회 실패! : ${err}`, data:null})
//         }
      
//     }else {
//         try {
//             const url=`${POLYGONSCAN_ENDPOINT}?module=contract&action=getabi&address=${contract}&apikey=${POLYGONSCAN_APIKEY}`
        
//             await axios.get(url).then(async(data)=>{
//              const sc=new ethers.Contract(contract, JSON.parse(data.data.result), provider);
                 
//                 const balance= await sc.balanceOf(address);
//                const searchedAddr=wallet.addresses.filter(addr=> addr.address===address)[0]
//                 const searchedToken=searchedAddr.tokens.filter(token=> token.address===contract)[0];
//                 const renewedToken:TokenT={
//                     ...searchedToken,
//                     balance: balance,
//                 }
//                 searchedAddr.tokens=searchedAddr.tokens.splice(searchedToken.idx,1,renewedToken);
//                 wallet.addresses=wallet.addresses.splice(searchedAddr.idx,1, searchedAddr);
//                 res.status(200).json({success:true, message:`토큰 잔액 변경 성공!`, data:wallet});
                
//             });
//         } catch(err){
//             console.log(err);
//             res.status(500).json({success:false, message:`토큰 잔액 변경 실패! : ${err}`, data:null})
//         }
//     }
// } )




export default router;
