/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable no-console */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TourWrapper } from "~/components/common/tour-guide/tour-wrapper";
import { StudioWrapper, template, useGrapesJS } from "~/features/funnel";
import { fetchTemplateByID } from "~/lib/funnel";
import { useAppDispatch, useAppSelector } from "~/store";
import { clearTemplate } from "~/store/features/template/template-slice";
import { funnelSteps } from "~/utils/steps/funnel";
import { FunnelControls } from "../_components/funnel-controls";

export default function Funnel() {
  const dispatch = useAppDispatch();
  const { onReady, editor } = useGrapesJS();
  const [template, setTemplate] = useState<template>();
  const searchParameters = useSearchParams();
  const ID = searchParameters.get("templateID") as string;
  const funnelTemplate = useAppSelector((state: RootState) => state.template.template);
  useEffect(() => {
    try {
      if (funnelTemplate) {
        setTemplate(JSON.parse(funnelTemplate));
      } else {
        const getTemplate = async () => {
          try {
            const response = await fetchTemplateByID(ID);
            if (response) {
              setTemplate(response);
            }
          } catch (error) {
            console.error("Failed to fetch template:", error);
          }
        };
        if (ID) {
          getTemplate();
        }
      }
    } finally {
      dispatch(clearTemplate());
    }
  }, [ID, dispatch, funnelTemplate]);

  useEffect(() => {
    if (!editor || !template || !Array.isArray(template.pages)) {
      return;
    }
    const existingPages = editor.Pages.getAll();
    existingPages.forEach((page: template) => editor.Pages.remove(page.id));
    for (const page of template.pages) {
      const { id, name, content } = page;

      const newPage = editor.Pages.add({ id, name, content });
      if (newPage) {
        editor.Pages.select(newPage.id);
        editor.addComponents(content, { pageId: newPage.id });
      }
    }

    const firstPageId = template.pages[0].id;
    if (firstPageId) {
      editor.Pages.select(firstPageId);
    }
  }, [editor, template]);

  return (
    <TourWrapper
      videoSrc={"https://bytealley.fra1.cdn.digitaloceanspaces.com/video1581815284.mp4"}
      videoTitle={`Funnel Tutorial`}
      steps={funnelSteps}
    >
      <main className="flex h-screen flex-col justify-between gap-2">
        {editor && <FunnelControls editor={editor} template={template as template} />}
        <StudioWrapper onReady={onReady} />
      </main>
    </TourWrapper>
  );
}
