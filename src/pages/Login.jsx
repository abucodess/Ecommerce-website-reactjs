import { SignIn } from "@clerk/clerk-react";


function Login() {
  return  <div className="h-screen w-screen bg-black/50 flex justify-center items-center">
    <SignIn />

  </div>;
}

export default Login;