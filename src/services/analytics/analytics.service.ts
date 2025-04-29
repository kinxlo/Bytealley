/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDaysInMonth } from "date-fns";

import { HttpAdapter } from "~/adapters/http-adapter";

export class AnalyticsService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllDownload(filters: IFilters) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<IPaginatedResponse<IPayout>>(`/downloads${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getDownloadById(downloadId: string) {
    const response = await this.http.get<{ data: IPayout }>(`/downloads/${downloadId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getDailyRevenueData(monthIndex: string) {
    const year = new Date().getFullYear();
    const month = monthIndex.padStart(2, "0");

    const response = await this.http.get<{ data: any }>(`/revenues/daily?month=${year}-${month}`);
    if (response?.status === 200) {
      const data = response.data.data;
      const daysInMonths = getDaysInMonth(Number.parseInt(monthIndex, 10));
      const dailyRevenueData = Array.from({ length: daysInMonths }, (_, index) => {
        const day = index + 1;
        const formattedDay = day.toString().padStart(2, "0");
        const date = `${year}-${month}-${formattedDay}`;
        return {
          day,
          revenue: data[date] ? data[date].amount : 0,
        };
      });
      return dailyRevenueData;
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
