"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbiFromJsonFile = void 0;
var fs = require("fs");
var path = require("path");
var getAbiFromJsonFile = function (abiPath) {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, abiPath)).toString()).abi;
};
exports.getAbiFromJsonFile = getAbiFromJsonFile;
