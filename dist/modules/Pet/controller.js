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
const Pets_1 = __importDefault(require("../../models/Pets"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../../infra/logger"));
const Pets_2 = __importDefault(require("../../models/Pets"));
const controller = {
    createPet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, dono, raca, idade, peso } = req.body;
                const { file } = req;
                const savedPet = yield Pets_1.default.count({
                    nome,
                    dono,
                    raca,
                    idade,
                    peso,
                });
                if (savedPet) {
                    logger_1.default.warn(`[createPet]Tentativa repetida de cadastro do pet:${req.socket.remoteAddress}`);
                    return res.status(400).json("Pet já cadastrado no banco");
                }
                const image = yield Images_1.default.create({
                    link: `${path_1.default.resolve("uploads", "images")}${file === null || file === void 0 ? void 0 : file.filename}`,
                    nome: file === null || file === void 0 ? void 0 : file.filename,
                });
                const newPet = yield Pets_1.default.create(Object.assign(Object.assign({}, req.body), { images: [image._id] }));
                logger_1.default.info(`[createPet]Pet cadastrado: ${req.socket.remoteAddress}`);
                return res.status(201).json(newPet);
            }
            catch (error) {
                logger_1.default.error(`[createPet]Erro ao cadastrar pet: ${error}-  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    getPets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPets = yield Pets_2.default.find().sort({ updated_at: -1 });
                return res.status(200).json(allPets);
            }
            catch (error) {
                logger_1.default.error(`[getPets]Erro ao consultar lista: ${error}-  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    getPetById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const pet = yield Pets_2.default.findOne({ _id: id });
                return res.status(200).json(pet);
            }
            catch (error) {
                logger_1.default.error(`[getPetById]Erro ao consultar pet: ${error}-  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    editPet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, dono, raca, idade, peso } = req.body;
                const { file } = req;
                const image = yield Images_1.default.create({
                    link: `${path_1.default.resolve("uploads", "images")}${file === null || file === void 0 ? void 0 : file.filename}`,
                    nome: file === null || file === void 0 ? void 0 : file.filename,
                });
                const petUpdate = yield Pets_2.default.findOneAndUpdate({ _id: id }, Object.assign(Object.assign({}, req.body), { images: [image._id] }), {
                    new: true,
                });
                return res.status(200).json(petUpdate);
            }
            catch (error) {
                logger_1.default.error(`[getPetById]Erro ao atualizar dados do pet: ${error}-  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    deletePet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield Pets_2.default.deleteOne({ _id: id });
                return res.sendStatus(204);
            }
            catch (error) {
                logger_1.default.error(`[deletePet]Erro ao deletar pet do banco: ${error}-  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
};
exports.default = controller;
