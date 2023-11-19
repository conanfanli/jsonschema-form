import * as React from "react";
import { Schema, TaggedItem } from "../types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getFieldInfosFromSchema } from "./utils";
import { DynoRow } from "./DynoRow";

import List from "@mui/material/List";

export function DynoList({ schema, items, selectForEdit }: DynoTableProps) {
  const columns = getFieldInfosFromSchema(schema);
  const visibleColumns = columns.filter((f) => !f.is_hidden);

  return (
    <div>
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
              <DynoRow
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
    </div>
  );
}

export interface DynoTableProps {
  schema: Schema;
  items: TaggedItem[];
  selectForEdit: (id: string) => void;
  container?: string;
}
