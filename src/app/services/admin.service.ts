import { Business, BusinessType } from "@/app/types/business";
import { User } from "@/app/types/auth";
import { PlatformAnalytics, PlatformSettings, CreateBusinessPayload } from "@/app/types/admin";

export interface BusinessAccount {
  business: Business;
  owner: User;
  generatedPassword?: string;
}

const MOCK_ACCOUNTS: BusinessAccount[] = [
  {
    business: {
      id: "biz_1",
      ownerId: "owner_1",
      name: "Urban Bites",
      type: "RESTAURANT",
      address: "123 Main St, NY",
      phone: "+1 555-0199",
      logoUrl: "",
      categories: [],
    },
    owner: {
      id: "owner_1",
      businessId: "biz_1",
      email: "urban@owner.com",
      name: "John Doe",
      role: "OWNER",
      createdAt: "2023-01-01",
    },
  },
];

const MOCK_ANALYTICS: PlatformAnalytics = {
  totalRevenue: 1542000,
  totalOrders: 4520,
  activeBusinesses: 124,
  totalUsers: 3500,
  serverHealth: "OPERATIONAL",
  revenueByMonth: [
    { month: "Jan", value: 120000 },
    { month: "Feb", value: 135000 },
    { month: "Mar", value: 160000 },
    { month: "Apr", value: 145000 },
    { month: "May", value: 190000 },
  ],
};

let MOCK_SETTINGS: PlatformSettings = {
  maintenanceMode: false,
  allowNewRegistrations: true,
  platformFeePercentage: 2.5,
  supportEmail: "support@platform.com",
};

export const AdminService = {
  getAllAccounts: async (): Promise<BusinessAccount[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...MOCK_ACCOUNTS];
  },

  getPlatformAnalytics: async (): Promise<PlatformAnalytics> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ...MOCK_ANALYTICS };
  },

  getPlatformSettings: async (): Promise<PlatformSettings> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { ...MOCK_SETTINGS };
  },

  updatePlatformSettings: async (settings: PlatformSettings): Promise<PlatformSettings> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    MOCK_SETTINGS = { ...settings };
    return MOCK_SETTINGS;
  },

  createBusinessAccount: async (data: CreateBusinessPayload): Promise<BusinessAccount> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newBusinessId = `biz_${Date.now()}`;
    const newOwnerId = `owner_${Date.now()}`;
    
    const generatedPassword = Math.random().toString(36).slice(-8).toUpperCase();

    const newOwner: User = {
      id: newOwnerId,
      email: data.ownerEmail,
      name: data.ownerName, 
      role: "OWNER",
      businessId: newBusinessId,
      createdAt: new Date().toISOString(),
    };

    const newBusiness: Business = {
      id: newBusinessId,
      ownerId: newOwnerId,
      name: data.businessName,
      type: data.type as BusinessType,
      address: data.address,
      phone: data.phoneNumber,
      categories: [],
      logoUrl: "", 
    };

    const newAccount: BusinessAccount = {
      business: newBusiness,
      owner: newOwner,
      generatedPassword
    };

    MOCK_ACCOUNTS.unshift(newAccount);
    
    MOCK_ANALYTICS.activeBusinesses += 1;
    MOCK_ANALYTICS.totalUsers += 1;

    return newAccount;
  },
};