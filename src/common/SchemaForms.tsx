import React from "react";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { IFieldInfo } from "../types";

export function SchemaCreateForm({ schema, submitUrl }) {
  const [formData, setFormData] = React.useState(null);
  return (
    <div>
      <Form
        schema={schema}
        validator={validator}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={async (e) => {
          const res = await fetch(submitUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          const body = await res.json();
          console.log("body", body);
        }}
      />
    </div>
  );
}
export function SchemaEditForm({
  columns,
  row,
}: {
  columns: IFieldInfo[];
  row: any;
}) {
  const editable = columns.filter((c) => !c.readOnly);
  return (
    <Box noValidate component="form">
      {editable.map((col) => (
        <TextField
          fullWidth
          helperText={col.name}
          value={row[col.name]}
          disabled={col.freeze_after_creation}
        />
      ))}
    </Box>
  );
}
