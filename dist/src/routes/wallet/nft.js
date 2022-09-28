"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.ipfs = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const multer_1 = __importDefault(require("multer"));
//import {create} from 'ipfs-http-client';
const ipfs_http_client_1 = __importDefault(require("ipfs-http-client"));
const router = express_1.default.Router();
exports.ipfs = (0, ipfs_http_client_1.default)({ host: 'localhost', port: 1234, protocol: 'http' });
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
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const date = (0, moment_1.default)().format('YYYYMMDD');
        // if(file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        //     cb(null, "uploads/images/"+ date +"/");
        // }else if(file.originalname.match(/\.(txt|csv)$/)){
        //     cb(null, "uploads/files/"+date+"/");
        // }
        cb(null, `uploads/`);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
exports.upload = (0, multer_1.default)({
    storage: fileStorage,
    // limits: {
    //   files: 10
    // }
});
//export const upload=multer({dest:'uploads/'});
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ success: true, message: '성공', data: 'nft' });
}));
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
router.post('/create/cid', exports.upload.single('file'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const filename = req.body.fileName;
    const filePath = 'uploads/' + file.originalname;
    console.log("======filePath=====");
    console.log(filePath);
    console.log("=============h=====");
    // const file=req.file;
    // console.log(file);
    try {
        const readedFile = fs_1.default.readFileSync(filePath);
        const fileAdded = yield exports.ipfs.add({ path: file.originalname, content: readedFile });
        const fileHash = String(fileAdded.cid);
        res.status(200).json({ success: false, message: `cid 생성 성공`, data: fileHash });
        //   const {cid}= await ipfs.add(file);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `지갑 생성 실패:${err}`, data: null });
    }
}));
exports.default = router;
//# sourceMappingURL=nft.js.map