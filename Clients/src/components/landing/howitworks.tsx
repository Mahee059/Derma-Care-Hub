import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-transparent sm:text-4xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
            Your Journey to Glowing Skin
          </h2>
          <p className="text-lg text-muted-foreground">
            Follow these simple steps to get started with your personalized
            beauty routine.
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-12">
            <TabsTrigger value="analyze">1. Analyze</TabsTrigger>
            <TabsTrigger value="recommend">2. Recommend</TabsTrigger>
            <TabsTrigger value="customize">3. Customize</TabsTrigger>
            <TabsTrigger value="track">4. Track</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="mt-0">
            <div className="flex flex-col items-center gap-12 md:flex-row">
              <div className="flex-1 order-2 space-y-6 md:order-1">
                <h3 className="text-2xl font-bold">
                  Complete Your Skin Analysis
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Expert Questionnaire</h4>
                    <p className="text-muted-foreground">
                      Answer questions about your skin type, concerns,
                      allergies, and beauty goals to create your unique profile.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Upload Your Selfie</h4>
                    <p className="text-muted-foreground">
                      Optionally upload a selfie for AI analysis to detect
                      concerns like dryness, texture, or pigmentation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Product Assessment</h4>
                    <p className="text-muted-foreground">
                      Tell us what products you're currently using so we can
                      understand your preferences and routine.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="relative overflow-hidden bg-muted rounded-xl">
                  <img
                    src="https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Skin analysis"
                    className="object-cover w-full h-full aspect-video md:aspect-square"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommend" className="mt-0">
            <div className="flex flex-col items-center gap-12 md:flex-row">
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl font-bold">
                  Get Personalized Recommendations
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">AI-Powered Matching</h4>
                    <p className="text-muted-foreground">
                      Our advanced algorithms analyze your skin profile and
                      match you with ideal products and ingredients.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Ingredient Analysis</h4>
                    <p className="text-muted-foreground">
                      Learn which ingredients will benefit your skin and which
                      ones to avoid based on your unique needs.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Product Suggestions</h4>
                    <p className="text-muted-foreground">
                      Receive a curated list of recommended products across
                      various price points that suit your skin.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative overflow-hidden bg-muted rounded-xl">
                  <img
                    src="https://images.pexels.com/photos/6476071/pexels-photo-6476071.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Product recommendations"
                    className="object-cover w-full h-full aspect-video md:aspect-square"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="mt-0">
            <div className="flex flex-col items-center gap-12 md:flex-row">
              <div className="flex-1 order-2 space-y-6 md:order-1">
                <h3 className="text-2xl font-bold">Customize Your Routine</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Morning & Evening Routines</h4>
                    <p className="text-muted-foreground">
                      Build separate routines for morning and evening with
                      step-by-step guidance on product application.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Add Your Own Products</h4>
                    <p className="text-muted-foreground">
                      Include products you already own and love in your
                      personalized routine.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Special Treatment Days</h4>
                    <p className="text-muted-foreground">
                      Create special routines for treatment days with masks,
                      exfoliants, and other intensive care products.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="relative overflow-hidden bg-muted rounded-xl">
                  <img
                    src="https://images.pexels.com/photos/6476588/pexels-photo-6476588.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Customizing skincare routine"
                    className="object-cover w-full h-full aspect-video md:aspect-square"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="track" className="mt-0">
            <div className="flex flex-col items-center gap-12 md:flex-row">
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl font-bold">Track Your Progress</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Visual Timeline</h4>
                    <p className="text-muted-foreground">
                      Document your skin's transformation with photos and see
                      how it improves over time.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Satisfaction Tracking</h4>
                    <p className="text-muted-foreground">
                      Rate products and track how your skin responds to
                      different ingredients and routines.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Routine Adjustments</h4>
                    <p className="text-muted-foreground">
                      Receive suggestions to tweak your routine based on
                      seasonal changes, lifestyle, and ongoing results.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative overflow-hidden bg-muted rounded-xl">
                  <img
                    src="https://images.pexels.com/photos/7479817/pexels-photo-7479817.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Progress tracking"
                    className="object-cover w-full h-full aspect-video md:aspect-square"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
