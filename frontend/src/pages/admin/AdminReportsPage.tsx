import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, CalendarDays, MapPin } from "lucide-react";
import api from "@/api/client";

interface RevenueData {
  date: string;
  revenue: number;
}

interface FieldReport {
  name: string;
  totalBookings: number;
  totalRevenue: number;
}

export default function AdminReportsPage() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [fieldData, setFieldData] = useState<FieldReport[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/admin/reports/revenue?period=${period}`),
      api.get("/admin/reports/fields"),
    ])
      .then(([rev, fields]) => {
        setRevenueData(rev.data.data);
        setTotalRevenue(rev.data.totalRevenue);
        setTotalBookings(rev.data.totalBookings);
        setFieldData(fields.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1);
  const maxFieldRev = Math.max(...fieldData.map((d) => d.totalRevenue), 1);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Revenue and booking analytics</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {["daily", "weekly", "monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                period === p ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-green-500 to-green-600" },
          { label: "Total Bookings", value: totalBookings, icon: CalendarDays, color: "from-blue-500 to-blue-600" },
          { label: "Avg per Booking", value: `$${totalBookings ? (totalRevenue / totalBookings).toFixed(0) : 0}`, icon: TrendingUp, color: "from-purple-500 to-purple-600" },
          { label: "Active Fields", value: fieldData.length, icon: MapPin, color: "from-orange-500 to-orange-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart (bar chart with CSS) */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Revenue Over Time</h2>
            {revenueData.length > 0 ? (
              <div className="space-y-2">
                {revenueData.slice(-15).map((d) => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20 shrink-0">{new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-yellow-300 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max((d.revenue / maxRevenue) * 100, 5)}%` }}
                      >
                        <span className="text-[10px] font-bold text-gray-900">${d.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No revenue data for this period</p>
            )}
          </CardContent>
        </Card>

        {/* Field Performance */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Field Performance</h2>
            {fieldData.length > 0 ? (
              <div className="space-y-4">
                {fieldData.map((f) => (
                  <div key={f.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{f.name}</span>
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-green-600">${f.totalRevenue.toLocaleString()}</span>
                        <span className="text-gray-400 ml-2">({f.totalBookings} bookings)</span>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-yellow-300 rounded-full"
                        style={{ width: `${Math.max((f.totalRevenue / maxFieldRev) * 100, 3)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No field data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Billing Summary */}
      <Card className="border-0 shadow-md mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4">Billing Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Field</th>
                  <th className="pb-3 font-medium">Bookings</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {fieldData.map((f) => (
                  <tr key={f.name} className="border-b last:border-0">
                    <td className="py-3 font-medium text-gray-900">{f.name}</td>
                    <td className="py-3 text-gray-600">{f.totalBookings}</td>
                    <td className="py-3 font-semibold text-green-600">${f.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 text-gray-600">{totalRevenue ? ((f.totalRevenue / totalRevenue) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
                {fieldData.length > 0 && (
                  <tr className="font-bold">
                    <td className="py-3">Total</td>
                    <td className="py-3">{fieldData.reduce((s, f) => s + f.totalBookings, 0)}</td>
                    <td className="py-3 text-green-600">${fieldData.reduce((s, f) => s + f.totalRevenue, 0).toLocaleString()}</td>
                    <td className="py-3">100%</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
