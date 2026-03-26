import { AnimateOnView } from "@/components/site/animate-on-view";
import { CatalogBrowser } from "@/components/site/products/catalog-browser";
import { fetchCatalogPage } from "@/lib/next-catalog";

type ProductosPageProps = {
  searchParams?: Promise<{
    page?: string;
    category?: string;
    brand?: string;
    search?: string;
  }>;
};

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const params = (await searchParams) ?? {};
  const currentPage = Number(params.page ?? "1");
  const selectedCategory = params.category ?? "all";
  const selectedBrand = params.brand ?? "all";
  const search = params.search ?? "";
  const pageSize = 10;

  const catalog = await fetchCatalogPage({
    page: Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage,
    pageSize,
    category: selectedCategory,
    brand: selectedBrand,
    search,
  });

  return (
    <div className="bg-[#f4f6fb] px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-[1240px]">
        <AnimateOnView className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-[#111827] sm:text-5xl">
            Productos disponibles
          </h1>
        </AnimateOnView>

        <AnimateOnView delayMs={80}>
          <CatalogBrowser
            products={catalog.results}
            total={catalog.count}
            currentPage={Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage}
            pageSize={pageSize}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            search={search}
          />
        </AnimateOnView>
      </div>
    </div>
  );
}
