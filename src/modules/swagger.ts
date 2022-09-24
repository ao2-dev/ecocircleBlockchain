
import swaggereJsdoc from 'swagger-jsdoc'
// const swaggerUi = require('swagger-ui-express');
//const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        host: 'localhost:1234',
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
