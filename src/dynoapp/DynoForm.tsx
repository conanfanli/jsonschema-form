import React from "react";
import {
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { IFieldInfo, Schema } from "../types";
import { getFieldInfosFromSchema } from "./utils";
import { ConfigContext } from "../ConfigApp";
import { DynoArrayField } from "./DynoArrayField";

export function CreateForm({
  schema,
  addNewRow,
}: {
  schema: Schema;
  addNewRow: (r: any) => void;
}) {
  const [newRow, setNewRow] = React.useState({});
  return (
    <EditForm
      row={newRow}
      onChange={(newRow) => {
        setNewRow(newRow);
      }}
      onSubmitItem={(r) => {
        addNewRow(r);
        setNewRow({});
      }}
      onDeleteItem={() => {}}
      schema={schema}
    />
  );
}
export function EditForm({
  schema,
  row,
  noButtons = false,
  onChange,
  onSubmitItem = () => {},
  onDeleteItem,
}: {
  schema: Schema;
  row: any;
  noButtons?: boolean;
  onChange: (v: any) => void;
  onSubmitItem?: (v: any) => void;
  onDeleteItem: (v: any) => void;
}) {
  const isEditMode = !!row && !!row.id;
  const { config, schemaClient } = React.useContext(ConfigContext);
  const editable = getFieldInfosFromSchema(schema).filter((c) => !c.readOnly);

  if (!config || !config.itemsUrl || !schemaClient) {
    return <div></div>;
  }

  const onSubmit = async () => {
    const [item] = await schemaClient.putItem(config.itemsUrl || "", row);
    if (item) {
      onSubmitItem(item);
    }
  };
  const onDelete = async () => {
    const [res] = await schemaClient.deleteItem(config.itemsUrl || "", row);
    if (res) {
      onDeleteItem(row);
    }
  };
  return (
    <Box>
      {!isEditMode ? (
        <Typography variant="h4">{schema.title}</Typography>
      ) : null}
      {editable.map((col) => (
        <EditField
          schema={schema}
          isEditMode={isEditMode}
          key={col.name}
          fieldInfo={col}
          value={row ? row[col.name] : ""}
          onChange={(newValue) => {
            onChange({ ...row, [col.name]: newValue });
          }}
        />
      ))}
      {!noButtons ? (
        <>
          <Button onClick={onSubmit} variant="contained" color="primary">
            Submit
          </Button>
          <Button onClick={onDelete} variant="contained" color="secondary">
            Delete
          </Button>{" "}
        </>
      ) : null}
    </Box>
  );
}

function EditField({
  schema,
  fieldInfo,
  value,
  isEditMode,
  onChange,
  onDeleteItem = () => {},
}: {
  schema: Schema;
  fieldInfo: IFieldInfo;
  value: any;
  isEditMode: boolean;
  onChange: (any) => void;
  onDeleteItem?: (v: any) => void;
}) {
  let inputType = "text";
  const [open, setOpen] = React.useState(false);
  switch (fieldInfo.type) {
    case "composite":
      if (fieldInfo.$ref) {
        return (
          <>
            <Link
              component="button"
              variant="h6"
              onClick={(e) => setOpen(!open)}
            >
              {fieldInfo.title || fieldInfo.name}
            </Link>
            <div></div>
            <Collapse
              style={{ marginTop: "1ch" }}
              in={open}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ ml: 4 }}>
                <EditForm
                  onDeleteItem={onDeleteItem}
                  onChange={onChange}
                  schema={schema}
                  row={value || {}}
                  noButtons
                />
              </Box>
            </Collapse>
          </>
        );
      }
      break;
    case "boolean":
      inputType = "checkbox";
      return (
        <FormControlLabel
          control={
            <Checkbox
              value={value || []}
              onChange={(e) => onChange(e.target.value)}
            />
          }
          label={fieldInfo.title || fieldInfo.name}
        />
      );
    case "integer":
      inputType = "number";
      break;
    case "string":
      if (fieldInfo.format === "date-time") {
        inputType = "datetime-local";
      }
      break;
    case "array":
      return (
        <DynoArrayField
          value={value}
          optionsUrl={fieldInfo.auto_complete}
          onChange={(newValue) => onChange(newValue)}
        />
      );
    default:
      console.error("cannot decided input field for", fieldInfo);
      break;
  }
  if (isEditMode && fieldInfo.freeze_after_creation) {
    return null;
  }
  return (
    <TextField
      sx={{ m: 0.5 }}
      variant="filled"
      fullWidth
      helperText={fieldInfo.title || fieldInfo.name}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      type={inputType}
    />
  );
}
