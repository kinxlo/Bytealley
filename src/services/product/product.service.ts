/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpAdapter } from "~/adapters/http-adapter";

export class ProductService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

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

  async updateProduct(data: any, productID: string) {
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await this.http.post<{ data: IProduct }>(`/products/${productID}?_method=PUT`, data, headers);

    if (response?.status !== 200) return;

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

  async getAllProducts(filters: IFilters = Object.create({ page: 1 })): Promise<IPaginatedResponse<IProduct>> {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<IPaginatedResponse<IProduct>>(`/products/users?${queryParameters}`);

    if (!response || response.status !== 200) {
      throw new Error("Failed to fetch products");
    }

    return response.data;
  }

  async getDashboardAnalytics() {
    const response = await this.http.get<{ data: IDashboardAnalytics }>("/products/analytics");
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async getPurchasedProducts(filters: IFilters) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<IDownload[]>(`/products/purchased?${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getProductTypesAndCategories() {
    const response = await this.http.get<{ data: ICategory[] }>(`/products/types`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getProductTags() {
    const response = await this.http.get<{ data: [] }>(`/products/tags`);

    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async downloadProducts(filters: IFilters = Object.create({ page: 1 })) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get(`/products/records?${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async softDeleteProduct(productId: string) {
    const response = await this.http.delete<IProduct>(`/products/${productId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async restoreDeleteProduct(productId: string) {
    const response = await this.http.get<IProduct>(`/products/${productId}/restore`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async deleteProductPermanently(productId: string) {
    const response = await this.http.delete<IProduct>(`/products/${productId}/force`);
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
    const response = await this.http.get<{ data: IOrder[] }>(`/orders/products/${productId}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  // New method to publish a product
  async publishProduct(productId: string) {
    const response = await this.http.patch<{ data: IProduct }>(`/products/${productId}/publish`);
    if (response?.status === 200) {
      return response.data.data;
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
