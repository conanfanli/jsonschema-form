import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { ConfigContext } from "./contextProvider";

export function ListField({ optionsUrl }: { optionsUrl?: string }) {
  const { schemaClient } = React.useContext(ConfigContext);
  const [options, setOptions] = React.useState<any[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      if (!optionsUrl || !schemaClient) {
        return;
      }
      const [options] = await schemaClient.getItems(optionsUrl, {});

      if (options && options.length) {
        console.log(options);
        setOptions(options);
      }
    };
    fetchData();
  }, [optionsUrl]);
  // defaultValue={[options[0]]}
  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="tags-standard"
        options={options}
        getOptionLabel={(option) => option.tag_name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Multiple values"
            placeholder="Favorites"
          />
        )}
      />
    </Stack>
  );
}
