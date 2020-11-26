// TypeORM imports.
import "reflect-metadata";
import {
  Connection,
  createConnection,
  MongoRepository,
  Repository,
} from "typeorm";

// Custom imports.
import { App } from "./app";
import { BoilerRouter } from "./routes/plates";

// Model imports.
import { Plate } from "./entity/Plate";
import { RouterListEntry } from "./index.d";

// Connect to database.
const getPlateRepository = async (): Promise<
  MongoRepository<Plate> | Repository<Plate>
> => {
  return await createConnection({
    type: "mongodb",
    database: "test",
    entities: [__dirname + "/entity/*.js"],
    synchronize: true,
  }).then(async (connection) => connection.getRepository(Plate));
};

// Create and run application.
const main = async () => {
  const routers: RouterListEntry[] = [];
  const plateRepository = await getPlateRepository();
  const plateRouter = new BoilerRouter(plateRepository).router;
  routers.push({router: plateRouter, prefix: "/"})
  const application = new App(5000, routers, plateRepository);
  application.run();
};

export default main;