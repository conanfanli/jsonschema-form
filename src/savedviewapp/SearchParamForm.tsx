import {
  TextField,
  Button,
  Grid,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { LocalStorageViewStore, ViewStore } from "./viewStore";

interface SearchParamFormProps {
  viewStore?: ViewStore;
  excluded?: string[];
}
/**
 * A form to edit search params.
 *
 * Initially display the search params from url.
 *
 */
export function SearchParamForm(props: SearchParamFormProps) {
  const { viewStore = LocalStorageViewStore(), excluded = [] } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams);
  function setParams(p: { [key: string]: string }) {
    setSearchParams(new URLSearchParams(p));
  }
  return (
    <div>
      {decodeURIComponent(searchParams.toString())}
      <ViewNameSelect
        initialViewName={params.viewName}
        onSelect={(viewName) => {
          if (viewName) {
            const savedQueryString = viewStore.getView(viewName);
            if (savedQueryString) {
              setParams(
                Object.fromEntries(new URLSearchParams(savedQueryString)),
              );
            } else {
              setParams({ ...params, viewName });
            }
          }
        }}
        options={viewStore.listViews()}
      />
      {Object.keys(params)
        .filter((k) => !excluded.includes(k) && k !== "viewName")
        .map((key) => (
          <Grid container key={key}>
            <Grid item md={1}>
              <TextField
                size="small"
                fullWidth
                key={"name"}
                disabled
                value={key}
                onChange={(e) => {
                  setParams({ ...params, [key]: e.target.value });
                }}
              />
            </Grid>
            <Grid item md={10.5}>
              <TextField
                size="small"
                fullWidth
                key={"value"}
                onChange={(e) => {
                  setParams({ ...params, [key]: e.target.value });
                }}
                value={params[key]}
              />
            </Grid>
            <Grid item md={0.5}>
              <IconButton
                color="error"
                key={key}
                onClick={() => {
                  const { [key]: removed, ...newParams } = params;
                  setParams(newParams);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setSearchParams(params);
        }}
      >
        Go
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          viewStore.saveView(
            params.viewName,
            new URLSearchParams(params).toString(),
          );
        }}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          viewStore.deleteView(params.viewName);
        }}
      >
        Delete
      </Button>
    </div>
  );
}

const filter = createFilterOptions<string>();
function ViewNameSelect({
  initialViewName,
  options,
  onSelect,
}: {
  initialViewName: string;
  options: string[];
  onSelect: (selection: string | null) => void;
}) {
  const [value, setValue] = React.useState<string | null>(initialViewName);
  return (
    <Autocomplete
      value={value}
      selectOnFocus
      onChange={(_, selection: string | null) => {
        const newValue = selection ? selection.replace(/^\+ /, "") : null;
        setValue(newValue);
        onSelect(newValue);
      }}
      clearOnBlur
      options={options}
      renderInput={(params) => (
        <TextField {...params} size="small" label={"View Name"} />
      )}
      filterOptions={(options: string[], params) => {
        // Return which ones to display
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option);
        if (inputValue !== "" && !isExisting) {
          filtered.push(`+ ${inputValue}`);
        }

        return filtered;
      }}
      freeSolo
    />
  );
}
