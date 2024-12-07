"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieContent = exports.hello = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const functions_1 = require("./adapter/entry-points/functions");
dotenv_1.default.config();
const hello = (name) => `hello ${name}`;
exports.hello = hello;
exports.getCookieContent = functions_1.functionGetCookieContent;
//# sourceMappingURL=index.js.map