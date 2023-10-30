import { Collapse, Typography, TextField } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { IFieldInfo } from "../types";

export function Expansion({
  open,
  columns,
  row,
}: {
  open: boolean;
  columns: IFieldInfo[];
  row: any;
}) {
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          Tags
          <EditForm columns={columns} row={row} />
        </Typography>
      </Box>
    </Collapse>
  );
}

function EditForm({ columns, row }: { columns: IFieldInfo[]; row: any }) {
  const editable = columns.filter((c) => !c.readOnly);
  return (
    <Box noValidate component="form">
      {editable.map((col) => (
        <TextField
          fullWidth
          helperText={col.name}
          value={row[col.name]}
          disabled={col.freeze_after_creation}
        />
      ))}
    </Box>
  );
}
