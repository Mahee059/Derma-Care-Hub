import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { ProductData } from "../../lib/types";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

import { ProductFormValues } from "../../lib/validators";
import { ProductForm } from "../../components/admin/product.form";
import { ProductCard } from "../../components/admin/product.card";
import productService from "../../api/services/product.service";

export default function ManageProducts() {
  const { setIsLoading } = useContext(AppContext);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(
    null
  );

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Now safe to include

  const handleProductSubmit = async (
    values: ProductFormValues & { image?: File }
  ) => {
    try {
      setIsLoading(true);
      if (editingProduct) {
        const updatedProduct = await productService.updateProduct(
          editingProduct.id,
          values
        );
        // Update the product in state directly instead of re-fetching
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
        toast.success("Product updated successfully");
      } else {
        const newProduct = await productService.createProduct(values);
        // Add the new product to state directly instead of re-fetching
        setProducts([...products, newProduct]);
        toast.success("Product created successfully");
      }
      setIsProductDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      await productService.deleteProduct(id);
      // Update the state directly instead of re-fetching
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container min-h-screen px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          {/* Fixed line 106: updated to bg-linear-to-r */}
          <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-linear-to-r from-pink-500 to-amber-500 bg-clip-text">
            Manage Products
          </h1>
          <p className="text-foreground/70">
            Add, edit, or remove skincare products
          </p>
        </div>
        <Dialog
          open={isProductDialogOpen}
          onOpenChange={setIsProductDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update product details"
                  : "Add a new product to the catalog"}
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={handleProductSubmit}
              editingProduct={editingProduct}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-foreground/50" />
        <Input
          className="pl-10"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product: ProductData) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsProductDialogOpen(true);
              }}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}