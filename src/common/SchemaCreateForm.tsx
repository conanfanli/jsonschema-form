import React from "react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

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
