/**
 * Service Layer — currently returns mock data.
 * Replace these functions with Axios calls when backend is ready.
 * Keep all function signatures identical — only the internals change.
 */

import {
  Member, Trainer, Staff, Branch, MembershipPlan,
  Attendance, Payment, TableFilters, PaginatedResponse,
  User, Notification,
} from "@/types";
import {
  mockMembers, mockTrainers, mockStaff, mockBranches,
  mockPlans, mockAttendance, mockPayments, mockNotifications,
  mockDashboardStats, mockRevenueData, mockAttendanceChart, mockMemberGrowth,
} from "@/mock/data";

// ─── Utility ─────────────────────────────────────────────────
function paginate<T>(arr: T[], page = 1, limit = 10): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const data = arr.slice(start, start + limit);
  return { data, total: arr.length, page, limit, totalPages: Math.ceil(arr.length / limit) };
}

function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Auth Service ────────────────────────────────────────────
export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay();
    if (email && password) {
      return {
        token: "mock-jwt-token-fitsaas",
        user: {
          id: "user-1",
          name: "Arpit Sharma",
          email,
          role: "owner",
          gymId: "gym-1",
          createdAt: "2024-01-01",
        },
      };
    }
    throw new Error("Invalid credentials");
  },

  async forgotPassword(email: string): Promise<void> {
    await delay();
    if (!email) throw new Error("Email required");
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await delay();
    if (!token || !password) throw new Error("Invalid request");
  },

  async logout(): Promise<void> {
    await delay(100);
  },

  async getMe(): Promise<User> {
    await delay(200);
    return {
      id: "user-1",
      name: "Arpit Sharma",
      email: "arpit@fitsaas.com",
      role: "owner",
      gymId: "gym-1",
      createdAt: "2024-01-01",
    };
  },
};

// ─── Dashboard Service ───────────────────────────────────────
export const dashboardService = {
  async getStats() {
    await delay(300);
    return mockDashboardStats;
  },
  async getRevenueChart() {
    await delay(300);
    return mockRevenueData;
  },
  async getAttendanceChart() {
    await delay(300);
    return mockAttendanceChart;
  },
  async getMemberGrowth() {
    await delay(300);
    return mockMemberGrowth;
  },
};

// ─── Member Service ──────────────────────────────────────────
export const memberService = {
  async getMembers(filters: TableFilters = {}): Promise<PaginatedResponse<Member>> {
    await delay();
    let data = [...mockMembers];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q));
    }
    if (filters.status) data = data.filter((m) => m.status === filters.status);
    if (filters.branchId) data = data.filter((m) => m.branchId === filters.branchId);
    return paginate(data, filters.page, filters.limit);
  },

  async getMemberById(id: string): Promise<Member> {
    await delay();
    const m = mockMembers.find((m) => m.id === id);
    if (!m) throw new Error("Member not found");
    return m;
  },

  async createMember(data: Partial<Member>): Promise<Member> {
    await delay(600);
    const newMember: Member = {
      id: `member-${Date.now()}`,
      gymId: "gym-1",
      branchId: data.branchId ?? "branch-1",
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      gender: data.gender ?? "male",
      dateOfBirth: data.dateOfBirth ?? "1990-01-01",
      address: data.address ?? "",
      status: "active",
      planId: data.planId ?? "plan-1",
      planName: data.planName ?? "Monthly Basic",
      joinDate: new Date().toISOString().split("T")[0],
      expiryDate: data.expiryDate ?? "",
      emergencyContact: data.emergencyContact ?? { name: "", phone: "", relation: "" },
      totalPaid: 0,
      pendingAmount: 0,
      attendanceCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockMembers.unshift(newMember);
    return newMember;
  },

  async updateMember(id: string, data: Partial<Member>): Promise<Member> {
    await delay();
    const idx = mockMembers.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Member not found");
    mockMembers[idx] = { ...mockMembers[idx], ...data };
    return mockMembers[idx];
  },

  async deleteMember(id: string): Promise<void> {
    await delay();
    const idx = mockMembers.findIndex((m) => m.id === id);
    if (idx !== -1) mockMembers.splice(idx, 1);
  },

  async getMemberAttendance(memberId: string): Promise<Attendance[]> {
    await delay();
    return mockAttendance.filter((a) => a.memberId === memberId).slice(0, 30);
  },

  async getMemberPayments(memberId: string): Promise<Payment[]> {
    await delay();
    return mockPayments.filter((p) => p.memberId === memberId);
  },
};

