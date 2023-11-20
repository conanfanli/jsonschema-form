import React from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import { DynoApp } from "./DynoApp/DynoApp";
import { ConfigProvider, ConfigForm } from "./ConfigApp";

/**
 *
 * If url is /views/abc, redirect to /dyno/abc?query=xxxx. Query string
 * is the sort of truth.
 */

function SavedViewRedirect() {
  const { viewName } = useParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedConfigs") || "[]");
    const view = saved.find((c) => c.name === viewName);
    if (!view) {
      return;
    }
    const params = `/dyno/${viewName}?` + new URLSearchParams(view);
    function redirect() {
      navigate(params);
    }
    setTimeout(redirect, 1000);
  }, [viewName, navigate]);
  return <div>loading ...</div>;
}

function Root() {
  const { viewName } = useParams();
  React.useEffect(() => {
    const title = viewName || "Dyno";
    document.title = title;
    const myDynamicManifest = {
      short_name: title,
      name: title,
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
  });
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
        { path: "/config", element: <ConfigForm /> },
        { path: "/dyno/:viewName", element: <DynoApp /> },
        { path: "/views/:viewName", element: <SavedViewRedirect /> },
      ],
    },
  ],
  { basename: "/jsonschema-form" },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
