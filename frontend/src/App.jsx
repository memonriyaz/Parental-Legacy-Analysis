import { useState } from "react";
import { BarChart3, FileSpreadsheet, Sparkles } from "lucide-react";
import CleanUploadSection from "./components/UploadSection";
import CleanStatsCards from "./components/StatsCards";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import CleanDownloadPDF from "./components/DownloadPDF";
import CleanFactorTable from "./components/FactorTable";

function App() {
  const [data, setData] = useState(null);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950">
              PLA
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Parental Legacy Analysis
              </h1>
            </div>
          </div>

          <div className="rounded-full border border-slate-700 px-3 py-1 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="px-3 py-1">Upload Excel</span>
            <span className="px-3 py-1">-&gt;</span>
            <span className="px-3 py-1">Pick birth date</span>
            <span className="px-3 py-1">-&gt;</span>
            <span className=" px-3 py-1 text-cyan-200">Generate report</span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/20 sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="rounded-lg bg-cyan-400/10 p-3 text-cyan-300">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Analysis workflow
                </p>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
                  Upload the source spreadsheet, select the birth date, and
                  generate charts, totals, searchable factors, and a PDF export
                  in one flow.
                </p>
              </div>
            </div>

            <CleanUploadSection setData={setData} />
          </div>

          <aside className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/20">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-cyan-300">
                  {data ? (
                    <BarChart3 size={24} />
                  ) : (
                    <FileSpreadsheet size={24} />
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {data ? "Report is ready" : "Waiting for spreadsheet"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {data
                    ? "Review totals, compare values, search factors, then export the PDF."
                    : "Use an Excel file with parental factor columns. Once generated, this panel becomes your report summary."}
                </p>
              </div>

              {data ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <SummaryValue label="Mother" value={data.motherTotal} />
                    <SummaryValue label="Father" value={data.fatherTotal} />
                    <SummaryValue label="Total" value={data.total} />
                  </div>
                  <CleanDownloadPDF data={data} />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/60 p-5">
                  <p className="text-sm font-medium text-slate-300">
                    No generated report yet.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Your charts and factor table will appear below after
                    analysis.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </section>

        {data && (
          <section className="space-y-6">
            <CleanStatsCards data={data} />

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20 lg:col-span-2">
                <SectionHeader
                  eyebrow="Distribution"
                  title="Factor comparison"
                  description="Mother and father values across every generated factor."
                />
                <BarChart factors={data.factors} />
              </section>

              <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20">
                <SectionHeader
                  eyebrow="Ratio"
                  title="Parent totals"
                  description="Overall contribution split by parent."
                />
                <PieChart
                  motherTotal={data.motherTotal}
                  fatherTotal={data.fatherTotal}
                />
              </section>
            </div>

            <CleanFactorTable data={data} />
          </section>
        )}
      </div>
    </main>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-bold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function SummaryValue({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

export default App;
