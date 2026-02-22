import makeup from "../../assets/react.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "sonner";

import { loginFormData, loginFormSchema } from "../../lib/validators";
import authService from "../../api/services/auth.service";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setIsLoading, setUserData, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const form = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: loginFormData) => {
    try {
      setIsLoading(true);
      const data = await authService.login({
        email: values.email,
        password: values.password,
      });

      if (data.success) {
        setToken(data.token);
        setUserData(data.user);
        toast.success(data.message);
        console.log(data.user);

        switch (data.user.role) {
          case "USER":
            navigate("/userDashboard");
            break;
          case "DERMATOLOGISTS":
            navigate("/dermatologist/dashboard");
            break;
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while logging in"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="flex items-center w-full max-w-sm mx-4 bg-gray-300 border rounded-lg shadow-md md:max-w-screen-lg">
        {/*Left side*/}
        <div className="w-1/2 max-md:hidden">
          <img
            src={makeup}
            alt="makeup image"
            loading="lazy"
            decoding="async"
            className="object-contain object-center w-full h-full rounded-l-lg"
          />
        </div>

        {/*Right side*/}
        <div className="w-full px-6 py-10 md:w-1/2">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">
              Login to GlowGuide
            </h2>
            <p className="text-gray-600 text-md">
              Sign in to access your personalized skincare routine and expert
              advice. ✨
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col w-full mt-4 space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your Password"
                          {...field}
                        />
                        {showPassword ? (
                          <EyeIcon
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute w-5 h-5 text-gray-700 cursor-pointer top-1/4 right-3"
                          />
                        ) : (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute w-5 h-5 text-gray-700 cursor-pointer top-1/4 right-3"
                          />
                        )}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="mt-4 text-sm text-blue-600 cursor-pointer">
                Forgot Password?
              </p>
              <Button type="submit">Login</Button>
            </form>
          </Form>
          <p className="mt-5 text-center">
            Don't have an account?
            <Link to={"/register"}>
              <span className="text-blue-600 cursor-pointer"> Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
