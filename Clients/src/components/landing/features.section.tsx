import { Sparkles, Shield, Clock, Users } from "lucide-react";
import FeatureCard from "./feature.card";

const features = [
  {
    icon: <Sparkles className="w-10 h-10 text-pink-500" />,
    title: "AI-Powered Analysis",
    description:
      "Get personalized skincare recommendations based on your unique skin profile",
  },
  {
    icon: <Shield className="w-10 h-10 text-amber-500" />,
    title: "Expert Guidance",
    description: "Access professional advice from certified dermatologists",
  },
  {
    icon: <Clock className="w-10 h-10 text-pink-400" />,
    title: "Progress Tracking",
    description:
      "Monitor your skin's improvement over time with detailed analytics",
  },
  {
    icon: <Users className="w-10 h-10 text-amber-400" />,
    title: "Community Support",
    description: "Connect with others on their skincare journey",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-transparent sm:text-5xl bg-linear-to-r from-pink-500 via-pink-400 to-amber-500 bg-clip-text">
              Features
            </h2>
            <p className="max-w-225 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Everything you need to achieve your best skin ever
            </p>

          </div>
        </div>

        <div className="grid items-center gap-6 py-12 mx-auto max-w-5xl lg:grid-cols-2 lg:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

      </div>
    </section>
  );
}