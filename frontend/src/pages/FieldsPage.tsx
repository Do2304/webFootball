import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  Shuffle,
} from "lucide-react";
import api from "@/api/client";
import type { Field } from "@/types";

const fallbackFields: Field[] = [
  { id: "1", name: "Field #1", description: "Premium artificial turf with LED lighting", type: "7v7", imageUrl: "/images/i1.jpg", isActive: true, pricingRules: [] },
  { id: "2", name: "Field #2", description: "Standard artificial turf field", type: "7v7", imageUrl: "/images/i2.jpg", isActive: true, pricingRules: [] },
  { id: "3", name: "Field #3", description: "Indoor turf with climate control", type: "7v7", imageUrl: "/images/i3.jpg", isActive: true, pricingRules: [] },
  { id: "4", name: "Field #4", description: "Outdoor field with panoramic view", type: "7v7", imageUrl: "/images/i4.jpg", isActive: true, pricingRules: [] },
];

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/fields")
      .then((res) => {
        const data = res.data;
        if (data && data.length > 0) {
          setFields(data);
        } else {
          setFields(fallbackFields);
        }
      })
      .catch(() => {
        setFields(fallbackFields);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[250px] sm:h-[300px] overflow-hidden">
        <img
          src="/images/i5.jpg"
          alt="Field Rental"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            Field Rental
          </h1>
          <p className="text-base sm:text-lg text-gray-200 max-w-2xl">
            Book premium 7v7 artificial turf fields with professional lighting
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-teal-400 to-yellow-300 flex items-center justify-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700">1. Pick a Field</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-teal-400 to-yellow-300 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700">2. Choose Date & Time</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-teal-400 to-yellow-300 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700">3. Confirm & Play</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fields Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h2 className="text-2xl font-bold mb-8">Choose Your Field</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Any Available Field Option */}
          <Link to="/fields/any/book" className="sm:col-span-2 lg:col-span-4">
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border-2 border-dashed border-teal-300 bg-gradient-to-r from-teal-50 to-yellow-50">
              <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-400 to-yellow-300 flex items-center justify-center shrink-0">
                  <Shuffle className="w-7 h-7 text-gray-900" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="font-bold text-lg text-gray-900">Any Available Field</h3>
                  <p className="text-gray-500 text-sm">Don't have a preference? We'll assign you any field that's open at your chosen time</p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold shrink-0">
                  Quick Book
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {fields.map((field) => (
            <Link key={field.id} to={`/fields/${field.id}/book`}>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group h-full">
                <div className="h-44 relative overflow-hidden">
                  {field.imageUrl ? (
                    <img
                      src={field.imageUrl}
                      alt={field.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-400 to-yellow-300 flex items-center justify-center">
                      <span className="text-gray-900 text-2xl font-bold">{field.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-white font-bold text-lg">{field.name}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {field.type}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-500 text-sm mb-3">{field.description}</p>
                  <Button size="sm" className="w-full bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold">
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing Info */}
      <section className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h2 className="text-2xl font-bold text-center mb-8">Pricing</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Weekday Morning", time: "6AM - 4PM", price: "$40/hr" },
              { label: "Weekday Peak", time: "4PM - 11PM", price: "$70/hr" },
              { label: "Weekend Morning", time: "6AM - 4PM", price: "$60/hr" },
              { label: "Weekend Peak", time: "4PM - 11PM", price: "$80/hr" },
            ].map((item) => (
              <Card key={item.label} className="text-center border-0 shadow-md">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="font-bold text-sm sm:text-base mb-2">{item.label}</h3>
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-3">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{item.time}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-500 to-yellow-400 bg-clip-text text-transparent">
                    {item.price}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
