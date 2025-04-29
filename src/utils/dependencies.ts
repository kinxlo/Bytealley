import { QueryClient } from "@tanstack/react-query";

import { FunnelService } from "~/features/funnel";
import { PushService } from "~/features/push-notification/services/notification.service";
import { CustomerService } from "~/services/customer.service";
import { EarningService } from "~/services/earnings.service";
import { PayoutService } from "~/services/payout.service";
import { ProductService } from "~/services/product/product.service";
import { HttpAdapter } from "../adapters/http-adapter";
import { AppService } from "../services/app/app.service";
import { AuthService } from "../services/auth.service";
import { AnalyticsService } from "./../services/analytics.service";
import { DownloadService } from "./../services/download.service";
import { HelpService } from "./../services/help.service";
import { OrderService } from "./../services/orders.service";
import { SettingsService } from "./../services/settings.service";

const dependencies = {
  QUERY_CLIENT: Symbol("QueryClient"),
  HTTP_ADAPTER: Symbol("httpAdapter"),
  AUTH_SERVICE: Symbol("AuthService"),
  PRODUCT_SERVICE: Symbol("ProductService"),
  ORDER_SERVICE: Symbol("OrderService"),
  CUSTOMER_SERVICE: Symbol("CustomerService"),
  PAYOUT_SERVICE: Symbol("PayoutService"),
  EARNINGS_SERVICE: Symbol("EarningService"),
  DOWNLOAD_SERVICE: Symbol("DownloadService"),
  ANALYTICS_SERVICE: Symbol("AnalyticsService"),
  HELP_SERVICE: Symbol("HelpService"),
  APP_SERVICE: Symbol("AppService"),
  SETTINGS_SERVICE: Symbol("SettingsService"),
  PUSH_SERVICES: Symbol("PushService"),
  FUNNEL_SERVICE: Symbol("FunnelService"),
};

const queryClient = new QueryClient();
const httpAdapter = new HttpAdapter();
const authService = new AuthService(httpAdapter);
const productService = new ProductService(httpAdapter);
const orderService = new OrderService(httpAdapter);
const customerService = new CustomerService(httpAdapter);
const payoutService = new PayoutService(httpAdapter);
const earningService = new EarningService(httpAdapter);
const downloadService = new DownloadService(httpAdapter);
const analyticsService = new AnalyticsService(httpAdapter);
const helpService = new HelpService(httpAdapter);
const appService = new AppService(httpAdapter);
const settingsService = new SettingsService(httpAdapter);
const pushService = new PushService(httpAdapter);
const funnelService = new FunnelService(httpAdapter);

class DependencyContainer implements IDependencyContainer {
  _dependencies = {};

  add<T>(key: symbol, dependency: T) {
    Object.defineProperty(this._dependencies, key, {
      value: dependency,
    });
  }

  get<T>(key: symbol): T {
    return Object.getOwnPropertyDescriptor(this._dependencies, key)?.value as T;
  }
}

const container = new DependencyContainer();

container.add(dependencies.QUERY_CLIENT, queryClient);
container.add(dependencies.HTTP_ADAPTER, httpAdapter);
container.add(dependencies.AUTH_SERVICE, authService);
container.add(dependencies.PRODUCT_SERVICE, productService);
container.add(dependencies.ORDER_SERVICE, orderService);
container.add(dependencies.CUSTOMER_SERVICE, customerService);
container.add(dependencies.PAYOUT_SERVICE, payoutService);
container.add(dependencies.EARNINGS_SERVICE, earningService);
container.add(dependencies.EARNINGS_SERVICE, earningService);
container.add(dependencies.DOWNLOAD_SERVICE, downloadService);
container.add(dependencies.ANALYTICS_SERVICE, analyticsService);
container.add(dependencies.HELP_SERVICE, helpService);
container.add(dependencies.APP_SERVICE, appService);
container.add(dependencies.SETTINGS_SERVICE, settingsService);
container.add(dependencies.PUSH_SERVICES, pushService);
container.add(dependencies.FUNNEL_SERVICE, funnelService);

export { container, dependencies };
