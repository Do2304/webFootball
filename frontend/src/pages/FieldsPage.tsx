import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/api/client";
import type { Field } from "@/types";

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/fields")
      .then((res) => setFields(res.data))
      .catch(() => {
        // Use fallback data if API is not available
        setFields([
          { id: "1", name: "Field #1", description: "Premium artificial turf with LED lighting", type: "7v7", imageUrl: null, isActive: true, pricingRules: [] },
          { id: "2", name: "Field #2", description: "Standard artificial turf field", type: "7v7", imageUrl: null, isActive: true, pricingRules: [] },
          { id: "3", name: "Field #3", description: "Indoor turf with climate control", type: "7v7", imageUrl: null, isActive: true, pricingRules: [] },
          { id: "4", name: "Field #4", description: "Outdoor field with panoramic view", type: "7v7", imageUrl: null, isActive: true, pricingRules: [] },
        ]);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-3">Field Rental</h1>
      <p className="text-gray-500 text-center mb-10 lg:mb-12">
        Choose a field and book your time slot
      </p>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
        {fields.map((field) => (
          <Link key={field.id} to={`/fields/${field.id}/book`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
              <div className="h-48 bg-cyan-400 flex items-center justify-center relative">
                {field.imageUrl ? (
                  <img
                    src={field.imageUrl}
                    alt={field.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">{field.name}</span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </div>
              <CardContent className="p-5 sm:p-6">
                <h3 className="font-bold text-lg">{field.name}</h3>
                <p className="text-gray-500 text-sm mt-2">{field.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{field.type}</span>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Booking Info */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
        <CardContent className="p-8 sm:p-10 lg:p-12 text-center">
          <h2 className="text-xl font-bold mb-2">7 vs 7 Field Rental</h2>
          <p className="text-gray-600 mb-4">
            Pick a field, choose your date, and check availability
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">
              Field: Pick a Field
            </span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">
              Pick a Date
            </span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">
              Check Availability
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
