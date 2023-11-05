import * as React from "react";
import { useParams } from "react-router-dom";
import { AppConfig } from "../types";

export const ConfigContext = React.createContext<AppConfig | null>(null);

const SAVED_CONFIGS_KEY = "savedConfigs";

export function ConfigProvider({ children }) {
  let config: AppConfig | null = null;
  const { configName } = useParams();
  try {
    if (configName && configName.length > 0) {
      const savedConfigs: AppConfig[] = JSON.parse(
        localStorage.getItem(SAVED_CONFIGS_KEY) || "[]",
      );
      config = savedConfigs.find((c) => c.name === configName) || null;
    }
  } catch (error) {
    console.error(error);
  }
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
