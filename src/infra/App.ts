import Express, { Application } from "express";
import ENV from "./config/env";
import logger from "./logger";
import detect from "detect-port";
import { mongoDB } from "../database";
import BaseRoutes from "./BaseRoutes";
import cors from "cors";
import path from "path";

type SetupOptions = {
  test?: boolean;
  port?: number;
};

export default class App {
  private instance: Application;
  private defaultPort: any = process.env.PORT || 8080;

  constructor() {
    this.instance = Express();
  }

  async setup(options: SetupOptions): Promise<void> {
    await mongoDB.createConnection();
    const selectedPort = options.port ? options.port : this.defaultPort;
    this.instance.use(cors());
    this.instance.use(Express.json());
    this.instance.use(Express.static((path.resolve(process.cwd(), 'uploads/images'))));
    this.instance.use(BaseRoutes);
    

    if (options.test) {
      console.log("[OK] Teste de configuração.");
      console.log(`API: ${ENV.API_NAME}`);
      console.log(`Porta TCP: ${selectedPort}`);
      console.log(`Banco de dados: ${ENV.DB_NAME}`);
      console.log("Saindo...");
      logger.info("[setup] Teste de configuração executado.");
      return;
    }

    detect(selectedPort)
      .then(_port => {
        if (selectedPort == _port) {
          this.instance.listen(process.env.PORT || selectedPort, () => {
            console.log(`[OK] API aguardando requisições... [Porta TCP ${selectedPort}]`);
            logger.info("[setup] API em execução.");
          })
        } else {
          logger.warn("[setup] Conexão Recusada: Porta em Uso.");
        }
      })
      .catch(err => {
        logger.error("[setup] Conexão Recusada:" + err);
      });

  }

  getInstance() {
    return this.instance;
  }
}