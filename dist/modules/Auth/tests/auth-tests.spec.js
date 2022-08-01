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
let novoHash = "";
describe("POST /login", () => {
    test("Login de usuário já cadastrado", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = new App_1.default();
        yield app.setup({
            test: true,
        });
        const instance = app.getInstance();
        const response = yield (0, supertest_1.default)(instance).post("/login").send({
            email: "golden@email.com",
            senha: "1234abcd",
        });
        expect(response.statusCode).toEqual(200);
    }));
    test("Usuário não cadastrado tentando fazer login", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = new App_1.default();
        yield app.setup({
            test: true,
        });
        const instance = app.getInstance();
        const response = yield (0, supertest_1.default)(instance).post("/login").send({
            email: faker_1.faker.internet.email(),
            senha: faker_1.faker.internet.password(),
        });
        expect(response.statusCode).toEqual(400);
    }));
    test("Senha inválida", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = new App_1.default();
        yield app.setup({
            test: true,
        });
        const instance = app.getInstance();
        const response = yield (0, supertest_1.default)(instance).post("/login").send({
            email: "golden@email.com",
            senha: faker_1.faker.internet.password(),
        });
        expect(response.statusCode).toEqual(401);
    }));
});
describe("POST /reset-senha", () => {
    test("Usuário não encontrado", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = new App_1.default();
        yield app.setup({
            test: true,
        });
        const instance = app.getInstance();
        const response = yield (0, supertest_1.default)(instance).post("/reset-senha").send({
            email: faker_1.faker.internet.email(),
        });
        expect(response.statusCode).toEqual(404);
    }));
    test("Gerando novo hash para o usuário", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = new App_1.default();
        yield app.setup({
            test: true,
        });
        const instance = app.getInstance();
        const response = yield (0, supertest_1.default)(instance).post("/reset-senha").send({
            email: "golden@email.com",
        });
        expect(response.statusCode).toEqual(200);
        if (response.statusCode === 200) {
            novoHash = response.body;
            console.log(novoHash);
        }
    }));
});
