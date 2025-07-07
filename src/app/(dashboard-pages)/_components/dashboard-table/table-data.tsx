import { Edit, Eye, MinusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Badge } from "~/components/ui/badge";
import { useProductService } from "~/services/product/use-product-service";
import { Toast } from "~/utils/notificationManager";
import { cn, formatDate, formatTime } from "~/utils/utils";

export const useProductRowActions = () => {
  const router = useRouter();
  const { useSoftDeleteProduct, usePublishProduct } = useProductService();
  const softDeleteMutation = useSoftDeleteProduct();
  const publishMutation = usePublishProduct();

  const getRowActions = (product: IProduct) => {
    const actions: IRowAction<IProduct>[] = [];

    switch (product.status) {
      case "draft": {
        actions.push(
          {
            label: "Edit",
            onClick: () => {
              router.push(`/dashboard/${product.user_id}/products/new?product_id=${product.id}`);
            },
            icon: <Edit className={`text-high-primary`} />,
          },
          {
            label: "Delete",
            onClick: async () => {
              await softDeleteMutation.mutateAsync(product.id);
              Toast.getInstance().showToast({
                title: "Success",
                description: `Product ${product.title} deleted successfully!`,
                variant: "warning",
              });
              router.push(`/dashboard/${product.user_id}/products?tab=deleted`);
            },
            icon: <Trash className={`text-high-danger`} />,
          },
          {
            label: "Preview",
            onClick: () => {
              router.push(`/dashboard/${product.user_id}/products/new?product_id=${product.id}&tab=preview`);
            },
            icon: <Eye className={`text-high-primary`} />,
          },
        );
        break;
      }
      case "published": {
        actions.push(
          {
            label: "Preview",
            onClick: () => {
              router.push(
                `/dashboard/${product.user_id}/products/new?product_id=${product.id}&tab=preview&status=published`,
              );
            },
            icon: <Eye className={`text-high-primary`} />,
          },
          {
            label: "Unpublish to draft",
            onClick: async () => {
              await publishMutation.mutateAsync(product.id);
              Toast.getInstance().showToast({
                title: "Success",
                description: `Product ${product.title} status updated successfully!`,
                variant: "success",
              });
              router.push(`/dashboard/${product.user_id}/products?tab=drafts`);
            },
            icon: <MinusCircle className={`text-high-warning`} />,
          },
        );
        break;
      }
    }
    return actions;
  };
  return { getRowActions };
};

