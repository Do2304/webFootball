import { useState } from "react";
import { Send, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/api/client";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    howDidYouHear: "",
    agreedTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/contact", formData);
      setSubmitted(true);
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">About Us</h1>
      <p className="text-gray-500 text-center mb-10">Get in touch with us</p>

      {submitted ? (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
            <p className="text-gray-500">
              Please allow 1-2 business days for our reply.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-center mb-2">Contact Us</h2>
            <p className="text-gray-500 text-center mb-6">
              Please fill out the form below so we can arrange a party or event for you.
              <br />
              Please allow 1-2 business days for our reply.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                <Input
                  id="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={(e) => handleChange("howDidYouHear", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreedTerms}
                  onChange={(e) => handleChange("agreedTerms", e.target.checked)}
                  className="rounded"
                  required
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                  I agree to the terms and conditions *
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </form>

            <div className="flex justify-center gap-6 mt-8">
              <a
                href="mailto:info@southwestsports.com"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400 text-gray-800 text-sm font-medium hover:opacity-90"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href="tel:5551234567"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-yellow-300 text-gray-800 text-sm font-medium hover:opacity-90"
              >
                <Phone className="w-4 h-4" />
                Phone Number
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
