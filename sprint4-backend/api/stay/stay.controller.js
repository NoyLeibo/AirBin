import { log } from "../../middlewares/logger.middleware.js";
import { loggerService } from "../../services/logger.service.older.js";
import { stayService } from "./stay.service.js";

export async function getStay(req, res) {
  try {
    const filterBy = req.query;
    loggerService.debug("Getting Stays", filterBy);
    const stays = await stayService.query(filterBy);
    res.json(stays);
  } catch (err) {
    loggerService.error("Failed to get stays", err);
    res.status(500).send({ err: "Failed to get stays" });
  }
}

export async function getStayById(req, res) {
  try {
    const stayId = req.params.id;
    const stay = await stayService.getById(stayId);
    res.json(stay);
  } catch (err) {
    loggerService.error("Failed to get stay", err);
    res.status(500).send({ err: "Failed to get stay" });
  }
}

export async function addStay(req, res) {
  const { loggedinUser } = req;

  try {
    const stay = req.body;
    // stay.host = loggedinUser;
    const addedStay = await stayService.add(stay);
    res.json(addedStay);
  } catch (err) {
    loggerService.error("Failed to add stay", err);
    res.status(500).send({ err: "Failed to add stay" });
  }
}

export async function updateStay(req, res) {
  try {
    const stay = req.body;
    const updatedStay = await stayService.update(stay);
    res.json(updatedStay);
  } catch (err) {
    loggerService.error("Failed to update stay", err);
    res.status(500).send({ err: "Failed to update stay" });
  }
}

export async function removeStay(req, res) {
  try {
    const stayId = req.params.id;
    await stayService.remove(stayId);
    res.send();
  } catch (err) {
    loggerService.error("Failed to remove stay", err);
    res.status(500).send({ err: "Failed to remove stay" });
  }
}

export async function addStayReview(req, res) {
  const { loggedinUser } = req;
  try {
    const stayId = req.params.id;
    const review = {
      at: Date.now(),
      by: {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
        imgUrl: loggedinUser.imgUrl,
      },
      txt: req.body.txt,
    };
    console.log(review.txt);
    const savedReview = await stayService.addReviewMsg(stayId, review);
    res.json(savedReview);
  } catch (err) {
    loggerService.error("Failed to update stay", err);
    res.status(500).send({ err: "Failed to update stay" });
  }
}
