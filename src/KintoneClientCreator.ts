import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export class KintoneClientCreator {
  private readonly baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createKintoneClient(
    apiToken: string | string[]
  ): Promise<KintoneRestAPIClient> {
    return new KintoneRestAPIClient({
      baseUrl: this.baseUrl,
      auth: { apiToken },
    });
  }
}