// ─── Trainer Service ──────────────────────────────────────────
export const trainerService = {
  async getTrainers(filters: TableFilters = {}): Promise<PaginatedResponse<Trainer>> {
    await delay();
    let data = [...mockTrainers];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q));
    }
    if (filters.status) data = data.filter((t) => t.status === filters.status);
    if (filters.branchId) data = data.filter((t) => t.branchId === filters.branchId);
    return paginate(data, filters.page, filters.limit);
  },

  async getTrainerById(id: string): Promise<Trainer> {
    await delay();
    const t = mockTrainers.find((t) => t.id === id);
    if (!t) throw new Error("Trainer not found");
    return t;
  },

  async createTrainer(data: Partial<Trainer>): Promise<Trainer> {
    await delay(600);
    const newT: Trainer = {
      id: `trainer-${Date.now()}`,
      gymId: "gym-1",
      branchId: data.branchId ?? "branch-1",
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      gender: data.gender ?? "male",
      status: "active",
      specialization: data.specialization ?? [],
      experience: data.experience ?? 1,
      salary: data.salary ?? 25000,
      joinDate: new Date().toISOString().split("T")[0],
      assignedMembers: 0,
      rating: 0,
      attendanceCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockTrainers.unshift(newT);
    return newT;
  },

  async updateTrainer(id: string, data: Partial<Trainer>): Promise<Trainer> {
    await delay();
    const idx = mockTrainers.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Trainer not found");
    mockTrainers[idx] = { ...mockTrainers[idx], ...data };
    return mockTrainers[idx];
  },

  async deleteTrainer(id: string): Promise<void> {
    await delay();
    const idx = mockTrainers.findIndex((t) => t.id === id);
    if (idx !== -1) mockTrainers.splice(idx, 1);
  },
};

// ─── Staff Service ────────────────────────────────────────────
export const staffService = {
  async getStaff(filters: TableFilters = {}): Promise<PaginatedResponse<Staff>> {
    await delay();
    let data = [...mockStaff];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (filters.status) data = data.filter((s) => s.status === filters.status);
    return paginate(data, filters.page, filters.limit);
  },

  async createStaff(data: Partial<Staff>): Promise<Staff> {
    await delay(600);
    const newS: Staff = {
      id: `staff-${Date.now()}`,
      gymId: "gym-1",
      branchId: data.branchId ?? "branch-1",
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      role: data.role ?? "receptionist",
      status: "active",
      salary: data.salary ?? 18000,
      joinDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };
    mockStaff.unshift(newS);
    return newS;
  },

  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    await delay();
    const idx = mockStaff.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Staff not found");
    mockStaff[idx] = { ...mockStaff[idx], ...data };
    return mockStaff[idx];
  },

  async deleteStaff(id: string): Promise<void> {
    await delay();
    const idx = mockStaff.findIndex((s) => s.id === id);
    if (idx !== -1) mockStaff.splice(idx, 1);
  },
};

