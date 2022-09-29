import express, { Router ,Request, Response, NextFunction} from "express";
import { CoinGeckoClient } from ".";

const router: Router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Coin
 *   description: 코인(이더리움 등) 시세 및 기타정보
 */

router.get('/', async(req:Request, res:Response, next:NextFunction)=> {
    res.status(200).json({success:true, message:'성공', data:'coin'})
});

/**
   * @swagger
   * /coin/price/{coinId}:
   *   get:
   *     summary: 코인 가격 조회 (달러, 원화) [C-1]
   *     parameters:
   *       - in: path
   *         name: coinId
   *         schema:
   *           type: string
   *           enum: [ethereum, matic-network]
   *         required: true
   *         description: 조회하고자 하는 코인의 id
   *     tags:
   *      - Coin
   *     description: 코인 가격 조회 (달러, 원화) [C-1]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */
router.get('/price/:coinId',async(req:Request, res:Response, next:NextFunction)=> {
    const coinId=req.params['coinId'];
    try{
   await CoinGeckoClient.coins.fetch(coinId,{}).then(info =>{
   const name=info.data.name;
   const usd=  info.data.market_data.current_price.usd
   const krw=  info.data.market_data.current_price.krw

   res.status(200).json({success:true, message:`코인 가격 정보 조회 성공!`, data:{
    name:name,
    coinId:coinId,
    usd:usd,
    krw:krw,
   }})
    });

    }catch(err){
        res.status(500).json({success:false, message:`코인 가격 정보 조회 실패 : ${err}`, data:null})
    }
});


export default router;