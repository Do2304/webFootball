import { Card, CardContent } from "@/components/ui/card";

export default function LeaguesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-3">Leagues</h1>
      <p className="text-gray-500 text-center mb-10 lg:mb-12">Join our competitive leagues</p>

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
        <CardContent className="p-8 sm:p-12 lg:p-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            We are organizing exciting 7v7 leagues. Stay tuned for more information!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
