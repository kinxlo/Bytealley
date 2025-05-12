/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import { AppService } from "~/services/app/app.service";

export const useProductCategories = (appService: AppService) => {
  const [categories, setCategories] = useState<any[]>([]);

  const getData = useCallback(async () => {
    const response = await appService.getProductCategory();
    if (response) {
      const formattedLinks = response.map((link) => ({
        name: link.name.replace("_", " "),
        path: `/explore?category=${link.name.replace("_", "-")}`,
        type: "link",
      }));
      setCategories(formattedLinks);
    }
  }, [appService]);

  useEffect(() => {
    getData();
  }, [getData]);

  return categories;
};
