import React from "react";
import { useParams } from "react-router-dom";
import { SchemaClient } from "../clients";
import { SchemaCreateForm } from "../common/SchemaForms";
import { Schema } from "../types";
import { SchemaTable } from "./Table";
export { SchemaTable } from "./Table";
export { EventLogDataGrid } from "./DataGrid";

export function DynoTablePage() {
  const { configName } = useParams();

  const [error, setError] = React.useState("");
  const [schema, setSchema] = React.useState<Schema | null>(null);
  const [items, setItems] = React.useState<any[]>([]);

  const configs = JSON.parse(localStorage.getItem("savedConfigs") || "[]");
  const config = configs.find((c) => c.name === configName);

  React.useEffect(() => {
    const fetchData = async () => {
      const client = new SchemaClient(config.schemaUrl);
      const [schema, errorMessage] = await client.getSchema();

      if (errorMessage) {
        setError(errorMessage);
        return;
      }
      setSchema(schema);

      const [items, errorMessage2] = await client.getItems(config.itemsUrl, {
        filters: config.itemsFilters,
      });

      if (!items || errorMessage2) {
        setError(errorMessage2);
        return;
      }
      setItems(items);
    };

    fetchData();
  }, [config.schemaUrl, config.itemsFilters, config.itemsUrl]);

  return (
    <div>
      {error}
      {schema ? (
        <SchemaCreateForm schema={schema} submitUrl={config.itemsUrl} />
      ) : null}
      <div>{schema ? <SchemaTable schema={schema} items={items} /> : null}</div>
    </div>
  );
}
