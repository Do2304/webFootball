import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as {
    field: string;
    date: string;
    time: string;
    price: number;
  } | null;

  if (!bookingData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">No Booking Found</h1>
        <Link to="/fields">
          <Button>Go to Fields</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-700">Booking Confirmed!</h1>
        <p className="text-gray-500 mt-2">Your field has been reserved</p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Field</p>
              <p className="font-semibold">{bookingData.field}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-semibold">7 vs 7</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{bookingData.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-semibold">{bookingData.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-2xl text-primary">${bookingData.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-8 justify-center">
        <Button onClick={() => navigate("/my-bookings")} className="bg-primary">
          View My Bookings
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
