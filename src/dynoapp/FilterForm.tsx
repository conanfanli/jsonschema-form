import React from "react";
import { useSearchParams } from "react-router-dom";
import { MultiSelect } from "../common/MultiSelect";
import { IFieldInfo } from "../types";

export function FilterForm({ fields }: { fields: IFieldInfo[] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
      {fields
        .filter((f) => f.query_params_on_filter)
        .map((f) => {
          return (
            <MultiSelect
              key={f.name}
              selected={[]}
              allowNewOption={false}
              label={f.title || f.name}
              getOptions={f.getAutoCompleteOptions}
              onSelectionsChange={(selected) => {
                const newParams = {
                  ...Object.fromEntries<string>(searchParams),
                  filters: (f.query_params_on_filter || "").replace(
                    /\$value/i,
                    selected[0],
                  ),
                };
                setSearchParams(newParams);
              }}
            />
          );
        })}
    </div>
  );
}
