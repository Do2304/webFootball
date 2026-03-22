import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "@/api/client";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  isActive: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, category: "general" });

  const fetchData = () => {
    api.get("/admin/services").then((r) => setServices(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: 0, category: "general" });
    setShowDialog(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description || "", price: s.price, category: s.category });
    setShowDialog(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await api.patch(`/admin/services/${editing.id}`, form);
      } else {
        await api.post("/admin/services", form);
      }
      setShowDialog(false);
      fetchData();
    } catch { alert("Failed to save"); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try { await api.delete(`/admin/services/${id}`); fetchData(); } catch { alert("Failed"); }
  };

  const toggleActive = async (s: Service) => {
    try {
      await api.patch(`/admin/services/${s.id}`, { isActive: !s.isActive });
      fetchData();
    } catch { alert("Failed"); }
  };

  // Group by category
  const categories = [...new Set(services.map(s => s.category))];

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Other Services</h1>
          <p className="text-gray-500 text-sm mt-1">Manage additional services offered at the complex</p>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="border-0 shadow-md"><CardContent className="p-12 text-center text-gray-400">No services yet. Add services like equipment rental, coaching, etc.</CardContent></Card>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.filter(s => s.category === cat).map((s) => (
                  <Card key={s.id} className={`border-0 shadow-md ${!s.isActive ? "opacity-60" : ""}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold">{s.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {s.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-xl font-bold bg-gradient-to-r from-teal-500 to-yellow-400 bg-clip-text text-transparent">${s.price}</p>
                      </div>
                      {s.description && <p className="text-sm text-gray-500 mb-3">{s.description}</p>}
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(s)}>{s.isActive ? "Deactivate" : "Activate"}</Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(s.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Service Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Equipment Rental" className="mt-1" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="mt-1" /></div>
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                  <option value="general">General</option>
                  <option value="equipment">Equipment</option>
                  <option value="coaching">Coaching</option>
                  <option value="food">Food & Beverage</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="event">Event Hosting</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={save} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90">{editing ? "Save" : "Add Service"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
