import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Grid, Typography } from "@mui/material";

interface EditModalProps {
  children: React.ReactNode;
  onOpenNewModal: () => void;
  onCloseModal: () => void;
  isNewItem: boolean;
  open: boolean;
}
export function ModalContainer({
  isNewItem,
  onOpenNewModal,
  open,
  onCloseModal,
  children,
}: EditModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={4}>
          <Button variant="outlined" onClick={onOpenNewModal}>
            Add a new row
          </Button>
        </Grid>
        <Grid item xs={8}></Grid>
      </Grid>
      {open ? (
        <Dialog open={true} onClose={onCloseModal} fullScreen={fullScreen}>
          <DialogTitle>{isNewItem ? "Create" : "Edit"}</DialogTitle>
          <DialogContent>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {children}
              </Typography>
              <Button onClick={onCloseModal}>Cancel</Button>
            </Box>
          </DialogContent>
        </Dialog>
      ) : null}
    </React.Fragment>
  );
}
