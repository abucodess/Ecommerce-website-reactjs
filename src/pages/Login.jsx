import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

function Login() {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  return (
    <div className="h-screen w-screen bg-black/50 flex justify-center items-center">
      <SignIn
        fallbackRedirectUrl={redirectUrl}
        signUpFallbackRedirectUrl={redirectUrl}
      />
    </div>
  );
}

export default Login;