import { Sparkles, RefreshCw, CircleCheck as CheckCircle2, Lightbulb, TrendingUp, Inbox } from "lucide-react";
import OpportunityCard from "./OpportunityCard";
import { useMarketOpportunities, type MarketOpportunity } from "@/hooks/useMarketOpportunities";

interface OpportunitiesTabProps {
  onActionClick?: (opportunity: MarketOpportunity) => void;
}

const STAT_TYPES = [
  { type: "seasonal_demand", label: "Seasonal" },
  { type: "untapped_region", label: "Regions" },
  { type: "export_window", label: "Export" },
  { type: "competitor_weakness", label: "Competitive" },
  { type: "buyer_reengagement", label: "Buyers" },
  { type: "product_gap", label: "Products" },
];

const OpportunitiesTab = ({ onActionClick }: OpportunitiesTabProps) => {
  const {
    opportunities,
    actionedOpportunities,
    isLoading,
    updateStatus,
    generateOpportunities,
    isGenerating,
  } = useMarketOpportunities();

  const highCount = opportunities.filter((o) => o.priority === "high").length;
  const totalActioned = actionedOpportunities.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            AI Business Opportunities
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Personalized growth opportunities based on your market data, seasonal trends, and competitive landscape
          </p>
        </div>

        <button
          onClick={() => generateOpportunities()}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? "Generating..." : "Refresh Insights"}
        </button>
      </div>

      {opportunities.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{opportunities.length}</p>
              <p className="text-xs text-muted-foreground">Active Opportunities</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{highCount}</p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{totalActioned}</p>
              <p className="text-xs text-muted-foreground">Actioned</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {STAT_TYPES.filter((s) => opportunities.some((o) => o.type === s.type)).length}
              </p>
              <p className="text-xs text-muted-foreground">Categories Covered</p>
            </div>
          </div>
        </div>
      )}

      {opportunities.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-16 gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Inbox size={28} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">No Opportunities Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              Click "Refresh Insights" to let the AI analyze your market data and generate personalized business opportunities.
            </p>
          </div>
          <button
            onClick={() => generateOpportunities()}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            <Sparkles size={14} className={isGenerating ? "animate-pulse" : ""} />
            {isGenerating ? "Analyzing your data..." : "Generate AI Insights"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {highCount > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                High Priority — Act Now
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {opportunities
                  .filter((o) => o.priority === "high")
                  .map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onAction={updateStatus}
                      onActionClick={onActionClick}
                    />
                  ))}
              </div>
            </div>
          )}

          {opportunities.filter((o) => o.priority === "medium").length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                Medium Priority
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {opportunities
                  .filter((o) => o.priority === "medium")
                  .map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onAction={updateStatus}
                      onActionClick={onActionClick}
                    />
                  ))}
              </div>
            </div>
          )}

          {opportunities.filter((o) => o.priority === "low").length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                Low Priority
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {opportunities
                  .filter((o) => o.priority === "low")
                  .map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onAction={updateStatus}
                      onActionClick={onActionClick}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {totalActioned > 0 && (
        <div className="glass-card p-4 border border-green-200 dark:border-green-800/40 bg-green-50/50 dark:bg-green-950/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              {totalActioned} opportunit{totalActioned === 1 ? "y" : "ies"} actioned this cycle — great work!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesTab;
