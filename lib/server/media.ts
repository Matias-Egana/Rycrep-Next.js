import "server-only";
import path from "path";

function resolveDefaultProductsDir() {
  const localDir = path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    "public",
    "data",
    "products"
  );
  return localDir;
}

export function getProductsDir() {
  const raw = (process.env.PRODUCTS_DIR || "").trim();
  if (!raw) return resolveDefaultProductsDir();

  const normalized = raw.replace(/^[\\/]+/, "");
  if (path.isAbsolute(raw)) {
    return path.resolve(/* turbopackIgnore: true */ raw);
  }

  return path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    normalized || path.join("public", "data", "products")
  );
}

export function getProductFilePath(segments: string[]) {
  const safeSegments = segments
    .map((segment) => path.basename(segment))
    .filter(Boolean);

  return path.join(getProductsDir(), ...safeSegments);
}
