import { Collapse, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { SchemaEditForm } from "../common/SchemaForms";
import { Schema } from "../types";

export function Expansion({
  schema,
  open,
  row,
  onChange,
}: {
  schema: Schema;
  open: boolean;
  row: any;
  onChange: (v: any) => void;
}) {
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          Tags
          <SchemaEditForm onChange={onChange} schema={schema} row={row} />
        </Typography>
      </Box>
    </Collapse>
  );
}
