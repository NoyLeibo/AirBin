import { userService } from "./user.service.js";
import { loggerService } from "../../services/logger.service.older.js";
import { log } from "../../middlewares/logger.middleware.js";

export async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id);
    res.send(user);
  } catch (err) {
    loggerService.error("Failed to get user", err);
    res.status(500).send({ err: "Failed to get user" });
  }
}

// CHECK FUNCTION
export async function getUsers(req, res) {
  try {
    // const filterBy = {
    //   txt: req.query?.txt || "",
    //   minBalance: +req.query?.minBalance || 0,
    // };
    const users = await userService.query();
    res.send(users);
  } catch (err) {
    loggerService.error("Failed to get users", err);
    res.status(500).send({ err: "Failed to get users" });
  }
}

export async function deleteUser(req, res) {
  try {
    await userService.remove(req.params.id);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    loggerService.error("Failed to delete user", err);
    res.status(500).send({ err: "Failed to delete user" });
  }
}

// export async function addUserTrip(req, res) {
//   try {
//     const newTrip = req.body;
//     const savedUser = await userService.updateTrips(newTrip);
//     res.send(savedUser);
//   } catch (err) {
//     loggerService.error("Failed to update user", err);
//     res.status(500).send({ err: "Failed to update user" });
//   }
// }

// export async function addHostReservation(req, res) {
//   try {
//     const reservation = req.body;
//     const savedUser = await userService.updateReservationHost(reservation);
//     res.send(savedUser);
//   } catch {
//     loggerService.error("Failed to update user", err);
//     res.status(500).send({ err: "Failed to update user" });
//   }
// }

export async function updateUser(req, res) {
  try {
    const user = req.body;
    console.log(user._id);
    console.log(user.trips.length);
    const savedUser = await userService.update(user);
    res.send(savedUser);
  } catch (err) {
    loggerService.error("Failed to update user", err);
    res.status(500).send({ err: "Failed to update user" });
  }
}
