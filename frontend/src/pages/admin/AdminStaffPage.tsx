import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import api from "@/api/client";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  salary: number;
  startDate: string;
  isActive: boolean;
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Staff", salary: 0, startDate: "" });

  const fetchStaff = () => {
    api.get("/admin/staff").then((r) => setStaff(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchStaff(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", role: "Staff", salary: 0, startDate: new Date().toISOString().split("T")[0] });
    setShowDialog(true);
  };

  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, phone: s.phone || "", role: s.role, salary: s.salary, startDate: s.startDate.split("T")[0] });
    setShowDialog(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await api.patch(`/admin/staff/${editing.id}`, form);
      } else {
        await api.post("/admin/staff", form);
      }
      setShowDialog(false);
      fetchStaff();
    } catch { alert("Failed to save"); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    try { await api.delete(`/admin/staff/${id}`); fetchStaff(); } catch { alert("Failed"); }
  };

  const toggleActive = async (s: Staff) => {
    try {
      await api.patch(`/admin/staff/${s.id}`, { isActive: !s.isActive });
      fetchStaff();
    } catch { alert("Failed"); }
  };

  const totalSalary = staff.filter(s => s.isActive).reduce((sum, s) => sum + s.salary, 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-1">{staff.length} staff members</p>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      {/* Salary Summary */}
      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Monthly Salary (Active Staff)</p>
            <p className="text-2xl font-bold text-gray-900">${totalSalary.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Salary</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{s.name}</td>
                    <td className="p-4 text-gray-600">{s.email}</td>
                    <td className="p-4 text-gray-600">{s.phone || "-"}</td>
                    <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{s.role}</span></td>
                    <td className="p-4 font-semibold text-green-600">${s.salary.toLocaleString()}</td>
                    <td className="p-4">
                      <button onClick={() => toggleActive(s)} className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(s.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">No staff members yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Staff" : "Add Staff Member"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                  <option>Staff</option>
                  <option>Manager</option>
                  <option>Coach</option>
                  <option>Referee</option>
                  <option>Maintenance</option>
                  <option>Security</option>
                </select>
              </div>
              <div><Label>Monthly Salary ($)</Label><Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: parseFloat(e.target.value) })} className="mt-1" /></div>
            </div>
            <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={save} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90">{editing ? "Save" : "Add Staff"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
