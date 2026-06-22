import { Download } from "lucide-react";

function DownloadPDF({ data }) {
  const downloadReport = () => {
    const query = data.birthDate
      ? `?birthDate=${encodeURIComponent(data.birthDate)}`
      : "";

    window.open(`http://localhost:3000/report${query}`, "_blank");
  };

  return (
    <button
      onClick={downloadReport}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-100"
    >
      <Download size={20} />
      Download PDF
    </button>
  );
}

export default DownloadPDF;
