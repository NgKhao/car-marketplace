// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'seller';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Car Types
export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  color: string;
  description: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerType: 'individual' | 'dealer';
  location: string;
  status: 'active' | 'pending' | 'sold' | 'rejected';
  features: string[];
  condition: 'new' | 'used';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarRequest {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  color: string;
  description: string;
  images: File[];
  location: string;
  features: string[];
  condition: 'new' | 'used';
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  id: string;
}

// Filter Types
export interface CarFilters {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  fuelType?: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission?: 'manual' | 'automatic';
  location?: string;
  condition?: 'new' | 'used';
  features?: string[];
  sortBy?: 'price' | 'year' | 'mileage' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Contact Types
export interface ContactInfo {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  carId: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalCars: number;
  pendingApprovals: number;
  totalSales: number;
  monthlyRevenue: number;
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: FormError[];
}

// Navigation Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Constants
export const CAR_BRANDS = [
  'Toyota',
  'Honda',
  'Ford',
  'Hyundai',
  'Kia',
  'Mazda',
  'Nissan',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Lexus',
  'Mitsubishi',
  'Suzuki',
  'Isuzu',
  'Subaru',
] as const;

export const FUEL_TYPES = ['gasoline', 'diesel', 'hybrid', 'electric'] as const;

export const TRANSMISSION_TYPES = ['manual', 'automatic'] as const;

export const CAR_CONDITIONS = ['new', 'used'] as const;

export const USER_ROLES = ['buyer', 'seller', 'admin'] as const;

export const CAR_STATUS = ['active', 'pending', 'sold', 'rejected'] as const;
