import { ethers } from 'ethers';
import express,{Request, Response, NextFunction, Router}  from 'express';
import { provider, signer } from '.';
import { EcoStatistic } from '../contracts';
const router: Router = express.Router();


const statisticsSC=new ethers.Contract(EcoStatistic.address, EcoStatistic.abi, provider);


interface StudentT {
    rank: number;
    phone:string;
    point:number;
    schoolId: number;
}



/**
   * @swagger
   * tags:
   *   name: Statistics
   *   description: 에코써클 통계 관련
   */


/**
   * @swagger
   * /statistics/student/rank:
   *   post:
   *     summary: 학생 순위 랭킹 등록
   *     requestBody:
   *       description: 바이바이
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               rank:
   *                 type: integer
   *               phone:
   *                 type: string
   *               point:
   *                 type: integer
   *               schoolId:
   *                 type: integer
   *     tags:
   *      - Statistics
   *     description: 학생 순위 랭킹 등록
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *             
   *         
   */


const setStudentRank=async(std:StudentT)=>{
    const statisticsSCSigned= statisticsSC.connect(signer);
            const tx=await statisticsSCSigned.setRank(std.rank, String(std.phone),std.point, std.schoolId);
            console.log(`Tx Successed in hash : ${tx.hash}`);
            return tx;
}

router.post('/student/rank', async (req:Request, res:Response, next:NextFunction)=>{
    const rank = req.body.rank;
    const phone= req.body.phone;
    const point =req.body.point;
    const schoolId= req.body.schoolId;
    try {
        const statisticsSCSigned= statisticsSC.connect(signer);
        const tx=await statisticsSCSigned.setRank(parseInt(rank), phone,parseInt(point), parseInt(schoolId));
        console.log(`Tx Successed in hash : ${tx.hash}`);
        res.status(200).json({success: true, message:'학생 순위 랭킹 등록 성공', data: null});
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:`학생 순위 랭킹 등록 실패 :${err}`, data:null});
    }
})

/**
   * @swagger
   * /statistics/student/{rank}:
   *   get:
   *     summary: 학생 랭킹 조회
   *     parameters:
   *       - in: path
   *         name: rank
   *         schema:
   *           type: string
   *         required: true
   *         description: 조회하고자하는 랭킹넘버
   *     tags:
   *      - Statistics
   *     description: 학생 랭킹 조회
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *               properties:
   *                 data:
   *                   type: object
   *             
   *         
   */
router.get('/student/:rank',async (req:Request, res:Response, next:NextFunction)=>{
    const rank= req.params['rank'];
    try {
        console.log(rank);
        const statisticsSCSigned= statisticsSC.connect(signer);
    await statisticsSCSigned.getStudentByRank(parseInt(rank)).then((response:any)=>{
        console.log('tx dddd~')
        console.log(JSON.stringify(response));
        const student:StudentT = {
            rank: parseInt(rank),
            phone:`${response[0]}`,
            point:parseInt(`${response[1]}`),
            schoolId:parseInt(`${response[2]}`),
        }
        console.log(`STUDENT: ${JSON.stringify(student)}`);
        res.status(200).json({success: true, message:'학생 랭킹 조회 성공', data: student});
    })
   
    //    await tx.wait().then((result:object)=>{
    //         console.log(`result !!! : : ${JSON.stringify(result)}`);
    //    });
      //  res.status(200).json({success: true, message:'학생 링킹 조회 성공', data: JSON.stringify(object)});

    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:`학생 랭킹 조회 실패 :${err}`, data:null});
    }
});


router.post('/ranks/all',async (req:Request, res:Response, next:NextFunction)=>{
    try {
    const listString=JSON.stringify(jsonlist);
    console.log(listString);

  const statisticsSCSigned= statisticsSC.connect(signer);
  const tx=statisticsSCSigned.setAllRanks(listString);
  console.log(`Tx Successed in hash : ${tx.hash}`);
        res.status(200).json({success: true, message:'/ranks/all  성공', data: null});
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:`dump 실패 :${err}`, data:null});
    }
});

