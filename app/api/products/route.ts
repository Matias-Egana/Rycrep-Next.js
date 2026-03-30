import { NextRequest, NextResponse } from "next/server";
import { listProducts, parseProductListParams } from "@/lib/server/products";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = parseProductListParams({
      q: searchParams.get("q") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      oferta: searchParams.get("oferta") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      price_min: searchParams.get("price_min") ?? undefined,
      price_max: searchParams.get("price_max") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      offset: searchParams.get("offset") ?? undefined,
      orderBy: searchParams.get("orderBy") ?? undefined,
      order: searchParams.get("order") ?? undefined,
    });

    const { results, count, limit, offset } = await listProducts(params);
    const buildUrl = (nextOffset: number) => {
      const url = new URL(request.url);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(nextOffset));
      return url.toString();
    };

    return NextResponse.json({
      count,
      next: offset + limit < count ? buildUrl(offset + limit) : null,
      previous: offset - limit >= 0 ? buildUrl(offset - limit) : null,
      results,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "No fue posible listar productos." }, { status: 400 });
  }
}
