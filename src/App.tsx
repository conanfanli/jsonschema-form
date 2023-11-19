import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { DynoApp } from "./DynoApp/DynoApp";
import { ConfigProvider, ConfigForm } from "./ConfigApp";

function Root() {
  return (
    <>
      <ConfigProvider>
        <div style={{ margin: ".1ch" }}>
          <Outlet />
        </div>
      </ConfigProvider>
    </>
  );
}
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/", element: <ConfigForm /> },
        { path: "/:configName", element: <DynoApp /> },
      ],
    },
  ],
  { basename: "/jsonschema-form" },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
