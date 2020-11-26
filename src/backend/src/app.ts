import express from "express";
import cors from "cors";
import morgan from 'morgan';
import { MongoRepository, Repository } from "typeorm";
import { Plate } from "./entity/Plate";
import { RouterListEntry } from './index.d';

export class App {
  // Properties.
  port: number;
  app: express.Application;
  routers: RouterListEntry[];
  plateRepository: MongoRepository<Plate> | Repository<Plate>;

  // Constructor.
  constructor(
    port: number,
    routers: RouterListEntry[],
    plateRepository: MongoRepository<Plate> | Repository<Plate>
  ) {
    this.port = port;
    this.app = express();
    this.routers = routers;
    this.plateRepository = plateRepository;
  }

  // Initialize the application.
  initialize() {
    console.log("Initializing...");
    // Middleware initialization.
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan('common'))

    // Route initialization.
    this.routers.forEach(({prefix, router}: RouterListEntry) => {
      this.app.use(prefix, router);
    });
    console.log("Done initializing!");
  }

  // Start the server.
  startup() {
    // Start listening.
    this.app.listen(this.port, () =>
      console.log("Listening on port:", this.port)
    );
  }

  // Run the server from start to finish.
  run() {
    this.initialize();
    this.startup();
  }
}
