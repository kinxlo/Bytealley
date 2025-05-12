import { HttpAdapter } from "~/adapters/http-adapter";

export class OrderService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllOrders(filters?: IFilters) {
    let queryParameters = null;
    if (filters) {
      queryParameters = this.buildQueryParameters(filters);
    }
    const response = await this.http.get<IPaginatedResponse<IOrder>>(`/orders/user?${queryParameters}`);

    if (response?.status === 200) {
      return response.data;
    }
  }

  async getOrderById(orderId: string) {
    const response = await this.http.get<{ data: IOrder }>(`/orders/${orderId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadOrdersAsCSV(filters: IFilters) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get(`/orders/download?${queryParameters}`);
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
