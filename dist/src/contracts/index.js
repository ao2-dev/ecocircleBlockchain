"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = exports.Token = void 0;
const Token_json_1 = __importDefault(require("../../build/contracts/Token.json"));
const Test_json_1 = __importDefault(require("../../build/contracts/Test.json"));
exports.Token = {
    abi: Token_json_1.default.abi,
    address: Token_json_1.default.networks[3].address,
};
exports.Test = {
    abi: Test_json_1.default.abi,
    address: Test_json_1.default.networks[3].address,
};
//# sourceMappingURL=index.js.map