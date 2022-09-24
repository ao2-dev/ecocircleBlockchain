
import express,  {Request, Response, NextFunction, Router} from 'express';
import tokenRouter from './token';
import wallterRouter from './wallet';
import * as dotenv from 'dotenv'
import { ethers } from 'ethers';
import swaggerJSDoc from 'swagger-jsdoc';
dotenv.config()
//const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_RPC_SERVER));
//const web3= new Web3(GANACHE_RPC_SERVER);

const {OWNER_PRIVATE_KEY,INFURA_API_KEY,TEST} = process.env;
// const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_GORLI_SERVER!));

const provider= new ethers.providers.InfuraProvider("ropsten",
INFURA_API_KEY
)

const router: Router = express.Router();
//const payRouter:Router = require('./pay');
router.use('/token', tokenRouter);
router.use('/wallet', wallterRouter);

/**
 * @swagger
 * components:
 *  schemas:
 *    ResponseT:
 *      type: object
 *      properties:
 *        success: 
 *          type: boolean
 *        message:
 *          type: string
 *        data:
 *          anyOf:
 *          - type: object
 *          nullable: true
 *           
 *    Dog:
 *      type: object
 *      properties:
 *        bark:
 *          type: boolean
 *        breed:
 *          type: string
 *          enum: [Dingo, Husky, Retriever, Shepherd]
 *    Cat:
 *      type: object
 *      properties:
 *        hunts:
 *          type: boolean
 *        age:
 *          type: integer
 * 
 */
/**
   * @swagger
   * tags:
   *   name: Index
   *   description: User management and login
   */
 /**
   * @swagger
   * /:
   *   get:
   *     tags:
   *      - Index
   *     description: 테스트
   *     responses:
   *       200:
   *         description: {success:true, message:'인덱스', data:'환영합니다'}
   */
router.get('/', (req:Request, res:Response, next:NextFunction)=> {
    res.status(200).json({success:true, message:'인덱스', data:'환영합니다'})
})


/**
 * @swagger
 * /test:
 *  get:
 *   tags:
 *    - Index
 *      
 */
router.get('/test', (req:Request, res:Response, next:NextFunction)=> {
    res.status(200).json({success:true, message:'env 테스트', data:TEST})
})


// router.get('/', async (req:Request, res:Response, next:NextFunction)=> {
//     try {
    
//         const accounts = await web3.eth.getAccounts();
// //0번째 주소 가져올 때 사용법
// //         account = (await web3.eth.getAccounts())[0];
// // i.addVoter(account);
//         const  data={
//             accounts,
//         }
//       res.status(200).json({data:data, key:OWNER_PRIVATE_KEY});

//     }catch(err){
//         console.log(err);
//         res.status(500).send();
//     }

// });
router.get('/welcome', (req:Request, res:Response, next:NextFunction)=> {
    res.send('welcome!!!');
});
export default router;