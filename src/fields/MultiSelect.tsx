import * as React from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const filter = createFilterOptions<string>();

interface MultiSelectProps {
  options: string[];
  // Called whenever select/deselect something
  onSelectionsChange: (newSelections: string[]) => void;
  allowNewOption: boolean;
  selected: string[];
  label: string;
}
export function MultiSelect(props: MultiSelectProps) {
  const { options, selected, onSelectionsChange, allowNewOption, label } =
    props;
  return (
    <Autocomplete
      fullWidth
      multiple
      onChange={(_, newValue: string[]) => {
        onSelectionsChange(
          newValue.map((selection) =>
            allowNewOption ? selection.replace(/^\+ /, "") : selection,
          ),
        );
      }}
      value={selected || []}
      options={options}
      freeSolo={allowNewOption ? true : undefined}
      renderInput={(params) => (
        <TextField {...params} variant="standard" label={label} />
      )}
      filterOptions={(options: string[], params) => {
        // Return which ones to display
        const filtered = filter(options, params);

        if (!allowNewOption) {
          return filtered;
        }

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option);
        if (inputValue !== "" && !isExisting) {
          filtered.push(`+ ${inputValue}`);
        }

        return filtered;
      }}
    />
  );
}
