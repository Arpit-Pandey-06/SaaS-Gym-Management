// ─── Auth & User ─────────────────────────────────────────────
export type UserRole = "owner" | "admin" | "receptionist" | "trainer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  gymId: string;
  branchId?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Gym & Branch ────────────────────────────────────────────
export interface Gym {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  gymId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId?: string;
  totalMembers: number;
  totalTrainers: number;
  totalStaff: number;
  monthlyRevenue: number;
  status: "active" | "inactive";
  createdAt: string;
}

// ─── Member ──────────────────────────────────────────────────
export type MemberStatus = "active" | "inactive" | "expired" | "frozen";
export type Gender = "male" | "female" | "other";

export interface Member {
  id: string;
  gymId: string;
  branchId: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  avatar?: string;
  status: MemberStatus;
  planId: string;
  planName: string;
  joinDate: string;
  expiryDate: string;
  trainerId?: string;
  trainerName?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalNotes?: string;
  totalPaid: number;
  pendingAmount: number;
  attendanceCount: number;
  createdAt: string;
}

// ─── Trainer ─────────────────────────────────────────────────
export type TrainerStatus = "active" | "inactive" | "on_leave";

export interface Trainer {
  id: string;
  gymId: string;
  branchId: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  avatar?: string;
  status: TrainerStatus;
  specialization: string[];
  experience: number;
  salary: number;
  joinDate: string;
  assignedMembers: number;
  rating: number;
  attendanceCount: number;
  createdAt: string;
}

// ─── Staff ───────────────────────────────────────────────────
export type StaffRole = "receptionist" | "manager" | "cleaner" | "maintenance" | "other";
export type StaffStatus = "active" | "inactive";

export interface Staff {
  id: string;
  gymId: string;
  branchId: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  salary: number;
  joinDate: string;
  avatar?: string;
  createdAt: string;
}

// ─── Membership Plan ─────────────────────────────────────────
export type PlanDuration = "monthly" | "quarterly" | "half_yearly" | "yearly" | "custom";

export interface MembershipPlan {
  id: string;
  gymId: string;
  name: string;
  duration: PlanDuration;
  durationDays: number;
  price: number;
  discount: number;
  features: string[];
  freezeAllowed: boolean;
  freezeDays: number;
  isActive: boolean;
  totalMembers: number;
  createdAt: string;
}

// ─── Attendance ──────────────────────────────────────────────
export type AttendanceMethod = "manual" | "qr" | "biometric";

export interface Attendance {
  id: string;
  gymId: string;
  branchId: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  method: AttendanceMethod;
  duration?: number;
}

// ─── Payment ─────────────────────────────────────────────────
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer" | "online";

export interface Payment {
  id: string;
  gymId: string;
  branchId: string;
  memberId: string;
  memberName: string;
  planId: string;
  planName: string;
  amount: number;
  discount: number;
  tax: number;
  total: number;
  status: PaymentStatus;
  method: PaymentMethod;
  invoiceNumber: string;
  paidAt?: string;
  dueDate: string;
  notes?: string;
  createdAt: string;
}

// ─── Workout & Diet Plans ────────────────────────────────────
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  gymId: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal: string;
  durationWeeks: number;
  schedule: WorkoutDay[];
  assignedMembers: number;
  createdAt: string;
}

// ─── Chart & Analytics ───────────────────────────────────────
export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
}

export interface AttendanceDataPoint {
  date: string;
  count: number;
}

export interface MemberGrowthDataPoint {
  month: string;
  new: number;
  total: number;
}

// ─── API Response Wrappers ───────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ─── Table / Filter ──────────────────────────────────────────
export interface TableFilters {
  search?: string;
  status?: string;
  branchId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Notification ────────────────────────────────────────────
export type NotificationType = "expiry" | "payment" | "birthday" | "announcement" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}
