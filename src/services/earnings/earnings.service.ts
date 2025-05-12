import { HttpAdapter } from "~/adapters/http-adapter";
import { BankFormData, WithdrawalData } from "~/schemas";

export class EarningService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getUserEarnings() {
    const response = await this.http.get<{ data: IEarnings }>(`/earnings`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async getListOfPaystackApproveBanks() {
    const response = await this.http.get<IBank[]>(`/accounts/bank-list`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async registerPaymentAccount(data: BankFormData) {
    const parseBankData = JSON.parse(data.bank_code);
    const formData = {
      ...data,
      bank_code: parseBankData.bank_code,
      bank_name: parseBankData.bank_name,
    };
    const response = await this.http.post<{ data: IPaymentAccount }>(`/accounts`, formData);
    if (response?.status === 201) {
      return response.data;
    }
  }

  async getAllRegisteredPaymentAccount() {
    const response = await this.http.get<{ data: IPaymentAccount[] }>(`/accounts`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async initiateWithdrawal(data: WithdrawalData) {
    const response = await this.http.post<{ data: string }>(`/earnings/withdraw`, data);
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
