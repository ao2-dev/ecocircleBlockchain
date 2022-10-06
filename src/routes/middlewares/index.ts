import express,  {Request, Response, NextFunction, Router} from 'express';
import { OWNER_PRIVATE_KEY } from "..";

//middleware
export const needPK=(req:Request, res:Response, next:NextFunction)=>{
    const privateKey=req.get('PK');
    if(privateKey){
      req.pk=privateKey;
        next();
      }else {
        res.status(400).json({success:false, message: `유저의 privateKey를 보내주세요` ,  data:null});
      }
  }
  

  //middleware
export const onlyOwner=(req:Request, res:Response, next:NextFunction)=>{
    const owner=req.get('OWNER');
    if(owner){
      if(owner===OWNER_PRIVATE_KEY){
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