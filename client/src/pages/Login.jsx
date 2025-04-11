import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
     const res = await axios.post("http://localhost:3000/api/v1/user/login", {
        email,
        password
      }, {
        withCredentials: true
      });
      toast.success("✅ Logged in successfully!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Login failed! Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
        <CardContent className="space-y-4 mt-2">
          <h2 className="text-3xl font-bold text-center mb-4">Login</h2>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>

          <p onClick={() => { navigate('/signup') }} className="text-center text-sm text-muted-foreground">
  Account nahi hai? <span className="text-primary font-medium cursor-pointer">Bana lo yaar 😄</span>
</p>

        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
