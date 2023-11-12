import * as React from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { ConfigContext } from "./contextProvider";

const filter = createFilterOptions<string>();

export function ListField({
  optionsUrl,
  value,
  onChange,
}: {
  optionsUrl?: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const { schemaClient } = React.useContext(ConfigContext);
  const [options, setOptions] = React.useState<string[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      if (!optionsUrl || !schemaClient) {
        return;
      }
      const [options] = await schemaClient.getItems(optionsUrl, {});

      if (options && options.length) {
        setOptions(options.map((o) => o.name));
      }
    };
    fetchData();
  }, [optionsUrl, schemaClient]);
  if (options.length === 0) {
    return <div>loading..</div>;
  }
  return (
    <Stack spacing={3}>
      <Autocomplete
        fullWidth
        multiple
        onChange={(_, newValue: string[]) => {
          onChange(newValue.map((item) => item.replace(/^\+ /, "")));
        }}
        value={value || []}
        options={options}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Tags" />
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
      />
    </Stack>
  );
}
/*
 */
