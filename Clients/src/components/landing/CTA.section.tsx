import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
              Ready to Transform Your Skin?
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Join thousands of others who have discovered their perfect
              skincare routine
            </p>
          </div>
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="inline-flex items-center"
          >
            Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
