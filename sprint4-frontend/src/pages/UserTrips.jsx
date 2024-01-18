import * as React from "react";
import { useEffect} from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import { userService } from "../services/user.service";
import { updateUser } from "../store/user.actions";
import {
  SOCKET_EVENT_REMOVE_ORDER,
  socketService,
} from "../services/socket.service";
// 1025px
export function UserTrips() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const tripList = user.trips;
  useEffect(() => {
    document.documentElement.style.setProperty("--main-layout-width", "1025px");
    
  }, [])

  async function onRemoveBtn(reservation) {
    const user = await userService.removeTrip(reservation);
    await userService.removeTripHost(reservation);

    await updateUser(user);
    const data = {
      from: user.username,
      to: reservation.host._id,
    };
    const type = SOCKET_EVENT_REMOVE_ORDER;
    socketService.emit("direct-emit", {
      type,
      data,
      userId: reservation.host._id,
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

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {tripList?.map((reservation, index) => (
        <Grid item xs={2} sm={4} md={3} key={index}>
          {/* <Item> */}
          <Card sx={{ maxWidth: 345 ,minHeight:330 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                src={reservation.stay.stayImg}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom component="div">
                  {reservation.stay.stayName}
                </Typography>
                <Typography gutterBottom component="div">
                  <span className={changeFontColor(reservation.status)}>
                    {reservation.status}
                  </span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hosted by {reservation.host.fullname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reservation.checkIn} - {reservation.checkOut}
                </Typography>
              </CardContent>
            </CardActionArea>
            {/* <CardActions>
              <Tooltip onClick={() => onRemoveBtn(reservation)}>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions> */}
          </Card>
          {/* </Item> */}
        </Grid>
      ))}
    </Grid>
  );
}

// // import * as React from "react";
// import React, { useEffect } from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import DeleteIcon from "@mui/icons-material/Delete";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
// import { useSelector } from "react-redux";
// import { userService } from "../services/user.service";
// import { updateUser } from "../store/user.actions";

// export function UserTrips() {
//   const user = useSelector((storeState) => storeState.userModule.user);
//   const tripList = user.trips;

//   useEffect(() => {
//     document.documentElement.style.setProperty("--main-layout-width", "1280px");
//   }, []);

//   async function onRemoveBtn(reservation) {
//     const user = await userService.removeTrip(reservation);
//     const host = await userService.removeTripHost(reservation);
//     await updateUser(user);
//   }

//   return (
//     <TableContainer component={Paper} className="user-trips-container">
//       <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
//         <TableHead className="table-head">
//           <TableRow>
//             <TableCell className="table-cell" align="left">
//               Stay
//             </TableCell>
//             <TableCell className="table-cell" align="left">
//               Name
//             </TableCell>
//             <TableCell className="table-cell" align="left">
//               Host
//             </TableCell>
//             <TableCell className="table-cell" align="center">
//               Check-In
//             </TableCell>
//             <TableCell className="table-cell" align="center">
//               Check-Out
//             </TableCell>
//             <TableCell className="table-cell" align="center">
//               Booked
//             </TableCell>
//             <TableCell className="table-cell" align="center">
//               Total
//             </TableCell>
//             <TableCell className="table-cell" align="center">
//               Status
//             </TableCell>
//             <TableCell className="table-cell" align="right">
//               Action
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tripList?.map((reservation, index) => (
//             <TableRow
//               key={index}
//               sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//             >
//               <TableCell align="left" component="th" scope="row">
//                 <img
//                   className="trip-img"
//                   src={reservation.stay.stayImg}
//                   alt="stay image"
//                   style={{ width: "220px", height: "150px" }}
//                 />
//               </TableCell>
//               <TableCell align="left">{reservation.stay.stayName}</TableCell>
//               <TableCell align="left">{reservation.host.fullname}</TableCell>
//               <TableCell align="center">{reservation.checkIn}</TableCell>
//               <TableCell align="center">{reservation.checkOut}</TableCell>
//               <TableCell align="center">{reservation.booked}</TableCell>
//               <TableCell align="center">{reservation.totalPrice}</TableCell>
//               <TableCell align="center">{reservation.status}</TableCell>
//               <TableCell align="right">
//                 {/* <Tooltip title="Delete">
//                   <IconButton>
//                     <DeleteIcon />
//                   </IconButton>
//                 </Tooltip> */}
//                 <button
//                   onClick={() => onRemoveBtn(reservation)}
//                   className="clean-btn cancel-btn"
//                 >
//                   Cancel
//                 </button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
