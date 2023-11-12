import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Grid, Typography } from "@mui/material";
import { ErrorCenter } from "./ErrorCenter";
import { CreateForm, EditForm } from "./SchemaForms";
import { Schema } from "../types";

export function EditModal({
  schema,
  focusedRow,
  setFocusedRow,
  onDeleteItem,
  addNewRow,
  replaceItem,
}: {
  schema: Schema;
  focusedRow: any;
  setFocusedRow: (v: any) => void;
  onDeleteItem: (v: any) => void;
  addNewRow: (v: any) => void;
  replaceItem: (v: any) => void;
}) {
  const isEditMode = !!focusedRow && !!focusedRow.id;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setFocusedRow({});
  };

  const handleClose = () => {
    setFocusedRow(null);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={4}>
          <Button variant="outlined" onClick={handleClickOpen}>
            Add a new row
          </Button>
        </Grid>
        <Grid item xs={8}>
          <ErrorCenter />
        </Grid>
      </Grid>
      {focusedRow ? (
        <Dialog
          open={!!focusedRow}
          onClose={handleClose}
          fullScreen={fullScreen}
        >
          <DialogTitle>{isEditMode ? "Editing" : "Creating"}</DialogTitle>
          <DialogContent>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Tags
                {isEditMode ? (
                  <EditForm
                    onChange={setFocusedRow}
                    schema={schema}
                    row={focusedRow}
                    onSubmitItem={(newItem) => {
                      replaceItem(newItem);
                      handleClose();
                    }}
                    onDeleteItem={(r) => {
                      onDeleteItem(r);
                      handleClose();
                    }}
                  />
                ) : (
                  <CreateForm
                    schema={schema}
                    addNewRow={(r) => {
                      addNewRow(r);
                      handleClose();
                    }}
                  />
                )}
              </Typography>
              <Button onClick={handleClose}>Cancel</Button>
            </Box>
          </DialogContent>
        </Dialog>
      ) : null}
    </React.Fragment>
  );
}
