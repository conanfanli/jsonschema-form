export type FieldType =
  | "array"
  | "string"
  | "integer"
  | "boolean"
  | "composite"
  | "null"
  | "enum";

export interface Property {
  $ref?: Schema;
  allOf?: any[];
  anyOf?: any[];
  auto_complete?: string;
  format?: string;
  freeze_after_creation?: boolean;
  is_hidden?: boolean;
  nullable?: boolean;
  properties?: { [key: string]: Property };
  readOnly?: boolean;
  required: string[];
  title?: string;
  type: FieldType;

  // Server
  query_params_on_filter?: string;
  getAutoCompleteOptions?: () => Promise<string[]>;
}

export interface IFieldInfo extends Property {
  name: string;
}

export interface Schema {
  type: FieldType;
  title: string;
  properties: { [key: string]: Property };
  $defs: any;
}

export interface AppConfig {
  name: string;
  schemaUrl?: string;
  itemsUrl?: string;
  filters?: string; // This is a json string like {"label": "abc"}
}

export interface TaggedItem {
  id: string;
  date: string;
  description: string;
  tags?: string[];
  [key: string]: any;
}

export interface IResourceClient<T = any> {
  schemaUrl: string;
  request: (...args) => Promise<[T | null, string]>;
  getItems: (arg: {
    queryFilters?: string;
    url?: string;
  }) => Promise<[T[] | null, string]>;
  putItem: (data: T) => Promise<[T | null, string]>;
  deleteItem: (data: T) => Promise<[T | null, string]>;
  getSchema: () => Promise<[Schema | null, string]>;
}
