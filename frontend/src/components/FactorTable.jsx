import { Search } from "lucide-react";
import { useState } from "react";

function FactorTable({ data }) {
  const [search, setSearch] = useState("");

  const filteredFactors = data.factors.filter((factor) =>
    factor.factor.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Details
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">
            Generated factors
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Search and inspect each parental distribution row.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 text-sm text-slate-400">
              <th className="py-4 text-left font-semibold">Factor</th>
              <th className="py-4 text-center font-semibold">Mother</th>
              <th className="py-4 text-center font-semibold">Father</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactors.map((factor, index) => (
              <tr
                key={`${factor.factor}-${index}`}
                className="border-b border-slate-800/70 text-sm transition last:border-0 hover:bg-slate-800/60"
              >
                <td className="py-4 font-medium text-slate-200">
                  {factor.factor}
                </td>
                <td className="text-center">
                  <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 font-semibold text-rose-300">
                    {factor.mother}
                  </span>
                </td>
                <td className="text-center">
                  <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 font-semibold text-blue-300">
                    {factor.father}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FactorTable;
