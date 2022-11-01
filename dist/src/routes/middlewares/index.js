"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyOwner = exports.needPK = void 0;
const __1 = require("..");
//middleware
const needPK = (req, res, next) => {
    const privateKey = req.get('PK');
    if (privateKey) {
        req.pk = privateKey;
        next();
    }
    else {
        res.status(400).json({ success: false, message: `유저의 privateKey를 보내주세요`, data: null });
    }
};
exports.needPK = needPK;
//middleware
const onlyOwner = (req, res, next) => {
    const owner = req.get('OWNER');
    if (owner) {
        if (owner === __1.OWNER_PRIVATE_KEY) {
            req.owner = owner;
            console.log(owner);
            next();
        }
        else {
            res.status(400).json({ success: false, message: `불일치`, data: null });
        }
    }
    else {
        res.status(400).json({ success: false, message: `owner 값 없음`, data: null });
    }
};
exports.onlyOwner = onlyOwner;
//# sourceMappingURL=index.js.map