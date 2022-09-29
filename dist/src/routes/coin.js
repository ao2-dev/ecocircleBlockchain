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
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Coin
 *   description: 코인(이더리움 등) 시세 및 기타정보
 */
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ success: true, message: '성공', data: 'coin' });
}));
/**
   * @swagger
   * /coin/price/{coinId}:
   *   get:
   *     summary: 코인 가격 조회 (달러, 원화) [C-1]
   *     parameters:
   *       - in: path
   *         name: coinId
   *         schema:
   *           type: string
   *           enum: [ethereum, matic-network]
   *         required: true
   *         description: 조회하고자 하는 코인의 id
   *     tags:
   *      - Coin
   *     description: 코인 가격 조회 (달러, 원화) [C-1]
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseT'
   *
   *
   */
router.get('/price/:coinId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const coinId = req.params['coinId'];
    try {
        yield _1.CoinGeckoClient.coins.fetch(coinId, {}).then(info => {
            const name = info.data.name;
            const usd = info.data.market_data.current_price.usd;
            const krw = info.data.market_data.current_price.krw;
            res.status(200).json({ success: true, message: `코인 가격 정보 조회 성공!`, data: {
                    name: name,
                    coinId: coinId,
                    usd: usd,
                    krw: krw,
                } });
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: `코인 가격 정보 조회 실패 : ${err}`, data: null });
    }
}));
exports.default = router;
//# sourceMappingURL=coin.js.map