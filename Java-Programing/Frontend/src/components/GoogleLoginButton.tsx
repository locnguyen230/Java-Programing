import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed");
      return;
    }

    console.log("[GoogleOAuth] credential =", credentialResponse.credential);

    setLoading(true);
    try {
      // Decode Google JWT to get user info
      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);
      
      // Send Google token to backend for verification and JWT generation

      const response = await authService.googleLogin({
        token: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture || null,
      });

      console.log("[GoogleOAuth] auth response =", response);

      // Support BOTH:
      // 1) Spring: { success: true, data: { accessToken, user } }
      // 2) Mock:  { user, accessToken, refreshToken }
      const accessToken =
        response?.accessToken ?? response?.data?.accessToken;

      const user =
        response?.user ?? response?.data?.user;

      if (!accessToken || !user) {
        throw new Error(
          `Unexpected auth response shape: ${JSON.stringify(response)}`
        );
      }

      // Set auth state with returned JWT and user info
      setAuth(user, accessToken);

      toast.success(`Welcome ${user.name}! 👋`);

      // Deterministic redirect (avoid depending on route state shape)
      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (user.role === "RECRUITER") {
        navigate("/recruiter/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      const message = err?.response?.data?.message;

      toast.error(
        message ||
          `Google login failed (status: ${status || "?"})` +
            (data ? `: ${JSON.stringify(data)}` : "")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed");
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-3 bg-white border border-gray-300 rounded-lg">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
        width="100%"
        text="signin_with"
        locale="en"
      />
    </div>
  );
}
