import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { ConfigContext } from "./contextProvider";

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
  return (
    <Stack spacing={3}>
      <Autocomplete
        fullWidth
        multiple
        onChange={(_, newValue: string[]) => {
          console.log("onChange", newValue);
          onChange(newValue);
        }}
        value={value || []}
        options={options}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Tags" />
        )}
      />
    </Stack>
  );
}
