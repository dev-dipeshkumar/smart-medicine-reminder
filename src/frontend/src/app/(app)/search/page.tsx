"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type MedicineResult,
  useMedicineSearch,
} from "@/hooks/useMedicineSearch";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Pill,
  Search,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const QUICK_CHIPS = [
  "Aspirin",
  "Ibuprofen",
  "Paracetamol",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Omeprazole",
  "Amoxicillin",
];

const FALLBACK_DB: Record<string, Partial<MedicineResult>> = {
  aspirin: {
    name: "Aspirin",
    activeIngredient: "Acetylsalicylic acid",
    purpose:
      "Pain reliever, fever reducer, and anti-inflammatory. Commonly used for headaches, muscle pain, arthritis, and to reduce risk of heart attack or stroke.",
    dosage:
      "Adults: 325\u2013650 mg every 4\u20136 hours as needed. Do not exceed 4,000 mg/day. Enteric-coated tablets help reduce stomach irritation.",
    warnings:
      "Do not use in children under 12 with viral illness (risk of Reye syndrome). Avoid if allergic to NSAIDs. May increase bleeding risk. Consult a doctor if pregnant.",
  },
  ibuprofen: {
    name: "Ibuprofen",
    activeIngredient: "Ibuprofen",
    purpose:
      "NSAID used for mild-to-moderate pain, fever, and inflammation. Effective for headaches, dental pain, menstrual cramps, arthritis, and muscle aches.",
    dosage:
      "Adults: 200\u2013400 mg every 4\u20136 hours. Maximum 1,200 mg/day OTC or 3,200 mg/day by prescription. Take with food or milk to reduce stomach upset.",
    warnings:
      "Avoid on an empty stomach. Not recommended for prolonged use without medical supervision. May increase cardiovascular and GI risk. Avoid in last trimester of pregnancy.",
  },
  paracetamol: {
    name: "Paracetamol (Acetaminophen)",
    activeIngredient: "Paracetamol (Acetaminophen)",
    purpose:
      "Analgesic and antipyretic used to relieve mild-to-moderate pain and reduce fever. Common uses: headache, toothache, cold, flu, and post-vaccination discomfort.",
    dosage:
      "Adults: 500\u20131,000 mg every 4\u20136 hours. Maximum 4,000 mg/day (3,000 mg/day in older adults or those with liver concerns).",
    warnings:
      "Overdose can cause serious liver damage. Do not combine with other acetaminophen-containing products. Avoid alcohol. Use caution if liver disease is present.",
  },
  metformin: {
    name: "Metformin",
    activeIngredient: "Metformin hydrochloride",
    purpose:
      "First-line oral antidiabetic agent for type 2 diabetes. Lowers blood glucose by reducing hepatic glucose production and improving insulin sensitivity.",
    dosage:
      "Initial: 500 mg twice daily or 850 mg once daily with meals. Maximum: 2,550 mg/day in divided doses. Extended-release versions taken once daily with evening meal.",
    warnings:
      "Risk of lactic acidosis (rare but serious). Hold before contrast imaging procedures. Contraindicated in severe renal impairment (eGFR < 30). May cause GI side effects initially.",
  },
  amoxicillin: {
    name: "Amoxicillin",
    activeIngredient: "Amoxicillin trihydrate",
    purpose:
      "Broad-spectrum penicillin-type antibiotic used to treat bacterial infections including respiratory tract infections, ear infections, UTIs, and skin infections.",
    dosage:
      "Adults: 250\u2013500 mg every 8 hours or 500\u2013875 mg every 12 hours depending on infection severity. Complete the full prescribed course.",
    warnings:
      "Allergic reactions including anaphylaxis may occur. Inform your doctor of penicillin allergy. May interact with blood thinners. Disrupts gut flora \u2014 consider probiotics.",
  },
};

function getFallback(query: string): Partial<MedicineResult> | null {
  const key = query.toLowerCase().trim();
  return FALLBACK_DB[key] ?? null;
}

function SectionCard({
  title,
  content,
  defaultOpen = false,
}: {
  title: string;
  content: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const safeId = title.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
        data-ocid={`search.section_toggle.${safeId}`}
      >
        <span className="font-semibold text-sm text-foreground">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 bg-card">
          <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result }: { result: MedicineResult }) {
  return (
    <div
      data-ocid="search.result_card"
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="px-6 py-5 border-b border-border bg-primary/5">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 rounded-lg bg-primary/10 shrink-0">
            <Pill className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-foreground truncate">
              {result.name}
            </h2>
            {result.activeIngredient && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Generic: {result.activeIngredient}
              </p>
            )}
            {result.manufacturer && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {result.manufacturer}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {result.purpose && (
          <SectionCard
            title="Indications & Usage"
            content={result.purpose}
            defaultOpen
          />
        )}
        {result.dosage && (
          <SectionCard
            title="Dosage & Administration"
            content={result.dosage}
          />
        )}
        {result.warnings && (
          <SectionCard title="Warnings" content={result.warnings} />
        )}
      </div>

      {result.aiSummary && (
        <div
          data-ocid="search.ai_summary"
          className="mx-4 mb-4 p-4 rounded-xl bg-accent/10 border border-accent/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              AI-powered summary
            </span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {result.aiSummary}
          </p>
        </div>
      )}
    </div>
  );
}

