import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Search, Sparkles, ArrowUpDown, DollarSign } from "lucide-react";
import { ProductData } from "../../lib/types";

import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../components/ui/select";

import { Badge } from "../../components/ui/badge";
import { ExternalLink } from "lucide-react";
import productService from "../../api/services/product.service";

// Skin types
const skinTypes = [
  { value: "DRY", label: "Dry" },
  { value: "OILY", label: "Oily" },
  { value: "COMBINATION", label: "Combination" },
  { value: "NORMAL", label: "Normal" },
  { value: "SENSITIVE", label: "Sensitive" },
];

// Skin concerns
const skinConcerns = [
  { id: "ACNE", label: "Acne" },
  { id: "AGING", label: "Aging/Fine Lines" },
  { id: "PIGMENTATION", label: "Pigmentation" },
  { id: "SENSITIVITY", label: "Sensitivity" },
  { id: "DRYNESS", label: "Dryness" },
  { id: "OILINESS", label: "Oiliness" },
  { id: "REDNESS", label: "Redness" },
  { id: "UNEVEN_TEXTURE", label: "Uneven Texture" },
];

export default function ProductExplorer() {
  const { setIsLoading } = useContext(AppContext);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState<string>("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [minSustainability, setMinSustainability] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setIsLocalLoading(true);

        const params: {
          skinType?: string;
          concerns?: string[];
        } = {};

        if (selectedSkinType) {
          params.skinType = selectedSkinType;
        }

        if (selectedConcerns.length > 0) {
          params.concerns = selectedConcerns;
        }

        const data = await productService.getProducts(params);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
        setIsLocalLoading(false);
      }
    };
    fetchProducts();
  }, [selectedSkinType, selectedConcerns, setIsLoading]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sustainability filter
    if (minSustainability > 0) {
      result = result.filter(
        (product) => product.sustainabilityScore >= minSustainability
      );
    }

    // Apply sorting
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "sustainability") {
      result = result.sort(
        (a, b) => b.sustainabilityScore - a.sustainabilityScore
      );
    }

    setFilteredProducts(result);
  }, [products, searchTerm, minSustainability, sortBy]);

  // Toggle concern selection
  const toggleConcern = (concernId: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concernId)
        ? prev.filter((id) => id !== concernId)
        : [...prev, concernId]
    );
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
            Product Explorer
          </h1>
          <p className="text-foreground/70">
            Discover products tailored to your skin needs
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-foreground/50" />
          <Input
            type="search"
            placeholder="Search products, brands, or ingredients..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort By</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="sustainability">Sustainability</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedSkinType ||
        selectedConcerns.length > 0 ||
        minSustainability > 0) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedSkinType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {skinTypes.find((t) => t.value === selectedSkinType)?.label}
              <button onClick={() => setSelectedSkinType("")}>×</button>
            </Badge>
          )}

          {selectedConcerns.map((concernId) => (
            <Badge
              key={concernId}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {skinConcerns.find((c) => c.id === concernId)?.label}
              <button onClick={() => toggleConcern(concernId)}>×</button>
            </Badge>
          ))}

          {minSustainability > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sustainability: {minSustainability}+
              <button onClick={() => setMinSustainability(0)}>×</button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-xs h-7"
            onClick={() => {
              setSelectedSkinType("");
              setSelectedConcerns([]);
              setMinSustainability(0);
            }}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Products Grid */}
      {isLocalLoading ? (
        <div className="flex items-center justify-center py-12">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="w-12 h-12 mb-4 text-foreground/30" />
          <h3 className="mb-2 text-xl font-semibold">No Products Found</h3>
          <p className="max-w-md text-foreground/70">
            We couldn't find any products matching your criteria. Try adjusting
            your filters or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`overflow-hidden transition-all hover:shadow-md ${
                product.externalUrl ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (product.externalUrl) {
                  window.open(
                    product.externalUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
            >
              <div className="relative aspect-square bg-muted group">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-muted">
                    <Sparkles className="w-12 h-12 text-foreground/20" />
                  </div>
                )}
                {product.externalUrl && (
                  <div className="absolute transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100">
                    <div className="p-1 rounded-full bg-white/90">
                      <ExternalLink className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-sm font-semibold text-foreground/60">
                      {product.brand}
                    </p>
                  </div>
                  <Badge className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4" /> {product.price}
                  </Badge>
                </div>
                <p className="mb-3 text-sm line-clamp-2">
                  {product.description}
                </p>
                {product.externalUrl && (
                  <p className="flex items-center gap-1 text-xs text-primary">
                    <ExternalLink className="w-3 h-3" />
                    Click to view product details
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}