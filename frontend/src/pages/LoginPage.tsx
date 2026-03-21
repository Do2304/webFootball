import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import api from "@/api/client";

export default function LoginPage() {
  const { login, loginWithToken, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Register form
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (user) {
    navigate("/");
    return null;
  }

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    if (credentialResponse.credential) {
      try {
        await login(credentialResponse.credential);
        navigate("/");
      } catch {
        setError("Google login failed. Please try again.");
      }
    }
  };

  const handleEmailLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });

      if (res.data.token) {
        await loginWithToken(res.data.token);
        navigate("/");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-teal-50 via-white to-yellow-50">
      <div className="w-full max-w-4xl">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 sm:p-10">
              {isLogin ? (
                // Login Form
                <form onSubmit={handleEmailLogin} className="space-y-5">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-semibold mb-2 block"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      className="text-gray-700 font-semibold mb-2 block"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold py-2.5"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              ) : (
                // Register Form
                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-gray-700 font-semibold mb-2 block"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="reg-email"
                      className="text-gray-700 font-semibold mb-2 block"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="reg-password"
                      className="text-gray-700 font-semibold mb-2 block"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="confirm-password"
                      className="text-gray-700 font-semibold mb-2 block"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pl-10 pr-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-400 to-yellow-300 text-gray-900 hover:opacity-90 font-semibold py-2.5"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              )}

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Login */}
              <div className="mb-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google login failed")}
                  theme="outline"
                  size="large"
                />
              </div>

              {/* Toggle */}
              <p className="text-center text-gray-600 text-sm">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setLoginData({ email: "", password: "" });
                    setRegisterData({
                      name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                    });
                  }}
                  className="font-semibold text-teal-600 hover:text-teal-700"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </CardContent>
          </Card>

          {/* Right side - Info */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-3">Why Book With Us?</h3>
                <p className="text-gray-600">
                  Experience premium 7v7 artificial turf fields with
                  professional lighting and world-class facilities.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Easy Booking",
                    desc: "Reserve your field in just 30 seconds",
                  },
                  {
                    title: "Premium Fields",
                    desc: "FIFA-quality artificial turf with LED lighting",
                  },
                  {
                    title: "Flexible Pricing",
                    desc: "Choose from various time slots and packages",
                  },
                  {
                    title: "Great Location",
                    desc: "Easy access with ample parking available",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-yellow-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-900 font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
