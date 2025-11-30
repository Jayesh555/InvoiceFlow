import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, UserRound, Pill, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface DashboardStats {
  invoices: number;
  clients: number;
  doctors: number;
  medicines: number;
}

interface DashboardPageProps {
  stats?: DashboardStats;
  isLoading?: boolean;
  onResetInvoiceCounter?: () => Promise<void>;
}

export default function DashboardPage({ stats, isLoading, onResetInvoiceCounter }: DashboardPageProps) {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetCounter = async () => {
    if (onResetInvoiceCounter && confirm("Are you sure you want to reset the invoice counter to BAF-000001? This cannot be undone.")) {
      setIsResetting(true);
      try {
        await onResetInvoiceCounter();
        alert("Invoice counter reset successfully. Next invoice will be BAF-000001.");
      } catch (error) {
        alert("Failed to reset invoice counter: " + (error as any).message);
      } finally {
        setIsResetting(false);
      }
    }
  };
  const metrics = [
    {
      title: "Total Invoices",
      value: stats?.invoices || 0,
      icon: FileText,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Total Clients",
      value: stats?.clients || 0,
      icon: Users,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Total Doctors",
      value: stats?.doctors || 0,
      icon: UserRound,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Total Medicines",
      value: stats?.medicines || 0,
      icon: Pill,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your invoice management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div
                  className="text-3xl font-bold"
                  data-testid={`text-${metric.title.toLowerCase().replace(/ /g, "-")}`}
                >
                  {metric.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">
                Active Records
              </span>
              {isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                <span className="font-semibold">
                  {(stats?.clients || 0) + (stats?.doctors || 0) + (stats?.medicines || 0)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">
                Total Invoices Generated
              </span>
              {isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                <span className="font-semibold">{stats?.invoices || 0}</span>
              )}
            </div>
            {onResetInvoiceCounter && (
              <div className="pt-2">
                <Button
                  onClick={handleResetCounter}
                  disabled={isResetting}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {isResetting ? "Resetting..." : "Reset Invoice Counter"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
