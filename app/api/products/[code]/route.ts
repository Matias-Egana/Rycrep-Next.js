import { NextResponse } from "next/server";
import { findProductByCode } from "@/lib/server/products";

type ProductByCodeRouteProps = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, { params }: ProductByCodeRouteProps) {
  try {
    const { code } = await params;
    const product = await findProductByCode(code);

    if (!product) {
      return NextResponse.json(
        { error: "not_found", message: `No existe un producto con code="${code}"` },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "No fue posible obtener el producto." }, { status: 400 });
  }
}
