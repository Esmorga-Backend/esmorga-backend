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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.change_password_with_argon21719909591756 = void 0;
var argon2 = require("argon2");
var crypto_1 = require("crypto");
var collection = 'users';
function encodeValue(value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, argon2.hash(value)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function hash(value) {
    return (0, crypto_1.createHash)('sha256').update(value).digest('hex');
}
var USERS_TO_UPDATE = [
    {
        email: 'esmorga.test.04@yopmail.com',
        password: 'Password!4',
        encodedPassword: '',
    },
    {
        email: 'esmorga.test.05@yopmail.com',
        password: 'Password!5',
        encodedPassword: '',
    },
    {
        email: 'esmorga.test.06@yopmail.com',
        password: 'Password!6',
        encodedPassword: '',
    },
];
var change_password_with_argon21719909591756 = /** @class */ (function () {
    function change_password_with_argon21719909591756() {
    }
    change_password_with_argon21719909591756.prototype.up = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, promises;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = USERS_TO_UPDATE[0];
                        return [4 /*yield*/, encodeValue(USERS_TO_UPDATE[0].password)];
                    case 1:
                        _a.encodedPassword = _d.sent();
                        _b = USERS_TO_UPDATE[1];
                        return [4 /*yield*/, encodeValue(USERS_TO_UPDATE[1].password)];
                    case 2:
                        _b.encodedPassword = _d.sent();
                        _c = USERS_TO_UPDATE[2];
                        return [4 /*yield*/, encodeValue(USERS_TO_UPDATE[2].password)];
                    case 3:
                        _c.encodedPassword = _d.sent();
                        promises = USERS_TO_UPDATE.map(function (user) {
                            return db
                                .collection(collection)
                                .updateOne({ email: { $eq: user.email } }, { $set: { password: user.encodedPassword } });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 4:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    change_password_with_argon21719909591756.prototype.down = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = USERS_TO_UPDATE.map(function (user) {
                            return db
                                .collection(collection)
                                .updateOne({ email: { $eq: user.email } }, { $set: { password: hash(user.password) } });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return change_password_with_argon21719909591756;
}());
exports.change_password_with_argon21719909591756 = change_password_with_argon21719909591756;
