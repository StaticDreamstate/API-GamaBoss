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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Clients_1 = __importDefault(require("../../models/Clients"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const logger_1 = __importDefault(require("../../infra/logger"));
const env_1 = __importDefault(require("../../infra/config/env"));
const controller = {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, senha } = req.body;
                const savedClient = yield Clients_1.default.findOne({
                    email: email
                });
                if (!savedClient) {
                    logger_1.default.warn(`[login] Email não cadastrado: ${req.socket.remoteAddress}`);
                    return res.status(400).json("Email não cadastrado no banco");
                }
                const validPass = bcryptjs_1.default.compareSync(senha, savedClient.senha);
                if (!validPass) {
                    logger_1.default.error(`[login] Erro de login: ${req.socket.remoteAddress}`);
                    return res.status(401).json("Email ou senha inválidos.");
                }
                const token = jsonwebtoken_1.default.sign({
                    id: savedClient._id,
                    email: savedClient.email,
                    nome: savedClient.nome,
                }, env_1.default.KEY);
                return res.status(200).json(token);
            }
            catch (error) {
                logger_1.default.error(`[login] Erro: ${error} - ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    gerarNovoHash(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`[reset] Requisição de reset de senha: ${req.socket.remoteAddress}`);
                const { email } = req.body;
                const savedClient = yield Clients_1.default.findOne({
                    email: email
                });
                if (!savedClient) {
                    logger_1.default.error(`[reset] Usuário não encontrado: ${req.socket.remoteAddress}`);
                    return res.status(404).json("Email não encontrado");
                }
                logger_1.default.info(`[reset] Usuário = ${JSON.stringify(savedClient.email)} : ${req.socket.remoteAddress}`);
                const token = crypto_js_1.default.AES.encrypt(`${savedClient.email}`, env_1.default.KEY).toString();
                savedClient.hashReset = token;
                yield savedClient.save();
                logger_1.default.info(`[reset] Hash gerado: ${req.socket.remoteAddress}`);
                return res.status(200).json(token);
            }
            catch (error) {
                logger_1.default.error(`[reset] Erro: ${error} - ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    recuperarSenha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`[recuperarSenha] Recuperação de senha em progresso: ${req.socket.remoteAddress}`);
                const { token, senha } = req.body;
                const bytes = crypto_js_1.default.AES.decrypt(token, env_1.default.KEY);
                const email = bytes.toString(crypto_js_1.default.enc.Utf8);
                if (!email) {
                    logger_1.default.error(`[recuperarSenha] Token inválido - Email não existe:  ${req.socket.remoteAddress}`);
                    return res.status(400).json("token invalido");
                }
                const savedClient = yield Clients_1.default.findOne({
                    email: email
                });
                if (!savedClient) {
                    logger_1.default.error(`[recuperarSenha] Email não encontrado email= ${email} - ${req.socket.remoteAddress}`);
                    return res.status(404).json("Email não encontrado");
                }
                if (!savedClient.hashReset || savedClient.hashReset !== token) {
                    logger_1.default.error(`[recuperarSenha] Token diferente/Inexistente no banco de dados - ${req.socket.remoteAddress}`);
                    return res.status(400).json("token invalido");
                }
                if (bcryptjs_1.default.compareSync(senha, savedClient.senha)) {
                    logger_1.default.error(`[recuperarSenha] Tentativa de mudança com a mesma senha - ${req.socket.remoteAddress}`);
                    return res.status(400).json("Senha ja utilizada");
                }
                const newSenha = bcryptjs_1.default.hashSync(senha, 10);
                savedClient.senha = newSenha;
                savedClient.hashReset = null;
                yield savedClient.save();
                logger_1.default.info(`[recuperarSenha] Senha alterada: ${req.socket.remoteAddress}`);
                return res.sendStatus(201);
            }
            catch (error) {
                logger_1.default.error(`[recuperarSenha] Erro: ${error} - ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    }
};
exports.default = controller;
