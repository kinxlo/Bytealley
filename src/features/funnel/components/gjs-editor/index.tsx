/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import GrapesJsStudio from "@grapesjs/studio-sdk/react";

import "@grapesjs/studio-sdk/style";

import { editorOptions } from "../../config";

interface StudioWrapperProperties {
  onReady: (editor: any) => void;
}

const StudioWrapper = ({ onReady }: StudioWrapperProperties) => {
  return (
    // <div className="h-full w-full flex-1 overflow-hidden">
    //   <GrapesJsStudio onReady={onReady} options={editorOptions} />
    // </div>
    <div className="grapesjs-editor h-full w-full flex-1 overflow-hidden">
      <GrapesJsStudio onReady={onReady} options={editorOptions} />
    </div>
  );
};

export default StudioWrapper;
