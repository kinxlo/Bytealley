"use client";

import { Video } from "lucide-react";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";
import { toast } from "sonner";

import CustomButton from "../common-button/common-button";
import { ReusableDialog } from "../dialog/Dialog";

interface TourWrapperProperties {
  steps: Step[];
  children: React.ReactNode;
  videoSrc?: string; // Add video source prop
  videoTitle?: string; // Optional video title
}

export const TourWrapper = ({ steps, children, videoSrc, videoTitle }: TourWrapperProperties) => {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleTourStart = () => {
    setIsTourRunning(true);
    toast.dismiss();
    sessionStorage.setItem("tourShown", "true");
  };

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      setIsTourRunning(false);
    }
  };

  // const dismiss = () => {
  //   setIsTourRunning(false);
  //   toast.dismiss();
  //   sessionStorage.setItem("tourShown", "true");
  // };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
    toast.dismiss();
  };

  useEffect(() => {
    const tourShown = sessionStorage.getItem("tourShown");
    if (!tourShown) {
      toast(
        <div className="flex flex-col gap-2">
          <p>Would you like to watch a video on how to use our Funnel or take a tour ?</p>
          <div className="flex justify-end gap-2">
            <CustomButton isLeftIconVisible icon={<Video />} variant="outline" onClick={openVideoModal}>
              Watch Tutorial
            </CustomButton>
            <CustomButton variant="primary" onClick={handleTourStart}>
              Start Tour
            </CustomButton>
          </div>
        </div>,
        {
          duration: Infinity,
          position: "bottom-right",
        },
      );
    }
  }, []);

  return (
    <>
      {/* Joyride Tour */}
      <Joyride
        steps={steps}
        run={isTourRunning}
        callback={handleTourCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: "#3b82f6",
            textColor: "#1e293b",
          },
        }}
      />

      {/* Video Modal */}
      <ReusableDialog
        trigger={null}
        open={isVideoModalOpen}
        onOpenChange={setIsVideoModalOpen}
        title={videoTitle || "Tutorial Video"}
        description="Watch this video to learn how to use this page."
      >
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          {videoSrc && (
            <video controls className="h-full w-full" src={videoSrc}>
              Your browser does not support the video tag.
            </video>
          )}
          {/* {videoSrc ? (
            <iframe
              src={videoSrc}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p className="text-center text-muted-foreground">No video available.</p>
          )} */}
        </div>
      </ReusableDialog>
      {children}
    </>
  );
};
