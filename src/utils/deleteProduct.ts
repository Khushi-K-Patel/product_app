import toast from "react-hot-toast";

export const handleDeleteproduct = async (productName: string, refetchData: () => Promise<void>) => {
    try {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            const res = await fetch('/api/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Product deleted successfully');
                refetchData();
            } else {
                toast.error(data.error);
            }
        }
    } catch (error) {
        console.log("Error while deleting product", error);
        toast.error("Error while deleting product");
    }
}