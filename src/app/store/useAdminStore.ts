import { create } from "zustand";
import { AdminService, BusinessAccount } from "@/app/services/admin.service";
import { PlatformAnalytics, PlatformSettings, CreateBusinessPayload } from "@/app/types/admin";
import toast from "react-hot-toast";

interface AdminState {
  accounts: BusinessAccount[];
  analytics: PlatformAnalytics | null;
  settings: PlatformSettings | null;
  
  isLoading: boolean;
  isCreating: boolean;
  isSettingsLoading: boolean;

  fetchAccounts: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  
  createAccount: (data: CreateBusinessPayload) => Promise<string | null>; 
  updateSettings: (data: PlatformSettings) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  accounts: [],
  analytics: null,
  settings: null,
  
  isLoading: false,
  isCreating: false,
  isSettingsLoading: false,

  fetchAccounts: async () => {
    set({ isLoading: true });
    try {
      const data = await AdminService.getAllAccounts();
      set({ accounts: data, isLoading: false });
    } catch (err) {
      console.error(err);
      toast.error("Could not load businesses");
      set({ isLoading: false });
    }
  },

  fetchAnalytics: async () => {
    try {
      const data = await AdminService.getPlatformAnalytics();
      set({ analytics: data });
    } catch (err) {
      console.error(err);
    }
  },

  fetchSettings: async () => {
    try {
      const data = await AdminService.getPlatformSettings();
      set({ settings: data });
    } catch (err) {
      console.error(err);
    }
  },

  createAccount: async (data: CreateBusinessPayload) => {
    set({ isCreating: true });
    try {
      const newAccount = await AdminService.createBusinessAccount(data);
      
      const currentAccounts = get().accounts;
      set({ 
        accounts: [newAccount, ...currentAccounts],
        isCreating: false 
      });

      get().fetchAnalytics();
      
      toast.success(`${data.businessName} created successfully`);
      
      return newAccount.generatedPassword || null;
    } catch (err) {
      console.error(err);
      toast.error("Failed to create business account");
      set({ isCreating: false });
      return null;
    }
  },

  updateSettings: async (data: PlatformSettings) => {
    set({ isSettingsLoading: true });
    try {
      const updated = await AdminService.updatePlatformSettings(data);
      set({ settings: updated, isSettingsLoading: false });
      toast.success("Platform settings saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
      set({ isSettingsLoading: false });
    }
  },
}));