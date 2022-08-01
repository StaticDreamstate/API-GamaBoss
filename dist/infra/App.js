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
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./logger"));
const detect_port_1 = __importDefault(require("detect-port"));
const database_1 = require("../database");
const BaseRoutes_1 = __importDefault(require("./BaseRoutes"));
const cors_1 = __importDefault(require("cors"));
class App {
    constructor() {
        this.defaultPort = process.env.PORT || 8080;
        this.instance = (0, express_1.default)();
    }
    setup(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.mongoDB.createConnection();
            const selectedPort = options.port ? options.port : this.defaultPort;
            this.instance.use((0, cors_1.default)());
            this.instance.use(express_1.default.json());
            this.instance.use(express_1.default.static("uploads"));
            this.instance.use(BaseRoutes_1.default);
            if (options.test) {
                console.log("[OK] Teste de configuração.");
                console.log(`API: ${env_1.default.API_NAME}`);
                console.log(`Porta TCP: ${selectedPort}`);
                console.log(`Banco de dados: ${env_1.default.DB_NAME}`);
                console.log("Saindo...");
                logger_1.default.info("[setup] Teste de configuração executado.");
                return;
            }
            (0, detect_port_1.default)(selectedPort)
                .then(_port => {
                if (selectedPort == _port) {
                    this.instance.listen(process.env.PORT || selectedPort, () => {
                        console.log(`[OK] API aguardando requisições... [Porta TCP ${selectedPort}]`);
                        logger_1.default.info("[setup] API em execução.");
                    });
                }
                else {
                    logger_1.default.warn("[setup] Conexão Recusada: Porta em Uso.");
                }
            })
                .catch(err => {
                logger_1.default.error("[setup] Conexão Recusada:" + err);
            });
        });
    }
    getInstance() {
        return this.instance;
    }
}
exports.default = App;
