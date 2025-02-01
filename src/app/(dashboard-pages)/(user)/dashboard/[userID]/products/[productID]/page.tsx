"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import { TableHeaderInfo } from "~/app/(dashboard-pages)/_components/table-header-info";
import Loading from "~/app/Loading";
import CustomButton from "~/components/common/common-button/common-button";
import { WithDependency } from "~/HOC/withDependencies";
import { ProductService } from "~/services/product.service";
import { singleProductCustomerColumns } from "~/utils/constants";
import { dependencies } from "~/utils/dependencies";
import { Toast } from "~/utils/notificationManager";
import { formatDate, formatTime } from "~/utils/utils";

const BasePreviewProductDetailsPage = ({
  params,
  productService,
}: {
  params: { productID: string };
  productService: ProductService;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isPublishPending, startPublishTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [productOrders, setProductOrders] = useState<IProductOrderFlat[]>([]);
  const router = useRouter();

  // Fetch product and orders data
  useEffect(() => {
    const fetchProductData = async () => {
      startTransition(async () => {
        const [product, orders] = await Promise.all([
          productService.getProductById(params.productID),
          productService.getProductOrderByProductId(params.productID),
        ]);

        if (product && orders) {
          setProduct(product);
          setProductOrders(
            orders.flatMap((order) => ({
              name: order.customer.name,
              email: order.customer.email,
              quantity: order.quantity,
              date: `${formatDate(order.created_at)} ${formatTime(order.created_at)}`,
            })),
          );
        }
      });
    };

    fetchProductData();
  }, [params.productID, productService]);

  // Handle publish/unpublish action
  const handlePublish = async () => {
    startPublishTransition(async () => {
      await productService.publishProduct(params.productID);

      // Show success toast
      Toast.getInstance().showToast({
        title: "Success",
        description: `Product status updated successfully!`,
        variant: "success",
      });

      // Re-fetch product data to update the UI
      const updatedProduct = await productService.getProductById(params.productID);
      if (updatedProduct) {
        setProduct(updatedProduct);
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      await productService.softDeleteProduct(params.productID);
      Toast.getInstance().showToast({
        title: "Product Deleted",
        description: `Product ${product?.title} deleted successfully!`,
        variant: "warning",
      });
      router.push(`/dashboard/${product?.user_id}/products?tab=deleted`);
    });
  };

  if (isPending) {
    return <Loading />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="The product you are looking for does not exist."
        images={[]}
        className="h-full"
      />
    );
  }

  return (
    <section className="space-y-6">
      {/* Header Section */}
      <section className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 lg:items-center">
        <BackNavigator text="Products Details" />
        <div className="flex items-center space-x-4">
          <CustomButton
            onClick={handleDelete}
            isDisabled={isDeletePending}
            isLoading={isDeletePending}
            variant="outline"
            size="lg"
            className="w-full border-destructive text-destructive lg:w-auto"
          >
            Delete
          </CustomButton>
          {product.status === "published" ? (
            <CustomButton
              isDisabled={isPublishPending}
              isLoading={isPublishPending}
              onClick={handlePublish}
              variant="primary"
              size="lg"
              className="w-full lg:w-auto"
            >
              Unpublish to Draft
            </CustomButton>
          ) : (
            <CustomButton
              isDisabled={isPublishPending}
              isLoading={isPublishPending}
              onClick={handlePublish}
              variant="primary"
              size="lg"
              className="w-full lg:w-auto"
            >
              Publish
            </CustomButton>
          )}
        </div>
      </section>

      {/* Product Details Section */}
      <section>
        <p className="mb-4 text-lg font-semibold">{product?.title}</p>
        <TableHeaderInfo headers={["Publish Date", "Price", "Product Link", "Status"]} product={product} />
      </section>

      {/* Orders Table Section */}
      <section>
        <DashboardTable data={productOrders} columns={singleProductCustomerColumns} />
      </section>
    </section>
  );
};

// Wrap the component with dependencies
const ProductDetailsPage = WithDependency(BasePreviewProductDetailsPage, {
  productService: dependencies.PRODUCT_SERVICE,
});

export default ProductDetailsPage;