router.get('/allranks',async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const listString=JSON.stringify(jsonlist);
        console.log(listString);
    
      const statisticsSCSigned= statisticsSC.connect(signer);
      const result=await statisticsSCSigned.allRanks();
      console.log(result);
      res.status(200).json({success: true, message:'allranks 성공', data: result});
    
        }catch(err){
            console.log(err);
            res.status(500).json({success:false, message:`allranks 실패 :${err}`, data:null});
        }
})

export default router;

const jsonlist=[
    {
      "rank": 1,
      "phone": 1023898528,
      "point": 2002,
      "school_id": 26
    },
    {
      "rank": 2,
      "phone": 1041525760,
      "point": 835,
      "school_id": 26
    },
    {
      "rank": 3,
      "phone": 1021793677,
      "point": 450,
      "school_id": 26
    },
    {
      "rank": 4,
      "phone": 1076884405,
      "point": 409,
      "school_id": 26
    },
    {
      "rank": 5,
      "phone": 1066780475,
      "point": 258,
      "school_id": 26
    },
    {
      "rank": 6,
      "phone": 1029910003,
      "point": 257,
      "school_id": 26
    },
    {
      "rank": 7,
      "phone": 1087593664,
      "point": 255,
      "school_id": 26
    },
    {
      "rank": 8,
      "phone": 1041039032,
      "point": 239,
      "school_id": 26
    },
    {
      "rank": 9,
      "phone": 1063760818,
      "point": 218,
      "school_id": 26
    },
    {
      "rank": 10,
      "phone": 1054445258,
      "point": 198,
      "school_id": 26
    },
    {
      "rank": 11,
      "phone": 1086943991,
      "point": 190,
      "school_id": 26
    },
    {
      "rank": 12,
      "phone": 1095722947,
      "point": 183,
      "school_id": 26
    },
    {
      "rank": 13,
      "phone": 1031820955,
      "point": 177,
      "school_id": 26
    },
    {
      "rank": 14,
      "phone": 1095994246,
      "point": 176,
      "school_id": 26
    },
    {
      "rank": 15,
      "phone": 1062744134,
      "point": 167,
      "school_id": 26
    },
    {
      "rank": 16,
      "phone": 1037554984,
      "point": 141,
      "school_id": 26
    },
    {
      "rank": 17,
      "phone": 1049131730,
      "point": 135,
      "school_id": 26
    },
    {
      "rank": 18,
      "phone": 1057140617,
      "point": 124,
      "school_id": 26
    },
    {
      "rank": 19,
      "phone": 1023880746,
      "point": 117,
      "school_id": 26
    },
    {
      "rank": 20,
      "phone": 1049333486,
      "point": 113,
      "school_id": 26
    },
    {
      "rank": 21,
      "phone": 1083535298,
      "point": 105,
      "school_id": 26
    },
    {
      "rank": 22,
      "phone": 1024493422,
      "point": 103,
      "school_id": 26
    },
    {
      "rank": 23,
      "phone": 1094670782,
      "point": 102,
      "school_id": 26
    },
    {
      "rank": 23,
      "phone": 1065230723,
      "point": 102,
      "school_id": 26
    },
    {
      "rank": 25,
      "phone": 1045734304,
      "point": 97,
      "school_id": 26
    },
    {
      "rank": 25,
      "phone": 1085243047,
      "point": 97,
      "school_id": 26
    },
    {
      "rank": 27,
      "phone": 1097382947,
      "point": 95,
      "school_id": 26
    },
    {
      "rank": 28,
      "phone": 1050493698,
      "point": 91,
      "school_id": 26
    },
    {
      "rank": 29,
      "phone": 1045462208,
      "point": 85,
      "school_id": 26
    },
    {
      "rank": 30,
      "phone": 1081926322,
      "point": 80,
      "school_id": 26
    },
    {
      "rank": 31,
      "phone": 1044426825,
      "point": 79,
      "school_id": 26
    },
    {
      "rank": 32,
      "phone": 1056822451,
      "point": 73,
      "school_id": 26
    },
    {
      "rank": 33,
      "phone": 1085145630,
      "point": 68,
      "school_id": 26
    },
    {
      "rank": 34,
      "phone": 1092893635,
      "point": 67,
      "school_id": 26
    },
    {
      "rank": 35,
      "phone": 1049979716,
      "point": 60,
      "school_id": 26
    },
    {
      "rank": 35,
      "phone": 1023627750,
      "point": 60,
      "school_id": 26
    },
    {
      "rank": 37,
      "phone": 1048909802,
      "point": 56,
      "school_id": 26
    },
    {
      "rank": 38,
      "phone": 1052230761,
      "point": 54,
      "school_id": 26
    },
    {
      "rank": 38,
      "phone": 1024082163,
      "point": 54,
      "school_id": 26
    },
    {
      "rank": 38,
      "phone": 1086013209,
      "point": 54,
      "school_id": 26
    },
    {
      "rank": 41,
      "phone": 1037461222,
      "point": 52,
      "school_id": 26
    },
    {
      "rank": 42,
      "phone": 1080757431,
      "point": 50,
      "school_id": 26
    },
    {
      "rank": 43,
      "phone": 1047731719,
      "point": 49,
      "school_id": 26
    },
    {
      "rank": 44,
      "phone": 1050294095,
      "point": 48,
      "school_id": 26
    },
    {
      "rank": 45,
      "phone": 1045233891,
      "point": 47,
      "school_id": 26
    },
    {
      "rank": 45,
      "phone": 1054890475,
      "point": 47,
      "school_id": 26
    },
    {
      "rank": 47,
      "phone": 1082467940,
      "point": 44,
      "school_id": 26
    },
    {
      "rank": 47,
      "phone": 1050644131,
      "point": 44,
      "school_id": 26
    },
    {
      "rank": 49,
      "phone": 1029996962,
      "point": 41,
      "school_id": 26
    },
    {
      "rank": 50,
      "phone": 1093028291,
      "point": 40,
      "school_id": 26
    },
    {
      "rank": 50,
      "phone": 1049939825,
      "point": 40,
      "school_id": 26
    },
    {
      "rank": 52,
      "phone": 1072425103,
      "point": 38,
      "school_id": 26
    },
    {
      "rank": 53,
      "phone": 1086850844,
      "point": 37,
      "school_id": 26
    },
    {
      "rank": 54,
      "phone": 1082511327,
      "point": 33,
      "school_id": 26
    },
    {
      "rank": 54,
      "phone": 1038262326,
      "point": 33,
      "school_id": 26
    },
    {
      "rank": 56,
      "phone": 1033131121,
      "point": 32,
      "school_id": 26
    },
    {
      "rank": 57,
      "phone": 1031660190,
      "point": 31,
      "school_id": 26
    },
    {
      "rank": 58,
      "phone": 1021968752,
      "point": 30,
      "school_id": 26
    },
    {
      "rank": 59,
      "phone": 1030922608,
      "point": 29,
      "school_id": 26
    },
    {
      "rank": 60,
      "phone": 1047562313,
      "point": 28,
      "school_id": 26
    },
    {
      "rank": 60,
      "phone": 1032958388,
      "point": 28,
      "school_id": 26
    },
    {
      "rank": 62,
      "phone": 1044123329,
      "point": 27,
      "school_id": 26
    },
    {
      "rank": 62,
      "phone": 1021965618,
      "point": 27,
      "school_id": 26
    },
    {
      "rank": 64,
      "phone": 1054761585,
      "point": 26,
      "school_id": 26
    },
    {
      "rank": 65,
      "phone": 1089722338,
      "point": 25,
      "school_id": 26
    },
    {
      "rank": 66,
      "phone": 1096798972,
      "point": 24,
      "school_id": 26
    },
    {
      "rank": 66,
      "phone": 1027283005,
      "point": 24,
      "school_id": 26
    },
    {
      "rank": 66,
      "phone": 1021762905,
      "point": 24,
      "school_id": 26
    },
    {
      "rank": 69,
      "phone": 1048934036,
      "point": 21,
      "school_id": 26
    },
    {
      "rank": 69,
      "phone": 1032996102,
      "point": 21,
      "school_id": 26
    },
    {
      "rank": 71,
      "phone": 1089225293,
      "point": 20,
      "school_id": 26
    },
    {
      "rank": 72,
      "phone": 1054988407,
      "point": 18,
      "school_id": 26
    },
    {
      "rank": 72,
      "phone": 1086724173,
      "point": 18,
      "school_id": 26
    },
    {
      "rank": 72,
      "phone": 1062645080,
      "point": 18,
      "school_id": 26
    },
    {
      "rank": 75,
      "phone": 1020985497,
      "point": 17,
      "school_id": 26
    },
    {
      "rank": 76,
      "phone": 1056257176,
      "point": 16,
      "school_id": 26
    },
    {
      "rank": 77,
      "phone": 1031402323,
      "point": 13,
      "school_id": 26
    },
    {
      "rank": 78,
      "phone": 1049440343,
      "point": 12,
      "school_id": 26
    },
    {
      "rank": 78,
      "phone": 1094626620,
      "point": 12,
      "school_id": 26
    },
    {
      "rank": 78,
      "phone": 1076628506,
      "point": 12,
      "school_id": 26
    },
    {
      "rank": 81,
      "phone": 1075627535,
      "point": 11,
      "school_id": 26
    },
    {
      "rank": 81,
      "phone": 1058610429,
      "point": 11,
      "school_id": 26
    },
    {
      "rank": 81,
      "phone": 1051210386,
      "point": 11,
      "school_id": 26
    },
    {
      "rank": 81,
      "phone": 1083933994,
      "point": 11,
      "school_id": 26
    },
    {
      "rank": 81,
      "phone": 1039527953,
      "point": 11,
      "school_id": 26
    },
    {
      "rank": 81,
      "phone": 1089765418,
      "point": 11,
      "school_id": 26
    },
    {
      "rank": 87,
      "phone": 1057849943,
      "point": 10,
      "school_id": 26
    },
    {
      "rank": 87,
      "phone": 1090796585,
      "point": 10,
      "school_id": 26
    },
    {
      "rank": 87,
      "phone": 1027406254,
      "point": 10,
      "school_id": 26
    },
    {
      "rank": 87,
      "phone": 1064229198,
      "point": 10,
      "school_id": 26
    },
    {
      "rank": 91,
      "phone": 1084873862,
      "point": 9,
      "school_id": 26
    },
    {
      "rank": 91,
      "phone": 1020549727,
      "point": 9,
      "school_id": 26
    },
    {
      "rank": 91,
      "phone": 1041007483,
      "point": 9,
      "school_id": 26
    },
    {
      "rank": 94,
      "phone": 1057631683,
      "point": 8,
      "school_id": 26
    },
    {
      "rank": 94,
      "phone": 1021957381,
      "point": 8,
      "school_id": 26
    },
    {
      "rank": 94,
      "phone": 1045751720,
      "point": 8,
      "school_id": 26
    },
    {
      "rank": 94,
      "phone": 1033168841,
      "point": 8,
      "school_id": 26
    },
    {
      "rank": 98,
      "phone": 1038147981,
      "point": 7,
      "school_id": 26
    },
    {
      "rank": 98,
      "phone": 1062967525,
      "point": 7,
      "school_id": 26
    },
    {
      "rank": 98,
      "phone": 1073700620,
      "point": 7,
      "school_id": 26
    },
    {
      "rank": 98,
      "phone": 1031014485,
      "point": 7,
      "school_id": 26
    },
    {
      "rank": 98,
      "phone": 1086195672,
      "point": 7,
      "school_id": 26
    },
    {
      "rank": 98,
      "phone": 1099439874,
      "point": 7,
      "school_id": 26
    },
    {
      "rank": 104,
      "phone": 1058500223,
      "point": 6,
      "school_id": 26
    },
    {
      "rank": 104,
      "phone": 1031634695,
      "point": 6,
      "school_id": 26
    },
    {
      "rank": 104,
      "phone": 1024103905,
      "point": 6,
      "school_id": 26
    },
    {
      "rank": 104,
      "phone": 1085736063,
      "point": 6,
      "school_id": 26
    },
    {
      "rank": 104,
      "phone": 1027763905,
      "point": 6,
      "school_id": 26
    },
    {
      "rank": 104,
      "phone": 1071942076,
      "point": 6,
      "school_id": 26
    },
    {
      "rank": 104,
      "phone": 1028564867,
      "point": 6,
      "school_id": 26
    },
    {
      "rank": 104,
      "phone": 1044946533,
      "point": 6,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1056684373,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1057974927,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1063575625,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1091027650,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1075626681,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1024223485,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1035764127,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1062875915,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 112,
      "phone": 1045880258,
      "point": 5,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1029622098,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1086453209,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1067881265,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1063892256,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1082659668,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1052664676,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1036636833,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1095975403,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 121,
      "phone": 1085779543,
      "point": 4,
      "school_id": 26
    },
    {
      "rank": 130,
      "phone": 1063228131,
      "point": 3,
      "school_id": 26
    },
    {
      "rank": 130,
      "phone": 1087905532,
      "point": 3,
      "school_id": 26
    },
    {
      "rank": 130,
      "phone": 1084416595,
      "point": 3,
      "school_id": 26
    },
    {
      "rank": 130,
      "phone": 1041077413,
      "point": 3,
      "school_id": 26
    },
    {
      "rank": 130,
      "phone": 1090252444,
      "point": 3,
      "school_id": 26
    },
    {
      "rank": 130,
      "phone": 1096011218,
      "point": 3,
      "school_id": 26
    },
    {
      "rank": 130,
      "phone": 1094646033,
      "point": 3,
      "school_id": 26
    },
    {
      "rank": 130,
      "phone": 1056358380,
      "point": 3,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1052577104,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1024492296,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1057872909,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1046701837,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1096060646,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1048913001,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1062481362,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1056209154,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1087795382,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1099077226,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1035734868,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1087297013,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1031575820,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1025375459,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1056459803,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1051432617,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1025390399,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1082168594,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 138,
      "phone": 1084848150,
      "point": 2,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1099659524,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1086978628,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1092167018,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1039258584,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1047535674,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1067483384,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1076851773,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1065326877,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1055756309,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1075428985,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1098147234,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1030213384,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1071745278,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1023348840,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1041658524,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1022506514,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1039117947,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1062515690,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1041555667,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1056272715,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1075046683,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1093853883,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1066888817,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1024263825,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1040413420,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1038259228,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1039287732,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1047129975,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1049156939,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1062562058,
      "point": 1,
      "school_id": 26
    },
    {
      "rank": 157,
      "phone": 1032778194,
      "point": 1,
      "school_id": 26
    }
  ]

