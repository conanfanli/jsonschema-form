import React from "react";
import { useParams } from "react-router-dom";
import { ConfigContext } from "../common/contextProvider";
import { CreateForm } from "../common/SchemaForms";
import { Schema } from "../types";
import { SchemaTable } from "./Table";
export { SchemaTable } from "./Table";
export { EventLogDataGrid } from "./DataGrid";

export function DynoPage() {
  const { configName } = useParams();

  const { schemaClient } = React.useContext(ConfigContext);
  const [schema, setSchema] = React.useState<Schema | null>(null);
  const [items, setItems] = React.useState<any[]>([]);

  const configs = JSON.parse(localStorage.getItem("savedConfigs") || "[]");
  const config = configs.find((c) => c.name === configName);

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
      <CreateForm schema={schema} addNewRow={addNewRow} />
      <SchemaTable
        onChange={replaceItem}
        schema={schema}
        items={items}
        onDeleteItem={deleteRow}
      />
    </div>
  ) : null;
}
