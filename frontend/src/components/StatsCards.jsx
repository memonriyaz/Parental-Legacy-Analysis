import { Activity, Heart, Shield } from "lucide-react";

function StatsCards({ data }) {
  const cards = [
    {
      title: "Mother total",
      value: data.motherTotal,
      icon: <Heart size={24} />,
      color: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    },
    {
      title: "Father total",
      value: data.fatherTotal,
      icon: <Shield size={24} />,
      color: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    },
    {
      title: "Overall total",
      value: data.total,
      icon: <Activity size={24} />,
      color: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">{card.title}</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {card.value}
              </h2>
            </div>
            <div className={`rounded-lg border p-3 ${card.color}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
