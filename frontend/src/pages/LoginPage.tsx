import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/");
    return null;
  }

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (credentialResponse.credential) {
      try {
        await login(credentialResponse.credential);
        navigate("/");
      } catch {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full">
        {/* Login */}
        <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-0">
          <CardContent className="p-8 sm:p-10 flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-bold mb-6">Log In</h2>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Login Failed")}
              theme="outline"
              size="large"
              width="300"
            />
            <p className="text-sm text-gray-500 mt-4">Sign in with your Google account</p>
          </CardContent>
        </Card>

        {/* Register Info */}
        <Card className="bg-gradient-to-br from-green-100 to-cyan-100 border-0">
          <CardContent className="p-8 sm:p-10 flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-bold mb-6">Register</h2>
            <p className="text-gray-600 text-center mb-4">
              Click "Log In" with Google to automatically create your account.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>- Username & Email (from Google)</li>
              <li>- Phone (update in profile)</li>
              <li>- Address & Billing (update in profile)</li>
            </ul>
            <div className="mt-4 space-y-2 text-xs text-gray-400">
              <p>By registering, you agree to our terms</p>
              <p>Option to join WhatsApp group</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
