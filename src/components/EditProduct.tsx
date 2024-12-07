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
    const [addQuantity, setAddQuantity] = useState("");
    const [reduceQuantity, setReduceQuantity] = useState("");
    const [isNewProductCountValid, setIsNewProductCountValid] = useState(true);
    const [isAddQuantityValid, setIsAddQuantityValid] = useState(true);
    const [isReduceQuantityValid, setIsReduceQuantityValid] = useState(true);

    const validateNumber = (value: string): boolean => {
        const regex = /^(\d+(\.\d*)?|\.\d+)$/; // This regex allows numbers like 123, 123.456, .456
        return regex.test(value) || value === ""; // Allow empty value for clearing the input
    };

    const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, validitySetter: React.Dispatch<React.SetStateAction<boolean>>) => {
        // Trim the value
        value = value.trim();

        // If the value is empty, set it to "0"
        if (value === "") {
            setter("");
            validitySetter(true);
            return;
        }

        // Validate if the value is a valid number
        if (validateNumber(value)) {
            // Check if the number has more than 18 decimal places
            const parts = value.split(".");
            if (parts.length > 1 && parts[1].length > 18) {
                toast.error("Number cannot have more than 18 decimal places.");
                validitySetter(false);
                return;
            }

            setter(value);
            validitySetter(true);
        } else {
            toast.error("Please enter a valid non-negative number.");
            validitySetter(false);
        }
    };

    const handleEditProduct = async () => {

        const updatedProductQuality = parseFloat(newProductCount) + parseFloat(addQuantity || "0") - parseFloat(reduceQuantity || "0");
        const payload = {
            name: productName,
            newName: newProductName || undefined,
            count: updatedProductQuality,
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
                        <label className="block text-sm font-medium text-gray-700">Total Product Quantity</label>
                        <Input
                            type="text"
                            value={newProductCount}
                            onChange={(e) => handleInputChange(e.target.value, setNewProductCount, setIsNewProductCountValid)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Add Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Add Quantity</label>
                        <Input
                            type="text"
                            value={addQuantity}
                            onChange={(e) => handleInputChange(e.target.value, setAddQuantity, setIsAddQuantityValid)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    {/*  Reduce Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reduce Quantity</label>
                        <Input
                            type="text"
                            value={reduceQuantity}
                            disabled={Number(productCount) <= 0}
                            onChange={(e) => handleInputChange(e.target.value, setReduceQuantity, setIsReduceQuantityValid)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="default"
                        disabled={!isNewProductCountValid || !isAddQuantityValid || !isReduceQuantityValid}
                        onClick={handleEditProduct}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

