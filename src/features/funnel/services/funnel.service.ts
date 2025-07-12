import { HttpAdapter } from "~/adapters/http-adapter";
import { FunnelFormData } from "~/schemas";

export class FunnelService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async saveFunnelToDraft(data: FunnelFormData & { funnel: string; upsell_funnel_id?: string }) {
    const headers = { "Content-Type": "multipart/form-data" };
    const formattedData = new FormData();

    formattedData.append("title", data.title);
    formattedData.append("thumbnail", data.thumbnail);
    formattedData.append("status", "draft");
    formattedData.append("template", JSON.stringify(data.funnel));
    formattedData.append("asset", data.assets[0]);
    formattedData.append(`product_id`, data.product_id);

    if (data.upsell_funnel_id) {
      formattedData.append(`upsell_funnel_id`, data.upsell_funnel_id);
    }

    const response = await this.http.post("/funnels", formattedData, headers);
    if (response?.status === 201) {
      return response.data;
    }
  }

  async publishFunnel(data: FunnelFormData & { funnel: string; upsell_funnel_id?: string }) {
    const headers = { "Content-Type": "multipart/form-data" };
    const formattedData = new FormData();

    formattedData.append("title", data.title);
    formattedData.append("thumbnail", data.thumbnail);
    formattedData.append("status", "published");
    formattedData.append("template", JSON.stringify(data.funnel));
    formattedData.append("asset", data.assets[0]);
    formattedData.append(`product_id`, data.product_id);

    if (data.upsell_funnel_id) {
      formattedData.append(`upsell_funnel_id`, data.upsell_funnel_id);
    }

    const response = await this.http.post("/funnels", formattedData, headers);
    if (response?.status === 201) {
      return response.data;
    }
  }

  // async saveFunnelToDraft(data: FunnelFormData & { funnel: string }) {
  //   const headers = { "Content-Type": "multipart/form-data" };
  //   const formattedData = new FormData();

  //   formattedData.append("title", data.title);
  //   formattedData.append("thumbnail", data.thumbnail);
  //   formattedData.append("status", "draft");
  //   formattedData.append("template", JSON.stringify(data.funnel));
  //   formattedData.append("asset", data.assets[0]);
  //   formattedData.append(`product_id`, data.product_id);
  //   // data.products.forEach((productId, index) => {
  //   //   formattedData.append(`products[${index}]`, productId);
  //   // });

  //   const response = await this.http.post("/funnels", formattedData, headers);
  //   if (response?.status === 201) {
  //     return response.data;
  //   }
  // }

  // async publishFunnel(data: FunnelFormData & { funnel: string }) {
  //   const headers = { "Content-Type": "multipart/form-data" };
  //   const formattedData = new FormData();

  //   formattedData.append("title", data.title);
  //   formattedData.append("thumbnail", data.thumbnail);
  //   formattedData.append("status", "published");
  //   formattedData.append("template", JSON.stringify(data.funnel));
  //   formattedData.append("asset", data.assets[0]);
  //   formattedData.append(`product_id`, data.product_id);

  //   // data.products.forEach((productId, index) => {
  //   //   formattedData.append(`products[${index}]`, productId);
  //   // });

  //   const response = await this.http.post("/funnels", formattedData, headers);
  //   if (response?.status === 201) {
  //     return response.data;
  //   }
  // }

  async getAllFunnels(filters: IFilters = Object.create({ page: 1 })) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<IPaginatedResponse<IFunnel>>(`/funnels/me?${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getFunnelByID(funnelID: string) {
    const response = await this.http.get<{ data: IFunnel }>(`/funnels/${funnelID}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async updateFunnel(data: IFunnel) {
    const headers = { "Content-Type": "multipart/form-data" };
    const formattedData = new FormData();
    if (data.template) {
      formattedData.append("template", data.template);
    }
    formattedData.append("title", data.title);
    if (data.thumbnail && data.thumbnail instanceof File) {
      formattedData.append("thumbnail", data.thumbnail);
    }
    formattedData.append("status", data.status);
    formattedData.append("_method", `PATCH`);

    const response = await this.http.post<{ data: IFunnel }>(`/funnels/${data.id}`, formattedData, headers);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async deleteFunnel(funnelID: string) {
    const response = await this.http.delete<{ data: IFunnel }>(`/funnels/${funnelID}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  private buildQueryParameters(filters: IFilters): string {
    const queryParameters = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        queryParameters.append(key, value.toString());
      }
    }
    return queryParameters.toString();
  }
}
