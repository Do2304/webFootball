import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Tag, Calendar } from "lucide-react";
import api from "@/api/client";

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  discountPercent: number | null;
  discountAmount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", code: "", discountPercent: 0, discountAmount: 0,
    startDate: "", endDate: "", isActive: true,
  });

  const fetch = () => {
    api.get("/admin/promotions").then((r) => setPromotions(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", code: "", discountPercent: 0, discountAmount: 0, startDate: "", endDate: "", isActive: true });
    setShowDialog(true);
  };

  const openEdit = (p: Promotion) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description || "", code: p.code || "",
      discountPercent: p.discountPercent || 0, discountAmount: p.discountAmount || 0,
      startDate: p.startDate.split("T")[0], endDate: p.endDate.split("T")[0], isActive: p.isActive,
    });
    setShowDialog(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await api.patch(`/admin/promotions/${editing.id}`, form);
      } else {
        await api.post("/admin/promotions", form);
      }
      setShowDialog(false);
      fetch();
    } catch { alert("Failed to save promotion"); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this promotion?")) return;
    try { await api.delete(`/admin/promotions/${id}`); fetch(); } catch { alert("Failed"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage discount codes and promotions</p>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Promotion
        </Button>
      </div>

      {promotions.length === 0 ? (
        <Card className="border-0 shadow-md"><CardContent className="p-12 text-center text-gray-400">No promotions yet. Click "Add Promotion" to create one.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((p) => (
            <Card key={p.id} className="border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(p.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                {p.description && <p className="text-sm text-gray-500 mb-3">{p.description}</p>}
                {p.code && (
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-teal-500" />
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono font-bold">{p.code}</code>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {p.discountPercent ? <span className="font-semibold text-green-600">{p.discountPercent}% off</span> : null}
                  {p.discountAmount ? <span className="font-semibold text-green-600">${p.discountAmount} off</span> : null}
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Promotion" : "New Promotion"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={2} /></div>
            <div><Label>Promo Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. SUMMER25" className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Discount %</Label><Input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: parseFloat(e.target.value) })} className="mt-1" /></div>
              <div><Label>Discount $ Amount</Label><Input type="number" value={form.discountAmount} onChange={(e) => setForm({ ...form, discountAmount: parseFloat(e.target.value) })} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="mt-1" /></div>
              <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="mt-1" /></div>
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
