import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { DynoTablePage } from "./dynotable";
import { ConfigForm } from "./common/ConfigForm";
import { ConfigProvider } from "./common/contextProvider";

function Root() {
  return (
    <>
      <ConfigProvider>
        <div style={{ marginTop: "1ch" }} id="detail">
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
        { path: "/:configName", element: <DynoTablePage /> },
      ],
    },
  ],
  { basename: "/jsonschema-form" },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
