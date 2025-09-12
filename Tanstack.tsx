import React from "react";
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

interface Order {
    id: number;
    customer: string;
    status: string;
}

interface OrderStore {
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
}

interface FetchOrdersParams {
    page: number;
    size: number;
    sort: string;
}

const useOrderStore = create<OrderStore>((set) => ({
    selectedOrder: null,
    setSelectedOrder: (order) => set({ selectedOrder: order }),
}));

async function fetchOrders({ page, size, sort }: FetchOrdersParams) {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await res.json();

    const orders = posts.slice(page * size, (page + 1) * size).map((post: any) => ({
        id: post.id,
        customer: `Klant ${post.userId}`,
        status: post.id % 3 === 0 ? "Voltooid" : post.id % 2 === 0 ? "In behandeling" : "Verzonden"
    }));

    return { orders, total: posts.length };
}

export default function OrdersTable() {
    const { selectedOrder, setSelectedOrder } = useOrderStore();

    const { data, isLoading } = useQuery({
        queryKey: ["orders", { page: 0, size: 5, sort: "id" }],
        queryFn: () => fetchOrders({ page: 0, size: 15, sort: "id" }),
    });

    const columns: ColumnDef<any>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "customer", header: "Klant" },
        { accessorKey: "status", header: "Status" },
    ];

    const table = useReactTable({
        data: data?.orders || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    if (isLoading) return <p>Laden...</p>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
                Bestellingen
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableCell key={header.id} sx={{ fontWeight: 'bold' }}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                                <TableRow
                                    onClick={() => setSelectedOrder(row.original)}
                                    component={motion.tr}
                                    whileHover={{ backgroundColor: "#f5f5f5" }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedOrder && (
                <Paper sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Geselecteerde bestelling:
                    </Typography>
                    <Typography component="pre" sx={{ fontSize: '0.875rem' }}>
                        {JSON.stringify(selectedOrder, null, 2)}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
