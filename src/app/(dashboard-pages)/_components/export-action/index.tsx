/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import uploadIcon from "@/icons/Property_2_Upload_cm42yb.svg";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import Image from "next/image";
import { HtmlHTMLAttributes, useTransition } from "react";

import CustomButton from "~/components/common/common-button/common-button";
import { cn } from "~/utils/utils";

interface ExportActionProperties<T> extends HtmlHTMLAttributes<HTMLButtonElement> {
  downloadMutation: (parameters: T) => Promise<Blob | File>;
  currentPage?: number;
  dateRange?: { from?: Date; to?: Date };
  status?: string;
  onDownloadComplete?: () => void;
  buttonText?: string;
  additionalParameters?: Omit<T, "page" | "start_date" | "end_date" | "status">;
  fileName?: string;
  size?: "xs" | "lg" | "xl";
}

const ExportAction = <T extends object>({
  downloadMutation,
  currentPage = 1,
  dateRange,
  status,
  onDownloadComplete,
  buttonText = "Export",
  additionalParameters,
  fileName = "download",
  size = "lg",
  className,
}: ExportActionProperties<T>) => {
  const [isPending, startTransition] = useTransition();

  const handleDownload = async () => {
    startTransition(async () => {
      const parameters: any = {
        page: currentPage,
        ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
        ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
        ...(status && status !== "all" && { status }),
        ...additionalParameters,
      };

      const file = await downloadMutation(parameters);
      const blob = new Blob([file], { type: "text/csv" });
      saveAs(blob, `${fileName}.csv`);

      onDownloadComplete?.();
    });
  };

  return (
    <CustomButton
      variant="outline"
      className={cn("w-full border-primary text-primary lg:w-auto", className)}
      size={size as "lg" | "xl"}
      isLeftIconVisible={true}
      icon={<Image src={uploadIcon} width={16} height={16} alt="export" className={`dark:invert dark:filter`} />}
      onClick={handleDownload}
      isLoading={isPending}
      // isIconOnly={true}
    >
      {buttonText}
    </CustomButton>
  );
};

export default ExportAction;
