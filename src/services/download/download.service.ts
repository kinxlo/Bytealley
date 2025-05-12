import { HttpAdapter } from "~/adapters/http-adapter";

export class DownloadService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllDownload(filters: IFilters) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<IPaginatedResponse<IDownload>>(`/downloads?${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getDownloadById(downloadId: string, isSkillSelling?: boolean) {
    const response = await (isSkillSelling
      ? this.http.get<{ data: ISkillSellingDownload }>(`/skillSellings/products/${downloadId}`)
      : this.http.get<{ data: IDownload[] }>(`/assets/products/${downloadId}`));

    if (response?.status === 200) {
      return response.data;
    }
  }

  async reviewDownloadedProduct(downloadId: string, review: IReview) {
    const response = await this.http.post<{ data: IDownload[] }>(`/reviews/products/${downloadId}`, review);
    if (response?.status === 201) {
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
