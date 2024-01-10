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
  const users = useSelector((storeState) => storeState.userModule.users);
  const user = useSelector((storeState) => storeState.userModule.user);
  const isLoading = useSelector(
    (storeState) => storeState.userModule.isLoading
  );
  const tripList = user.trips;

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
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="left">{row.calories}</StyledTableCell>
              <StyledTableCell align="left">{row.fat}</StyledTableCell>
              <StyledTableCell align="left">{row.carbs}</StyledTableCell>
              <StyledTableCell align="left">{row.protein}</StyledTableCell>
              <StyledTableCell align="center">{row.protein}</StyledTableCell>
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
                  onClick={() => onRemoveBtn(trip._id)}
                  className="clean-btn cancel-btn"
                >
                  Accept
                </button>
                <button
                  onClick={() => onRemoveBtn(trip._id)}
                  className="clean-btn cancel-btn"
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
