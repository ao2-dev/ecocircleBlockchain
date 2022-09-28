import { ethers, providers } from "ethers";
import express, { Request, Response, NextFunction,Router } from "express";
import * as dotenv from 'dotenv'
import { Token } from "../contracts";
import { IOERR } from "sqlite3";
import socketio, { Server } from 'socket.io';
const router: Router = express.Router();
const {OWNER_PRIVATE_KEY,INFURA_ROPSTEN_WEBSOCKET} = process.env;
const wsProvider= new ethers.providers.WebSocketProvider(INFURA_ROPSTEN_WEBSOCKET!,"ropsten");
const sc=new ethers.Contract( Token.address, Token.abi , wsProvider);
const signer = new ethers.Wallet(OWNER_PRIVATE_KEY!, wsProvider);
const scWithSigner=sc.connect(signer);

// interface ServerToClientEvents {
//     noArg: () => void;
//     basicEmit: (a: number, b: string, c: Buffer) => void;
//     withAck: (d: string, callback: (e: number) => void) => void;
//   }
  
//   interface ClientToServerEvents {
//     hello: () => void;
//   }
  
//   interface InterServerEvents {
//     ping: () => void;
//   }
  
//   interface SocketData {
//     name: string;
//     age: number;
//   }
//   const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();


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