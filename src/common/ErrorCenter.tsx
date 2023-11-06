import * as React from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Snackbar from "@mui/material/Snackbar";
import { ConfigContext } from "./contextProvider";
import { Badge, Alert, Box, Collapse, Grid } from "@mui/material";

export function ErrorCenter() {
  const { errors = [] } = React.useContext(ConfigContext);
  const [nextMessageIndex, setNextMessageIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const toDisplay = errors[nextMessageIndex];
  return (
    <Box>
      {toDisplay ? (
        <Snackbar
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={true}
          onClose={() => setNextMessageIndex(nextMessageIndex + 1)}
          message={toDisplay}
        />
      ) : null}
      <Grid container justifyContent="flex-end">
        <Badge onClick={() => setOpen(!open)} badgeContent={2} color="primary">
          <NotificationsNoneOutlinedIcon color="primary" />
        </Badge>
      </Grid>
      <Collapse
        style={{ marginTop: "1ch" }}
        in={open}
        timeout="auto"
        unmountOnExit
      >
        {errors.map((e) => (
          <Alert>{e}</Alert>
        ))}
      </Collapse>
    </Box>
  );
}
