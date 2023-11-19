import * as React from "react";
import { Property } from "../types";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { IFieldInfo, Schema } from "../types";

export function DynoRow({
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
        {visibleColumns.map((c) => {
          const formatted = (
            <FormattedField
              row={row}
              columnName={c.name}
              fieldInfo={schema.properties[c.name]}
            />
          );
          return (
            <TableCell key={c.name} align="right">
              {formatted}
            </TableCell>
          );
        })}
      </TableRow>
    </React.Fragment>
  );
}

function FormattedField(props: {
  row;
  columnName: string;
  fieldInfo: Property;
}) {
  const { row, columnName, fieldInfo } = props;
  const fieldType = fieldInfo.type;
  const fieldValue = row[columnName];
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

  console.warn("cannot format field", columnName, row, fieldInfo);
  return JSON.stringify(fieldValue);
}
