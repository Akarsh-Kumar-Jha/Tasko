import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import axiosInstance from "../axios/axiosInstance";


function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [apiCalled,setApiCalled] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async () => {
    setApiCalled(true);
    const { name, email, password, confirmPassword } = formData;
  //http://localhost:3000/api/v1/user/register

    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all details!");
    }

    try {
      const res = await axiosInstance.post(`/user/register`, {
        name,
        email,
        password,
        confirmPassword
      });

      console.log("Signup Res From Backend :- ",res);

      if (res.data.success) {
        toast.success("OTP Sent! 🎉");
        localStorage.setItem("email",email);
        navigate("/verify-email");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed!");
      setApiCalled(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e2f] text-foreground">
      <Card className="w-full max-w-4xl p-6 shadow-xl rounded-3xl flex flex-row justify-between items-center bg-[#2b2b3d] gap-x-2">
        <div className="w-1/2 rounded-2xl overflow-hidden hidden md:block">
<div className="h-[100%]">
  <img className="h-full w-full object-cover" src="https://res.cloudinary.com/dyphwsac9/image/upload/v1752524301/ChatGPT_Image_Jul_15_2025_01_48_13_AM_icrs3i.png" alt="" />
</div>
        </div>
        <CardContent className="w-full md:w-1/2 space-y-4 mt-2 h-full">
          <h2 className="text-3xl font-bold text-center mb-4">Create an account</h2>

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
           disabled={apiCalled}
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
