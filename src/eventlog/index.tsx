import React from "react";
import { useParams } from "react-router-dom";
import { Schema } from "../types";
import { EventLogTable } from "./Table";
export { EventLogTable } from "./Table";
export { EventLogDataGrid } from "./DataGrid";

export function EventLog() {
  const { configName } = useParams();

  const [error, setError] = React.useState("");
  const [schema, setSchema] = React.useState<Schema | null>(null);
  const [items, setItems] = React.useState([]);

  const configs = JSON.parse(localStorage.getItem("savedConfigs") || "[]");
  const config = configs.find((c) => c.name === configName);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(config.schemaUrl);
      const body = await res.json();

      if (body.errorMessage) {
        setError(body.errorMessage);
        return;
      }
      setSchema(body);

      const res2 = await fetch(
        `${config.itemsUrl || config.schemaUrl + "/items"}?` +
          new URLSearchParams({ filters: config.itemsFilters }),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const body2 = await res2.json();
      if (body2.error || body2.errorMessage) {
        console.error("Got error response", body2);
        setItems([]);
      } else {
        setItems(body2);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {error}
      <div>
        {schema ? <EventLogTable schema={schema} items={items} /> : null}
      </div>
    </div>
  );
}
