import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Field Rental", path: "/fields" },
  { label: "Leagues", path: "/leagues" },
  { label: "Pick Up Game", path: "/pickup" },
  { label: "Academy", path: "/academy" },
  { label: "About Us", path: "/about" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutDialog(false);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo1.jpeg" alt="SW Sports Complex" className="w-10 h-10 rounded-full object-cover" />
          <span className="font-bold text-lg text-secondary hidden sm:block">
            SW Sports Complex
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/my-bookings">
                <Button variant="outline" size="sm">
                  My Bookings
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || ""}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowLogoutDialog(true)}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:block">
              <Button className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:from-teal-500 hover:to-yellow-400">
                Log in / Register
              </Button>
            </Link>
          )}

          <Link to="/fields" className="hidden lg:block">
            <Button className="bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:from-teal-500 hover:to-yellow-400">
              Book Now
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 hover:bg-gray-100">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t my-2" />
                {user ? (
                  <>
                    <div className="px-4 py-2 flex items-center gap-2">
                      {user.avatar && (
                        <img
                          src={user.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={() => setShowLogoutDialog(true)}
                      className="px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:from-teal-500 hover:to-yellow-400">
                      Log in / Register
                    </Button>
                  </Link>
                )}
                <Link to="/fields" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:from-teal-500 hover:to-yellow-400 mt-2">
                    Book Now
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg">Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You'll need to sign in again to book fields or view your bookings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="sm:order-2"
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
