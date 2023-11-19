import React from "react";
import { useParams } from "react-router-dom";
import { ConfigContext } from "../common/contextProvider";
import { EditModal } from "../common/EditModal";
import { MultiSelect } from "../fields/MultiSelect";
import { Schema } from "../types";
import { DynoTable } from "./Table";

export function DynoPage() {
  const { configName } = useParams();

  const { schemaClient } = React.useContext(ConfigContext);
  const [schema, setSchema] = React.useState<Schema | null>(null);
  const [focusedRow, setFocusedRow] = React.useState<any>(null);
  const [items, setItems] = React.useState<any[]>([]);

  const configs = JSON.parse(localStorage.getItem("savedConfigs") || "[]");
  const config = configs.find((c) => c.name === configName);
  const [options, setOptions] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!schemaClient) {
        return;
      }
      const [schema] = await schemaClient.getSchema();

      if (schema) {
        setSchema(schema);
      }

      const [items] = await schemaClient.getItems(config.itemsUrl, {
        filters: config.itemsFilters,
      });

      if (items && items.length) {
        setItems(items);
      } else {
        setItems([]);
      }
      //
      // TODO: do not hard code fetch tags logic here
      //const itemsUrl = new URL(config.schemaUrl)
      const tagsUrl = `${config.itemsUrl.replace(
        /(\w+)\/items/,
        "barnie_distinct_tags/items",
      )}`;
      const [options] = await schemaClient.getItems(tagsUrl, {});
      if (options && options.length) {
        setOptions(options.map((o) => o.name));
      }
    };

    fetchData();
  }, [
    config.schemaUrl,
    config.itemsFilters,
    config.itemsUrl,
    config.name,
    schemaClient,
  ]);

  function replaceItem(newRow) {
    const newItems = items.map((item) => {
      if (item.id === newRow.id) {
        console.log(newRow);
        return newRow;
      }
      return item;
    });
    setItems(newItems);
  }
  function addNewRow(newRow) {
    setItems([newRow, ...items]);
  }
  function deleteRow(row) {
    setItems(items.filter((item) => item.id !== row.id));
  }

  return schema ? (
    <div>
      <EditModal
        focusedRow={focusedRow}
        onDeleteItem={deleteRow}
        schema={schema}
        setFocusedRow={setFocusedRow}
        addNewRow={addNewRow}
        replaceItem={replaceItem}
      />
      {options ? (
        <MultiSelect
          allowNewOption={false}
          label="tags"
          options={options}
          onSelectionsChange={setSelected}
          selected={selected}
        />
      ) : null}
      <DynoTable
        items={items}
        selectForEdit={(id: string) =>
          setFocusedRow(items.filter((item) => item.id === id)[0])
        }
        schema={schema}
      />
    </div>
  ) : null;
}
