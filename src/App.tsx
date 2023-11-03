import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import "./App.css";
import { CreateForm } from "./Create";
import { EventLogTable } from "./eventlog";
import { Schema } from "./types";
import { ConfigForm } from "./AppConfig";

export interface AppConfig {
  schemaUrl: string;
  itemsUrl: string;
  itemsFilters: string; // This is a json string like {"label": "abc"}
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
    itemsFilters: searchParams.get("itemsFilters") || "",
  });

  const [schema, setSchema] = React.useState<Schema | null>(null);

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
            setConfig({ ...config, itemsFilters: e.target.value });
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
            setConfig({
              schemaUrl: config.schemaUrl,
              itemsUrl: config.itemsUrl,
              itemsFilters: "",
            });
            setSearchParams({ ...config });
          }}
        >
          clear
        </Button>
      </Box>
      {schema ? (
        <CreateForm schema={schema} submitUrl={config.itemsUrl} />
      ) : null}
      {schema ? (
        <EventLogTable
          schema={schema}
          items={items}
          mergeFilter={(addedFilter) =>
            setConfig({
              ...config,
              itemsFilters: JSON.stringify({
                ...JSON.parse(config.itemsFilters || "{}"),
                ...addedFilter,
              }),
            })
          }
        />
      ) : null}
    </div>
  );
  // {schema ? <ListRows schema={schema} items={items} /> : null}
}

function Root() {
  return (
    <>
      <div style={{ marginTop: "3ch" }} id="detail">
        <Outlet />
      </div>
    </>
  );
}
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/", element: <SchemaPicker /> },
        { path: "/config", element: <ConfigForm /> },
      ],
    },
  ],
  { basename: "/jsonschema-form" },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
