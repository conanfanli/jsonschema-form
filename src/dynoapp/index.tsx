import React from "react";
import { SearchParamForm } from "../savedviewapp/SearchParamForm";
import { ModalContainer } from "../common/ModalContainer";
import { DynoList } from "./DynoList";
import { DynoForm } from "./DynoForm";
import { useSchema } from "./hooks";
import { FilterForm } from "./FilterForm";
import { getFieldInfosFromSchema } from "./utils";

export function DynoApp() {
  console.log("render DynoApp");
  const [focusedRow, setFocusedRow] = React.useState<any>(null);

  const { schema, isLoadingSchema, error } = useSchema();

  if (isLoadingSchema) {
    return <div>loading schema...</div>;
  }
  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return schema ? (
    <div>
      <ModalContainer
        open={!!focusedRow}
        isNewItem={focusedRow && !focusedRow.id}
        onOpenNewModal={() => setFocusedRow({})}
        onCloseModal={() => setFocusedRow(null)}
      >
        <DynoForm
          onChange={setFocusedRow}
          schema={schema}
          row={focusedRow}
          closeModal={() => {
            setFocusedRow(null);
          }}
          onDeleteItem={() => {}}
        />
      </ModalContainer>
      <SearchParamForm />
      <FilterForm fields={getFieldInfosFromSchema(schema)} />
      <DynoList setFocusedRow={setFocusedRow} schema={schema} />
    </div>
  ) : null;
}
