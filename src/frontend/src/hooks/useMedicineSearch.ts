// Medicine search using direct OpenFDA fetch + HuggingFace AI summary
import { useState } from "react";

export interface MedicineResult {
  name: string;
  genericName?: string;
  purpose?: string;
  indications?: string;
  dosage?: string;
  warnings?: string;
  adverseReactions?: string;
  drugInteractions?: string;
  aiSummary?: string;
  source: "fda" | "local";
}

// Local fallback database
const LOCAL_DB: Record<string, MedicineResult> = {
  metformin: {
    name: "Metformin",
    genericName: "metformin hydrochloride",
    purpose: "Antidiabetic medication",
    indications: "Used to treat type 2 diabetes mellitus.",
    dosage: "500mg to 2000mg per day, taken with meals.",
    warnings: "Risk of lactic acidosis; avoid in renal impairment.",
    source: "local",
  },
  aspirin: {
    name: "Aspirin",
    genericName: "acetylsalicylic acid",
    purpose: "Pain reliever, fever reducer, anti-inflammatory",
    indications:
      "Mild to moderate pain, fever, inflammation, and to reduce risk of heart attack.",
    dosage: "325mg to 650mg every 4-6 hours as needed.",
    warnings:
      "Do not give to children with viral illness. May cause stomach bleeding.",
    source: "local",
  },
  paracetamol: {
    name: "Paracetamol (Acetaminophen)",
    genericName: "acetaminophen",
    purpose: "Pain reliever and fever reducer",
    indications: "Used for mild to moderate pain and fever.",
    dosage: "500mg to 1000mg every 4-6 hours. Max 4g/day.",
    warnings: "Overdose can cause severe liver damage. Avoid alcohol.",
    source: "local",
  },
  ibuprofen: {
    name: "Ibuprofen",
    genericName: "ibuprofen",
    purpose: "NSAID — pain reliever, fever reducer, anti-inflammatory",
    indications: "Pain, fever, inflammation, arthritis.",
    dosage: "200mg to 400mg every 4-6 hours.",
    warnings: "May cause stomach bleeding. Avoid in kidney disease.",
    source: "local",
  },
};

export function useMedicineSearch() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState<MedicineResult | null>(null);
  const [error, setError] = useState("");

  async function search(query: string) {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const q = query.trim().toLowerCase();

    // Try OpenFDA direct
    try {
      const searches = [
        `brand_name:"${encodeURIComponent(query.trim())}"`,
        `openfda.brand_name:"${encodeURIComponent(query.trim())}"`,
        `openfda.generic_name:"${encodeURIComponent(query.trim())}"`,
        encodeURIComponent(query.trim()),
      ];

      let fdaData: Record<string, string[]> | null = null;
      for (const s of searches) {
        try {
          const res = await fetch(
            `https://api.fda.gov/drug/label.json?search=${s}&limit=1`,
            {
              signal: AbortSignal.timeout(8000),
            },
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.results?.[0]) {
              fdaData = data.results[0];
              break;
            }
          }
        } catch {
          // try next
        }
      }

      if (fdaData) {
        const p = (arr?: string[]) =>
          (arr?.[0] ?? "").replace(/<[^>]*>/g, " ").trim();
        const found: MedicineResult = {
          name: p(fdaData.brand_name as string[] | undefined) || query.trim(),
          genericName: p(fdaData.generic_name as string[] | undefined),
          purpose: p(fdaData.purpose as string[] | undefined),
          indications: p(fdaData.indications_and_usage as string[] | undefined),
          dosage: p(fdaData.dosage_and_administration as string[] | undefined),
          warnings: p(fdaData.warnings as string[] | undefined),
          adverseReactions: p(
            fdaData.adverse_reactions as string[] | undefined,
          ),
          drugInteractions: p(
            fdaData.drug_interactions as string[] | undefined,
          ),
          source: "fda",
        };
        setResult(found);
        setLoading(false);

        // AI summary in background
        const textForSummary = [found.purpose, found.indications, found.dosage]
          .filter(Boolean)
          .join(" ")
          .slice(0, 800);
        if (textForSummary) {
          setAiLoading(true);
          fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                inputs: textForSummary,
                parameters: { max_length: 120, min_length: 30 },
              }),
              signal: AbortSignal.timeout(20000),
            },
          )
            .then(async (r) => {
              if (!r.ok) return;
              const d = await r.json();
              if (Array.isArray(d) && d[0]?.summary_text) {
                setResult((prev) =>
                  prev ? { ...prev, aiSummary: d[0].summary_text } : prev,
                );
              }
            })
            .catch(() => {})
            .finally(() => setAiLoading(false));
        }
        return;
      }
    } catch {
      // fall through to local DB
    }

    // Local fallback
    const local =
      LOCAL_DB[q] ??
      Object.values(LOCAL_DB).find((m) => m.name.toLowerCase().includes(q));
    if (local) {
      setResult(local);
      setLoading(false);
      return;
    }

    setError(
      "No FDA data found for this medicine. Try a different name or spelling.",
    );
    setLoading(false);
  }

  return { search, loading, aiLoading, result, error };
}
