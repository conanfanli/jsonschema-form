import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { ResourceClient } from "../clients";
import { ErrorCenter } from "../common/ErrorCenter";
import { AppConfig, IResourceClient } from "../types";

interface IConfigContext {
  config?: AppConfig;
  resourceClient?: IResourceClient;
}
export const ConfigContext = React.createContext<IConfigContext>({});

export function ConfigProvider({ children }) {
  console.log("render contextProvider");
  let config: AppConfig | undefined = undefined;

  const [errors, setErrors] = React.useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const [resourceClient, setResourceClient] = React.useState<IResourceClient>();
  const [caches, setCaches] = React.useState({});

  if (searchParams.size) {
    config = Object.fromEntries<string>(searchParams) as any;
  }

  React.useEffect(() => {
    const addError = (e: string) => {
      setErrors([...errors, e]);
    };
    function setCache(key: string, value: string) {
      if (value === undefined) {
        delete caches[key];
      }
      setCaches({ ...caches, [key]: value });
    }
    const fetchData = async () => {
      if (!config?.schemaUrl) {
        return;
      }
      const client = ResourceClient<any>(config?.schemaUrl || "", addError, {
        get: function(key: string) {
          return caches[key];
        },
        set: setCache,
      });
      setResourceClient(client);
    };

    fetchData();
  }, [config?.schemaUrl, caches, errors]);

  return (
    <div>
      <ErrorCenter errors={errors} />
      <ConfigContext.Provider value={{ config, resourceClient }}>
        {children}
      </ConfigContext.Provider>
    </div>
  );
}
