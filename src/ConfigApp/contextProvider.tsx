import * as React from "react";
import { useParams } from "react-router-dom";
import { SchemaClient } from "../clients";
import { AppConfig } from "../types";

interface IConfigContext {
  config?: AppConfig;
  schemaClient?: SchemaClient;
}
export const ConfigContext = React.createContext<IConfigContext>({});

const SAVED_CONFIGS_KEY = "savedConfigs";

export function ConfigProvider({ children }) {
  let config: AppConfig | undefined = undefined;
  const { configName } = useParams();
  let schemaClient: SchemaClient | undefined = undefined;

  React.useEffect(() => {
    const title = configName || "Dyno";
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
  try {
    if (configName && configName.length > 0) {
      const savedConfigs: AppConfig[] = JSON.parse(
        localStorage.getItem(SAVED_CONFIGS_KEY) || "[]",
      );
      config = savedConfigs.find((c) => c.name === configName);
      if (config && config.schemaUrl) {
        schemaClient = new SchemaClient({
          schemaUrl: config.schemaUrl,
        });
      }
    }
  } catch (error) {
    console.error(`error when loading saved configs  ${error}`);
  }
  return (
    <ConfigContext.Provider value={{ config, schemaClient }}>
      {children}
    </ConfigContext.Provider>
  );
}
