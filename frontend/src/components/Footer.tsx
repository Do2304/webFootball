import { Link } from "react-router-dom";
import { MapPin, Clock, FileText, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray-300">
      {/* Footer Links Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Location", icon: MapPin, path: "/#location" },
              { label: "Hours", icon: Clock, path: "/#hours" },
              { label: "Waiver", icon: FileText, path: "/waiver" },
              { label: "Terms and Conditions", icon: FileText, path: "/terms" },
              { label: "Contact Us", icon: Phone, path: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-yellow-300 text-gray-800 text-sm font-medium hover:opacity-90 transition"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <span className="font-bold text-lg text-white">
                Southwest Sports
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Premium 7v7 artificial turf fields with professional lighting and
              facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Book Field", "Pricing", "Gallery"].map((link) => (
                <li key={link}>
                  <Link
                    to={
                      link === "Home"
                        ? "/"
                        : `/${link.toLowerCase().replace(" ", "-")}`
                    }
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                info@southwestsports.com
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                123 Sports Complex Dr, City
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hours</h3>
            <ul className="space-y-2 text-sm">
              <li>Mon-Fri: 6:00 AM - 11:00 PM</li>
              <li>Sat-Sun: 7:00 AM - 11:00 PM</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
                aria-label="Instagram"
              >
                i
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
                aria-label="WhatsApp"
              >
                w
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Southwest Sports Complex. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
