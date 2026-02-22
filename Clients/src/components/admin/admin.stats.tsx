import { Users, Package, Activity } from "lucide-react";

import { AdminStats as AdminStatsType } from "../../lib/types";
import { StatsCard } from "./stats.card";

interface AdminStatsProps {
  stats: AdminStatsType | null;
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
      <StatsCard
        icon={Users}
        label="Total Users"
        value={stats?.totalUsers || 0}
        iconColor="text-blue-500"
        bgColor="bg-blue-50"
      />
      <StatsCard
        icon={Package}
        label="Total Products"
        value={stats?.totalProducts || 0}
        iconColor="text-green-500"
        bgColor="bg-green-50"
      />
      <StatsCard
        icon={Activity}
        label="Active Dermatologists"
        value={stats?.totalDermatologists || 0}
        iconColor="text-purple-500"
        bgColor="bg-purple-50"
      />
    </div>
  );
}
