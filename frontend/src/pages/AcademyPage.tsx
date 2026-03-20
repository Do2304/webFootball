import { Card, CardContent } from "@/components/ui/card";
import { Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-3">Academy</h1>
      <p className="text-gray-500 text-center mb-10 lg:mb-12">Professional football training</p>

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
        <CardContent className="p-8 sm:p-12 lg:p-16 text-center space-y-6">
          <h2 className="text-2xl font-bold">Contact Academy</h2>
          <p className="text-gray-600">
            Get in touch with our coaching staff for training programs.
          </p>

          <div className="flex items-center justify-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-semibold">Training time: 7:00 PM - 8:00 PM</span>
          </div>

          <a href="tel:5551234567">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Phone className="w-4 h-4 mr-2" />
              Contact Academy
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
