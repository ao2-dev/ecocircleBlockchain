import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import createError from 'http-errors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import Router from './routes/index';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpecs } from './modules/swagger';
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });


//   app.listen('1234', ()=>{
//     console.log(`
//     ################################################
//     🛡️  Server listening on port: 1234🛡️
//     ################################################
//     `)
// })
  
app.listen(PORT, ()=>{
    console.log(`
    ################################################
    🛡️  Server listening on port: ${PORT}🛡️
    ################################################
    `)
})