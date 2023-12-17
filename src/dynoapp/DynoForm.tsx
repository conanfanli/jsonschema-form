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
import { useMutation } from "@tanstack/react-query";
import { usePutItem } from "./hooks";

/*
function onSubmitItem<T extends TaggedItem>(
  items: T[],
  setItems: (items: T[]) => void,
  setFocusedRow: (i: T | null) => void,
  client: IResourceClient,
) {
  function createOrUpdateItem(newRow: any) {
    let existing = false;
    const newItems = items.map((item) => {
      if (item.id === newRow.id) {
        existing = true;
        return newRow;
      }
      return item;
    });
    if (existing) {
      setItems(newItems);
    } else {
      setItems([newRow, ...items]);
    }
  }

  return async (data: T) => {
    const [newItem] = await client.putItem(data);
    createOrUpdateItem(newItem);
    setFocusedRow(null);
  };
}
  */

interface EditFormProps {
  schema: Schema;
  row: any;
  noButtons?: boolean;
  onChange: (v: any) => void;
  onSubmitItem?: (v: any) => void;
  onDeleteItem: (v: any) => void;
  options: string[];
}
interface EditFieldProps {
  schema: Schema;
  fieldInfo: IFieldInfo;
  value: any;
  options: string[];
  isEditMode: boolean;
  onChange: (any) => void;
  onDeleteItem: (v: any) => void;
}

export function DynoForm({
  noButtons = false,
  onChange,
  onDeleteItem,
  onSubmitItem = () => {},
  row,
  options,
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
            options={options}
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
  options,
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
                  options={options}
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
