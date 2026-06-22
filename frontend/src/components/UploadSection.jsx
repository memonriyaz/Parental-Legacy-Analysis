import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Calendar, Loader2, Upload, Zap } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

function UploadSection({ setData }) {
  const [file, setFile] = useState(null);
  const [birthDate, setBirthDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:3000/upload", formData);
      alert("Excel uploaded successfully");
    } catch {
      alert("Upload failed");
    }
  };

  const generate = async () => {
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/generate", {
        birthDate: birthDate.toISOString().split("T")[0],
      });

      setData(response.data);
    } catch {
      alert("Generation failed");
    }

    setLoading(false);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <CardTitle
          icon={<Upload size={20} />}
          title="Upload data"
          subtitle="Excel spreadsheet"
          tone="emerald"
        />

        <label className="flex min-h-36 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/60 p-5 text-center transition hover:border-emerald-400/70 hover:bg-slate-900">
          <input
            type="file"
            hidden
            accept=".xlsx,.xls,.csv"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
            <Upload size={24} />
          </div>
          <p className="mt-3 max-w-full truncate text-sm text-slate-400">
            {file ? (
              <span className="font-semibold text-emerald-300">{file.name}</span>
            ) : (
              "Click to choose a file"
            )}
          </p>
        </label>

        <button
          onClick={uploadFile}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          disabled={!file}
        >
          <Upload size={18} />
          Upload file
        </button>
      </div>

      <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <CardTitle
          icon={<Calendar size={20} />}
          title="Birth date"
          subtitle="Used for generation"
          tone="cyan"
        />

        <div className="flex min-h-36 flex-1 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 p-5">
          <DatePicker
            selected={birthDate}
            onChange={(date) => setBirthDate(date)}
            dateFormat="dd-MM-yyyy"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-1 py-3 text-center font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4">
        <CardTitle
          icon={<Zap size={20} />}
          title="Analyze"
          subtitle="Build dashboard output"
          tone="cyan"
        />

        <button
          onClick={generate}
          disabled={loading}
          className="flex min-h-36 flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {loading ? <Loader2 size={22} className="animate-spin" /> : <Zap size={22} />}
          {loading ? "Generating..." : "Generate analysis"}
        </button>
      </div>
    </div>
  );
}

function CardTitle({ icon, title, subtitle, tone }) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-400/10 text-emerald-300"
      : "bg-cyan-400/10 text-cyan-300";

  return (
    <div className="mb-4 flex items-center gap-3">
      <div className={`rounded-lg p-2 ${toneClass}`}>{icon}</div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default UploadSection;
