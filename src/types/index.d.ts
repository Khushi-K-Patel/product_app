export interface Product {
    index: number;
    productName: string;
    productCount: string;
    editProduct: string;
    deleteProduct: string;
    refetchData: () => Promise<void>;
}