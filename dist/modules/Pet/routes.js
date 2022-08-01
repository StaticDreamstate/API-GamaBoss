"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const imgUpload_1 = __importDefault(require("../../infra/middlewares/imgUpload"));
const routes = (0, express_1.Router)();
routes.post("/cadastrar-pet", imgUpload_1.default.single("avatar"), controller_1.default.createPet);
routes.get("/listar-pets", controller_1.default.getPets);
routes.get("/listar-pet/:id", controller_1.default.getPetById);
routes.put("/editar-pet/:id", imgUpload_1.default.single("avatar"), controller_1.default.editPet);
routes.delete("/deletar-pet/:id", controller_1.default.deletePet);
exports.default = routes;
