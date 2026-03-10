import { Clock, TrendingUp, CircleCheck as CheckCircle2, X, ArrowRight, Calendar, Zap, Globe, Users, Package, ChartBar as BarChart3, TriangleAlert as AlertTriangle } from "lucide-react";
import type { MarketOpportunity } from "@/hooks/useMarketOpportunities";

interface OpportunityCardProps {
  opportunity: MarketOpportunity;
  onAction: (id: string, status: "actioned" | "dismissed") => void;
  onActionClick?: (opportunity: MarketOpportunity) => void;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  seasonal_demand: {
    label: "Seasonal Demand",
    icon: <Calendar size={14} />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800/50",
  },
  untapped_region: {
    label: "Untapped Region",
    icon: <Globe size={14} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800/50",
  },
  product_gap: {
    label: "Product Gap",
    icon: <Package size={14} />,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200 dark:border-teal-800/50",
  },
  buyer_reengagement: {
    label: "Buyer Re-engagement",
    icon: <Users size={14} />,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800/50",
  },
  export_window: {
    label: "Export Window",
    icon: <Globe size={14} />,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800/50",
  },
  competitor_weakness: {
    label: "Competitor Weakness",
    icon: <AlertTriangle size={14} />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800/50",
  },
};

const PRIORITY_CONFIG = {
  high: { label: "High Priority", dot: "bg-red-500", text: "text-red-600 dark:text-red-400", badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
  medium: { label: "Medium", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  low: { label: "Low", dot: "bg-slate-400", text: "text-slate-500", badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" },
};

const OpportunityCard = ({ opportunity, onAction, onActionClick }: OpportunityCardProps) => {
  const typeConfig = TYPE_CONFIG[opportunity.type] ?? TYPE_CONFIG["product_gap"];
  const priorityConfig = PRIORITY_CONFIG[opportunity.priority] ?? PRIORITY_CONFIG["medium"];

  return (
    <div className={`relative rounded-xl border ${typeConfig.border} ${typeConfig.bg} p-5 flex flex-col gap-3 transition-all hover:shadow-md group`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${typeConfig.border} ${typeConfig.color} bg-white/60 dark:bg-black/20`}>
            {typeConfig.icon}
            {typeConfig.label}
          </span>
          <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot} inline-block`} />
            {priorityConfig.label}
          </span>
        </div>

        <button
          onClick={() => onAction(opportunity.id, "dismissed")}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-opacity shrink-0"
          title="Dismiss"
        >
          <X size={14} className="text-muted-foreground" />
        </button>
      </div>

      <h3 className="text-sm font-semibold text-foreground leading-snug">{opportunity.title}</h3>

      <p className="text-xs text-muted-foreground leading-relaxed">{opportunity.description}</p>

      <div className="flex items-center gap-4 flex-wrap">
        {opportunity.estimated_impact && (
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">{opportunity.estimated_impact}</span>
          </div>
        )}
        {opportunity.timeline_days && (
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Act within {opportunity.timeline_days} days</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-black/5 dark:border-white/5">
        {opportunity.action_label && (
          <button
            onClick={() => {
              onAction(opportunity.id, "actioned");
              onActionClick?.(opportunity);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${typeConfig.color} bg-white/70 dark:bg-black/20 border ${typeConfig.border} hover:bg-white dark:hover:bg-black/30 transition-colors`}
          >
            <ArrowRight size={12} />
            {opportunity.action_label}
          </button>
        )}
        <button
          onClick={() => onAction(opportunity.id, "actioned")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground bg-white/50 dark:bg-black/10 border border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-black/20 transition-colors ml-auto"
        >
          <CheckCircle2 size={12} />
          Mark Done
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
