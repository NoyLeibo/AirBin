import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadUsers, removeUser } from "../store/user.actions";
import { userService } from "../services/user.service";

// export function DashboardResarvation() {
//   const users = useSelector((storeState) => storeState.userModule.users);
//   const isLoading = useSelector(
//     (storeState) => storeState.userModule.isLoading
//   );

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   return (
//     <section className="dashboard-resarvation-container">
//       {isLoading && "Loading..."}
//       <div className="graphs-container">

//       </div>
//     </section>
//   );
// }

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export function DashboardResarvation() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const reservations = user.guestsReservations;
  console.log(reservations);
  const isLoading = useSelector(
    (storeState) => storeState.userModule.isLoading
  );
  const tripList = user.trips;

  function onActionClicked(reservation, status) {
    reservation.status = status;
    userService.updateReservationGuest(reservation);
    userService.updateReservationHost(reservation);
  }

  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Guest</StyledTableCell>
            <StyledTableCell align="left">Check-In</StyledTableCell>
            <StyledTableCell align="left">Check-Out</StyledTableCell>
            <StyledTableCell align="left">Booked</StyledTableCell>
            <StyledTableCell align="left">Total</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((reservation, index) => (
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
                {reservation.totalPrice}
              </StyledTableCell>
              <StyledTableCell align="center">
                {reservation.status}
              </StyledTableCell>
              <StyledTableCell align="center">
                {/* <Stack spacing={2}>
                  <Button variant="contained" color="success">
                    Accept
                  </Button>
                  <Button variant="outlined" color="error">
                    Reject
                  </Button>
                </Stack> */}
                <button
                  onClick={() => {
                    onActionClicked(reservation, "Accept");
                  }}
                  className="clean-btn cancel-btn"
                >
                  Accept
                </button>
                <button
                  className="clean-btn cancel-btn"
                  onClick={() => {
                    onActionClicked(reservation, "Reject");
                  }}
                >
                  Reject
                </button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
