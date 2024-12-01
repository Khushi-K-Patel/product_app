"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import { InfoIcon, TriangleAlertIcon } from "lucide-react";
import React from "react";
import { useState } from "react";

import { TableSkeletonRows } from "./skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    handleNext: () => void;
    handlePrev: () => void;
    handlePaginationByPage: (page: number) => void;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    loading: boolean;
    error: Error | undefined;
    refetchData: () => Promise<void>;
}

interface LeaderboardData {
    index: number;
    productName: string;
    productCount: string;
    editProduct: string;
    deleteProduct: string;
}

export function LeaderboardDataTable<TValue>({
    columns,
    data,
    handleNext,
    handlePrev,
    handlePaginationByPage,
    refetchData,
    currentPage,
    totalPages,
    loading,
    error
}: DataTableProps<LeaderboardData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    );
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        meta: {
            refetchData: refetchData,
        },

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    });

    // Pagination range logic
    const paginationRange = [];
    const range = 1; // Show one pages before and after the current page
    const startPage = Math.max(2, currentPage - range);
    const endPage = Math.min(totalPages - 1, currentPage + range);

    for (let i = startPage; i <= endPage; i++) {
        paginationRange.push(i);
    }

    return (
        <div>
            {/* table */}
            <div className="overflow-auto rounded-[7px] w-full max-h-[1000px] bg-white border-2 border-[#010000] shadow-[8px_8px_0_0_#00000026] custom-scrollbar">
                <Table>
                    <TableHeader className="text-center sticky top-0">
                        {table.getHeaderGroups().map(headerGroup => {
                            return (
                                <TableRow
                                    key={headerGroup.id}
                                    className="font-sans h-[44px] text-center border-b bg-[#EFF8FF] text-[14px] w-full whitespace-nowrap"
                                >
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="py-4 px-10 text-black w-[20%] text-center"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableSkeletonRows columns={columns} />
                        ) : error ? (
                            <>
                                <TableRow className="text-[14px] text-center whitespace-nowrap w-full h-[50px] text-red-800">
                                    <TableCell colSpan={columns.length} className="w-full">
                                        <div className="w-full flex justify-center items-center">
                                            <div className="w-[20px] h-[20px] mr-[10px]">
                                                <TriangleAlertIcon color="red" />
                                            </div>
                                            <div>Failed to Load Referral Table Data</div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </>
                        ) : (
                            <>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map(row => (
                                        <TableRow
                                            key={row.id}
                                            className={`text-[14px] text-center w-full whitespace-nowrap ${row.index % 2 === 1 ? "bg-[#EFF8FF]" : ""} `}
                                        >
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell
                                                    key={cell.id}
                                                    className="py-4 px-10 text-black w-[20%]"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow className="text-[14px] text-center whitespace-nowrap w-full h-[50px]">
                                        <TableCell colSpan={columns.length}>
                                            <div className="w-full flex justify-center items-center">
                                                <div className="w-[20px] h-[20px] mr-[10px]">
                                                    <InfoIcon color="black" />
                                                </div>
                                                <div>No Data Found</div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* pagination */}
            <div className="md:flex w-full justify-between">
                <div className="flex flex-wrap justify-center items-end w-full md:flex-row md:items-center md:justify-end space-y-2 md:space-y-0 space-x-2 md:space-x-4 py-8 md:py-10">
                    {/* Previous Button */}
                    <Button
                        size="sm"
                        onClick={handlePrev}
                        disabled={currentPage == 1}
                        className="bg-white w-[80px] border-[#010000] border-[1px] text-black rounded-md px-4 py-2 h-[42px] hover:cursor-pointer hover:bg-gray-200 shadow-none text-[14px]"
                    >
                        Previous
                    </Button>

                    {/* Page Number Buttons */}
                    <div className="flex items-center space-x-4 flex-wrap">
                        {/* First Page */}
                        <button
                            className={cn(
                                "px-4 py-2  border-[1px] text-black shadow-[2px_2px_0_0_#00000026] rounded-md hover:bg-gray-200 hover:cursor-pointer mt-[10px] md:mt-0 bg-white border-gray-300",
                                currentPage === 1 && "bg-[#EFF8FF] border-[#010000]"
                            )}
                            onClick={() => handlePaginationByPage(1)}
                            disabled={currentPage === 1}
                        >
                            1
                        </button>

                        {startPage > 2 && <span className="px-2">...</span>}

                        {paginationRange.map(page => (
                            <button
                                key={page}
                                className={cn(
                                    "px-4 py-2 border text-black rounded-md shadow-[2px_2px_0_0_#00000026] hover:bg-gray-200 hover:cursor-pointer mt-[10px] md:mt-0 bg-white border-gray-300",
                                    currentPage === page && "bg-[#EFF8FF] border-[#010000]"
                                )}
                                onClick={() => handlePaginationByPage(page)}
                                disabled={currentPage === page}
                            >
                                {page}
                            </button>
                        ))}

                        {endPage < totalPages - 1 && <span className="px-2">...</span>}

                        {/* Last Page */}
                        {totalPages > 1 && (
                            <button
                                className={cn(
                                    "px-4 py-2 border text-black rounded-md shadow-[2px_2px_0_0_#00000026] hover:bg-gray-200 hover:cursor-pointer mt-[10px] md:mt-0 bg-white border-gray-300",
                                    currentPage === totalPages && "bg-[#EFF8FF] border-[#010000]"
                                )}
                                onClick={() => handlePaginationByPage(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                {totalPages}
                            </button>
                        )}
                    </div>

                    {/* Next Button */}
                    <Button
                        size="sm"
                        onClick={handleNext}
                        disabled={currentPage >= totalPages}
                        className="bg-white w-[80px] text-black border-[#010000] border-[1px] rounded-md px-4 py-2 h-[42px] hover:cursor-pointer hover:bg-gray-200 shadow-none text-[14px]"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LeaderboardDataTable;