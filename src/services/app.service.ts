import { HttpAdapter } from "~/adapters/http-adapter";
import { EmailIntegrationFormData, ExternalContactFormData, ProfileFormData } from "~/schemas";

export class AppService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getCurrentUser() {
    const response = await this.http.get<{ data: IUser }>("/users/me");
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async getProductCategory() {
    const response = await this.http.get<{ data: CategoryItem[] }>("/products/types");
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async getAllProducts(filters: IFilters = Object.create({ page: 1 })) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<IPaginatedResponse<IProduct>>(`/products/external?${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async search(data: { text: string }) {
    const response = await this.http.post<{ data: IProduct[] }>("/products/search", data);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateUser(data: ProfileFormData) {
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await this.http.post<{ data: IUser }>(`/users/me`, data, headers);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async subscribeToPlan() {
    const response = await this.http.post<{ data: ISubscriptionPlan }>(`/subscriptions`, null);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async integrateEmail(data: EmailIntegrationFormData) {
    const response = await this.http.post<{ data: { message: string } }>(`/emailMarketing/token`, data);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateUserNotifications(data: object) {
    const response = await this.http.post<{ data: IUser }>(`/users/me`, data);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async contactUs(data: ExternalContactFormData) {
    const response = await this.http.post<{ message: string }>(`/complaints/contact-us`, data);
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
