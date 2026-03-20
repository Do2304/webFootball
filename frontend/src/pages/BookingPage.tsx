import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            description: "7v7 turf field",
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
          // Generate mock slots
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
    setShowBookingDialog(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-3">Book {field?.name}</h1>
      <p className="text-gray-500 text-center mb-10 lg:mb-12">7 vs 7 | Select your date and time</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Left - Selection */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={{ before: new Date() }}
              className="mx-auto"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Selected: {format(selectedDate, "PPP")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Right - Time Slots */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Available Times - {field?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-[80px_1fr_80px] gap-2 pb-2 border-b text-sm font-semibold text-gray-500">
                <span>Time</span>
                <span>Status</span>
                <span>Price</span>
              </div>
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleSlotClick(slot)}
                  disabled={!slot.available}
                  className={`w-full grid grid-cols-[80px_1fr_80px] gap-2 p-3 rounded-lg text-left text-sm transition ${
                    slot.available
                      ? "hover:bg-green-100 cursor-pointer"
                      : "opacity-50 cursor-not-allowed bg-red-50"
                  } ${
                    selectedSlot?.time === slot.time ? "ring-2 ring-primary bg-green-100" : ""
                  }`}
                >
                  <span className="font-medium">{slot.time}</span>
                  <span className="flex items-center gap-1">
                    {slot.available ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Booked</span>
                      </>
                    )}
                  </span>
                  <span className="font-medium">${slot.price}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Go to Checkout */}
      {selectedSlot && (
        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white px-12 py-6 text-lg"
            onClick={() => setShowBookingDialog(true)}
          >
            Go to Checkout
          </Button>
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">Booking Summary</h3>
              <p className="text-sm">7 vs 7</p>
              <p className="text-sm">Field: {field?.name}</p>
              <p className="text-sm">Date: {format(selectedDate, "PPP")}</p>
              <p className="text-sm">Time: {selectedSlot?.time}</p>
              <p className="text-lg font-bold text-primary mt-2">${selectedSlot?.price}/hr</p>
            </div>

            {/* Booking Form */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.playerName}
                  onChange={(e) =>
                    setFormData({ ...formData, playerName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  value={formData.playerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, playerPhone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.playerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, playerEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests?"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="terms" className="rounded" />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the terms and conditions
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="whatsapp" className="rounded" />
            <label htmlFor="whatsapp" className="text-sm text-gray-600">
              I agree to join WhatsApp group
            </label>
          </div>

          <Button
            className="w-full bg-accent hover:bg-accent/90 text-white mt-4"
            onClick={handleBooking}
            disabled={booking}
          >
            {booking ? "Booking..." : "Book"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
