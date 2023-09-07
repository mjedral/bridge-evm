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
var _this = this;
var ethers = require("ethers");
require("dotenv").config();
// CONNECT TO BLOCKCHAIN
var goerli_provider = process.env.PROVIDER_GOERLI;
var besu_provider = process.env.PROVIDER_BESU;
var key = process.env.PRIVATE_KEY;
// BRIDGE SMART CONTRACTS
var besuAddress = process.env.BESU_SC;
var goerliAddress = process.env.GOERLI_SC;
// TOKEN ADDRESSES
var tokenBesu = process.env.TOKEN_BESU;
var tokenGoerli = process.env.TOKEN_GOERLI;
// ABI
var besuAbi = require("../json/bridge.json");
var goerliAbi = require("../json/bridge.json");
var targetTokenAbi = require("../json/targetToken.json");
var sourceTokenAbi = require("../json/sourceToken.json");
// THE MAIN FUNCTION
var main = function () { return __awaiter(_this, void 0, void 0, function () {
    var besuProvider, besuWallet, goerliProvider, goerliWallet, besuBridge, goerliBridge, besuToken, goerliToken, sendTokensFromBesu, sendTokensFromGoerli;
    var _this = this;
    return __generator(this, function (_a) {
        // CONNECT TO Besu admin
        console.log("Connecting to Besu...");
        besuProvider = new ethers.providers.JsonRpcProvider(besu_provider);
        besuWallet = new ethers.Wallet(String(key), besuProvider);
        console.log("Connected! \n");
        console.log("Connecting to Goerli testnet...");
        goerliProvider = new ethers.providers.JsonRpcProvider(goerli_provider);
        goerliWallet = new ethers.Wallet(String(key), goerliProvider);
        console.log("Connected! \n");
        // CONNECT TO THE BRIDGE SMART CONTRACT ON EACH NETWORK
        console.log("Connecting to Besu bridge...");
        besuBridge = new ethers.Contract(besuAddress, besuAbi, besuWallet);
        console.log("Connected! \n");
        console.log("Connecting to Goerli bridge...");
        goerliBridge = new ethers.Contract(goerliAddress, goerliAbi, goerliWallet);
        console.log("Connected! \n");
        // CONNECT TO THE TOKEN SMART CONTRACT ON EACH NETWORK
        console.log("Connecting to Besu erc-20 token...");
        besuToken = new ethers.Contract(tokenBesu, sourceTokenAbi, besuWallet);
        console.log("Connected! \n");
        console.log("Connecting to Goerli erc-20 token...");
        goerliToken = new ethers.Contract(tokenGoerli, targetTokenAbi, goerliWallet);
        console.log("Connected! \n");
        sendTokensFromBesu = function (address, amount) { return __awaiter(_this, void 0, void 0, function () {
            var gasLimit, tx, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("Sending from Besu bridge...");
                        console.log("To: " + address);
                        console.log("Amount: " + amount);
                        return [4 /*yield*/, besuBridge.estimateGas.sendTokens(address, amount, {
                                from: besuWallet.address,
                            })];
                    case 1:
                        gasLimit = _a.sent();
                        return [4 /*yield*/, besuBridge.sendTokens(address, amount, {
                                from: besuWallet.address,
                                gasLimit: gasLimit.toString(),
                            })];
                    case 2:
                        tx = _a.sent();
                        tx.wait();
                        console.log("Sent!");
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log("Error: " + error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        sendTokensFromGoerli = function (address, amount) { return __awaiter(_this, void 0, void 0, function () {
            var gasLimit, tx, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("Sending from Goerli bridge...");
                        console.log("To: " + address);
                        console.log("Amount: " + amount);
                        return [4 /*yield*/, goerliBridge.estimateGas.sendTokens(address, amount, { from: goerliWallet.address })];
                    case 1:
                        gasLimit = _a.sent();
                        return [4 /*yield*/, goerliBridge.sendTokens(address, amount, {
                                from: goerliWallet.address,
                                gasLimit: gasLimit.toString(),
                            })];
                    case 2:
                        tx = _a.sent();
                        tx.wait();
                        console.log("Sent!");
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log("Error: " + error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // LISTEN FOR TRANSFER EVENTS ON BESU
        besuToken.on("Transfer", function (from, to, value) {
            var info = {
                from: from,
                to: to,
                value: value,
            };
            if (String(to) === besuAddress) {
                try {
                    sendTokensFromBesu(String(info.from), String(info.value));
                }
                catch (error) {
                    console.log("Error on transfer from besu bridge: " + error);
                }
            }
        });
        // LISTEN FOR TRANSFER EVENTS ON GOERLI
        goerliToken.on("Transfer", function (from, to, value) {
            var info = {
                from: from,
                to: to,
                value: value,
            };
            if (String(to) === goerliAddress) {
                try {
                    sendTokensFromGoerli(String(info.from), String(info.value));
                }
                catch (error) {
                    console.log("Error on transfer from besu bridge: " + error);
                }
            }
        });
        return [2 /*return*/];
    });
}); };
main();
