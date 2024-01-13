// import * as React from "react";
import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import { userService } from "../services/user.service";
import { updateUser } from "../store/user.actions";

export function UserTrips() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const tripList = user.trips;

  useEffect(() => {
    document.documentElement.style.setProperty("--main-layout-width", "1280px");
  }, []);

  async function onRemoveBtn(reservation) {
    const user = await userService.removeTrip(reservation);
    const host = await userService.removeTripHost(reservation);
    await updateUser(user);
  }

  return (
    <TableContainer component={Paper} className="user-trips-container">
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead className="table-head">
          <TableRow>
            <TableCell className="table-cell" align="left">
              Stay
            </TableCell>
            <TableCell className="table-cell" align="left">
              Name
            </TableCell>
            <TableCell className="table-cell" align="left">
              Host
            </TableCell>
            <TableCell className="table-cell" align="center">
              Check-In
            </TableCell>
            <TableCell className="table-cell" align="center">
              Check-Out
            </TableCell>
            <TableCell className="table-cell" align="center">
              Booked
            </TableCell>
            <TableCell className="table-cell" align="center">
              Total
            </TableCell>
            <TableCell className="table-cell" align="center">
              Status
            </TableCell>
            <TableCell className="table-cell" align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tripList?.map((reservation, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" component="th" scope="row">
                <img
                  className="trip-img"
                  src={reservation.stay.stayImg}
                  alt="stay image"
                  style={{ width: "220px", height: "150px" }}
                />
              </TableCell>
              <TableCell align="left">{reservation.stay.stayName}</TableCell>
              <TableCell align="left">{reservation.host.fullname}</TableCell>
              <TableCell align="center">{reservation.checkIn}</TableCell>
              <TableCell align="center">{reservation.checkOut}</TableCell>
              <TableCell align="center">{reservation.booked}</TableCell>
              <TableCell align="center">{reservation.totalPrice}</TableCell>
              <TableCell align="center">{reservation.status}</TableCell>
              <TableCell align="right">
                {/* <Tooltip title="Delete">
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip> */}
                <button
                  onClick={() => onRemoveBtn(reservation)}
                  className="clean-btn cancel-btn"
                >
                  Cancel
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
