"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpecs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
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
exports.swaggerSpecs = (0, swagger_jsdoc_1.default)(options);
// export default {
//     swaggerUi,
//     specs
// }
//# sourceMappingURL=swagger.js.map