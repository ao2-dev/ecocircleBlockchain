import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import createError from 'http-errors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import Router from './routes/index';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpecs } from './modules/swagger';
import cors from 'cors';
//import cors from 'cors';


dotenv.config()

const app = express();
const PORT = process.env.PORT
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/', Router);

app.use(cors({
  origin: 'http://127.0.0.1:3000',
}))
//catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });




//export const socket=new WebSocet.Server({port:1235});

// socket.on('connection', (ws:any, req:any)=> {
//   const ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   console.log('새로운 클라이언트 접속',ip);
//   ws.on('message', (message:any)=> {
//     console.log(message);
//   });

//   ws.on('error', (err:any)=>{
//     console.log(`error !!:${err}`);
//   });

//   ws.on('close', ()=>{
//     console.log('클라이언트 접속 해제',ip);
 
//   });
// })

// app.listen('1234', ()=>{
//   console.log(`
//   ################################################
//   🛡️  Server listening on port: 1234🛡️
//   ################################################
//   `)
// })

// const wsProvider= new ethers.providers.WebSocketProvider(INFURA_ROPSTEN_WEBSOCKET!,"ropsten");
// wsProvider.on("pending",(txHash)=>{
//   wsProvider.getTransaction(txHash).then((tx)=>{
//     console.log(tx);
//   })
//  })
//const socket=new WebSocket("ws://localhost:1235")


app.listen(PORT, ()=>{
    console.log(`
    ################################################
    🛡️  Server listening on port: ${PORT}🛡️
    ################################################
    `)
})

