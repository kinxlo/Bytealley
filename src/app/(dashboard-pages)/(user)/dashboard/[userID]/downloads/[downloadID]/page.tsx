"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { VideoPlayerWithCustomControls } from "~/components/common/video-player";
import { BlurImage } from "~/components/miscellaneous/blur-image";
import { PDFViewer } from "~/features/PDFviewer";
import { WithDependency } from "~/HOC/withDependencies";
import { DownloadService } from "~/services/download/download.service";
import { dependencies } from "~/utils/dependencies";
import { ReviewModal } from "../_components/review-modal";

const getFileType = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (!extension) return "unknown";

  if (["pdf"].includes(extension)) return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image";
  if (["mp4", "webm", "ogg"].includes(extension)) return "video";

  return "other";
};

const BaseDownloadDetailPage = ({
  params,
  downloadService,
}: {
  params: { downloadID: string };
  downloadService: DownloadService;
}) => {
  const [isPending, startTransition] = useTransition();
  const [download, setDownload] = useState<IDownload[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<IDownload | null>(null);
  const [skillSellingContent, setSkillSellingContent] = useState<ISkillSellingDownload | null>(null);
  const searchParameters = useSearchParams();
  const productType = searchParameters.get("product_type");
  const productTitle = searchParameters.get("title");
  const productPublisher = searchParameters.get("author");

  useEffect(() => {
    const fetchProductData = async () => {
      startTransition(async () => {
        let downloadData;

        if (productType === "skill_selling") {
          downloadData = await downloadService.getDownloadById(params.downloadID, true);
          setSkillSellingContent((downloadData?.data as unknown as ISkillSellingDownload) || null);
        } else {
          downloadData = await downloadService.getDownloadById(params.downloadID);
          setDownload((downloadData?.data as IDownload[]) || []);
        }
      });
    };

    fetchProductData();
  }, [downloadService, params.downloadID, productType]);

  useEffect(() => {
    if (download.length > 0 && !selectedAsset) {
      setSelectedAsset(download[0]);
    }
  }, [download, selectedAsset]);

  if (isPending) {
    return <Loading text={`Loading download details...`} className={`w-fill h-fit p-20`} />;
  }

  if ((!download || download.length === 0) && productType === "skill_selling" && !skillSellingContent) {
    return (
      <EmptyState
        title="Download Not Found"
        description="The downloaded asset you are looking for does not exist."
        images={[]}
        className="h-full"
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackNavigator />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold sm:text-xl">{productTitle}</h1>
            <p className="truncate text-sm font-medium text-mid-grey-III">By {productPublisher}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <ReviewModal downloadedProductID={params.downloadID} />
        </div>
      </div>

      {/* Main Content Area with sticky footer */}
      <div className="flex-1 overflow-hidden">
        {/* Scrollable Content */}
        <div className="h-[90%] overflow-auto rounded-tl-md rounded-tr-md border-default bg-low-grey-II pb-16">
          <div className="p-4">
            {selectedAsset ? (
              <div className="relative h-full w-full">
                {(() => {
                  const fileType = getFileType(selectedAsset?.url || "");

                  switch (fileType) {
                    case "pdf": {
                      return <PDFViewer url={`/api/pdf-proxy?url=${encodeURIComponent(selectedAsset?.url || "")}`} />;
                    }
                    case "image": {
                      return (
                        <div className="flex h-full items-center justify-center">
                          <BlurImage
                            src={selectedAsset?.url || ""}
                            alt={selectedAsset?.name || ""}
                            width={1200}
                            height={800}
                            className="h-auto w-auto object-contain"
                            // sizes="(max-width: 768px) 100vw, 80vw"
                          />
                        </div>
                      );
                    }
                    case "video": {
                      return <VideoPlayerWithCustomControls url={selectedAsset?.url || ""} />;
                      // return (
                      //   <div className="flex max-h-[700px] items-center justify-center overflow-hidden rounded-md">
                      //     <video controls className="w-{100%} h-[100%]">
                      //       <source src={selectedAsset.url} type="video/mp4" />
                      //       Your browser does not support the video tag.
                      //     </video>
                      //   </div>
                      // );
                    }
                    default: {
                      return (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-muted">Preview not available for this file type.</p>
                        </div>
                      );
                    }
                  }
                })()}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted">Select a download to preview.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Asset Selector */}
        {download.length > 1 && (
          <div className="flex h-[10%] items-center gap-4 overflow-x-auto rounded-bl-md rounded-br-md border-default bg-white p-2 px-4 dark:bg-black">
            {download.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedAsset(item)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedAsset?.id === item.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DownloadDetailPage = WithDependency(BaseDownloadDetailPage, {
  downloadService: dependencies.DOWNLOAD_SERVICE,
});

export default DownloadDetailPage;
