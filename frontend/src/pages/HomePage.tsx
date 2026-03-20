import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Phone,
  Star,
  MapPin,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/api/client";
import type { Review, Event } from "@/types";

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api
      .get("/reviews")
      .then((res) => setReviews(res.data))
      .catch(() => {});
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] bg-gradient-to-br from-green-900 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-field.jpg')] bg-cover bg-center opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 sm:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            Southwest Sports Complex
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-gray-200">
            Premium 7v7 Artificial Turf Fields
          </p>
          <p className="text-lg mb-8 text-gray-300">
            Book your field in under 30 seconds
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/fields">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6"
              >
                <CalendarDays className="w-5 h-5 mr-2" />
                Book Field
              </Button>
            </Link>
            <a href="tel:5551234567">
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-accent text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
        {/* Field Rental Arrow (like wireframe) */}
        <Link
          to="/fields"
          className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-lg font-bold shadow-lg hover:bg-orange-600 transition"
        >
          Field Rental
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Quick Booking Widget */}
      <section className="bg-white shadow-lg -mt-8 relative z-20 max-w-4xl mx-4 sm:mx-auto rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Quick Booking
            </h2>
            <p className="text-gray-500 text-sm">
              Select a field and check availability
            </p>
          </div>
          <Link to="/fields">
            <Button className="bg-primary hover:bg-primary/90 px-8">
              <CalendarDays className="w-4 h-4 mr-2" />
              Check Availability
            </Button>
          </Link>
        </div>
      </section>

      {/* Slides Section - Field Photos, Promotions */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Facilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Premium Turf",
                desc: "FIFA-quality artificial turf for the best playing experience",
                gradient: "from-green-500 to-emerald-700",
              },
              {
                title: "LED Lighting",
                desc: "Professional-grade lighting for night matches",
                gradient: "from-blue-500 to-indigo-700",
              },
              {
                title: "Modern Facilities",
                desc: "Locker rooms, parking, and spectator areas",
                gradient: "from-purple-500 to-pink-700",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className={`bg-gradient-to-br ${item.gradient} text-white border-0 overflow-hidden`}
              >
                <CardContent className="p-6 sm:p-8 h-52 flex flex-col justify-end">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                label: "Weekday Morning",
                time: "6:00 - 16:00",
                price: "$40",
                period: "/ hour",
              },
              {
                label: "Weekday Peak",
                time: "16:00 - 23:00",
                price: "$70",
                period: "/ hour",
              },
              {
                label: "Weekend Morning",
                time: "6:00 - 16:00",
                price: "$60",
                period: "/ hour",
              },
              {
                label: "Weekend Peak",
                time: "16:00 - 23:00",
                price: "$80",
                period: "/ hour",
              },
            ].map((item) => (
              <Card
                key={item.label}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-bold text-lg mb-3">{item.label}</h3>
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{item.time}</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {item.price}
                    <span className="text-base font-normal text-gray-500">
                      {item.period}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-video rounded-lg bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center overflow-hidden"
              >
                <span className="text-gray-500 text-sm">Field Photo {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-yellow-600 to-orange-700" />
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {event.description}
                    </p>
                    <p className="text-primary font-medium text-sm mt-2">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location Section */}
      <section
        id="location"
        className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-xl overflow-hidden bg-gray-200 h-80 flex items-center justify-center">
              <span className="text-gray-500">Google Map Embed</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">
                    123 Sports Complex Dr, City, State 12345
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Hours</h3>
                  <p className="text-gray-600">Mon-Fri: 6 AM - 11 PM</p>
                  <p className="text-gray-600">Sat-Sun: 7 AM - 11 PM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Directions
                  </Button>
                </a>
                <a href="tel:5551234567">
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {(reviews.length > 0
              ? reviews
              : [
                  {
                    id: "1",
                    rating: 5,
                    comment: "Great turf and lighting!",
                    user: { name: "John", avatar: null, id: "" },
                    createdAt: "",
                    userId: "",
                  },
                  {
                    id: "2",
                    rating: 4,
                    comment: "Nice facilities. Clean and well maintained.",
                    user: { name: "Jane", avatar: null, id: "" },
                    createdAt: "",
                    userId: "",
                  },
                  {
                    id: "3",
                    rating: 5,
                    comment: "Amazing experience!",
                    user: { name: "Mike", avatar: null, id: "" },
                    createdAt: "",
                    userId: "",
                  },
                ]
            ).map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {review.user.name?.[0] || "?"}
                    </div>
                    <span className="font-medium text-sm">
                      {review.user.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile CTA Bar */}
      <div className="h-16 lg:hidden" />
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50 flex gap-3">
        <Link to="/fields" className="flex-1">
          <Button className="w-full bg-accent text-white">
            <CalendarDays className="w-4 h-4 mr-2" />
            Book Field
          </Button>
        </Link>
        <a href="tel:5551234567" className="flex-1">
          <Button variant="outline" className="w-full">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
        </a>
      </div>
    </div>
  );
}
