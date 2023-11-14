import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Schema, TaggedItem } from "../types";
import { getFields } from "../fields/utils";
import { Row } from "./Row";
import { DynoList } from "./DynoList";

export interface DynoTableProps {
  schema: Schema;
  items: TaggedItem[];
  selectForEdit: (id: string) => void;
  container?: string;
}
export function DynoTable(props: DynoTableProps) {
  const { schema, items, selectForEdit, container = "list" } = props;
  if (container === "list") {
    return <DynoList {...props} />;
  }
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
