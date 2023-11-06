import * as React from "react";
import { useParams } from "react-router-dom";
import { AppConfig } from "../types";

interface IConfigContext {
  config?: AppConfig;
  errors?: string[];
  setErrors: (errs: string[]) => void;
}
export const ConfigContext = React.createContext<IConfigContext>({
  setErrors: () => {},
});

const SAVED_CONFIGS_KEY = "savedConfigs";

export function ConfigProvider({ children }) {
  const [errors, setErrors] = React.useState<string[]>(["test"]);

  let config: AppConfig | undefined = undefined;
  const { configName } = useParams();
  try {
    if (configName && configName.length > 0) {
      const savedConfigs: AppConfig[] = JSON.parse(
        localStorage.getItem(SAVED_CONFIGS_KEY) || "[]",
      );
      config = savedConfigs.find((c) => c.name === configName);
    }
  } catch (error) {
    console.error(error);
  }
  return (
    <ConfigContext.Provider value={{ config, errors, setErrors }}>
      {children}
    </ConfigContext.Provider>
  );
}
