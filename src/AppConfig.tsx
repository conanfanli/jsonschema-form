import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Collapse, Box, Button, TextField, Autocomplete } from "@mui/material";
import { AppConfig } from "./types";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { createFilterOptions } from "@mui/material/Autocomplete";

interface AppConfigOption extends AppConfig {
  isNew?: boolean;
}
const filter = createFilterOptions<AppConfigOption>();

function saveConfig(saved: AppConfig[], newConfig: AppConfig) {
  const newOptions = [
    ...saved.filter((config) => config.name !== newConfig.name),
    newConfig,
  ];
  localStorage.setItem("savedConfigs", JSON.stringify(newOptions));
  return newOptions;
}
function removeConfig(saved: AppConfig[], toRemove: AppConfig) {
  const newOptions = saved.filter((config) => config.name !== toRemove.name);
  localStorage.setItem("savedConfigs", JSON.stringify(newOptions));
  return newOptions;
}
/*
 * Priority: query params > local storage
 *
 *
 */
export function ConfigForm() {
  const navigate = useNavigate();
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
  }, []);

  return (
    <Box noValidate component="form">
      <Button
        variant="contained"
        endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
        onClick={() => setOpen(!open)}
      >
        Config
      </Button>
      <Collapse
        style={{ marginTop: "1ch" }}
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <ConfigSelect
          options={options}
          onSelect={(selected: AppConfig) => {
            setConfig({ ...config, ...selected });
          }}
        />
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
            setSearchParams({ ...config });
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const newOptions = removeConfig(options, config);
            setOptions(newOptions);
          }}
        >
          delete
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            navigate(`/${config.name}`);
          }}
        >
          Go
        </Button>
      </Collapse>
    </Box>
  );
}

function ConfigSelect({
  options,
  onSelect,
}: {
  options: AppConfigOption[];
  onSelect: (AppConfig) => void;
}) {
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
          return;
        } else if (newValue && newValue.isNew) {
          // Create a new value from the user input
          setValue(newValue);
        } else {
          setValue(newValue);
        }
        delete newValue?.isNew;
        onSelect(newValue);
      }}
      clearOnBlur
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.isNew) {
          return `+ ${option.name}`;
        }
        // Regular option
        return option.name;
      }}
      filterOptions={(options, params) => {
        // Return which ones to display
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            isNew: true,
            name: `${inputValue}`,
          });
        }

        return filtered;
      }}
      freeSolo
      renderInput={(params) => <TextField {...params} label="Config Name" />}
    />
  );
}
