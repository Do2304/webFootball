import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Info,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import type { Field, TimeSlot } from "@/types";

export default function BookingPage() {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [field, setField] = useState<Field | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [formData, setFormData] = useState({
    playerName: "",
    playerPhone: "",
    playerEmail: "",
    notes: "",
  });

  useEffect(() => {
    if (fieldId) {
      api
        .get(`/fields/${fieldId}`)
        .then((res) => setField(res.data))
        .catch(() => {
          setField({
            id: fieldId,
            name: `Field #${fieldId}`,
            description: "Premium 7v7 artificial turf with LED lighting",
            type: "7v7",
            imageUrl: null,
            isActive: true,
            pricingRules: [],
          });
        })
        .finally(() => setLoading(false));
    }
  }, [fieldId]);

  useEffect(() => {
    if (fieldId && selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      api
        .get(`/fields/${fieldId}/availability?date=${dateStr}`)
        .then((res) => setSlots(res.data.slots))
        .catch(() => {
          const mockSlots: TimeSlot[] = [];
          for (let h = 6; h <= 22; h++) {
            mockSlots.push({
              time: `${h.toString().padStart(2, "0")}:00`,
              available: Math.random() > 0.3,
              price: h >= 16 ? 70 : 40,
            });
          }
          setSlots(mockSlots);
        });
    }
  }, [fieldId, selectedDate]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedSlot || !fieldId) return;

    setBooking(true);
    try {
      const startHour = parseInt(selectedSlot.time.split(":")[0]);
      await api.post("/bookings", {
        fieldId,
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSlot.time,
        endTime: `${(startHour + 1).toString().padStart(2, "0")}:00`,
        playerName: formData.playerName || user.name,
        playerPhone: formData.playerPhone || user.phone,
        playerEmail: formData.playerEmail || user.email,
        notes: formData.notes,
      });
      setShowBookingDialog(false);
      navigate("/checkout", {
        state: {
          field: field?.name,
          date: format(selectedDate, "PPP"),
          time: selectedSlot.time,
          price: selectedSlot.price,
        },
      });
    } catch {
      alert("Failed to book. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const availableCount = slots.filter((s) => s.available).length;
  const fieldImages = ["/images/i1.jpg", "/images/i2.jpg", "/images/i3.jpg", "/images/i4.jpg"];
  const fieldImage = field?.imageUrl || fieldImages[(parseInt(fieldId || "1") - 1) % 4];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
        <img
          src={fieldImage}
          alt={field?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-teal-300 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span>SW Sports Complex</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {field?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                7 vs 7
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                Premium Turf
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-teal-300" />
                LED Lighting
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-yellow-300 flex items-center justify-center text-sm font-bold text-gray-900">
              1
            </div>
            <span className="text-sm font-medium hidden sm:block">Select Date</span>
          </div>
          <div className="w-8 sm:w-12 h-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              selectedSlot
                ? "bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900"
                : "bg-gray-200 text-gray-500"
            }`}>
              2
            </div>
            <span className="text-sm font-medium hidden sm:block">Pick Time</span>
          </div>
          <div className="w-8 sm:w-12 h-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
              3
            </div>
            <span className="text-sm font-medium hidden sm:block">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left - Calendar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-yellow-300 px-5 py-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Select Date
                </h2>
              </div>
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={{ before: new Date() }}
                  className="mx-auto"
                />
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Selected Date</p>
                  <p className="font-semibold text-gray-900">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="border-0 shadow-lg mt-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">Booking Info</p>
                    <p>Each slot is 1 hour</p>
                    <p>Peak hours (4PM-10PM): <span className="font-semibold text-gray-900">$70/hr</span></p>
                    <p>Off-peak hours: <span className="font-semibold text-gray-900">$40/hr</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Time Slots */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-yellow-300 px-5 py-4 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Available Times
                </h2>
                <span className="text-sm font-medium text-gray-700 bg-white/60 px-3 py-1 rounded-full">
                  {availableCount} slots available
                </span>
              </div>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        onClick={() => handleSlotClick(slot)}
                        disabled={!slot.available}
                        className={`relative p-4 rounded-xl text-center transition-all duration-200 border-2 ${
                          isSelected
                            ? "border-teal-400 bg-gradient-to-br from-teal-50 to-yellow-50 shadow-md scale-[1.02]"
                            : slot.available
                            ? "border-gray-100 bg-white hover:border-teal-300 hover:shadow-md hover:scale-[1.02]"
                            : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <p className={`text-lg font-bold ${
                          isSelected ? "text-teal-600" : slot.available ? "text-gray-900" : "text-gray-400"
                        }`}>
                          {slot.time}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {slot.available ? (
                            <CheckCircle className={`w-3.5 h-3.5 ${isSelected ? "text-teal-500" : "text-green-500"}`} />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                          )}
                          <span className={`text-xs ${
                            slot.available
                              ? isSelected ? "text-teal-600" : "text-green-600"
                              : "text-red-400"
                          }`}>
                            {slot.available ? "Open" : "Taken"}
                          </span>
                        </div>
                        <p className={`text-sm font-semibold mt-1 ${
                          isSelected ? "text-teal-700" : "text-gray-600"
                        }`}>
                          ${slot.price}
                        </p>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-teal-400 to-yellow-300 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-gray-900" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white border-2 border-gray-200" />
                    Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-yellow-300" />
                    Selected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-gray-200" />
                    Booked
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        {selectedSlot && (
          <div className="mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
              <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-center sm:text-left">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Field</p>
                    <p className="font-semibold">{field?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                    <p className="font-semibold">{format(selectedDate, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
                    <p className="font-semibold">{selectedSlot.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-teal-400 to-yellow-300 bg-clip-text text-transparent">
                      ${selectedSlot.price}
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => setShowBookingDialog(true)}
                  className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-bold px-8 shrink-0"
                >
                  Continue Booking
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-400 to-yellow-300 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-gray-900 text-lg">Confirm Your Booking</DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-5">
            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Field</p>
                  <p className="font-medium">{field?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium">7 vs 7</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{format(selectedDate, "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium">{selectedSlot?.time} (1 hour)</p>
                </div>
              </div>
              <div className="pt-2 border-t mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-yellow-500 bg-clip-text text-transparent">
                    ${selectedSlot?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  placeholder={user?.name || "Your name"}
                  value={formData.playerName}
                  onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="phone"
                    placeholder={user?.phone || "Phone number"}
                    value={formData.playerPhone}
                    onChange={(e) => setFormData({ ...formData, playerPhone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={user?.email || "Email"}
                    value={formData.playerEmail}
                    onChange={(e) => setFormData({ ...formData, playerEmail: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="terms" className="rounded border-gray-300" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and conditions
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="whatsapp" className="rounded border-gray-300" />
                <label htmlFor="whatsapp" className="text-sm text-gray-600">
                  I agree to join WhatsApp group
                </label>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-bold py-5"
              onClick={handleBooking}
              disabled={booking}
            >
              {booking ? "Processing..." : "Confirm & Book Now"}
              {!booking && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
