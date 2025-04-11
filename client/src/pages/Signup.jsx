import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all details!");
    }

    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/register", {
        name,
        email,
        password,
        confirmPassword
      });

      console.log("Signup Res From Backend :- ",res);

      if (res.data.success) {
        toast.success("Signup successful! 🎉");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
        <CardContent className="space-y-4 mt-2">
          <h2 className="text-3xl font-bold text-center mb-4">Signup</h2>

          <Input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button
            onClick={handleSignup}
            className="w-full"
          >
            Create Account
          </Button>

          <Button
  onClick={() => navigate('/login')}
  variant="outline"
  className="w-full text-sm font-medium text-primary border-dashed hover:bg-muted transition-all"
>
  👋 Already have an account? Log In
</Button>

        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
