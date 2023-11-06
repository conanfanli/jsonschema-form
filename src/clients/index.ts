import { Schema } from "../types";

export class SchemaClient {
  private schemaUrl: string;

  constructor(schemaUrl: string) {
    this.schemaUrl = schemaUrl;
  }

  async getSchema(): Promise<[Schema | null, string]> {
    const res = await fetch(this.schemaUrl);
    const data = await res.json();

    if (data.errorMessage) {
      return [null, data.errorMessage];
    }
    return [data, ""];
  }
  async getItems(
    itemsUrl: string,
    queryFilters: {},
  ): Promise<[any[] | null, string]> {
    const res = await fetch(
      `${itemsUrl || this.schemaUrl + "/items"}?` +
        new URLSearchParams(queryFilters),
      //new URLSearchParams({ filters: config.itemsFilters }),
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await res.json();
    if (data.errorMessage) {
      return [null, data.errorMessage];
    } else {
      return [data, ""];
    }
  }
}
