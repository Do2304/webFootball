import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Phone, Star, MapPin, Clock } from "lucide-react";
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
      <section className="relative overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full block">
          <source src="/videos/v1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-6 sm:px-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-5">
            Southwest Sports Complex
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl mb-1 sm:mb-2 text-gray-200">
            Premium 7v7 Artificial Turf Fields
          </p>

          <div className="flex flex-row gap-3 sm:gap-4">
            <Link to="/fields">
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-white text-sm sm:text-lg sm:px-8 sm:py-6"
              >
                <CalendarDays className="w-4 h-4 mr-1 sm:w-5 sm:h-5 sm:mr-2" />
                Book Now
              </Button>
            </Link>
            <a href="tel:5551234567">
              <Button
                size="sm"
                variant="outline"
                className="border-white bg-accent text-white hover:bg-white/10 text-sm sm:text-lg sm:px-8 sm:py-6"
              >
                <Phone className="w-4 h-4 mr-1 sm:w-5 sm:h-5 sm:mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900">
              <CardContent className="p-6 sm:p-8">
                <span className="inline-block bg-black/10 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Limited Time
                </span>
                <h3 className="text-2xl font-bold mb-2">First Booking 20% Off</h3>
                <p className="text-gray-800/80 mb-4">
                  New customers get 20% off their first field booking. Use code FIRST20 at checkout.
                </p>
                <Link to="/fields">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold">
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900">
              <CardContent className="p-6 sm:p-8">
                <span className="inline-block bg-black/10 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Weekly Deal
                </span>
                <h3 className="text-2xl font-bold mb-2">Weekday Morning Special</h3>
                <p className="text-gray-800/80 mb-4">
                  Book any field Mon-Fri before 10 AM and pay only $30/hour. Perfect for morning training sessions.
                </p>
                <Link to="/fields">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold">
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900">
              <CardContent className="p-6 sm:p-8">
                <span className="inline-block bg-black/10 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Group Offer
                </span>
                <h3 className="text-2xl font-bold mb-2">Team Package</h3>
                <p className="text-gray-800/80 mb-4">
                  Book 10 sessions and get 2 free. Ideal for teams with regular training schedules.
                </p>
                <Link to="/fields">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900">
              <CardContent className="p-6 sm:p-8">
                <span className="inline-block bg-black/10 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Membership
                </span>
                <h3 className="text-2xl font-bold mb-2">Monthly Pass</h3>
                <p className="text-gray-800/80 mb-4">
                  Unlimited access for $299/month. Play anytime, any field. Cancel anytime.
                </p>
                <Link to="/fields">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Slides Section - Field Photos */}
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
                image: "/images/i1.jpg",
              },
              {
                title: "LED Lighting",
                desc: "Professional-grade lighting for night matches",
                image: "/images/i2.jpg",
              },
              {
                title: "Modern Facilities",
                desc: "Locker rooms, parking, and spectator areas",
                image: "/images/i3.jpg",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="relative text-white border-0 overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <CardContent className="relative z-10 p-6 sm:p-8 h-52 flex flex-col justify-end">
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
              <div key={i} className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={`/images/i${i}.jpg`}
                  alt={`Field Photo ${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
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
