import { Card, CardContent } from "@/components/ui/card";

export default function PickupPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Pick Up Game</h1>
      <p className="text-gray-500 text-center mb-10">Join a game near you</p>

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
        <CardContent className="p-8">
          <ol className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                1
              </span>
              <div>
                <h3 className="font-bold">Plei App</h3>
                <p className="text-gray-600 text-sm">
                  Download the Plei app to find and join pick up games in your area.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                2
              </span>
              <div>
                <h3 className="font-bold">WhatsApp Group</h3>
                <p className="text-gray-600 text-sm">
                  Join our WhatsApp group when you register or book a field to stay updated on pick up games.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
