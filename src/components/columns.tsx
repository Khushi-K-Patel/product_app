import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { handleDeleteproduct } from "@/utils/deleteProduct";
import { EditProduct } from "./EditProduct";
import { useState } from "react";

interface WalletData {
    index: number;
    productName: string;
    productCount: string;
    editProduct: string;
    deleteProduct: string;
}

export const columns: ColumnDef<WalletData>[] = [
    {
        header: "Index",
        accessorKey: "index",
        cell: ({ row }) => {
            const index: number = row.getValue("index") || 0;
            return <div>{index}</div>;
        }
    },
    {
        header: "Product Name",
        accessorKey: "productName",
        cell: ({ row }) => {
            const productName: string = row.getValue("productName");
            return productName;
        }
    },
    {
        header: "Quantity",
        accessorKey: "productCount",
        cell: ({ row }) => {
            return <div>{row.getValue("productCount")}</div>;
        }
    },
    {
        header: "Edit Product",
        accessorKey: "editProduct",
        cell: ({ row, table }) => {
            const product: string = row.getValue("editProduct");
            const [productName, productCount] = product.split('-');
            const [isDialogOpen, setIsDialogOpen] = useState(false);
            const refetchData = (table.options.meta as { refetchData: () => Promise<void> }).refetchData;
            return (
                <>
                    <Button
                        variant="default"
                        onClick={() => {
                            setIsDialogOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    <EditProduct
                        productName={productName}
                        productCount={productCount}
                        isOpen={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        onProductUpdated={refetchData}
                    /></>
            )
        }
    },
    {
        header: "Delete Product",
        accessorKey: "deleteProduct",
        cell: ({ row, table }) => {
            const product: string = row.getValue("deleteProduct");
            const refetchData = (table.options.meta as { refetchData: () => Promise<void> }).refetchData;
            return (
                <Button
                    variant="destructive"
                    onClick={async () => {
                        handleDeleteproduct(product, refetchData);
                    }}
                >
                    Delete
                </Button>
            )

        }
    }
];