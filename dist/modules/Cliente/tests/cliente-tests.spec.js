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
const supertest_1 = __importDefault(require("supertest"));
const App_1 = __importDefault(require("../../../infra/App"));
const faker_1 = require("@faker-js/faker");
const path_1 = __importDefault(require("path"));
describe("GET /", () => {
    test("Verifica se a API está executando.", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = new App_1.default();
        yield app.setup({
            test: true,
        });
        const instance = app.getInstance();
        const response = yield (0, supertest_1.default)(instance).get("/");
        expect(response.statusCode).toEqual(200);
    }));
});
describe("POST /cadastro", () => {
    describe("Cadastro parcial", () => {
        test("Deve retornar um status 201 em caso de sucesso.", () => __awaiter(void 0, void 0, void 0, function* () {
            const app = new App_1.default();
            yield app.setup({
                test: true,
            });
            const instance = app.getInstance();
            const response = yield (0, supertest_1.default)(instance).post("/cadastro").send({
                nome: faker_1.faker.name.firstName(),
                email: faker_1.faker.internet.email(),
                senha: faker_1.faker.internet.password(),
            });
            expect(response.statusCode).toEqual(201);
        }));
        test("Completo: Deve retornar um status 201 em caso de sucesso.", () => __awaiter(void 0, void 0, void 0, function* () {
            const app = new App_1.default();
            yield app.setup({
                test: true,
            });
            const instance = app.getInstance();
            const response = yield (0, supertest_1.default)(instance).post("/cadastro").send({
                nome: faker_1.faker.name.firstName(),
                email: faker_1.faker.internet.email(),
                senha: faker_1.faker.internet.password(),
                telefone: faker_1.faker.phone.number(),
                whatsapp: faker_1.faker.phone.number(),
                avatar: path_1.default.resolve("home", "user", "Imagens", "imagem.jpg"),
            });
            expect(response.statusCode).toEqual(201);
        }));
        test("Cadastro de usuário repetido.", () => __awaiter(void 0, void 0, void 0, function* () {
            const app = new App_1.default();
            yield app.setup({
                test: true,
            });
            const instance = app.getInstance();
            const response = yield (0, supertest_1.default)(instance).post("/cadastro").send({
                nome: "golden",
                email: "golden@email.com",
                senha: faker_1.faker.internet.password(),
            });
            expect(response.statusCode).toEqual(400);
        }));
    });
});