// ─── Branch Service ───────────────────────────────────────────
export const branchService = {
  async getBranches(): Promise<Branch[]> {
    await delay();
    return mockBranches;
  },
  async getBranchById(id: string): Promise<Branch> {
    await delay();
    const b = mockBranches.find((b) => b.id === id);
    if (!b) throw new Error("Branch not found");
    return b;
  },
  async createBranch(data: Partial<Branch>): Promise<Branch> {
    await delay(600);
    const newB: Branch = {
      id: `branch-${Date.now()}`,
      gymId: "gym-1",
      name: data.name ?? "",
      address: data.address ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      totalMembers: 0,
      totalTrainers: 0,
      totalStaff: 0,
      monthlyRevenue: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    mockBranches.push(newB);
    return newB;
  },
};

// ─── Plan Service ─────────────────────────────────────────────
export const planService = {
  async getPlans(): Promise<MembershipPlan[]> {
    await delay();
    return mockPlans;
  },
  async createPlan(data: Partial<MembershipPlan>): Promise<MembershipPlan> {
    await delay(600);
    const newP: MembershipPlan = {
      id: `plan-${Date.now()}`,
      gymId: "gym-1",
      name: data.name ?? "",
      duration: data.duration ?? "monthly",
      durationDays: data.durationDays ?? 30,
      price: data.price ?? 0,
      discount: data.discount ?? 0,
      features: data.features ?? [],
      freezeAllowed: data.freezeAllowed ?? false,
      freezeDays: data.freezeDays ?? 0,
      isActive: true,
      totalMembers: 0,
      createdAt: new Date().toISOString(),
    };
    mockPlans.push(newP);
    return newP;
  },
};

// ─── Attendance Service ───────────────────────────────────────
export const attendanceService = {
  async getAttendance(filters: { date?: string; branchId?: string; search?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<Attendance>> {
    await delay();
    let data = [...mockAttendance];
    if (filters.date) data = data.filter((a) => a.date === filters.date);
    if (filters.branchId) data = data.filter((a) => a.branchId === filters.branchId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((a) => a.memberName.toLowerCase().includes(q));
    }
    return paginate(data, filters.page, filters.limit ?? 20);
  },

  async markAttendance(memberId: string): Promise<Attendance> {
    await delay(400);
    const member = mockMembers.find((m) => m.id === memberId);
    if (!member) throw new Error("Member not found");
    const today = new Date().toISOString().split("T")[0];
    const record: Attendance = {
      id: `att-${Date.now()}`,
      gymId: "gym-1",
      branchId: member.branchId,
      memberId,
      memberName: member.name,
      date: today,
      checkIn: new Date().toTimeString().slice(0, 5),
      method: "manual",
    };
    mockAttendance.unshift(record);
    return record;
  },
};

// ─── Payment Service ──────────────────────────────────────────
export const paymentService = {
  async getPayments(filters: TableFilters = {}): Promise<PaginatedResponse<Payment>> {
    await delay();
    let data = [...mockPayments];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((p) => p.memberName.toLowerCase().includes(q) || p.invoiceNumber.toLowerCase().includes(q));
    }
    if (filters.status) data = data.filter((p) => p.status === filters.status);
    if (filters.branchId) data = data.filter((p) => p.branchId === filters.branchId);
    return paginate(data, filters.page, filters.limit);
  },

  async getPaymentById(id: string): Promise<Payment> {
    await delay();
    const p = mockPayments.find((p) => p.id === id);
    if (!p) throw new Error("Payment not found");
    return p;
  },

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    await delay(600);
    const member = mockMembers.find((m) => m.id === data.memberId);
    const newP: Payment = {
      id: `pay-${Date.now()}`,
      gymId: "gym-1",
      branchId: member?.branchId ?? "branch-1",
      memberId: data.memberId ?? "",
      memberName: member?.name ?? "",
      planId: data.planId ?? "",
      planName: data.planName ?? "",
      amount: data.amount ?? 0,
      discount: data.discount ?? 0,
      tax: data.tax ?? 0,
      total: data.total ?? 0,
      status: "paid",
      method: data.method ?? "cash",
      invoiceNumber: `INV-${2000 + mockPayments.length}`,
      paidAt: new Date().toISOString(),
      dueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };
    mockPayments.unshift(newP);
    return newP;
  },
};

// ─── Notification Service ─────────────────────────────────────
export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    await delay(200);
    return mockNotifications;
  },

  async markAsRead(id: string): Promise<void> {
    await delay(100);
    const n = mockNotifications.find((n) => n.id === id);
    if (n) n.isRead = true;
  },

  async markAllAsRead(): Promise<void> {
    await delay(200);
    mockNotifications.forEach((n) => (n.isRead = true));
  },
};
