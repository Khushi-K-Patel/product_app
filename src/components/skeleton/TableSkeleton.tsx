/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";

import { TableCell, TableRow } from "../ui/table";

interface TableSkeletonRowsProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export const TableSkeletonRows = <TData, TValue>({
    columns
}: TableSkeletonRowsProps<TData, TValue>) => {
    return Array.from({ length: 10 }, (_, i) => (
        <TableRow key={`skeleton-${i}`} className="animate-pulse bg-gray-200">
            {columns.map((column, index) => (
                <TableCell key={`skeleton-cell-${i}-${index}`} className="py-4 px-10">
                    <div className="h-5 bg-gray-300 rounded w-full"></div>
                </TableCell>
            ))}
        </TableRow>
    ));
};