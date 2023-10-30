import { Table, Collapse, Typography, TextField } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { IFieldInfo } from "../types";

export function Expansion({
  open,
  columns,
}: {
  open: boolean;
  columns: IFieldInfo[];
}) {
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          Tags
          <EditForm columns={columns} />
        </Typography>
      </Box>
    </Collapse>
  );
}

function EditForm({ columns }: { columns: IFieldInfo[] }) {
  const editable = columns.filter((c) => !c.readOnly);
  return (
    <Box noValidate component="form">
      {editable.map((col) => (
        <TextField fullWidth helperText={col.name} />
      ))}
    </Box>
  );
}
