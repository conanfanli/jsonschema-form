import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getFields, IFieldInfo, Schema } from "../types";
import { ConfigContext } from "./contextProvider";

export function SchemaCreateForm({
  schema,
  submitUrl,
}: {
  schema: Schema;
  submitUrl: string;
}) {
  const [data, setData] = React.useState({});
  const writableFields = getFields(schema).filter((f) => !f.readOnly);
  return (
    <Box noValidate component="form">
      <Typography variant="h4">{schema.title}</Typography>
      {writableFields.map((f) => (
        <EditField
          creationMode={true}
          key={f.name}
          fieldInfo={f}
          value={data[f.name]}
          onChange={(newValue) => setData({ ...data, [f.name]: newValue })}
        />
      ))}
      <Button
        onClick={async (e) => {
          const res = await fetch(submitUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const body = await res.json();
          console.log("body", body);
        }}
        variant="contained"
        color="primary"
      >
        Submit
      </Button>
    </Box>
  );
}
export function SchemaEditForm({
  columns,
  row,
}: {
  columns: IFieldInfo[];
  row: any;
}) {
  const config = React.useContext(ConfigContext);
  const [data, setData] = React.useState(row);
  const editable = columns.filter((c) => !c.readOnly);

  if (!config || !config.itemsUrl) {
    return <div></div>;
  }

  return (
    <Box noValidate component="form">
      {editable.map((col) => (
        <EditField
          creationMode={false}
          key={col.name}
          fieldInfo={col}
          value={row[col.name]}
          onChange={(newValue) => setData({ ...data, [col.name]: newValue })}
        />
      ))}
      <Button
        onClick={async (e) => {
          const res = await fetch(config.itemsUrl || "", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const body = await res.json();
          console.log("body", body);
        }}
        variant="contained"
        color="primary"
      >
        Submit
      </Button>
      <Button
        onClick={async (e) => {
          const res = await fetch(config.itemsUrl || "", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const body = await res.json();
          console.log("body", body);
        }}
        variant="contained"
        color="secondary"
      >
        Delete
      </Button>
    </Box>
  );
}

function EditField({
  fieldInfo,
  value,
  creationMode,
  onChange,
}: {
  fieldInfo: IFieldInfo;
  value: any;
  creationMode: boolean;
  onChange: (any) => void;
}) {
  let inputType = "text";
  switch (fieldInfo.type) {
    case "integer":
      inputType = "number";
      break;
    case "string":
      if (fieldInfo.format === "date-time") {
        inputType = "datetime-local";
      }
      break;
    default:
      break;
  }
  return (
    <TextField
      fullWidth
      helperText={fieldInfo.title || fieldInfo.name}
      value={value}
      disabled={!creationMode && fieldInfo.freeze_after_creation}
      onChange={(e) => onChange(e.target.value)}
      type={inputType}
    />
  );
}
