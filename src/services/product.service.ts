import { HttpAdapter } from "~/adapters/http-adapter";

export class ProductService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  // Example: Sending a POST request with custom headers
  async createProduct(data: ProductFormValues) {
    const headers = { "Content-Type": "multipart/form-data" };

    const response = await this.http.post<{ data: IProduct }>("/products", data, headers);

    if (response?.status !== 201) return;

    const { id, product_type } = response.data.data;

    if (product_type === "digital_product") {
      const digitalProductData = {
        product_id: id,
        category: data.category,
        assets: data.assets,
      };
      await this.http.post("/digitalProducts", digitalProductData, headers);
    } else if (product_type === "skill_selling") {
      const skillSellingData = {
        product_id: id,
        category: data.category,
        resource_link: data.resource_link,
        link: data.portfolio_link,
      };
      await this.http.post("/skillSellings", skillSellingData, headers);
    }
    return response.data.data.id;
  }

  async getAllProducts(filters: IProductFilters = Object.create({ page: 1 })) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<IPaginatedResponse<IProduct>>(`/products/users?${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getDashboardAnalytics() {
    const response = await this.http.get<{ data: IDashboardAnalytics }>("/products/analytics");
    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadProducts(filters: IProductFilters = Object.create({ page: 1 })) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get(`/products/download?${queryParameters}`);
    if (response?.status === 200) {
      // console.log(response.data);
      // return response.data; // This will be a Blob for the CSV file
    }
  }

  async softDeleteProduct(productId: string) {
    const response = await this.http.delete<IProduct>(`/products/${productId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getProductById(productId: string) {
    const response = await this.http.get<{ data: IProduct }>(`/products/${productId}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }
  async getProductOrderByProductId(productId: string) {
    const response = await this.http.get<{ data: IProductOrder[] }>(`/orders/products/${productId}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  private buildQueryParameters(filters: IProductFilters): string {
    const queryParameters = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        queryParameters.append(key, value.toString());
      }
    }
    return queryParameters.toString();
  }
}
