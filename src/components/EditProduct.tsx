"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "./ui/input";

interface EditProductProps {
    productName: string;
    productCount: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onProductUpdated: () => Promise<void>;
}

export function EditProduct({ productName, productCount, isOpen, onOpenChange, onProductUpdated }: EditProductProps) {
    const [newProductName, setNewProductName] = useState("");
    const [newProductCount, setNewProductCount] = useState(productCount);

    const handleEditProduct = async () => {
        const payload = {
            name: productName,
            newName: newProductName || undefined,
            count: newProductCount || undefined,
        };

        try {
            const response = await fetch("/api/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const updatedProduct = await response.json();
            if (response.ok) {
                toast.success("Product updated successfully");
                onOpenChange(false); // Close the dialog on success
                await onProductUpdated();
            } else {
                toast.error(updatedProduct.error);
                console.error("Failed to update product:", updatedProduct.error);
            }
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Default Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name (Default)</label>
                        <Input
                            type="text"
                            value={productName}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                    </div>
                    {/* New Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Product Name</label>
                        <Input
                            type="text"
                            value={newProductName}
                            onChange={(e) => setNewProductName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    {/* Product Count */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Count</label>
                        <Input
                            type="number"
                            value={newProductCount}
                            onChange={(e) => setNewProductCount(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="default" onClick={handleEditProduct}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

