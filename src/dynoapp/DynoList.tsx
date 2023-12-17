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
import { useItems } from "./hooks";

export function DynoList({ schema, setFocusedRow }: DynoTableProps) {
  const columns = getFieldInfosFromSchema(schema);
  const visibleColumns = columns.filter((f) => !f.is_hidden);
  const { data: items, isLoading, error } = useItems();

  if (isLoading) {
    return <div>loading items ...</div>;
  }
  if (error || items.errorMessage) {
    return <div>{error || items.errorMessage}</div>;
  }
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
                selectForEdit={(id: string) =>
                  setFocusedRow(items.filter((item) => item.id === id)[0])
                }
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
  // items: TaggedItem[];
  // setFocusedRow: (id: string) => void;
  setFocusedRow: (i: TaggedItem | null) => void;
  container?: string;
}
