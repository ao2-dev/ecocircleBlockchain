"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpecs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const constants_1 = require("../utils/constants");
// const swaggerUi = require('swagger-ui-express');
//const swaggereJsdoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Ecocircle Blockchain API',
            version: '1.0.0',
            description: `${constants_1.HOST}docs`,
        },
        host: constants_1.HOST,
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