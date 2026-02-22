import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 overflow-hidden md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
                Your Personal Guide to Radiant Skin
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover your perfect skincare routine with AI-powered
                recommendations and expert guidance.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="bg-pink-500 hover:bg-pink-600"
              >
                Start Your Journey <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => navigate("/skincare-101")}
                variant="outline"
                size="lg"
                className="border-pink-200 hover:bg-pink-50"
              >
                Learn More
              </Button>
            </div>
          </div>
          <img
            alt="Hero"
            className="object-cover object-center mx-auto overflow-hidden aspect-video rounded-xl sm:w-full lg:aspect-square"
            src="https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&auto=format&fit=crop&q=60"
          />
        </div>
      </div>
    </section>
  );
}