const studentList=[
    {
      rank: 1,
      phone: 1023898528,
      point: 2002,
      school_id: 26
    },
    {
      rank: 2,
      phone: 1041525760,
      point: 835,
      school_id: 26
    },
    {
      rank: 3,
      phone: 1021793677,
      point: 450,
      school_id: 26
    },
    {
      rank: 4,
      phone: 1076884405,
      point: 409,
      school_id: 26
    },
    {
      rank: 5,
      phone: 1066780475,
      point: 258,
      school_id: 26
    },
    {
      rank: 6,
      phone: 1029910003,
      point: 257,
      school_id: 26
    },
    {
      rank: 7,
      phone: 1087593664,
      point: 255,
      school_id: 26
    },
    {
      rank: 8,
      phone: 1041039032,
      point: 239,
      school_id: 26
    },
    {
      rank: 9,
      phone: 1063760818,
      point: 218,
      school_id: 26
    },
    {
      rank: 10,
      phone: 1054445258,
      point: 198,
      school_id: 26
    },
    {
      rank: 11,
      phone: 1086943991,
      point: 190,
      school_id: 26
    },
    {
      rank: 12,
      phone: 1095722947,
      point: 183,
      school_id: 26
    },
    {
      rank: 13,
      phone: 1031820955,
      point: 177,
      school_id: 26
    },
    {
      rank: 14,
      phone: 1095994246,
      point: 176,
      school_id: 26
    },
    {
      rank: 15,
      phone: 1062744134,
      point: 167,
      school_id: 26
    },
    {
      rank: 16,
      phone: 1037554984,
      point: 141,
      school_id: 26
    },
    {
      rank: 17,
      phone: 1049131730,
      point: 135,
      school_id: 26
    },
    {
      rank: 18,
      phone: 1057140617,
      point: 124,
      school_id: 26
    },
    {
      rank: 19,
      phone: 1023880746,
      point: 117,
      school_id: 26
    },
    {
      rank: 20,
      phone: 1049333486,
      point: 113,
      school_id: 26
    },
    {
      rank: 21,
      phone: 1083535298,
      point: 105,
      school_id: 26
    },
    {
      rank: 22,
      phone: 1024493422,
      point: 103,
      school_id: 26
    },
    {
      rank: 23,
      phone: 1094670782,
      point: 102,
      school_id: 26
    },
    {
      rank: 23,
      phone: 1065230723,
      point: 102,
      school_id: 26
    },
    {
      rank: 25,
      phone: 1045734304,
      point: 97,
      school_id: 26
    },
    {
      rank: 25,
      phone: 1085243047,
      point: 97,
      school_id: 26
    },
    {
      rank: 27,
      phone: 1097382947,
      point: 95,
      school_id: 26
    },
    {
      rank: 28,
      phone: 1050493698,
      point: 91,
      school_id: 26
    },
    {
      rank: 29,
      phone: 1045462208,
      point: 85,
      school_id: 26
    },
    {
      rank: 30,
      phone: 1081926322,
      point: 80,
      school_id: 26
    },
    {
      rank: 31,
      phone: 1044426825,
      point: 79,
      school_id: 26
    },
    {
      rank: 32,
      phone: 1056822451,
      point: 73,
      school_id: 26
    },
    {
      rank: 33,
      phone: 1085145630,
      point: 68,
      school_id: 26
    },
    {
      rank: 34,
      phone: 1092893635,
      point: 67,
      school_id: 26
    },
    {
      rank: 35,
      phone: 1049979716,
      point: 60,
      school_id: 26
    },
    {
      rank: 35,
      phone: 1023627750,
      point: 60,
      school_id: 26
    },
    {
      rank: 37,
      phone: 1048909802,
      point: 56,
      school_id: 26
    },
    {
      rank: 38,
      phone: 1052230761,
      point: 54,
      school_id: 26
    },
    {
      rank: 38,
      phone: 1024082163,
      point: 54,
      school_id: 26
    },
    {
      rank: 38,
      phone: 1086013209,
      point: 54,
      school_id: 26
    },
    {
      rank: 41,
      phone: 1037461222,
      point: 52,
      school_id: 26
    },
    {
      rank: 42,
      phone: 1080757431,
      point: 50,
      school_id: 26
    },
    {
      rank: 43,
      phone: 1047731719,
      point: 49,
      school_id: 26
    },
    {
      rank: 44,
      phone: 1050294095,
      point: 48,
      school_id: 26
    },
    {
      rank: 45,
      phone: 1045233891,
      point: 47,
      school_id: 26
    },
    {
      rank: 45,
      phone: 1054890475,
      point: 47,
      school_id: 26
    },
    {
      rank: 47,
      phone: 1082467940,
      point: 44,
      school_id: 26
    },
    {
      rank: 47,
      phone: 1050644131,
      point: 44,
      school_id: 26
    },
    {
      rank: 49,
      phone: 1029996962,
      point: 41,
      school_id: 26
    },
    {
      rank: 50,
      phone: 1093028291,
      point: 40,
      school_id: 26
    },
    {
      rank: 50,
      phone: 1049939825,
      point: 40,
      school_id: 26
    },
    {
      rank: 52,
      phone: 1072425103,
      point: 38,
      school_id: 26
    },
    {
      rank: 53,
      phone: 1086850844,
      point: 37,
      school_id: 26
    },
    {
      rank: 54,
      phone: 1082511327,
      point: 33,
      school_id: 26
    },
    {
      rank: 54,
      phone: 1038262326,
      point: 33,
      school_id: 26
    },
    {
      rank: 56,
      phone: 1033131121,
      point: 32,
      school_id: 26
    },
    {
      rank: 57,
      phone: 1031660190,
      point: 31,
      school_id: 26
    },
    {
      rank: 58,
      phone: 1021968752,
      point: 30,
      school_id: 26
    },
    {
      rank: 59,
      phone: 1030922608,
      point: 29,
      school_id: 26
    },
    {
      rank: 60,
      phone: 1047562313,
      point: 28,
      school_id: 26
    },
    {
      rank: 60,
      phone: 1032958388,
      point: 28,
      school_id: 26
    },
    {
      rank: 62,
      phone: 1044123329,
      point: 27,
      school_id: 26
    },
    {
      rank: 62,
      phone: 1021965618,
      point: 27,
      school_id: 26
    },
    {
      rank: 64,
      phone: 1054761585,
      point: 26,
      school_id: 26
    },
    {
      rank: 65,
      phone: 1089722338,
      point: 25,
      school_id: 26
    },
    {
      rank: 66,
      phone: 1096798972,
      point: 24,
      school_id: 26
    },
    {
      rank: 66,
      phone: 1027283005,
      point: 24,
      school_id: 26
    },
    {
      rank: 66,
      phone: 1021762905,
      point: 24,
      school_id: 26
    },
    {
      rank: 69,
      phone: 1048934036,
      point: 21,
      school_id: 26
    },
    {
      rank: 69,
      phone: 1032996102,
      point: 21,
      school_id: 26
    },
    {
      rank: 71,
      phone: 1089225293,
      point: 20,
      school_id: 26
    },
    {
      rank: 72,
      phone: 1054988407,
      point: 18,
      school_id: 26
    },
    {
      rank: 72,
      phone: 1086724173,
      point: 18,
      school_id: 26
    },
    {
      rank: 72,
      phone: 1062645080,
      point: 18,
      school_id: 26
    },
    {
      rank: 75,
      phone: 1020985497,
      point: 17,
      school_id: 26
    },
    {
      rank: 76,
      phone: 1056257176,
      point: 16,
      school_id: 26
    },
    {
      rank: 77,
      phone: 1031402323,
      point: 13,
      school_id: 26
    },
    {
      rank: 78,
      phone: 1049440343,
      point: 12,
      school_id: 26
    },
    {
      rank: 78,
      phone: 1094626620,
      point: 12,
      school_id: 26
    },
    {
      rank: 78,
      phone: 1076628506,
      point: 12,
      school_id: 26
    },
    {
      rank: 81,
      phone: 1075627535,
      point: 11,
      school_id: 26
    },
    {
      rank: 81,
      phone: 1058610429,
      point: 11,
      school_id: 26
    },
    {
      rank: 81,
      phone: 1051210386,
      point: 11,
      school_id: 26
    },
    {
      rank: 81,
      phone: 1083933994,
      point: 11,
      school_id: 26
    },
    {
      rank: 81,
      phone: 1039527953,
      point: 11,
      school_id: 26
    },
    {
      rank: 81,
      phone: 1089765418,
      point: 11,
      school_id: 26
    },
    {
      rank: 87,
      phone: 1057849943,
      point: 10,
      school_id: 26
    },
    {
      rank: 87,
      phone: 1090796585,
      point: 10,
      school_id: 26
    },
    {
      rank: 87,
      phone: 1027406254,
      point: 10,
      school_id: 26
    },
    {
      rank: 87,
      phone: 1064229198,
      point: 10,
      school_id: 26
    },
    {
      rank: 91,
      phone: 1084873862,
      point: 9,
      school_id: 26
    },
    {
      rank: 91,
      phone: 1020549727,
      point: 9,
      school_id: 26
    },
    {
      rank: 91,
      phone: 1041007483,
      point: 9,
      school_id: 26
    },
    {
      rank: 94,
      phone: 1057631683,
      point: 8,
      school_id: 26
    },
    {
      rank: 94,
      phone: 1021957381,
      point: 8,
      school_id: 26
    },
    {
      rank: 94,
      phone: 1045751720,
      point: 8,
      school_id: 26
    },
    {
      rank: 94,
      phone: 1033168841,
      point: 8,
      school_id: 26
    },
    {
      rank: 98,
      phone: 1038147981,
      point: 7,
      school_id: 26
    },
    {
      rank: 98,
      phone: 1062967525,
      point: 7,
      school_id: 26
    },
    {
      rank: 98,
      phone: 1073700620,
      point: 7,
      school_id: 26
    },
    {
      rank: 98,
      phone: 1031014485,
      point: 7,
      school_id: 26
    },
    {
      rank: 98,
      phone: 1086195672,
      point: 7,
      school_id: 26
    },
    {
      rank: 98,
      phone: 1099439874,
      point: 7,
      school_id: 26
    },
    {
      rank: 104,
      phone: 1058500223,
      point: 6,
      school_id: 26
    },
    {
      rank: 104,
      phone: 1031634695,
      point: 6,
      school_id: 26
    },
    {
      rank: 104,
      phone: 1024103905,
      point: 6,
      school_id: 26
    },
    {
      rank: 104,
      phone: 1085736063,
      point: 6,
      school_id: 26
    },
    {
      rank: 104,
      phone: 1027763905,
      point: 6,
      school_id: 26
    },
    {
      rank: 104,
      phone: 1071942076,
      point: 6,
      school_id: 26
    },
    {
      rank: 104,
      phone: 1028564867,
      point: 6,
      school_id: 26
    },
    {
      rank: 104,
      phone: 1044946533,
      point: 6,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1056684373,
      point: 5,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1057974927,
      point: 5,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1063575625,
      point: 5,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1091027650,
      point: 5,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1075626681,
      point: 5,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1024223485,
      point: 5,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1035764127,
      point: 5,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1062875915,
      point: 5,
      school_id: 26
    },
    {
      rank: 112,
      phone: 1045880258,
      point: 5,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1029622098,
      point: 4,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1086453209,
      point: 4,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1067881265,
      point: 4,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1063892256,
      point: 4,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1082659668,
      point: 4,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1052664676,
      point: 4,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1036636833,
      point: 4,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1095975403,
      point: 4,
      school_id: 26
    },
    {
      rank: 121,
      phone: 1085779543,
      point: 4,
      school_id: 26
    },
    {
      rank: 130,
      phone: 1063228131,
      point: 3,
      school_id: 26
    },
    {
      rank: 130,
      phone: 1087905532,
      point: 3,
      school_id: 26
    },
    {
      rank: 130,
      phone: 1084416595,
      point: 3,
      school_id: 26
    },
    {
      rank: 130,
      phone: 1041077413,
      point: 3,
      school_id: 26
    },
    {
      rank: 130,
      phone: 1090252444,
      point: 3,
      school_id: 26
    },
    {
      rank: 130,
      phone: 1096011218,
      point: 3,
      school_id: 26
    },
    {
      rank: 130,
      phone: 1094646033,
      point: 3,
      school_id: 26
    },
    {
      rank: 130,
      phone: 1056358380,
      point: 3,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1052577104,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1024492296,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1057872909,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1046701837,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1096060646,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1048913001,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1062481362,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1056209154,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1087795382,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1099077226,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1035734868,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1087297013,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1031575820,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1025375459,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1056459803,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1051432617,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1025390399,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1082168594,
      point: 2,
      school_id: 26
    },
    {
      rank: 138,
      phone: 1084848150,
      point: 2,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1099659524,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1086978628,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1092167018,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1039258584,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1047535674,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1067483384,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1076851773,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1065326877,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1055756309,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1075428985,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1098147234,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1030213384,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1071745278,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1023348840,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1041658524,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1022506514,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1039117947,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1062515690,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1041555667,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1056272715,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1075046683,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1093853883,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1066888817,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1024263825,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1040413420,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1038259228,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1039287732,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1047129975,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1049156939,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1062562058,
      point: 1,
      school_id: 26
    },
    {
      rank: 157,
      phone: 1032778194,
      point: 1,
      school_id: 26
    }

]