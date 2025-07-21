import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import axiosInstance from '../axios/axiosInstance'

export default function OtpVerifyWithInputOtp() {
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [otp, setOtp] = useState('')
  const navigate = useNavigate();
  const [apiCalled,setApiCalled] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6 || !email) {
      toast.error("Fill All Details")
      return
    }
     setApiCalled(true);

    try{
const response = await axiosInstance.post('/user/verify-otp',{
    email:email,
    Otp:otp
});

if(response.data.success){
    toast.success(`OTP Verified for ${email}`);
    localStorage.removeItem('email');
    navigate('/login');
}
    }catch(error){
console.error(error);
toast.error(error.response?.data?.message || "Verification failed!");
setApiCalled(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-foreground dark:text-gray-100 px-4 transition-colors">
      <Card className="w-full max-w-sm rounded-2xl shadow-2xl border-none bg-white dark:bg-gray-900 transition-colors">
        <CardContent className="py-8 px-7 flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Verify OTP</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter the code sent to your email</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700
                  text-base placeholder:text-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-400 dark:focus:ring-blue-900
                  transition-colors
                "
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="otp" className="text-gray-700 dark:text-gray-200 font-semibold">OTP</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  className="gap-3"
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="
                          w-14 h-14 text-2xl text-center
                          bg-gray-100 dark:bg-gray-800
                          border border-gray-300 dark:border-gray-600
                          rounded-xl
                          text-gray-900 dark:text-gray-100
                          focus:border-blue-500 dark:focus:border-blue-400
                          focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900
                          outline-none transition-all duration-150
                        "
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <Button
              type="submit"
              className="
                mt-2 w-full h-12 text-base font-semibold rounded-xl
                bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400
                text-white
                shadow-md transition
              "
               disabled={apiCalled}
            >
              Verify OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
