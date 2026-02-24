import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Checkbox } from "../../components/ui/checkbox";

import { toast } from "sonner";
import {
  skinAssessmentSchema,
  SkinAssessmentFormValues,
} from "../../lib/validators";
import { SkinProfileData } from "../../lib/types";
import { Textarea } from "../../components/ui/textaera";
import skinProfileService from "../../api/services/skin.service";

export default function SkinAssessment() {
  const { setIsLoading, setSkinProfile, skinProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<SkinAssessmentFormValues>({
    resolver: zodResolver(skinAssessmentSchema),
    defaultValues: {
      skinType: skinProfile?.SkinType?.[0]?.type || undefined,
      concerns: skinProfile?.Concerns?.map((c) => c.concern) || [],
      allergies: skinProfile?.allergies || "",
      goals: skinProfile?.goals || "",
    },
  });

  const onSubmit = async (values: SkinAssessmentFormValues) => {
    try {
      setIsLoading(true);
      let response: SkinProfileData;

      const formattedValues = {
        ...values,
        goals: values.goals.split(",").map((goal) => goal.trim()).filter(Boolean),
      };

      if (skinProfile) {
        response = await skinProfileService.updateSkinProfile(formattedValues);
        toast.success("Skin profile updated successfully!");
      } else {
        response = await skinProfileService.createSkinProfile(formattedValues);
        toast.success("Skin assessment completed successfully!");
      }

      setSkinProfile(response);
      navigate("/user/dashboard");
    } catch (error: unknown) {
      console.error("Error saving skin profile:", error);
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to save your skin profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await form.trigger("skinType");
    } else if (step === 2) {
      isValid = await form.trigger("concerns");
    } else if (step === 3) {
      isValid = await form.trigger(["goals", "allergies"]);
    }

    if (isValid) {
      if (step === totalSteps) {
        await form.handleSubmit(onSubmit)();
      } else {
        setStep(step + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const skinTypeOptions = [
    { value: "DRY", label: "Dry", description: "Skin feels tight, flaky, or rough" },
    { value: "OILY", label: "Oily", description: "Skin looks shiny and feels greasy" },
    { value: "COMBINATION", label: "Combination", description: "Oily T-zone with normal or dry cheeks" },
    { value: "NORMAL", label: "Normal", description: "Neither too oily nor too dry" },
    { value: "SENSITIVE", label: "Sensitive", description: "Easily irritated, red, or itchy" },
  ];

  const skinConcernsOptions = [
    { id: "ACNE", label: "Acne" },
    { id: "AGING", label: "Aging/Fine Lines" },
    { id: "PIGMENTATION", label: "Pigmentation" },
    { id: "SENSITIVITY", label: "Sensitivity" },
    { id: "DRYNESS", label: "Dryness" },
    { id: "OILINESS", label: "Oiliness" },
    { id: "REDNESS", label: "Redness" },
    { id: "UNEVEN_TEXTURE", label: "Uneven Texture" },
  ] as const;

  return (
    <div className="container max-w-3xl px-4 py-10 mx-auto">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-transparent bg-linear-to-r from-pink-500 to-amber-500 bg-clip-text">
          {skinProfile ? "Update Skin Profile" : "Skin Assessment"}
        </h1>
        <p className="text-foreground/70">
          {skinProfile
            ? "Update your skin profile to keep your recommendations accurate"
            : "Help us understand your skin to provide personalized recommendations"}
        </p>

        <div className="flex items-center w-full max-w-md gap-2 mt-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index + 1 <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-foreground/70">
          Step {step} of {totalSteps}
        </p>
      </div>

      <Card className="border-muted">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle className="text-transparent md:text-3xl bg-linear-to-r from-pink-500 to-amber-500 bg-clip-text">
                    What's your skin type?
                  </CardTitle>
                  <CardDescription>
                    Choose the option that best describes your skin most of the time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="skinType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            {skinTypeOptions.map((option) => (
                              <div key={option.value} className="flex">
                                <FormItem className="flex items-center w-full space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.value} />
                                  </FormControl>
                                  <div className="flex-1 p-3 rounded-md hover:bg-muted">
                                    <FormLabel className="font-normal cursor-pointer">
                                      <div className="font-medium">{option.label}</div>
                                      <div className="text-sm text-foreground/70">{option.description}</div>
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="text-transparent md:text-3xl bg-linear-to-r from-pink-500 to-amber-500 bg-clip-text">
                    What are your skin concerns?
                  </CardTitle>
                  <CardDescription>Select all that apply to you</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="concerns"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {skinConcernsOptions.map((item) => (
                            <FormItem key={item.id} className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentConcerns = [...(field.value || [])];
                                    if (checked) {
                                      field.onChange([...currentConcerns, item.id]);
                                    } else {
                                      field.onChange(currentConcerns.filter((c) => c !== item.id));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle className="text-transparent md:text-3xl bg-linear-to-r from-pink-500 to-amber-500 bg-clip-text">
                    Tell us more about you
                  </CardTitle>
                  <CardDescription>Share any allergies and your skincare goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you have any allergies?</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., fragrance, nuts, latex" {...field} />
                        </FormControl>
                        <FormDescription>
                          List ingredients that cause reactions (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What are your skincare goals?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="E.g., reduce acne, improve hydration, minimize fine lines"
                            className="min-h-25"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tell us what you want to achieve with your skincare routine
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </>
            )}

            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handlePreviousStep}>
                  Previous
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => navigate("/user/dashboard")}>
                  Cancel
                </Button>
              )}
              <Button type="button" onClick={handleNextStep}>
                {step === totalSteps
                  ? skinProfile
                    ? "Update Profile"
                    : "Complete Assessment"
                  : "Next"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}