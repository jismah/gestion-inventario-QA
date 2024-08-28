import { useEffect, useState } from "react";
import { ProductItem } from "./interfaces";

export function formatCurrency(amount: number | null): string {
    // Verifica si amount no es undefined antes de formatearlo
    if (amount !== undefined && amount !== null) {
        return amount.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' });
    } else {
        return '0.00 DOP';
    }
};

export function formatFrequency(frequency: string | null) {
    if (frequency !== undefined && frequency !== null) {
        if (frequency === "MONTHLY") {
            return "Mensual";
        } else if (frequency === "WEEKLY") {
            return "Semanal";
        } else if (frequency === "BIWEEKLY") {
            return "Quincenal";
        } else if (frequency === "UNIQUE") {
            return "Único";
        } else if (frequency === "YEARLY") {
            return "Anual";
        }
    } else {
        return 'NaN';
    }

}

export const useLoaded = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);
    return loaded;
};

export function filterLowStockProducts(products?: ProductItem[]): ProductItem[] {
    const lowStockProducts: ProductItem[] = [];

    if (!products) {
        return lowStockProducts; // Retorna una lista vacía si 'products' es undefined
    }

    products.forEach(product => {
        if (product.stock <= product.min_stock) {
            lowStockProducts.push(product);
        }
    });

    return lowStockProducts;
}