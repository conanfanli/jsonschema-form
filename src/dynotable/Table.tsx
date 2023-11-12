import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getFields, Schema } from "../types";
import { Row } from "./Row";

export function DynoTable({
  schema,
  items,
  selectForEdit,
}: {
  schema: Schema;
  items: any[];
  selectForEdit: (id: string) => void;
}) {
  const columns = getFields(schema);
  const visibleColumns = columns.filter((f) => !f.is_hidden);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableCell key={column.name}>
                {column?.title || column.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <Row
              selectForEdit={selectForEdit}
              key={row.id}
              columns={columns}
              row={row}
              schema={schema}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
