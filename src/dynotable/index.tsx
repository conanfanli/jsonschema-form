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
    document.title = config.name;
    const myDynamicManifest = {
      short_name: config.name,
      name: config.name,
      icons: [
        {
          src: "favicon.ico",
          sizes: "64x64 32x32 24x24 16x16",
          type: "image/x-icon",
        },
        {
          src: "logo192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "logo512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      start_url: ".",
      display: "standalone",
      theme_color: "#000000",
      background_color: "#ffffff",
    };
    const stringManifest = JSON.stringify(myDynamicManifest);
    const blob = new Blob([stringManifest], { type: "application/json" });
    const manifestURL = URL.createObjectURL(blob);
    const manifest = document.querySelector("#manifest");
    if (manifest) {
      manifest.setAttribute("href", manifestURL);
    }

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
  }, [config.schemaUrl, config.itemsFilters, config.itemsUrl, config.name]);

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
