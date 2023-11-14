import * as React from "react";
import Stack from "@mui/material/Stack";
import { ConfigContext } from "./contextProvider";
import { MultiSelect } from "../fields/MultiSelect";

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
      <MultiSelect
        allowNewOption={true}
        onSelectionsChange={onChange}
        options={options}
        label="Tags"
        selected={value}
      />
    </Stack>
  );
}
