import beauty from "../../assets/react.svg";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useContext, useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "sonner";
import authService from "../../api/services/auth.service";
import { AxiosError } from "axios";
import { registerFormData, registerFormSchema } from "../../lib/validators";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { setIsLoading, setToken, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const form = useForm<registerFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      role: undefined,
      dermatologistId: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: registerFormData) => {
    try {
      setIsLoading(true);
      const data = await authService.register(values);

      if (data.success) {
        toast.success(data.message);

        // Check if registration requires approval
        if (data.requiresApproval) {
          navigate("/");
        } else {
          setToken(data.token);
          setUserData(data.user);
          if (data.user.role === "USER") {
            navigate("/user/dashboard");
          } else {
            navigate("/");
          }
        }
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message || "Error from server");
      } else if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.error("Internal server error");
      }
      console.log(error);
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
            src={beauty}
            alt="modal image"
            loading="lazy"
            decoding="async"
            className="object-contain object-center w-full h-full rounded-l-lg"
          />
        </div>

        {/*Right side*/}
        <div className="w-full px-6 py-10 md:py-6 md:w-1/2">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">
              Create an Account
            </h2>
            <p className="text-xs text-gray-600 md:text-sm">
              Join GlowGuide to get personalized skincare routines, expert
              advice, and track your progress effortlessly! ✨
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col w-full mt-4 space-y-4"
            >
              <div className="space-y-2">
                <div className="md:space-x-3 md:justify-between md:items-center md:flex max-sm:space-y-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="text"
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone No.</FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="number"
                              placeholder="Enter your phone Number"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="email"
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

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedRole(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem className="cursor-pointer" value="USER">
                              User
                            </SelectItem>
                            <SelectItem
                              className="cursor-pointer"
                              value="DERMATOLOGISTS"
                            >
                              Dermatologist
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedRole === "DERMATOLOGISTS" && (
                  <FormField
                    control={form.control}
                    name="dermatologistId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dermatologist License ID</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="text"
                            placeholder="Enter your medical license ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit">Create Account</Button>
            </form>
          </Form>
          <p className="mt-5 text-center">
            Already have an account?
            <Link to={"/login"}>
              <span className="text-blue-600 cursor-pointer"> Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
