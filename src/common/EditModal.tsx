import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
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
}: {
  schema: Schema;
  focusedRow: any;
  setFocusedRow: (v: any) => void;
  onDeleteItem: (v: any) => void;
  addNewRow: (v: any) => void;
}) {
  if (!focusedRow) {
    return null;
  }

  const isEditMode = !!focusedRow && !!focusedRow.id;

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
      <Dialog open={!!focusedRow} onClose={handleClose}>
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
                  onSubmitItem={() => handleClose()}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
