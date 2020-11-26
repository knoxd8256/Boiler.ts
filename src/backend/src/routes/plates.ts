import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { MongoRepository, Repository } from "typeorm";
import { Plate } from "../entity/Plate";

interface RouteCallback {
  (req: Request, res: Response): void;
}

// Class to contain router information with a referencce to the plate repo.
class BoilerRouter {
  // Declare properties.
  router: Router;
  repository: MongoRepository<Plate> | Repository<Plate>;

  constructor(repository: MongoRepository<Plate> | Repository<Plate>) {
    // Create a router and import the repository.
    this.router = Router();
    this.repository = repository;

    // Register routes.
    this.router.route("/").get(this.getAllPlates(this));
    this.router.route("/plate/:id").get(this.getPlateById(this));
    this.router.route("/plate").post(this.postOnePlate(this));
    this.router.route("/plate/:id").delete(this.deleteOnePlate(this));
  }

  // ---- Generators for route callbacks ---- //
  getAllPlates(router: BoilerRouter): RouteCallback {
    return async (req: Request, res: Response) => {
      try {
        const plates = await router.repository.find();
        res.send({ success: true, plates: plates});
      } catch (error) {
        console.log("Caught error:", error);
        res.send({ success: false, error: error });
      }
    };
  }

  getPlateById(router: BoilerRouter): RouteCallback {
    return async (req: Request, res: Response) => {
      try {
        const plate = await router.repository.findOneOrFail(req.params.id);
        res.send({success: true, plate: plate});
      } catch (error) {
        console.error("Caught error:", error);
        res.send({ success: false, error: "Plate not found. Check your plate id." });
      }
    };
  }

  postOnePlate(router: BoilerRouter): RouteCallback {
    return async (req: Request, res: Response) => {
      try {
        let plate = await req.body; 
        plate._id = new ObjectId(plate._id);
        const result = await router.repository.save(plate);
        res.send({success: true, plate: result});
      } catch (error) {
        console.log("Caught error:", error);
        res.send({ success: false, error: "Something went wrong. Check the plate formatting." });
      }
    };
  }

  deleteOnePlate(router: BoilerRouter): RouteCallback {
    return async (req: Request, res: Response) => {
      try {
        router.repository.delete(req.params.id);
        res.send({success: true, plate: req.params.id});
      } catch (error) {
        console.log("Caught error:", error);
        res.send({ success: false, error: "Plate not found. Check your plate id." });
      }
    };
  }
}

export { BoilerRouter };
