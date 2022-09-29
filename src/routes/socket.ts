
import express, { Request, Response, NextFunction,Router } from "express";
import { wsProvider } from ".";


const router: Router = express.Router();

router.get('/:tx', (req:Request, res:Response, next:NextFunction)=> {
    const tx=req.params['tx']; //txHash
   const network=wsProvider.getNetwork();
   network.then(res=> console.log(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}`)) 
   wsProvider.on("pending",(txHash)=>{
    if(txHash){
        if(txHash===tx){
            console.log(`${txHash} pending......>.<`)
            wsProvider.getTransaction(txHash).then((tx)=>{
                console.log(tx);
              })
        }
        
    }
   })
  
})
export default router;