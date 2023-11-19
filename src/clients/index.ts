import { Schema } from "../types";

export class SchemaClient {
  private schemaUrl: string;
  public onErrorCallback: (e: string) => void;

  constructor({
    schemaUrl,
    onErrorCallback = () => {},
  }: {
    schemaUrl: string;
    onErrorCallback?: (e: string) => void;
  }) {
    this.schemaUrl = schemaUrl;
    this.onErrorCallback = onErrorCallback;
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
    const url = `${itemsUrl}?` + new URLSearchParams(queryFilters);
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    try {
      const data = await res.json();
      if (data.errorMessage) {
        this.onErrorCallback(`[GET ${url}]: ${data.errorMessage}`);
        return [null, data.errorMessage];
      } else {
        return [data, ""];
      }
    } catch (err) {
      const msg = `error parsing response as JSON when requesting ${itemsUrl}: ${err} `;
      console.error(msg);
      this.onErrorCallback(msg);
      return [null, msg];
    }
  }
  async putItem<T>(itemsUrl: string, item: T): Promise<[T | null, string]> {
    const res = await fetch(itemsUrl || "", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await res.json();

    if (data.errorMessage) {
      this.onErrorCallback(`[PUT ${itemsUrl}]: ${data.errorMessage}`);
      return [null, data.errorMessage];
    } else {
      return [data, ""];
    }
  }

  async deleteItem<T>(itemsUrl: string, data: T): Promise<[T | null, string]> {
    const res = await fetch(itemsUrl || "", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (body.errorMessage) {
      this.onErrorCallback(`[DELETE ${itemsUrl}]: ${body.errorMessage}`);
      return [null, body.errorMessage];
    } else {
      return [body, ""];
    }
  }
}
