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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var index_js_1 = require("../../dist/index.js");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var network, tx, mappedError;
        return __generator(this, function (_a) {
            try {
                console.log('Fetching network config for testnet...');
                network = (0, index_js_1.getNetwork)('testnet');
                console.log('Connected to:', network.url);
                console.log('\nBuilding a payment transaction...');
                tx = (0, index_js_1.buildPayment)({
                    source: 'GBOQWQOJ7D365F5C3LHTDOKP72KUXHTN3P7D77K4R6X3NBYHHLHYHTM5',
                    sourceSequence: '1234567890',
                    destination: 'GCMT4P2ONJUBIUKD43UUG4D6PBYVBNQGMW3Y6IHDNBNGDBT7E76L32C3',
                    assetCode: 'XLM',
                    amount: '10.5',
                    network: 'testnet'
                });
                console.log('Transaction built successfully!');
                console.log('XDR:', tx.toEnvelope().toXDR('base64'));
                console.log('\nSimulating an error...');
                // Deliberately cause an error (invalid amount format)
                (0, index_js_1.buildPayment)({
                    source: 'GBOQWQOJ7D365F5C3LHTDOKP72KUXHTN3P7D77K4R6X3NBYHHLHYHTM5',
                    sourceSequence: '1',
                    destination: 'GCMT4P2ONJUBIUKD43UUG4D6PBYVBNQGMW3Y6IHDNBNGDBT7E76L32C3',
                    assetCode: 'XLM',
                    amount: '-5.0', // invalid amount
                    network: 'testnet'
                });
            }
            catch (error) {
                mappedError = (0, index_js_1.mapStellarError)(error);
                console.error('Caught mapped error:', mappedError.message);
                if (mappedError.originalError) {
                    console.error('Original type:', typeof mappedError.originalError);
                }
            }
            return [2 /*return*/];
        });
    });
}
main();
