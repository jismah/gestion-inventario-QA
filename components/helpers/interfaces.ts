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

export interface StockMovement {
  id: number;
  productId: number;
  quantity: number;
  type: "entrada" | "salida";
  userId: number;
  createdAt: string;
  updatedAt: string;
  Product: {
    name: string;
    category: string;
  };
  User: {
    username: string;
  };
}


export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export type Role = 'Admin' | 'Employee' | 'User' | 'Guest';
