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
    quantity: number;
}

export type Role = 'Admin' | 'Employee' | 'User' | 'Guest';
