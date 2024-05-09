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
exports.add_events1715175185780 = void 0;
var collection = 'events';
var eventNames = ['MobgenFest', 'Paintball', 'MobgenFest 2', 'MobgenFest 3'];
var futureDate = new Date();
futureDate.setFullYear(2025);
var oldDate = new Date();
oldDate.setFullYear(2023);
var add_events1715175185780 = /** @class */ (function () {
    function add_events1715175185780() {
    }
    add_events1715175185780.prototype.up = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            var newEvents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newEvents = [
                            {
                                eventName: eventNames[0],
                                eventDate: futureDate,
                                description: 'Hello World',
                                eventType: 'Party',
                                imageUrl: 'img.url',
                                location: {
                                    lat: 43.35525182148881,
                                    long: -8.41937931298951,
                                    name: 'A Coruña',
                                },
                                tags: ['Meal', 'Music'],
                            },
                            {
                                eventName: eventNames[1],
                                eventDate: futureDate,
                                description: 'Hello World',
                                eventType: 'Sport',
                                imageUrl: 'img.url',
                                location: {
                                    lat: 43.35525182148881,
                                    long: -8.41937931298951,
                                    name: 'Vigo',
                                },
                                tags: ['Shoots', 'Sports'],
                            },
                            {
                                eventName: eventNames[2],
                                eventDate: futureDate,
                                description: 'Event with only location.name',
                                eventType: 'Party',
                                imageUrl: 'img.url',
                                location: {
                                    name: 'A Coruña',
                                },
                                tags: ['Meal', 'Music'],
                            },
                            {
                                eventName: eventNames[3],
                                eventDate: oldDate,
                                description: 'Event with eventDate some time ago',
                                eventType: 'Party',
                                imageUrl: 'img.url',
                                location: {
                                    lat: 43.35525182148881,
                                    long: -8.41937931298951,
                                    name: 'A Coruña',
                                },
                                tags: ['Meal', 'Music'],
                            },
                        ];
                        return [4 /*yield*/, db.collection(collection).insertMany(newEvents)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    add_events1715175185780.prototype.down = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.collection(collection).deleteMany({
                            eventName: { $in: eventNames },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return add_events1715175185780;
}());
exports.add_events1715175185780 = add_events1715175185780;
