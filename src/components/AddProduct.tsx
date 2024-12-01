"use client"

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

export default function AddProduct({ isOpen, onOpenChange, onProductAdded }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onProductAdded: () => Promise<void>;
}) {

    const [newProductName, setNewProductName] = useState('');
    const [newProductCount, setNewProductCount] = useState(0);

    const handleAddProduct = async () => {
        if (!newProductName || newProductCount < 0) {
            toast.error('Please provide valid name and count');
            return;
        }

        const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newProductName, count: newProductCount }),
        });
        const data = await res.json();
        if (res.ok) {
            toast.success('Product added successfully');
            setNewProductName('');
            setNewProductCount(0);
            onOpenChange(false);
            await onProductAdded();
        } else {
            toast.error(data.error);
        }
    };

    return (
        <>
            {/* Add Product */}
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <Input
                                type="text"
                                value={newProductName}
                                onChange={(e) => setNewProductName(e.target.value)}
                                placeholder='Enter Product Name'
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Product Count */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Count</label>
                            <Input
                                type="number"
                                value={newProductCount}
                                onChange={(e) => setNewProductCount(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="default" onClick={handleAddProduct}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}