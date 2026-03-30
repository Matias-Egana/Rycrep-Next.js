import { NextResponse } from "next/server";
import {
  adminExists,
  deleteAllSetupTokens,
  ensureSetupTokenOnDemand,
  getSetupHomeUrl,
  validateSetupToken,
} from "@/lib/server/setup";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const homeUrl = getSetupHomeUrl();

  if (await adminExists()) {
    await deleteAllSetupTokens();
    return NextResponse.json(
      { valid: false, reason: "admin_exists", redirectTo: homeUrl },
      { status: 410 }
    );
  }

  await ensureSetupTokenOnDemand();
  const stored = await validateSetupToken(token);

  if (!stored) {
    return NextResponse.json(
      { valid: false, reason: "invalid_token", redirectTo: homeUrl },
      { status: 404 }
    );
  }

  return NextResponse.json({
    valid: true,
    expiresAt: stored.expires_at.toISOString(),
  });
}
