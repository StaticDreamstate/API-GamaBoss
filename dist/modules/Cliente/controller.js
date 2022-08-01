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
const Images_1 = __importDefault(require("../../models/Images"));
const Clients_1 = __importDefault(require("../../models/Clients"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../../infra/logger"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const controller = {
    start(req, res) {
        return res.status(200).json("API em execução.");
    },
    createClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash = bcryptjs_1.default.hashSync(req.body.senha, 10);
                const { nome, email, senha, telefone, whatsapp } = req.body;
                const { file } = req;
                const savedClient = yield Clients_1.default.count({
                    email,
                });
                if (savedClient) {
                    logger_1.default.warn(`[createClient] Tentativa repetida de cadastro: ${req.socket.remoteAddress}`);
                    return res.status(400).json("Email já cadastrado no banco");
                }
                const image = yield Images_1.default.create({
                    link: `${path_1.default.resolve("uploads", "images")}${file === null || file === void 0 ? void 0 : file.filename}`,
                    nome: file === null || file === void 0 ? void 0 : file.filename,
                });
                const newClient = yield Clients_1.default.create(Object.assign(Object.assign({}, req.body), { senha: hash, images: [image._id] }));
                logger_1.default.info(`[createClient] Cliente cadastrado: ${req.socket.remoteAddress}`);
                return res.status(201).json(newClient);
            }
            catch (error) {
                logger_1.default.error(`[createClient] Erro de cadastro do cliente: ${error} - ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
};
exports.default = controller;
