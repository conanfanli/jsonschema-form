import React from "react";
import { SearchParamForm } from "../savedviewapp/SearchParamForm";
import { ModalContainer } from "../common/ModalContainer";
import { DynoList } from "./DynoList";
import { DynoForm } from "./DynoForm";
import { useShit } from "./hooks";
import { FilterForm } from "./FilterForm";
import { getFieldInfosFromSchema } from "./utils";

export function DynoApp() {
  console.log("render DynoApp");

  const {
    schema,
    focusedRow,
    setFocusedRow,
    onDeleteItem,
    options,
    items,
    onSubmitItem,
  } = useShit();

  return schema && onDeleteItem && onSubmitItem ? (
    <div>
      <ModalContainer
        open={!!focusedRow}
        isNewItem={focusedRow && !focusedRow.id}
        onOpenNewModal={() => setFocusedRow({})}
        onCloseModal={() => setFocusedRow(null)}
      >
        <DynoForm
          options={options}
          onChange={setFocusedRow}
          schema={schema}
          row={focusedRow}
          onSubmitItem={onSubmitItem}
          onDeleteItem={onDeleteItem}
        />
      </ModalContainer>
      <SearchParamForm />
      <FilterForm fields={getFieldInfosFromSchema(schema)} />
      <DynoList
        items={items}
        selectForEdit={(id: string) =>
          setFocusedRow(items.filter((item) => item.id === id)[0])
        }
        schema={schema}
      />
    </div>
  ) : null;
}
