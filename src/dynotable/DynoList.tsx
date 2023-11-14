import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getFields } from "../fields/utils";
import { Row } from "./Row";
import type { DynoTableProps } from "./Table";

import List from "@mui/material/List";

export function DynoList({ schema, items, selectForEdit }: DynoTableProps) {
  const columns = getFields(schema);
  const visibleColumns = columns.filter((f) => !f.is_hidden);

  return (
    <List sx={{ bgcolor: "background.paper" }}>
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
    </List>
  );
}
