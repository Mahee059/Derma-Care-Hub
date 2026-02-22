import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Sparkles, Droplets, Shield, Sun } from "lucide-react";

export default function SkinCare101() {
  return (
    <div className="container px-4 py-12 mx-auto">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-transparent md:text-5xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
          Skincare 101
        </h1>
        <p className="text-lg text-foreground/70">
          Your comprehensive guide to understanding skincare basics,
          ingredients, and building an effective routine.
        </p>
      </div>

      <Tabs defaultValue="basics" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="routines">Routines</TabsTrigger>
          <TabsTrigger value="concerns">Concerns</TabsTrigger>
        </TabsList>

        {/* Skincare Basics */}
        <TabsContent value="basics">
          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  Understanding Your Skin Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Dry Skin</h3>
                  <p className="text-foreground/70">
                    Feels tight, may have flaky patches. Focus on hydration and
                    moisture-locking ingredients.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Oily Skin</h3>
                  <p className="text-foreground/70">
                    Excess sebum production, prone to shine. Look for
                    non-comedogenic and mattifying products.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Combination Skin</h3>
                  <p className="text-foreground/70">
                    Oily T-zone with normal/dry cheeks. Requires balanced care
                    for different areas.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Sensitive Skin</h3>
                  <p className="text-foreground/70">
                    Easily irritated, may react to products. Choose gentle,
                    fragrance-free formulations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ingredients Guide */}
        <TabsContent value="ingredients">
          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Essential Ingredients
                </CardTitle>
                <CardDescription>
                  Key ingredients for healthy skin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Hyaluronic Acid</h3>
                  <p className="text-foreground/70">
                    Hydrating ingredient that can hold up to 1000x its weight in
                    water.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Vitamin C</h3>
                  <p className="text-foreground/70">
                    Antioxidant that brightens skin and fights free radical
                    damage.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Retinol</h3>
                  <p className="text-foreground/70">
                    Vitamin A derivative that promotes cell turnover and
                    collagen production.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Niacinamide</h3>
                  <p className="text-foreground/70">
                    Vitamin B3 that helps with oil control and strengthening
                    skin barrier.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skincare Routines */}
        <TabsContent value="routines">
          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  Building Your Routine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold">Morning Routine</h3>
                  <ol className="ml-4 space-y-2 list-decimal text-foreground/70">
                    <li>Gentle cleanser</li>
                    <li>Toner (optional)</li>
                    <li>Vitamin C serum</li>
                    <li>Moisturizer</li>
                    <li>Sunscreen (SPF 30 or higher)</li>
                  </ol>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Evening Routine</h3>
                  <ol className="ml-4 space-y-2 list-decimal text-foreground/70">
                    <li>Double cleanse (oil-based + water-based)</li>
                    <li>Toner</li>
                    <li>Treatment serums</li>
                    <li>Retinol (2-3 times per week)</li>
                    <li>Night cream</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Common Concerns */}
        <TabsContent value="concerns">
          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Addressing Common Concerns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Acne</h3>
                  <p className="text-foreground/70">
                    Look for ingredients like salicylic acid, benzoyl peroxide,
                    and niacinamide.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Aging</h3>
                  <p className="text-foreground/70">
                    Focus on retinoids, peptides, and antioxidants for fine
                    lines and wrinkles.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Hyperpigmentation</h3>
                  <p className="text-foreground/70">
                    Use vitamin C, kojic acid, and alpha arbutin for dark spots
                    and uneven tone.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Sensitivity</h3>
                  <p className="text-foreground/70">
                    Choose gentle, fragrance-free products with soothing
                    ingredients like centella asiatica.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
