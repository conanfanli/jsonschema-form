import { Schema, IResourceClient } from "../types";

interface ICacheProvider {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
}
interface IRequestArgs {
  url: string;
  method: "PUT" | "DELETE" | "GET";
  data: any;
  errorHandler?: (e: string) => void;
  cacheProvider?: ICacheProvider;
}

async function request<T>({
  url,
  method,
  data,
  cacheProvider,
  errorHandler = () => {},
}: IRequestArgs): Promise<[T | null, string]> {
  if (method === "GET" && cacheProvider && cacheProvider.get(url)) {
    console.log("cache hit", url);
    return cacheProvider.get(url);
  }
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method !== "GET" ? JSON.stringify(data) : undefined,
  });
  const resData = await res.json();

  if (resData.errorMessage) {
    errorHandler(`[${method} ${url}]: ${resData.errorMessage}`);
    return [null, resData.errorMessage];
  } else {
    if (method === "GET" && cacheProvider) {
      cacheProvider.set(url, [resData, ""]);
      console.log("write cache", url, resData);
    }

    return [resData, ""];
  }
}

export function ResourceClient<T = any>(
  schemaUrl: string,
  errorHandler: (err: string) => void,
  cacheProvider: ICacheProvider,
): IResourceClient<T> {
  const getSchema = request.bind<
    null,
    IRequestArgs,
    Promise<[Schema | null, string]>
  >(null, {
    url: schemaUrl,
    method: "GET",
    data: {},
    cacheProvider,
  });

  function getItems({
    url = "",
    queryFilters = "",
  }: {
    url?: string;
    queryFilters?: string;
  }) {
    const actualUrl = url ? url : `${schemaUrl}/items?filters=` + queryFilters;
    return request<T[]>({
      url: actualUrl,
      method: "GET",
      data: {},
      errorHandler,
      cacheProvider,
    });
  }
  const putItem = (data: T) => {
    return request<T>({
      url: `${schemaUrl}/items`,
      method: "PUT",
      data,
      errorHandler,
    });
  };
  function deleteItem(data: T) {
    return request<T>({
      url: `${schemaUrl}/items`,
      method: "DELETE",
      data,
      errorHandler,
    });
  }
  return { schemaUrl, request, getItems, putItem, deleteItem, getSchema };
}
