import { Collapse, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { EditForm } from "../common/SchemaForms";
import { Schema } from "../types";

export function Expansion({
  schema,
  open,
  row,
  onChange,
  onDeleteItem,
}: {
  schema: Schema;
  open: boolean;
  row: any;
  onChange: (v: any) => void;
  onDeleteItem: (v: any) => void;
}) {
  // <TableRow>
  // <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          Tags
          <EditForm
            onChange={onChange}
            schema={schema}
            row={row}
            onDeleteItem={onDeleteItem}
          />
        </Typography>
      </Box>
    </Collapse>
  );
}
