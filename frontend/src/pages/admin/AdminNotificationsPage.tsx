import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Bell, Send, Megaphone } from "lucide-react";
import api from "@/api/client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  targetAudience: string;
  isSent: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "general", targetAudience: "all" });

  const fetchData = () => {
    api.get("/admin/notifications").then((r) => setNotifications(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const save = async () => {
    try {
      await api.post("/admin/notifications", form);
      setShowDialog(false);
      setForm({ title: "", message: "", type: "general", targetAudience: "all" });
      fetchData();
    } catch { alert("Failed to create notification"); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this notification?")) return;
    try { await api.delete(`/admin/notifications/${id}`); fetchData(); } catch { alert("Failed"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Send notifications and announcements to customers</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold">
          <Plus className="w-4 h-4 mr-2" /> New Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Sent", value: notifications.filter(n => n.isSent).length, icon: Send, color: "from-green-500 to-green-600" },
          { label: "Announcements", value: notifications.filter(n => n.type === "announcement").length, icon: Megaphone, color: "from-blue-500 to-blue-600" },
          { label: "All Notifications", value: notifications.length, icon: Bell, color: "from-purple-500 to-purple-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-md">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-0 shadow-md"><CardContent className="p-12 text-center text-gray-400">No notifications yet</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className="border-0 shadow-md">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === "announcement" ? "bg-blue-100" : n.type === "promotion" ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    {n.type === "announcement" ? <Megaphone className="w-4 h-4 text-blue-600" /> : <Bell className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{n.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        n.type === "announcement" ? "bg-blue-100 text-blue-700"
                        : n.type === "promotion" ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>{n.type}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">To: {n.targetAudience}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => remove(n.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Notification</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notification title" className="mt-1" /></div>
            <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." className="mt-1" rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                  <option value="general">General</option>
                  <option value="announcement">Announcement</option>
                  <option value="promotion">Promotion</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div>
                <Label>Target Audience</Label>
                <select value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                  <option value="all">All Users</option>
                  <option value="active_bookers">Active Bookers</option>
                  <option value="new_users">New Users</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={save} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90">
              <Send className="w-4 h-4 mr-2" /> Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
