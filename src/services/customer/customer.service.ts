import { HttpAdapter } from "~/adapters/http-adapter";

export class CustomerService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllCustomers(filters: IFilters) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<IPaginatedResponse<ICustomer>>(`/customers?${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getCustomerById(customerId: string) {
    const response = await this.http.get<{ data: ICustomer }>(`/customers/${customerId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getOrdersByCustomerId(customerId: string) {
    const response = await this.http.get<IPaginatedResponse<IOrder>>(`/orders/customers/${customerId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadCustomersAsCSV(filters: IFilters) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get(`/customers/download?${queryParameters}`);
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
