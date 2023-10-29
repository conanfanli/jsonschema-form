import {
  Table,
  Collapse,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { Property } from "../types";

export function Expansion({
  open,
  columns,
}: {
  open: boolean;
  columns: any[];
}) {
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          Tags
        </Typography>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((tag) => (
              <TableRow key={tag}>
                <TableCell component="th" scope="row">
                  {tag}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Collapse>
  );
}
