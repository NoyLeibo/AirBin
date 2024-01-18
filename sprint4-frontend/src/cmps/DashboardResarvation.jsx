import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loadUsers, updateUser } from "../store/user.actions";
import { userService } from "../services/user.service";
import { SOCKET_EVENT_HOST_ANSWER } from "../services/socket.service";
import { MdOutlineDoneOutline } from "react-icons/md";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.common.black,
    fontSize: 17,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // "&:nth-of-type(odd)": {
  //   backgroundColor: theme.palette.action.hover,
  // },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export function DashboardResarvation() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const reservations = user.guestsReservations;
  console.log(reservations.length);
  const isLoading = useSelector(
    (storeState) => storeState.userModule.isLoading
  );

  async function onActionClicked(reservation, status) {
    reservation.status = status;
    await userService.updateReservationGuest(reservation);
    const host = await userService.updateHostReservation(reservation);
    await updateUser(host);

    const data = {
      from: user.username,
      to: reservation.guest._id,
      status,
    };
    const type = SOCKET_EVENT_HOST_ANSWER;
    socketService.emit("direct-emit", {
      type,
      data,
      userId: reservation.guest._id,
    });
  }

  function changeFontColor(status) {
    if (status === "pending") {
      return "pendingStatus";
    }
    if (status === "Accepted") {
      return "acceptedStatus";
    }
    if (status === "Rejected") {
      return "rejectedStatus";
    }
  }

  // useEffect(() => {
  //   loadUsers();
  // }, []);
  return (
        <TableContainer component={Paper} className="dashboard-resarvation-container"
        sx={{ overflowX: 'scroll',width: 755 }}
        
        >
      <Table 
      sx={{width: 755,tableLayout: 'fixed', } }
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>Guest</StyledTableCell>
            <StyledTableCell align="left">Check-In</StyledTableCell>
            <StyledTableCell align="left">Check-Out</StyledTableCell>
            <StyledTableCell align="left">Booked</StyledTableCell>
            <StyledTableCell align="left">Total</StyledTableCell>
            <StyledTableCell align="left">Status</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations?.map((reservation) => (
            <StyledTableRow key={reservation._id}>
              <StyledTableCell component="th" scope="row">
                {reservation.guest.fullname}
              </StyledTableCell>
              <StyledTableCell align="left">
                {reservation.checkIn}
              </StyledTableCell>
              <StyledTableCell align="left">
                {reservation.checkOut}
              </StyledTableCell>
              <StyledTableCell align="left">
                {reservation.booked}
              </StyledTableCell>
              <StyledTableCell align="left">
                {reservation.totalPrice}$
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={changeFontColor(reservation.status)}>
                  {reservation.status}
                </span>
              </StyledTableCell>
              <StyledTableCell align="center">
                {reservation.status === "pending" ? (
                  <>
                    <button
                      onClick={() => onActionClicked(reservation, "Accepted")}
                      className="clean-btn accept-btn actionBtn"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onActionClicked(reservation, "Rejected")}
                      className="clean-btn reject-btn actionBtn"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  // "Action has been sent to client"

                  <Tooltip title="Action has already been sent to client">
                    <span>
                      {/* <Button disabled>Disabled Button</Button> */}
                      <MdOutlineDoneOutline size="22" />
                    </span>
                  </Tooltip>
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
