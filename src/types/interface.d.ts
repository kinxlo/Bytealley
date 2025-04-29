import { JWTPayload } from "jose";

declare global {
  interface ISessionContextType {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
  }

  interface IAuthState {
    isAuthenticated: boolean;
    user: null | {
      id: string;
      email: string;
      name: string;
    };
  }

  interface IDependencyContainer {
    _dependencies: {
      [key: symbol]: object;
    };
    add: (key: symbol, dependency: object) => void;
    get: <T>(key: symbol) => T;
  }

  interface IUser {
    id: string;
    name: string;
    username: string | undefined;
    email: string;
    phone_number: string | undefined;
    bio: string | undefined;
    account_type: string;
    logo: string | null;
    role: string;
    status: string | null;
    twitter_account: string | undefined;
    facebook_account: string | undefined;
    youtube_account: string | undefined;
    alt_email: string | null;
    email_verified: boolean;
    profile_completed: boolean;
    first_product_created: boolean;
    payout_setup: boolean;
    first_sale: boolean;
    product_creation_notification: boolean;
    purchase_notification: boolean;
    news_and_update_notification: boolean;
    payout_notification: boolean;
    kyc_complete: boolean;
    created_at: string;
    updated_at: string;
    token: string | undefined | null;
  }

  interface ISessionData extends JWTPayload {
    user: IUser;
    expires: string;
  }

  interface ICookieMetadata {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | "none";
  }

  interface ILayoutProperties {
    children: React.ReactNode;
  }

  interface ILoginResponse {
    user: IUser;
    token: string;
  }

  interface SidebarItem {
    route: string;
    link: string;
    icon?: IconType;
    iconUrl?: string;
    id: string;
    badge?: {
      count?: number;
      variant?: "danger" | "warning" | "success";
    };
    divider?: boolean;
  }

  interface ISidebarProperties {
    sideNavitems?: SidebarItem[];
    logoComponent?: React.ReactNode;
    className?: string;
  }

  interface IEmailVerificationResponse {
    message: string;
    success: boolean;
  }

  interface OnboardingStep {
    title: string;
    description: string;
    buttonLabel: string;
    icon: string;
    isCompleted: boolean | undefined;
    action: () => void;
  }

  interface IProduct {
    id: string;
    user_id: string;
    title: string;
    logo: string | null;
    price: number;
    category: string;
    discount_price: number;
    description: string;
    product_type: string;
    highlights: string[];
    thumbnail: File | string | null;
    cover_photos: string[];
    tags: string[];
    stock_count: boolean;
    choose_quantity: boolean;
    show_sales_count: boolean;
    link: string;
    status: "draft" | "published" | "deleted";
    slug: string;
    total_order: number;
    total_sales: number;
    assets?: (File | string | { extension?: string; size?: string })[];
    avg_rating: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    resource_link?: string[];
    portfolio_link?: string;
    publisher?: {
      name: string;
      avatar?: string;
    };
  }

  interface IPaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }

  interface IPaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: IPaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  }

  interface IPaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  }

  interface IPaginatedResponse<T> {
    data: T[];
    links: IPaginationLinks;
    meta: IPaginationMeta;
  }

  interface IDashboardAnalytics {
    total_products: number;
    total_sales: number;
    total_customers: number;
    total_revenues: number;
    new_orders: number;
    new_orders_revenue: number;
    views: number;
  }

  interface IFilters {
    page?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }

  interface IColumnDefinition<T extends DataItem> {
    header: string;
    accessorKey: keyof T;
    render?: (value: T[keyof T], row: T) => ReactNode;
  }

  interface IRowAction<T> {
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
  }

  interface IDashboardTableProperties<T extends DataItem> {
    data: T[];
    columns: IColumnDefinition<T>[];
    currentPage?: number;
    onPageChange?: (page: number) => void;
    totalPages?: number;
    itemsPerPage?: number;
    rowActions?: (row: T) => IRowAction<T>[];
    onRowClick?: (row: T) => void;
    showPagination?: boolean;
  }

  interface ICustomer {
    id: string;
    name: string;
    email: string;
    free_products: number;
    sale_products: number;
    total_order: number;
    total_transactions: string;
    latest_purchase_title: string;
    latest_purchase_price: number;
    latest_purchase_discount_price: number;
    latest_purchase_date: string;
    joined: string;
    latest_purchases: ILatestPurchase[];
  }

  interface ILatestPurchase {
    id: string;
    product_title: string;
    product_price: number;
    product_thumbnail: string;
    quantity: number;
    total_amount: number;
    customer_name: string;
    customer_email: string;
    total_order: number;
    total_sales: number;
    total_views: number;
    date: string;
  }

  interface IOrder {
    id: string;
    product: IProduct;
    customer: ICustomer;
    quantity: number;
    reference_no: string;
    total_amount: number;
    created_at: string;
  }

  interface IPayout {
    id: string;
    bank_name: string;
    account: {
      name: string;
      number: string;
    };
    amount: number;
    status: "completed" | "pending" | "failed";
    reference: string;
    created_at: string;
  }

  interface IEarnings {
    id: string;
    user_id: string;
    total_earnings: number;
    withdrawn_earnings: number;
    available_earnings: number;
    pending: number;
  }

  interface IBank {
    name: string;
    code: string;
  }

  interface IPaymentAccount {
    id: string;
    bank_name: string;
    name: string;
    account_number: string;
    active: boolean;
  }

  interface IDownload {
    id: string;
    price: number;
    product_type: string;
    publisher: string;
    sluge: string;
    thumbnail: string;
    title: string;
    extension?: string;
    mime_type?: string;
    size?: string;
    url?: string;
    publisher?: string;
    name?: string;
  }

  interface ICategory {
    name: string;
    categories: string[];
  }

  interface IReview {
    rating: number;
    comment?: string | undefined;
  }
  interface IFAQ {
    id: string;
    title: string;
    question: string;
    answer: string;
  }

  interface ISkillSellingDownload {
    id: string;
    category: string;
    link: string;
    resource_link: string[];
    product: {
      id: string;
      thumbnail: string;
      cover_photos: string[];
    };
    created_at: string;
  }

  interface IPlan {
    date: string;
    description: string;
    plan: string;
    price: number;
    reference: string;
    status: string;
  }

  interface IBillingCycle {
    id: string;
    renewal_date: string | "";
    plan: string;
    billing_total: number | null;
    plans: IPlan[] | [];
  }

  interface ISubscriptionPlan {
    link: string;
    authorization_url: string;
    access_code: string;
    reference: string;
  }
  interface IFunnel {
    id: string;
    title: string;
    status: string;
    thumbnail: string | File;
    slug?: string;
    url?: string;
    created_at: string;
    template?: string;
  }
}

export {};
