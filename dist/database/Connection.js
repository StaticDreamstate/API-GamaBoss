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
const mongoose_1 = require("mongoose");
const logger_1 = __importDefault(require("../infra/logger"));
class Connection {
    constructor(url_connection) {
        this.url_connection = url_connection;
    }
    getInstance() {
        return this.instance;
    }
    createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.instance = yield (0, mongoose_1.connect)(this.url_connection);
                logger_1.default.info("[createConnection] Conexão com o banco de dados realizada.");
            }
            catch (error) {
                logger_1.default.error(`[createConnection] Conexão Recusada: ${error}`);
            }
        });
    }
}
exports.default = Connection;
