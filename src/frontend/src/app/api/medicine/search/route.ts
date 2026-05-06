import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface FdaLabel {
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
  };
  indications_and_usage?: string[];
  dosage_and_administration?: string[];
  warnings?: string[];
}

async function fetchHuggingFaceSummary(text: string): Promise<string | null> {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: text.slice(0, 1024), // BART has a token limit
          parameters: { max_length: 150, min_length: 40 },
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return null;
    const data = await response.json();
    const summary = Array.isArray(data) ? data[0]?.summary_text : null;
    return summary ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    if (!q)
      return NextResponse.json({ error: "q is required" }, { status: 400 });

    // Fetch from OpenFDA
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=brand_name:${encodeURIComponent(q)}&limit=1`;
    const fdaRes = await fetch(fdaUrl, { signal: AbortSignal.timeout(8000) });

    if (!fdaRes.ok) {
      // Try generic_name as fallback
      const fdaFallback = `https://api.fda.gov/drug/label.json?search=generic_name:${encodeURIComponent(q)}&limit=1`;
      const fallbackRes = await fetch(fdaFallback, {
        signal: AbortSignal.timeout(8000),
      });
      if (!fallbackRes.ok) {
        return NextResponse.json(
          { error: "Medicine not found" },
          { status: 404 },
        );
      }
      const fallbackData = await fallbackRes.json();
      const label: FdaLabel = fallbackData.results?.[0];
      if (!label)
        return NextResponse.json(
          { error: "Medicine not found" },
          { status: 404 },
        );
      return buildResponse(label, q);
    }

    const fdaData = await fdaRes.json();
    const label: FdaLabel = fdaData.results?.[0];
    if (!label)
      return NextResponse.json(
        { error: "Medicine not found" },
        { status: 404 },
      );

    return buildResponse(label, q);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

async function buildResponse(label: FdaLabel, fallbackName: string) {
  const name = label.openfda?.brand_name?.[0] ?? fallbackName;
  const genericName = label.openfda?.generic_name?.[0] ?? null;
  const indications = label.indications_and_usage?.[0] ?? null;
  const dosage = label.dosage_and_administration?.[0] ?? null;
  const warnings = label.warnings?.[0] ?? null;

  // Attempt AI summary from indications text
  const aiSummary = indications
    ? await fetchHuggingFaceSummary(indications)
    : null;

  return NextResponse.json({
    name,
    activeIngredient: genericName,
    purpose: indications,
    dosage,
    warnings,
    aiSummary,
  });
}
