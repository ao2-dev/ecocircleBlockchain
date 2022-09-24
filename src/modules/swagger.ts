
import swaggereJsdoc from 'swagger-jsdoc'
import { HOST } from '../utils/constants';
// const swaggerUi = require('swagger-ui-express');
//const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Ecocircle Blockchain API',
            version: '1.0.0',
            description: 'Ecocircle API for communicating samrt contract',
        },
        host: HOST,
        basePath: '/',
   
    },
    apis: ['./src/routes/*.ts', './swagger/*'],
    // paths: {
    //     "/token" :{
    //         get:{
    //             summary:"getToken name",
    //             responses: {

    //             }
    //         }
    //     }
    // }
};

export const swaggerSpecs = swaggereJsdoc(options);

// export default {
//     swaggerUi,
//     specs
// }
