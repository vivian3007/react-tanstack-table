import React from 'react'
import ReactDOM from 'react-dom/client'
import OrdersTable from './Tanstack'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <OrdersTable />
        </QueryClientProvider>
    </React.StrictMode>,
)
