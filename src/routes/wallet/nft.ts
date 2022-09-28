import express, {Request, Response, NextFunction, Router } from "express";
import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json'
import * as Block from 'multiformats/block'
import * as codec from 'multiformats/codecs/json'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
import fs from 'fs';
import moment from "moment";
import multer from 'multer';

//import {create} from 'ipfs-http-client';
import ipfsClient from 'ipfs-http-client';





const router: Router = express.Router();

export const ipfs= ipfsClient({host:'localhost', port:1234, protocol:'http'});


// export function fileHandler(
//     req: Request,
//     res: Response,
//     next: NextFunction
//     ) {
//         let date: string = moment().format("YYMMDD");
//         let fileDir: string = "upload/files/" + date;
//         let imageDir: string = "upload/images/" + date;
//         try {
//             const stat = fs.lstatSync(fileDir);
//         } catch (err) {
//             fs.mkdirSync(fileDir, { recursive: true });
//             fs.mkdirSync(imageDir, { recursive: true });
//         } finally {
//             next();
//         }
//     }
//이미지파일, 일반파일 분류
 const fileStorage=multer.diskStorage({
    destination: (req,file, cb)=>{
        const date:string=moment().format('YYYYMMDD');

        // if(file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        //     cb(null, "uploads/images/"+ date +"/");
        // }else if(file.originalname.match(/\.(txt|csv)$/)){
        //     cb(null, "uploads/files/"+date+"/");
        // }
        cb(null,`uploads/`);
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
})
export const upload = multer({
    storage: fileStorage,
    // limits: {
    //   files: 10
    // }
  });

//export const upload=multer({dest:'uploads/'});

router.get('/', async(req:Request, res:Response, next:NextFunction)=> {
    res.status(200).json({success:true, message:'성공', data:'nft'})
})

// router.post('/create/cid', upload.single("file"),async(req:Request, res:Response, next:NextFunction)=> {
//     const file=req.body['file'];

// console.log(file);

//     try {
//         //const { create } = await import('ipfs-core')
//          const ipfs=await create();
//         //  fs.readFile(file,async(err,data)=>{
//         //     console.log(data);
//         //     res.status(200).json({success:false, message:`cid 생성 성공`, data:data});
//         //   });
//        const result=await ipfs.add(req.file!.buffer);
//          console.log(result);
//           res.status(200).json({success:false, message:`cid 생성 성공`, data:'tjd'})
//         //   const {cid}= await ipfs.add(file);
          
//     }catch(err){
//         console.log(err);
//         res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, data:null})
//     }
// });


router.post('/create/cid',upload.single('file'),async(req:Request, res:Response, next:NextFunction)=> {
const file=req.file;
const filename=req.body.fileName;
const filePath='uploads/'+file!.originalname;
console.log("======filePath=====")
console.log(filePath);
console.log("=============h=====")

    // const file=req.file;
    // console.log(file);

    try {
        
         
        const readedFile=fs.readFileSync(filePath);
        const fileAdded=await ipfs.add({path:file!.originalname, content:readedFile});
        const fileHash=String(fileAdded.cid);

    

          res.status(200).json({success:false, message:`cid 생성 성공`, data:fileHash})
        //   const {cid}= await ipfs.add(file);
          
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:`지갑 생성 실패:${err}`, data:null})
    }
});
export default router;