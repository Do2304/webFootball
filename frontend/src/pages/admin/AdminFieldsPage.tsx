import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, DollarSign, ToggleLeft, ToggleRight } from "lucide-react";
import api from "@/api/client";

interface PricingRule {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  isWeekend: boolean;
}

interface Field {
  id: string;
  name: string;
  description: string | null;
  type: string;
  imageUrl: string | null;
  isActive: boolean;
  pricingRules: PricingRule[];
  _count: { bookings: number };
}

export default function AdminFieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [pricingFieldId, setPricingFieldId] = useState<string | null>(null);
  const [fieldForm, setFieldForm] = useState({ name: "", description: "", type: "7v7", imageUrl: "" });
  const [pricingForm, setPricingForm] = useState({ label: "", startTime: "06:00", endTime: "16:00", pricePerHour: 40, isWeekend: false });

  const fetchFields = () => {
    api.get("/admin/fields")
      .then((res) => setFields(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFields(); }, []);

  const openCreateField = () => {
    setEditingField(null);
    setFieldForm({ name: "", description: "", type: "7v7", imageUrl: "" });
    setShowFieldDialog(true);
  };

  const openEditField = (field: Field) => {
    setEditingField(field);
    setFieldForm({ name: field.name, description: field.description || "", type: field.type, imageUrl: field.imageUrl || "" });
    setShowFieldDialog(true);
  };

  const saveField = async () => {
    try {
      if (editingField) {
        await api.patch(`/admin/fields/${editingField.id}`, fieldForm);
      } else {
        await api.post("/admin/fields", fieldForm);
      }
      setShowFieldDialog(false);
      fetchFields();
    } catch { alert("Failed to save field"); }
  };

  const toggleField = async (field: Field) => {
    try {
      await api.patch(`/admin/fields/${field.id}`, { isActive: !field.isActive });
      fetchFields();
    } catch { alert("Failed to update field"); }
  };

  const deleteField = async (id: string) => {
    if (!confirm("Delete this field? All related bookings will also be deleted.")) return;
    try {
      await api.delete(`/admin/fields/${id}`);
      fetchFields();
    } catch { alert("Failed to delete field"); }
  };

  const openPricing = (fieldId: string) => {
    setPricingFieldId(fieldId);
    setPricingForm({ label: "", startTime: "06:00", endTime: "16:00", pricePerHour: 40, isWeekend: false });
    setShowPricingDialog(true);
  };

  const savePricing = async () => {
    if (!pricingFieldId) return;
    try {
      await api.post(`/admin/fields/${pricingFieldId}/pricing`, pricingForm);
      setShowPricingDialog(false);
      fetchFields();
    } catch { alert("Failed to save pricing rule"); }
  };

  const deletePricing = async (id: string) => {
    try {
      await api.delete(`/admin/pricing/${id}`);
      fetchFields();
    } catch { alert("Failed to delete pricing rule"); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Field Management</h1>
          <p className="text-gray-500 text-sm mt-1">{fields.length} fields total</p>
        </div>
        <Button onClick={openCreateField} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Field
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fields.map((field) => (
          <Card key={field.id} className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              {/* Field Header */}
              <div className="p-5 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{field.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${field.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {field.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{field.description || "No description"}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Type: {field.type}</span>
                    <span>{field._count.bookings} bookings</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleField(field)} title={field.isActive ? "Deactivate" : "Activate"}>
                    {field.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditField(field)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteField(field.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Pricing Rules */}
              <div className="border-t bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> Pricing Rules
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => openPricing(field.id)} className="text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                {field.pricingRules.length > 0 ? (
                  <div className="space-y-1">
                    {field.pricingRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between text-sm bg-white rounded px-3 py-2">
                        <div>
                          <span className="font-medium">{rule.label}</span>
                          <span className="text-gray-400 ml-2">{rule.startTime} - {rule.endTime}</span>
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${rule.isWeekend ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                            {rule.isWeekend ? "Weekend" : "Weekday"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">${rule.pricePerHour}/hr</span>
                          <Button variant="ghost" size="sm" onClick={() => deletePricing(rule.id)} className="text-red-400 hover:text-red-600 h-6 w-6 p-0">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No pricing rules set</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Field Dialog */}
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingField ? "Edit Field" : "Add New Field"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Field Name</Label>
              <Input value={fieldForm.name} onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })} placeholder="e.g. Field #5" className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={fieldForm.description} onChange={(e) => setFieldForm({ ...fieldForm, description: e.target.value })} placeholder="Field description" className="mt-1" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Input value={fieldForm.type} onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value })} placeholder="7v7" className="mt-1" />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={fieldForm.imageUrl} onChange={(e) => setFieldForm({ ...fieldForm, imageUrl: e.target.value })} placeholder="/images/field.jpg" className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFieldDialog(false)}>Cancel</Button>
            <Button onClick={saveField} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90">
              {editingField ? "Save Changes" : "Create Field"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Pricing Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input value={pricingForm.label} onChange={(e) => setPricingForm({ ...pricingForm, label: e.target.value })} placeholder="e.g. Weekday Morning" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="time" value={pricingForm.startTime} onChange={(e) => setPricingForm({ ...pricingForm, startTime: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" value={pricingForm.endTime} onChange={(e) => setPricingForm({ ...pricingForm, endTime: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price per Hour ($)</Label>
                <Input type="number" value={pricingForm.pricePerHour} onChange={(e) => setPricingForm({ ...pricingForm, pricePerHour: parseFloat(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <Label>Day Type</Label>
                <div className="mt-2 flex items-center gap-3">
                  <button onClick={() => setPricingForm({ ...pricingForm, isWeekend: false })} className={`px-3 py-1.5 rounded text-sm font-medium ${!pricingForm.isWeekend ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                    Weekday
                  </button>
                  <button onClick={() => setPricingForm({ ...pricingForm, isWeekend: true })} className={`px-3 py-1.5 rounded text-sm font-medium ${pricingForm.isWeekend ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>
                    Weekend
                  </button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPricingDialog(false)}>Cancel</Button>
            <Button onClick={savePricing} className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90">
              Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
