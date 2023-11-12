import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getFields, IFieldInfo, Property, Schema } from "../types";
import { Expansion } from "./Expansion";

function formatField(obj, columnName: string, fieldInfo: Property) {
  const fieldType = fieldInfo.type;
  const fieldValue = obj[columnName];
  if (!fieldValue) {
    return "";
  }

  if (["string", "integer", "null"].includes(fieldType)) {
    return fieldValue;
  }

  if (fieldType === "boolean") {
    return fieldValue.toString();
  }

  if (fieldType === "array") {
    return fieldValue.map((item, index) => (
      <div key={index}>
        {typeof item === "string" ? item : JSON.stringify(item)}
      </div>
    ));
  }

  if (fieldType === undefined && fieldInfo.anyOf) {
    return JSON.stringify(fieldValue);
  }

  console.warn("cannot format field", columnName, obj, fieldInfo);
  return JSON.stringify(fieldValue);
}

function Row({
  columns,
  row,
  schema,
  onChange,
  onDeleteItem,
}: {
  columns: IFieldInfo[];
  row?: any;
  schema: Schema;
  onChange: (v) => void;
  onDeleteItem: (v) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const visibleColumns = columns.filter((f) => !f.is_hidden);
  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        {visibleColumns.map((c, index: number) => {
          const formatted = formatField(row, c.name, schema.properties[c.name]);
          return <TableCell key={c.name}>{formatted}</TableCell>;
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Expansion
            onDeleteItem={onDeleteItem}
            onChange={onChange}
            schema={schema}
            open={open}
            row={row}
          />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function SchemaTable({
  schema,
  items,
  onChange,
  onDeleteItem,
}: {
  schema: Schema;
  items: any[];
  onChange: (v) => void;
  onDeleteItem: (v) => void;
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
              onDeleteItem={onDeleteItem}
              onChange={onChange}
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
