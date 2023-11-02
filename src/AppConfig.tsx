import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Collapse, Box, Button, TextField, Autocomplete } from "@mui/material";
import { CreateForm } from "./Create";
import { EventLogTable } from "./eventlog";
import { AppConfig, Schema } from "./types";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { createFilterOptions } from "@mui/material/Autocomplete";

interface AppConfigOption extends AppConfig {
  inputValue?: string;
}
const filter = createFilterOptions<AppConfigOption>();

function saveConfig(saved: AppConfig[], newConfig: AppConfig) {
  const newOptions = [
    ...saved.filter((config) => config.name !== newConfig.name),
    newConfig,
  ];
  localStorage.setItem("appconfigs", JSON.stringify(newOptions));
  return newOptions;
}
/*
 * Priority: query params > local storage
 *
 *
 */
export function ConfigForm() {
  const [open, setOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultSchemaUrl = searchParams.get("schemaUrl") || "";

  const [config, setConfig] = React.useState<AppConfig>({
    name: "",
    schemaUrl: defaultSchemaUrl,
    itemsUrl:
      (defaultSchemaUrl && defaultSchemaUrl + "/items") ||
      searchParams.get("itemsUrl") ||
      "",
    itemsFilters: searchParams.get("itemsFilters") || "",
  });

  const [options, setOptions] = React.useState<AppConfig[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem("savedConfigs");
    if (saved) {
      const savedConfigs: AppConfig[] = JSON.parse(saved);
      setOptions([...savedConfigs]);
      console.log("set options", savedConfigs);
    }
  });

  return (
    <Box noValidate component="form">
      <Button
        variant="contained"
        endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
        onClick={() => setOpen(!open)}
      >
        Config
      </Button>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ConfigSelect options={options} />
        <TextField
          onChange={(e) => {
            setConfig({ ...config, schemaUrl: e.target.value });
          }}
          value={config.schemaUrl}
          fullWidth
          helperText="Schema URL"
        />
        <TextField
          onChange={(e) => setConfig({ ...config, itemsUrl: e.target.value })}
          value={config.itemsUrl}
          fullWidth
          helperText="Items URL"
        />
        <TextField
          onChange={(e) => {
            setConfig({ ...config, itemsFilters: e.target.value });
          }}
          value={config.itemsFilters}
          fullWidth
          helperText="Items filter"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const newOptions = saveConfig(options, config);
            setOptions(newOptions);
          }}
        >
          Save
        </Button>
      </Collapse>
    </Box>
  );
}

function ConfigSelect({ options }: { options: AppConfigOption[] }) {
  const [value, setValue] = React.useState<AppConfigOption | null>(null);
  return (
    <Autocomplete
      value={value}
      selectOnFocus
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({
            name: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            name: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      clearOnBlur
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.name;
        }
        // Regular option
        return option.name;
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue: inputValue,
            name: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      freeSolo
      renderInput={(params) => <TextField {...params} label="Config Name" />}
    />
  );
}
