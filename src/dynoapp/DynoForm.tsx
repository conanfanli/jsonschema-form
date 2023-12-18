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
import { MultiSelect } from "../common/MultiSelect";
import { usePutItem } from "./hooks";

interface EditFormProps {
  schema: Schema;
  row: any;
  noButtons?: boolean;
  onChange: (v: any) => void;
  closeModal?: () => void;
  onDeleteItem: (v: any) => void;
}
interface EditFieldProps {
  schema: Schema;
  fieldInfo: IFieldInfo;
  value: any;
  isEditMode: boolean;
  onChange: (a: any) => void;
  onDeleteItem: (v: any) => void;
}

export function DynoForm({
  noButtons = false,
  onChange,
  onDeleteItem,
  closeModal = () => {},
  row,
  schema,
}: EditFormProps) {
  const isEditMode = !!row && !!row.id;
  const editable = getFieldInfosFromSchema(schema).filter((c) => !c.readOnly);
  const { mutation } = usePutItem();

  return (
    <Box>
      {!isEditMode ? (
        <Typography variant="h4">{schema.title}</Typography>
      ) : null}
      {editable.map((col) => {
        return (
          <EditField
            key={col.name}
            schema={schema}
            onDeleteItem={onDeleteItem}
            isEditMode={isEditMode}
            fieldInfo={col}
            value={row ? row[col.name] : ""}
            onChange={(newValue) => {
              onChange({ ...row, [col.name]: newValue });
            }}
          />
        );
      })}
      {!noButtons ? (
        <>
          <Button
            onClick={async () => {
              mutation.mutate({ ...row });
              closeModal();
            }}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <Button
            onClick={async () => {
              await onDeleteItem(row);
            }}
            variant="contained"
            color="secondary"
          >
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
}: EditFieldProps) {
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
                <DynoForm
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
      return fieldInfo.getAutoCompleteOptions ? (
        <MultiSelect
          label={fieldInfo.title || fieldInfo.name}
          allowNewOption={true}
          getOptions={fieldInfo.getAutoCompleteOptions}
          selected={value}
          onSelectionsChange={(newValue) => onChange(newValue)}
        />
      ) : (
        <div>not defined array</div>
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
