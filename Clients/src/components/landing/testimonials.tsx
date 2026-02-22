import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "GlowGuide transformed my skincare routine. The personalized recommendations were spot on, and my skin has never looked better!",
    author: {
      name: "Sarah Johnson",
      role: "Beauty Enthusiast",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120",
    },
  },
  {
    quote:
      "As a dermatologist, I'm impressed by the accuracy of GlowGuide's recommendations. It's like having a skin expert in your pocket.",
    author: {
      name: "Dr. Michael Chen",
      role: "Dermatologist",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120",
    },
  },
  {
    quote:
      "My acne-prone skin was a challenge until I found GlowGuide. The routine they created for me cleared my skin in just 8 weeks!",
    author: {
      name: "Jamie Rodriguez",
      role: "Content Creator",
      avatar:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=120",
    },
  },
  {
    quote:
      "I love that GlowGuide recommends sustainable products. My skin looks great and I feel good about my environmental impact too.",
    author: {
      name: "Alex Thompson",
      role: "Environmental Activist",
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120",
    },
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-transparent sm:text-4xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
            Loved by Skin Enthusiasts
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from our satisfied users who have transformed their skin with
            GlowGuide.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="h-full transition-shadow bg-background border-border hover:shadow-md"
            >
              <CardHeader className="pt-6 pb-0">
                <Quote className="w-8 h-8 mb-2 text-pink-400/50" />
              </CardHeader>
              <CardContent className="pt-2">
                <p className="mb-6 text-lg italic">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.author.avatar}
                      alt={testimonial.author.name}
                    />
                    <AvatarFallback>
                      {testimonial.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {testimonial.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.author.role}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
