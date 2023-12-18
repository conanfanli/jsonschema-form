import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useParams,
} from "react-router-dom";
import "./App.css";
import { DynoApp } from "./dynoapp";
import { SavedViewRedirect } from "./savedviewapp/ViewRedirect";
import { SearchParamForm } from "./savedviewapp/SearchParamForm";

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <div style={{ margin: ".1ch" }}>
          <Outlet />
        </div>
      </QueryClientProvider>
    </>
  );
}
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/views", element: <SearchParamForm /> },
        { path: "/:viewName", element: <DynoApp /> },
        // { path: "/dyno/:viewName", element: <DynoApp /> },
        {
          // when hitting /views/abac -> /abc?query=xxxx
          path: "/views/:viewName",
          element: (
            <SavedViewRedirect redirectTo="/" addViewNameToPath={true} />
          ),
        },
      ],
    },
  ],
  { basename: "/jsonschema-form" },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
