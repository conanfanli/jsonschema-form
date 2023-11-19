import { Box, Collapse } from "@mui/material";
import React from "react";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";

export function ListRows({
  schema,
  items,
}: {
  schema: RJSFSchema;
  items: Array<any>;
}) {
  return (
    <Collapse in={!!schema && items && items.length > 0}>
      <Box>
        {items.map((it, i) => {
          console.log(it);
          return (
            <Form
              key={i}
              readonly
              schema={schema}
              validator={validator}
              formData={it}
              uiSchema={{ "ui:submitButtonOptions": { norender: true } }}
            />
          );
        })}
      </Box>
    </Collapse>
  );
}
