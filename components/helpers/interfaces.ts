export interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
    roles: Role[];
}

export interface ProductItem {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    min_stock: number;
    is_deleted: boolean;
    created_at: string;
}

export type Role = 'Admin' | 'Employee' | 'User' | 'Guest';
