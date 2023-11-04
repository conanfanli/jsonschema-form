import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "@mui/material";
import { getFields, IFieldInfo, Property, Schema } from "../types";
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

  if (fieldType === "boolean") {
    return fieldValue.toString();
  }

  // TODO: Display a link for array fields?
  // Probably not a right generic approach
  if (fieldType === "array") {
    return fieldValue.map((item) => (
      <div>
        <Link
          component="button"
          onClick={() =>
            mergeFilter({ [columnName]: { operator: "contains", value: item } })
          }
        >
          {JSON.stringify(item)}
        </Link>
      </div>
    ));
  }

  if (fieldType === undefined && fieldInfo.anyOf) {
    return JSON.stringify(fieldValue);
  }

  console.warn("undefined attribute", obj, columnName, fieldInfo);
  return JSON.stringify(fieldValue);
}

function Row({
  columns,
  row,
  schema,
  mergeFilter,
}: {
  columns: IFieldInfo[];
  row: any;
  schema: Schema;
  mergeFilter: (f: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const visibleColumns = columns.filter((f) => !f.is_hidden);
  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        onClick={() => setOpen(!open)}
      >
        {visibleColumns.map((c, index: number) => {
          const formatted = formatField(
            row,
            c.name,
            schema.properties[c.name],
            mergeFilter,
          );
          return <TableCell key={c.name}>{formatted}</TableCell>;
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Expansion columns={columns} open={open} row={row} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function EventLogTable({
  schema,
  items,
  mergeFilter = () => {},
}: {
  schema: Schema;
  items: any[];
  mergeFilter?: (any) => void;
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
