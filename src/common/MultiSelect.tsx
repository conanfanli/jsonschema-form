import * as React from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Checkbox from "@mui/material/Checkbox";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const filter = createFilterOptions<string>();
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface MultiSelectProps {
  initialOptions?: string[];
  onSelectionsChange: (newSelections: string[]) => void;
  allowNewOption: boolean;
  selected: string[];
  label: string;
  getOptions?: () => Promise<string[] | null>;
}

export function MultiSelect(props: MultiSelectProps) {
  const {
    getOptions,
    initialOptions = [],
    selected,
    onSelectionsChange,
    allowNewOption,
    label,
  } = props;
  const [options, setOptions] = React.useState<string[]>(initialOptions);

  async function onOpen() {
    if (!getOptions) {
      return;
    }

    setOptions(["loading..."]);
    const opts = await getOptions();
    if (opts) {
      setOptions(opts);
    }
  }

  const opts = [...options];
  opts.sort();

  return (
    <Autocomplete
      fullWidth
      onOpen={onOpen}
      multiple
      onChange={(_, newValue: string[]) => {
        onSelectionsChange(
          newValue.map((selection) =>
            allowNewOption ? selection.replace(/^\+ /, "") : selection,
          ),
        );
      }}
      value={selected || []}
      options={opts}
      freeSolo={allowNewOption ? true : undefined}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
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
