import React from "react";
import { useParams } from "react-router-dom";
import { ConfigContext } from "../common/contextProvider";
import { SchemaCreateForm } from "../common/SchemaForms";
import { Schema } from "../types";
import { SchemaTable } from "./Table";
export { SchemaTable } from "./Table";
export { EventLogDataGrid } from "./DataGrid";

export function DynoTablePage() {
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

  return (
    <div>
      {schema ? (
        <SchemaCreateForm schema={schema} submitUrl={config.itemsUrl} />
      ) : null}
      <div>{schema ? <SchemaTable schema={schema} items={items} /> : null}</div>
    </div>
  );
}