export const productColumns: IColumnDefinition<IProduct>[] = [
  {
    header: "Product Name",
    accessorKey: "title",
    render: (_, product: IProduct) => (
      <div className={`flex w-fit items-center gap-2`}>
        <Image
          src={typeof product.thumbnail === "string" ? product.thumbnail : ""}
          alt="product"
          width={100}
          height={64}
          className={`h-[64px] w-[100px] rounded-md bg-low-grey-III object-cover`}
        />
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium lg:text-[16px]">{product.title}</span>
          <span className="space-x-1 text-[10px] text-mid-grey-II lg:text-sm">
            {/* {`PDF-55.MB • `} */}
            {formatDate(product.created_at)}
            <span>•</span>
            <span>{formatTime(product.created_at)}</span>
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    accessorKey: "price",
    render: (_, product: IProduct) => (
      <span className={cn(`font-medium`, product.discount_price ? `text-mid-danger` : `text-mid-success`)}>
        ₦{product.price?.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Discount Price",
    accessorKey: "discount_price",
    render: (_, product: IProduct) => (
      <span className={cn(`font-medium`, product.discount_price ? `text-mid-success` : `text-mid-danger`)}>
        {product.discount_price ? `₦${product.discount_price?.toLocaleString()}` : `N/A`}
      </span>
    ),
  },
  {
    header: "Sales",
    accessorKey: "total_sales",
    render: (_, product: IProduct) => <span className={`font-medium`}>{product.total_sales}</span>,
  },
  {
    header: "Type",
    accessorKey: "product_type",
    render: (_, product: IProduct) => (
      <span className={`font-medium capitalize`}>{product.product_type.replace("_", " ")}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, product: IProduct) => (
      <Badge
        className={cn(
          product.status === "draft" ? "bg-low-warning text-high-warning" : "bg-low-success text-mid-success",
          "rounded-sm px-4 py-2",
        )}
      >
        {product.status}
      </Badge>
    ),
  },
];

export const singleProductOrderColumns: IColumnDefinition<IOrder>[] = [
  {
    header: "Customer Name",
    accessorKey: "customer",
    render: (_, product: IOrder) => <span className={`font-medium`}>{product?.customer?.name}</span>,
  },
  {
    header: "Customer Email",
    accessorKey: "customer",
    render: (_, product: IOrder) => <span className={`font-medium`}>{product?.customer?.email}</span>,
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    render: (_, product: IOrder) => <span className={`font-medium`}>{product?.quantity}</span>,
  },
  {
    header: "Date",
    accessorKey: "created_at",
    render: (_, order: IOrder) => (
      <span className={`font-medium`}>
        {formatDate(order?.created_at)} {formatTime(order?.created_at)}
      </span>
    ),
  },
];

export const orderColumns: IColumnDefinition<IOrder>[] = [
  {
    header: "Product",
    accessorKey: "product",
    render: (_, order: IOrder) => (
      <div className={`flex w-fit items-center gap-2`}>
        <Image
          src={typeof order?.product?.thumbnail === "string" ? order.product.thumbnail : ""}
          alt="product"
          width={44}
          height={44}
          className={`h-[44px] w-[44px] rounded-md bg-low-grey-III object-cover`}
        />
        <span className="text-[16px] font-medium">{order?.product?.title}</span>
      </div>
    ),
  },

  {
    header: "Price",
    accessorKey: "product",
    render: (_, order: IOrder) => (
      <span className={cn(`font-medium`, order?.product.discount_price ? `text-mid-danger` : `text-mid-success`)}>
        ₦{order?.product?.price?.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Discount Price",
    accessorKey: "product",
    render: (_, order: IOrder) => (
      <span className={cn(`font-medium`, order?.product.discount_price ? `text-mid-success` : `text-mid-danger`)}>
        ₦{order?.product?.discount_price?.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Customer Email",
    accessorKey: "customer",
    render: (_, order: IOrder) => <span className={`font-medium`}>{order?.customer?.email}</span>,
  },
  {
    header: "Date",
    accessorKey: "created_at",
    render: (_, order: IOrder) => (
      <span className={`font-medium`}>
        {formatDate(order?.created_at)} {formatTime(order?.created_at)}
      </span>
    ),
  },
];

export const customerColumns: IColumnDefinition<ICustomer>[] = [
  {
    header: "Customer Name",
    accessorKey: "name",
    render: (_, customer: ICustomer) => <span className={`font-medium`}>{customer.name}</span>,
  },
  {
    header: "Customer Email",
    accessorKey: "email",
    render: (_, customer: ICustomer) => <span className={`font-medium`}>{customer.email}</span>,
  },
  {
    header: "Latest Purchase",
    accessorKey: "latest_purchases",
    render: (_, customer: ICustomer) => (
      <div className={`space-y-2`}>
        <p className={`font-medium`}>{customer?.latest_purchase_title}</p>
        {/* <p className={`text-sm text-mid-grey-II underline`}>{customer?.id}</p> */}
      </div>
    ),
  },
  {
    header: "Latest Purchase Price",
    accessorKey: "latest_purchase_price",
    render: (_, customer: ICustomer) => (
      <span className={cn(`font-medium`, customer?.latest_purchase_price ? `text-mid-danger` : `text-mid-success`)}>
        ₦{customer?.latest_purchase_price?.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Latest Purchase Discount Price",
    accessorKey: "latest_purchase_discount_price",
    render: (_, customer: ICustomer) => (
      <span
        className={cn(`font-medium`, customer?.latest_purchase_discount_price ? `text-mid-success` : `text-mid-danger`)}
      >
        ₦{customer?.latest_purchase_discount_price?.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Date",
    accessorKey: "latest_purchase_date",
    render: (_, customer: ICustomer) => (
      <span className={`font-medium`}>
        {formatDate(customer?.latest_purchase_date)} {formatTime(customer?.latest_purchase_date)}
      </span>
    ),
  },
];

export const latestPurchaseColumns: IColumnDefinition<IOrder>[] = [
  {
    header: "Latest Purchase",
    accessorKey: "product",
    render: (_, order: IOrder) => (
      <div className={`flex w-fit items-center gap-2`}>
        <Image
          src={typeof order?.product.thumbnail === "string" ? order.product.thumbnail : ""}
          alt="product"
          width={44}
          height={44}
          className={`bg-low-grey-II`}
        />
        <span className="text-[16px] font-medium">{order?.product.title}</span>
      </div>
    ),
  },
  {
    header: "Price",
    accessorKey: "product",
    render: (_, order: IOrder) => (
      <span className={`font-medium`}>
        ₦
        {order?.product.discount_price
          ? order.product.discount_price.toLocaleString()
          : order?.product.price?.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Date",
    accessorKey: "created_at",
    render: (_, order: IOrder) => (
      <span className={`font-medium`}>
        {formatDate(order?.created_at)} {formatTime(order?.created_at)}
      </span>
    ),
  },
];

export const payoutColumns: IColumnDefinition<IPayout>[] = [
  {
    header: "Price",
    accessorKey: "amount",
    render: (_, payout: IPayout) => <span className={`font-medium`}>{payout.amount}</span>,
  },
  {
    header: "Bank Account",
    accessorKey: "account",
    render: (_, payout: IPayout) => {
      const accountNumber = payout?.account.number;
      const maskedAccountNumber = `${accountNumber.slice(0, 3)}****${accountNumber.slice(-3)}`;
      return <span className={`font-medium`}>{maskedAccountNumber}</span>;
    },
  },
  {
    header: "Period",
    accessorKey: "created_at",
    render: (_, payout: IPayout) => (
      <span className={`font-medium`}>
        {formatDate(payout?.created_at)} {formatTime(payout?.created_at)}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, payout: IPayout) => (
      <Badge
        className={cn(
          payout.status === "completed"
            ? "bg-low-success text-mid-success"
            : payout.status === "pending"
              ? "bg-low-warning text-high-warning"
              : "bg-low-danger text-mid-danger",
          "rounded-sm px-4 py-2",
        )}
      >
        {payout.status}
      </Badge>
    ),
  },
];

export const plansColumns: IColumnDefinition<IPlan>[] = [
  {
    header: "Plan",
    accessorKey: "plan",
    render: (_, plan: IPlan) => <span className={`font-medium`}>{plan.plan}</span>,
  },
  {
    header: "Price",
    accessorKey: "price",
    render: (_, plan: IPlan) => <span className={`font-medium`}>₦{plan.price?.toLocaleString()}</span>,
  },
  {
    header: "Date",
    accessorKey: "date",
    render: (_, plan: IPlan) => (
      <span className={`font-medium`}>
        {formatDate(plan?.date)} {formatTime(plan?.date)}
      </span>
    ),
  },

  {
    header: "Status",
    accessorKey: "status",
    render: (_, plan: IPlan) => (
      <Badge
        className={cn(
          plan.status === "success"
            ? "bg-low-success text-mid-success"
            : plan.status === "pending"
              ? "bg-low-warning text-high-warning"
              : "bg-low-danger text-mid-danger",
          "rounded-sm px-4 py-2",
        )}
      >
        {plan.status}
      </Badge>
    ),
  },
];

export const deletedProductColumns: IColumnDefinition<IProduct>[] = [
  {
    header: "Product Name",
    accessorKey: "title",
    render: (_, product: IProduct) => (
      <div className={`flex w-fit items-center gap-2`}>
        <Image
          src={typeof product.thumbnail === "string" ? product.thumbnail : ""}
          alt="product"
          width={100}
          height={64}
          className={`h-[64px] w-[100px] rounded-md bg-low-grey-III object-cover`}
        />
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium lg:text-[16px]">{product.title}</span>
          <span className="space-x-1 text-[10px] text-mid-grey-II lg:text-sm">
            {`PDF-55.MB • `}
            {formatDate(product.created_at)}
            <span>•</span>
            <span>{formatTime(product.created_at)}</span>
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    accessorKey: "price",
    render: (_, product: IProduct) => <span className={`font-medium`}>₦{product.price?.toLocaleString()}</span>,
  },
  {
    header: "Sales",
    accessorKey: "total_sales",
  },
  {
    header: "Type",
    accessorKey: "product_type",
    render: (_, product: IProduct) => <span className={`font-medium`}>{product.product_type.replace("_", " ")}</span>,
  },
];

export const useDeletedProductRowActions = () => {
  const router = useRouter();
  const { useDeleteProductPermanently, useRestoreDeleteProduct } = useProductService();

  const restoreMutation = useRestoreDeleteProduct();
  const permanentDeleteMutation = useDeleteProductPermanently();

  const getRowActions = (product: IProduct) => {
    const actions: IRowAction<IProduct>[] = [
      {
        label: "Recover to Draft",
        onClick: async () => {
          try {
            await restoreMutation.mutateAsync(product.id);
            Toast.getInstance().showToast({
              title: "Success",
              description: `Product ${product.title} restored to draft successfully!`,
              variant: "success",
            });
            router.push(`/dashboard/${product.user_id}/products?tab=drafts`);
          } catch {
            Toast.getInstance().showToast({
              title: "Error",
              description: "Failed to restore product",
              variant: "error",
            });
          }
        },
        icon: <Eye className="text-high-primary" />,
      },
      {
        label: "Delete Permanently",
        onClick: async () => {
          try {
            await permanentDeleteMutation.mutateAsync(product.id);
            Toast.getInstance().showToast({
              title: "Success",
              description: `Product ${product.title} deleted permanently!`,
              variant: "warning",
            });
            router.push(`/dashboard/${product.user_id}/products?tab=all-products`);
          } catch {
            Toast.getInstance().showToast({
              title: "Error",
              description: "Failed to delete product permanently",
              variant: "error",
            });
          }
        },
        icon: <Trash className="text-high-danger" />,
      },
      {
        label: "Preview",
        onClick: () => {
          router.push(`/dashboard/${product.user_id}/products/new?product_id=${product.id}&tab=preview`);
        },
        icon: <Eye className="text-high-primary" />,
      },
    ];

    return actions;
  };

  return { getRowActions };
};
