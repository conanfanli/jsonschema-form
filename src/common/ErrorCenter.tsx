import * as React from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Snackbar from "@mui/material/Snackbar";
import { Badge, Alert, Box, Collapse, Grid } from "@mui/material";

export function ErrorCenter(props: { errors: string[] }) {
  const { errors } = props;
  // const [errors, setErrors] = React.useState<string[]>([]);
  const [nextMessageIndex, setNextMessageIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const toDisplay = errors[nextMessageIndex];
  /*
  const addError = (e: string) => {
    setErrors([...errors, e]);
  };
  */

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
      <Grid container justifyContent="end">
        <Grid item md={11.5}>
          <Collapse
            style={{ marginTop: "1ch" }}
            in={open}
            timeout="auto"
            unmountOnExit
          >
            {errors.map((e, index) => (
              <Alert key={index}>{e}</Alert>
            ))}
          </Collapse>
        </Grid>
        <Grid item md={0.4}>
          <Badge
            sx={{ m: 1 }}
            onClick={() => setOpen(!open)}
            badgeContent={errors.length}
            color="primary"
          >
            <NotificationsNoneOutlinedIcon color="primary" />
          </Badge>
        </Grid>
      </Grid>
    </Box>
  );
}
