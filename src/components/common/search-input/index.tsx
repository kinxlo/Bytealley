import debounce from "lodash.debounce"; // Import debounce from lodash
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, HTMLAttributes, useState, useTransition } from "react";
import { LuSearch } from "react-icons/lu";

import Loading from "~/app/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WithDependency } from "~/HOC/withDependencies";
import { AppService } from "~/services/app/app.service";
import { dependencies } from "~/utils/dependencies";
import { cn } from "~/utils/utils";
import { ReusableDialog } from "../dialog/Dialog";
import { SearchProductCard } from "./search-product-card";

interface SearchProperties extends HTMLAttributes<HTMLDivElement> {
  inputBackgroundColor?: string;
  appService: AppService;
}

const BaseSearchInput: FC<SearchProperties> = ({ appService, inputBackgroundColor, className, ...properties }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<IProduct[] | undefined>([]);
  const [isPending, startTransition] = useTransition();

  const currentTab = searchParameters.get("search") || "all";

  // Debounce the search function
  const debouncedSearch = debounce(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const results = await appService.search({ text: query });
    setSearchResults(results);
  }, 500);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      const query = event.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    });
  };

  // Handle tab change
  const onTabChange = (value: string) => {
    const parameters = new URLSearchParams(searchParameters);
    parameters.set("search", value);
    router.replace(`${pathname}?${parameters.toString()}`, { scroll: false });
  };

  const searchResultsFormated = searchResults?.map((result) => {
    return (
      <SearchProductCard
        key={result.id}
        imageUrl={typeof result.thumbnail === "string" ? result.thumbnail : ""}
        imageAlt={result.title}
        productName={result.title}
        author={result.publisher?.name || ""}
        productLink={result.slug}
        onProductClick={() => setIsDialogOpen(false)}
      />
    );
  });

  return (
    <ReusableDialog
      className={cn(`lg:min-w-[780px]`)}
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={
        <div
          className={cn(
            "flex h-12 items-center justify-between overflow-hidden rounded-[6px] border-default bg-white text-sm font-normal placeholder:text-sm dark:bg-black",
            inputBackgroundColor,
            className,
          )}
          {...properties}
        >
          <span className={`flex h-full w-12 items-center justify-center`}>
            <LuSearch data-testid="search" className="text-neutral-dark-2 text-xl dark:bg-black" />
          </span>
          <input
            className={cn(
              `text-neutral-dark-2 placeholder:text-neutral-dark-1 h-12 w-full border-none px-3 outline-none ring-0`,
              inputBackgroundColor,
            )}
            placeholder="Search..."
            data-testid="input"
            readOnly={true}
          />
        </div>
      }
    >
      <section>
        <div
          className={cn(
            "border-bottom flex h-14 w-[100%] items-center justify-between gap-2 rounded-none border-mid-grey-II bg-white text-sm font-normal placeholder:text-sm dark:bg-transparent",
          )}
          {...properties}
        >
          <LuSearch data-testid="search" className="text-neutral-dark-2 h-10 w-10 border-none p-2" />
          <input
            className={cn(
              `text-neutral-dark-2 placeholder:text-neutral-dark-1 h-full w-full border-none outline-none ring-0 dark:bg-transparent`,
            )}
            placeholder="Search..."
            data-testid="input"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
      </section>

      {/* Tabs */}
      <section className={cn(`h-[40rem] overflow-y-auto border-default p-4`)}>
        <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="border-bottom mb-8 flex h-fit w-full flex-col-reverse gap-4 rounded-none bg-transparent p-0 sm:h-[58px] sm:flex-row sm:items-center sm:justify-between lg:h-[58px]">
            <section className="flex h-full w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:gap-0">
              <TabsTrigger
                value="all"
                className="relative h-full min-w-[100px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
              >
                All {searchResults?.length}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
                  data-state={currentTab === "all" ? "active" : "inactive"}
                />
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
              >
                Products {0}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
                  data-state={currentTab === "products" ? "active" : "inactive"}
                />
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
              >
                Files {0}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
                  data-state={currentTab === "files" ? "active" : "inactive"}
                />
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
              >
                Users {0}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
                  data-state={currentTab === "users" ? "active" : "inactive"}
                />
              </TabsTrigger>
            </section>
          </TabsList>

          {/* Tab content */}
          <TabsContent className={`space-y-4`} value="all">
            {searchResults?.length === 0 && !isPending ? (
              <p className="text-center text-muted-foreground">No search results found</p>
            ) : isPending ? (
              <Loading text={`Loading search results...`} className={`w-fill h-fit p-20`} />
            ) : (
              searchResultsFormated
            )}
          </TabsContent>
          {/* <TabsContent value="products">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nihil doloribus sed recusandae distinctio
            libero, fuga autem debitis hic laudantium reiciendis dicta. Voluptatum est asperiores consequuntur sit illo
            perspiciatis. Vero!
          </TabsContent>
          <TabsContent value="files">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi eveniet unde obcaecati officia, saepe
            laboriosam illo incidunt tempore earum iure ab sunt nesciunt illum tenetur quibusdam accusamus? Excepturi,
            harum fuga.
          </TabsContent>
          <TabsContent value="users">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi eveniet unde obcaecati officia, saepe
            laboriosam illo incidunt tempore earum iure ab sunt nesciunt illum tenetur quibusdam accusamus? Excepturi,
            harum fuga.
          </TabsContent> */}
        </Tabs>
      </section>
    </ReusableDialog>
  );
};

export const SearchInput = WithDependency(BaseSearchInput, {
  appService: dependencies.APP_SERVICE,
});
