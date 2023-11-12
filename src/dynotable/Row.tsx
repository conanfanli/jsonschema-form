import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { IFieldInfo, Schema } from "../types";
import { formatField } from "./utils";

export function Row({
  columns,
  row,
  schema,
  selectForEdit,
}: {
  columns: IFieldInfo[];
  row?: any;
  schema: Schema;
  selectForEdit: (id: string) => void;
}) {
  const visibleColumns = columns.filter((f) => !f.is_hidden);
  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
        onClick={() => selectForEdit(row.id)}
      >
        {visibleColumns.map((c, index: number) => {
          const formatted = formatField(row, c.name, schema.properties[c.name]);
          return <TableCell key={c.name}>{formatted}</TableCell>;
        })}
      </TableRow>
    </React.Fragment>
  );
}
