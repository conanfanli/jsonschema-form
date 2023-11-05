import { Collapse, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { SchemaEditForm } from "../common/SchemaForms";
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
          <SchemaEditForm columns={columns} row={row} />
        </Typography>
      </Box>
    </Collapse>
  );
}
