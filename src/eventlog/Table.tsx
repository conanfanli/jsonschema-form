import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "@mui/material";
import { getFields, Property, Schema } from "../types";
import { Expansion } from "./Expansion";

function formatField(
  obj,
  columnName: string,
  fieldInfo: Property,
  mergeFilter: (added: any) => void,
) {
  const fieldType = fieldInfo.type;
  const fieldValue = obj[columnName];
  if (["string", "integer", "null"].includes(fieldType)) {
    return fieldValue;
  }

  if (fieldType === "array") {
    return fieldValue.map((item) => (
      <div>
        <Link
          component="button"
          onClick={() =>
            mergeFilter({ [columnName]: { operator: "contains", value: item } })
          }
        >
          {item}
        </Link>
      </div>
    ));
  }

  if (fieldType === undefined && fieldInfo.anyOf) {
    return JSON.stringify(fieldValue);
  }

  console.warn("undefined attribute", obj, columnName, fieldInfo);
  return "";
}

function Row({
  columns,
  row,
  schema,
  mergeFilter,
}: {
  columns: any[];
  row: any;
  schema: Schema;
  mergeFilter: (f: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        onClick={() => setOpen(!open)}
      >
        {columns.map((c, index: number) => {
          const formatted = formatField(
            row,
            c,
            schema.properties[c],
            mergeFilter,
          );
          return <TableCell key={c}>{formatted}</TableCell>;
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Expansion columns={columns} open={open} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function EventLogTable({
  schema,
  items,
  mergeFilter,
}: {
  schema: Schema;
  items: any[];
  mergeFilter: (any) => void;
}) {
  const columns = getFields(schema)
    .filter((f) => !f.is_hidden)
    .map((f) => f.name);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>
                {schema.properties[column]?.title || column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row, i: number) => (
            <Row
              mergeFilter={mergeFilter}
              key={i}
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
