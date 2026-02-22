import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ProductData } from "../../lib/types";
import { DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textaera";
import { ProductFormValues, productSchema } from "../../lib/validators";

interface ProductFormProps {
  onSubmit: (values: ProductFormValues & { image?: File }) => Promise<void>;
  editingProduct: ProductData | null;
}

export function ProductForm({ onSubmit, editingProduct }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: editingProduct
      ? {
          name: editingProduct.name,
          brand: editingProduct.brand,
          description: editingProduct.description,
          ingredients: editingProduct.ingredients,
          sustainabilityScore: editingProduct.sustainabilityScore,
          allergens: editingProduct.allergens || undefined,
          skinTypes: editingProduct.suitableSkinTypes,
          concerns: editingProduct.targetConcerns,
          price: editingProduct.price,
          externalUrl: editingProduct.externalUrl || "",
        }
      : {
          name: "",
          brand: "",
          description: "",
          ingredients: "",
          sustainabilityScore: 3,
          allergens: "",
          skinTypes: [],
          concerns: [],
          price: 0,
          externalUrl: "",
        },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    const image = fileInput?.files?.[0];
    await onSubmit({ ...values, image });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="sustainabilityScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sustainability Score (1-5)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select score" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((score) => (
                      <SelectItem key={score} value={score.toString()}>
                        {score}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allergens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergens (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="skinTypes"
            render={() => (
              <FormItem>
                <FormLabel>Suitable Skin Types</FormLabel>
                <div className="space-y-2">
                  {["DRY", "OILY", "COMBINATION", "NORMAL", "SENSITIVE"].map(
                    (type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          checked={form.getValues("skinTypes")?.includes(type)}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("skinTypes") || [];
                            const updated = checked
                              ? [...current, type]
                              : current.filter((t) => t !== type);
                            form.setValue("skinTypes", updated);
                          }}
                        />
                        <label className="text-sm">{type}</label>
                      </div>
                    )
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="concerns"
            render={() => (
              <FormItem>
                <FormLabel>Target Concerns</FormLabel>
                <div className="space-y-2">
                  {[
                    "ACNE",
                    "AGING",
                    "PIGMENTATION",
                    "SENSITIVITY",
                    "DRYNESS",
                    "OILINESS",
                    "REDNESS",
                    "UNEVEN_TEXTURE",
                  ].map((concern) => (
                    <div key={concern} className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.getValues("concerns")?.includes(concern)}
                        onCheckedChange={(checked) => {
                          const current = form.getValues("concerns") || [];
                          const updated = checked
                            ? [...current, concern]
                            : current.filter((c) => c !== concern);
                          form.setValue("concerns", updated);
                        }}
                      />
                      <label className="text-sm">{concern}</label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>Product Image</FormLabel>
          <Input type="file" accept="image/*" />
        </div>

        <FormField
          control={form.control}
          name="externalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/product"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
