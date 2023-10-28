import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import "./App.css";
// import { ListRows } from "./List";
import { CreateForm } from "./Create";
import { EventLogTable } from "./eventlog";

export interface AppConfig {
  schemaUrl: string;
  itemsUrl: string;
  itemsFilters?: any;
}

function SchemaPicker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = React.useState([]);

  const defaultSchemaUrl = searchParams.get("schemaUrl") || "";
  const [config, setConfig] = React.useState<AppConfig>({
    schemaUrl: defaultSchemaUrl,
    itemsUrl:
      (defaultSchemaUrl && defaultSchemaUrl + "/items") ||
      searchParams.get("itemsUrl") ||
      "",
    itemsFilters: searchParams.get("itemsFilters"),
  });

  const [schema, setSchema] = React.useState(null);

  return (
    <div>
      <Box noValidate component="form">
        <TextField
          onChange={(e) => {
            setConfig({ ...config, schemaUrl: e.target.value });
          }}
          value={config.schemaUrl}
          fullWidth
          helperText="Schema URL"
        />
        <TextField
          onChange={(e) => setConfig({ ...config, itemsUrl: e.target.value })}
          value={config.itemsUrl}
          fullWidth
          helperText="Put URL"
        />
        <TextField
          onChange={(e) => {
            setConfig({ ...config, itemsFilters: JSON.parse(e.target.value) });
          }}
          value={config.itemsFilters}
          fullWidth
          helperText="Items filter"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            setSearchParams({ ...config });

            const res = await fetch(config.schemaUrl);
            const body = await res.json();
            setSchema(body);
          }}
        >
          Render
        </Button>
        <Button
          variant="contained"
          disabled={!schema}
          color="primary"
          onClick={async () => {
            const res = await fetch(
              `${config.itemsUrl || config.schemaUrl + "/items"}?` +
                new URLSearchParams({ filters: config.itemsFilters }),
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              },
            );
            const body = await res.json();
            if (body.error) {
              console.error("Got error response", body);
              setItems([]);
            } else {
              setItems(body);
            }
          }}
        >
          Get Items
        </Button>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            setConfig({ schemaUrl: "", itemsUrl: "" });
            setSearchParams({ ...config });
          }}
        >
          clear
        </Button>
      </Box>
      {schema ? (
        <CreateForm schema={schema} submitUrl={config.itemsUrl} />
      ) : null}
      {schema ? <EventLogTable schema={schema} items={items} /> : null}
    </div>
  );
  // {schema ? <ListRows schema={schema} items={items} /> : null}
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <SchemaPicker />,
    },
    /*
    {
      path: "/eventlog",
      element: <EventLogTable />,
    },
    */
  ],
  { basename: "/jsonschema-form" },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
