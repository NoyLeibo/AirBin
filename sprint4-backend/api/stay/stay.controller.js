import { loggerService } from "../../services/logger.service.js";
import { stayService } from "./stay.service.js";

export async function getStay(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || "",
      price: +req.query.price || 0,
      inStock: req.query.inStock || "All",
      sortBy: req.query.sortBy || "name",
      amentities: req.query.amentities || [],
    };

    loggerService.debug("Getting Stays", filterBy);
    const stays = await stayService.query(filterBy);
    res.json(stays);
  } catch (err) {
    loggerService.error("Failed to get stays", err);
    res.status(500).send({ err: "Failed to get stays" });
  }
}
