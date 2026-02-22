import { Card, CardContent } from "../components/ui/card";
import { Users, Heart, Shield, Sparkles } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="container px-4 py-12 mx-auto">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-transparent md:text-5xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
          Our Mission
        </h1>
        <p className="text-lg text-foreground/70">
          At GlowGuide, we're revolutionizing skincare through personalization,
          expertise, and technology. Our mission is to help everyone achieve
          their healthiest skin with science-backed solutions and expert
          guidance.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid gap-8 mb-16 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Users className="w-12 h-12 mb-4 text-pink-500" />
            <h3 className="mb-2 text-xl font-semibold">Personalization</h3>
            <p className="text-foreground/70">
              Tailored skincare solutions based on your unique skin profile and
              needs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Shield className="w-12 h-12 mb-4 text-amber-500" />
            <h3 className="mb-2 text-xl font-semibold">Expert Guidance</h3>
            <p className="text-foreground/70">
              Access to certified dermatologists and skincare professionals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Sparkles className="w-12 h-12 mb-4 text-pink-400" />
            <h3 className="mb-2 text-xl font-semibold">Innovation</h3>
            <p className="text-foreground/70">
              AI-powered recommendations and cutting-edge skincare technology
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Heart className="w-12 h-12 mb-4 text-amber-400" />
            <h3 className="mb-2 text-xl font-semibold">Community</h3>
            <p className="text-foreground/70">
              A supportive environment for sharing experiences and knowledge
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
          Our Team
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <img
              src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Dr. Sarah Chen"
              className="object-cover w-40 h-40 mx-auto mb-4 rounded-full"
            />
            <h3 className="mb-1 text-lg font-semibold">Dr. Sarah Chen</h3>
            <p className="text-sm text-foreground/70">Chief Dermatologist</p>
          </div>

          <div className="text-center">
            <img
              src="https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Dr. Michael Rodriguez"
              className="object-cover w-40 h-40 mx-auto mb-4 rounded-full"
            />
            <h3 className="mb-1 text-lg font-semibold">
              Dr. Michael Rodriguez
            </h3>
            <p className="text-sm text-foreground/70">Research Director</p>
          </div>

          <div className="text-center">
            <img
              src="https://images.pexels.com/photos/5723967/pexels-photo-5723967.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Emma Thompson"
              className="object-cover w-40 h-40 mx-auto mb-4 rounded-full"
            />
            <h3 className="mb-1 text-lg font-semibold">Emma Thompson</h3>
            <p className="text-sm text-foreground/70">Product Specialist</p>
          </div>
        </div>
      </div>
    </div>
  );
}