function FallbackCard({
  result,
  query,
}: {
  result: Partial<MedicineResult>;
  query: string;
}) {
  return (
    <div
      data-ocid="search.fallback_card"
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="px-5 py-3 border-b border-border bg-warning/10 flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-warning-foreground" />
        <span className="text-xs font-medium text-warning-foreground">
          Showing local reference data for “{query}”
        </span>
      </div>
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">
          {result.name ?? query}
        </h2>
        {result.activeIngredient && (
          <p className="text-sm text-muted-foreground mt-0.5">
            Generic: {result.activeIngredient}
          </p>
        )}
      </div>
      <div className="p-4 space-y-2">
        {result.purpose && (
          <SectionCard
            title="Indications & Usage"
            content={result.purpose}
            defaultOpen
          />
        )}
        {result.dosage && (
          <SectionCard
            title="Dosage & Administration"
            content={result.dosage}
          />
        )}
        {result.warnings && (
          <SectionCard title="Warnings" content={result.warnings} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ onChipClick }: { onChipClick: (chip: string) => void }) {
  return (
    <div data-ocid="search.empty_state" className="space-y-4">
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">
          Search any medicine
        </h3>
        <p className="text-sm text-muted-foreground">
          Get FDA-verified information, dosage guidance, warnings, and an
          AI-powered summary.
        </p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Common medicines
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChipClick(chip)}
              data-ocid={`search.quick_chip.${chip.toLowerCase()}`}
              className="px-3 py-1.5 rounded-full text-sm font-medium border border-border bg-muted/40 text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFoundState({ query }: { query: string }) {
  const fallback = getFallback(query);
  if (fallback) {
    return <FallbackCard result={fallback} query={query} />;
  }
  return (
    <div
      data-ocid="search.not_found"
      className="bg-card border border-border rounded-2xl p-8 text-center"
    >
      <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">Medicine not found</h3>
      <p className="text-sm text-muted-foreground">
        Try a different name or check the spelling.
      </p>
    </div>
  );
}

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data, isFetching, isLoading, isError, isFetched } =
    useMedicineSearch(submittedQuery);

  const hasSearched = submittedQuery.trim().length > 0;
  const showLoading = (isFetching || isLoading) && hasSearched;
  const showResult =
    !showLoading && hasSearched && isFetched && !isError && data != null;
  const showNotFound =
    !showLoading && hasSearched && isFetched && !isError && data == null;
  const showError = !showLoading && hasSearched && isError;

  function triggerSearch(value: string) {
    setInput(value);
    setSubmittedQuery(value);
  }

  return (
    <div data-ocid="search.page" className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">Medicine Search</h2>
        <p className="text-sm text-muted-foreground mt-1">
          FDA drug database with AI-powered summaries
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          <Pill className="w-4 h-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          data-ocid="search.search_input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSubmittedQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") triggerSearch(input);
          }}
          placeholder="Search for a medicine..."
          className="w-full pl-10 pr-12 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm dark:bg-card dark:text-foreground"
          aria-label="Search for a medicine"
        />
        <button
          type="button"
          data-ocid="search.submit_button"
          onClick={() => triggerSearch(input)}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-11 rounded-r-xl text-muted-foreground hover:text-primary transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Loading */}
      {showLoading && (
        <div
          data-ocid="search.loading_state"
          className="bg-card border border-border rounded-2xl p-8 text-center"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">
              Searching...
            </p>
          </div>
        </div>
      )}

      {/* Result */}
      {showResult && <ResultCard result={data as MedicineResult} />}

      {/* Not found or fallback */}
      {showNotFound && <NotFoundState query={submittedQuery} />}

      {/* Error state */}
      {showError && (
        <div data-ocid="search.error_state" className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">
              Could not reach drug database
            </h3>
            <p className="text-sm text-muted-foreground">
              Showing local reference data if available.
            </p>
          </div>
          {getFallback(submittedQuery) && (
            <FallbackCard
              result={getFallback(submittedQuery) as Partial<MedicineResult>}
              query={submittedQuery}
            />
          )}
        </div>
      )}

      {/* Empty state */}
      {!hasSearched && <EmptyState onChipClick={triggerSearch} />}
    </div>
  );
}
