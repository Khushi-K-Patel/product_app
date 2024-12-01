
"use client"

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import LeaderboardDataTable from './data-table';
import { columns } from "./columns";
import AddProduct from './AddProduct';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface productItemProps {
    name: string;
    count: string;
}

export function Productpage() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState('');

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handlePaginationByPage = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    // Fetch products with pagination and search
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?page=${currentPage}&limit=10&search=${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            if (res.ok) {
                setTotalItems(data.totalItems);
                setTotalPages(data.totalPages);
                const productData = data.products.map((item: productItemProps, index: number) => ({
                    index: (currentPage - 1) * 10 + index + 1,
                    productName: item.name,
                    productCount: item.count,
                    editProduct: `${item.name}-${item.count}`,
                    deleteProduct: item.name
                }));
                setProducts(productData);
                setLoading(false);
            } else {
                setError(data.error);
                toast.error(data.error);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("Failed to fetch products");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, currentPage]);

    return (
        <>
            <div className="min-h-screen flex flex-col items-center mt-[30px]">
                <div className='max-w-[60rem] w-full flex flex-col items-center lg:flex-row justify-center lg:justify-between gap-3 lg:gap-0'>
                    <div className='flex gap-3'>
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearch}
                            className="max-w-xs"
                        />
                    </div>
                    <div className='w-[100px]'>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Add Product
                        </Button>
                    </div>
                </div>

                <AddProduct
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onProductAdded={fetchProducts}
                />

                {/* Product List */}
                <div className="space-y-4 w-full max-w-[60rem] ">
                    <div className="py-5 pt-6 mx-[5px] md:mx-[10px] ">
                        <LeaderboardDataTable
                            columns={columns}
                            data={products}
                            handleNext={handleNextPage}
                            handlePrev={handlePrevPage}
                            handlePaginationByPage={handlePaginationByPage}
                            refetchData={fetchProducts}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}