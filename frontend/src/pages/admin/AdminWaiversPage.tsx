import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import api from "@/api/client";

interface Waiver {
  id: string;
  title: string;
  content: string;
  isRequired: boolean;
  isActive: boolean;
}

export default function AdminWaiversPage() {
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Waiver | null>(null);
  const [form, setForm] = useState({ title: "", content: "", isRequired: true });

  const fetchData = () => {
    api.get("/admin/waivers").then((r) => setWaivers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", content: "", isRequired: true });
    setShowDialog(true);
  };

  const openEdit = (w: Waiver) => {
    setEditing(w);
    setForm({ title: w.title, content: w.content, isRequired: w.isRequired });
    setShowDialog(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await api.patch(`/admin/waivers/${editing.id}`, form);
      } else {
        await api.post("/admin/waivers", form);
      }
      setShowDialog(false);
      fetchData();
    } catch { alert("Failed to save"); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this waiver?")) return;
    try { await api.delete(`/admin/waivers/${id}`); fetchData(); } catch { alert("Failed"); }
  };

  const toggleActive = async (w: Waiver) => {
    try {
      await api.patch(`/admin/waivers/${w.id}`, { isActive: !w.isActive });
      fetchData();
    } catch { alert("Failed"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waivers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage liability waivers and agreements</p>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Waiver
        </Button>
      </div>

      {waivers.length === 0 ? (
        <Card className="border-0 shadow-md"><CardContent className="p-12 text-center text-gray-400">No waivers yet</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {waivers.map((w) => (
            <Card key={w.id} className="border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{w.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${w.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {w.isActive ? "Active" : "Inactive"}
                        </span>
                        {w.isRequired && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Required</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(w)}>
                      {w.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(w)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(w.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {w.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Waiver" : "New Waiver"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Liability Waiver" className="mt-1" /></div>
            <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Waiver text..." className="mt-1" rows={8} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="required" checked={form.isRequired} onChange={(e) => setForm({ ...form, isRequired: e.target.checked })} className="rounded" />
              <label htmlFor="required" className="text-sm">Required for all bookings</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={save} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90">{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
