"use client";

import empty1 from "@/images/alert.png";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { singleProductOrderColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import { TableHeaderInfo } from "~/app/(dashboard-pages)/_components/table-header-info";
import Loading from "~/app/Loading";
import CustomButton from "~/components/common/common-button/common-button";
import { ConfirmationDialog } from "~/components/common/dialog/confirmation-dialog";
import { useProductService } from "~/services/product/use-product-service";
import { Toast } from "~/utils/notificationManager";

const PreviewProductDetailsPage = ({ params }: { params: { productID: string } }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Product Service Hooks
  const { useGetProductById, usePublishProduct, useSoftDeleteProduct, useGetProductOrders } = useProductService();
  const { data: productData, isLoading: isProductLoading } = useGetProductById(params.productID);

  // Mutations
  const publishMutation = usePublishProduct();
  const deleteMutation = useSoftDeleteProduct();
  const { data: ordersData, isLoading: isOrdersLoading } = useGetProductOrders(params.productID);

  // Handle publish/unpublish action
  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(params.productID);
      // Invalidate multiple queries
      await queryClient.invalidateQueries({
        queryKey: ["products", "list"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["products", "detail"],
      });
      Toast.getInstance().showToast({
        title: "Success",
        description: `Product status updated successfully!`,
        variant: "success",
      });
    } catch {
      Toast.getInstance().showToast({
        title: "Error",
        description: "Failed to update product status",
        variant: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(params.productID);
      queryClient.invalidateQueries({
        queryKey: ["products", "list", "detail"],
      });
      Toast.getInstance().showToast({
        title: "Product Deleted",
        description: `Product ${productData?.title} deleted successfully!`,
        variant: "warning",
      });
      router.push(`/dashboard/${productData?.user_id}/products?tab=deleted`);
    } catch {
      Toast.getInstance().showToast({
        title: "Error",
        description: "Failed to delete product",
        variant: "error",
      });
    }
  };

  if (isProductLoading || isOrdersLoading) {
    return <Loading />;
  }

  if (!productData) {
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
          <ConfirmationDialog
            action={{
              pending: deleteMutation.isPending,
              title: "Delete Product",
              description: "Are you sure you want to delete this product?",
              onConfirm: handleDelete,
              buttonName: "Delete",
              img: empty1.src,
            }}
          >
            <CustomButton variant="outline" size="lg" className="w-full border-destructive text-destructive lg:w-auto">
              Delete
            </CustomButton>
          </ConfirmationDialog>

          <CustomButton
            isDisabled={publishMutation.isPending}
            isLoading={publishMutation.isPending}
            onClick={handlePublish}
            variant="primary"
            size="lg"
            className="w-full lg:w-auto"
          >
            {productData.status === "published" ? "Unpublish to Draft" : "Publish"}
          </CustomButton>
        </div>
      </section>

      {/* Product Details Section */}
      <section>
        <p className="border-bottom pb-4 text-lg font-semibold">{productData.title}</p>
        <TableHeaderInfo headers={["Publish Date", "Price", "Product Link", "Status"]} product={productData} />
      </section>

      {/* Orders Table Section */}
      <section>
        <DashboardTable data={ordersData ?? []} columns={singleProductOrderColumns} />
      </section>
    </section>
  );
};

export default PreviewProductDetailsPage;
