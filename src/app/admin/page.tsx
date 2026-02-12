"use client";

import { useEffect, useState, useMemo } from "react";
import { useAdminStore } from "@/app/store/useAdminStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import PlatformAnalyticsView from "./components/PlatformAnalytics";
import GlobalSettings from "./components/GlobalSettings";
import CreateBusinessForm from "./components/CreateBusinessForm";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const TabButton = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active ? "text-white" : "text-zinc-400 hover:text-white"
    }`}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-white/10 border border-white/10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10 capitalize">{label}</span>
  </button>
);

export default function SuperAdminPage() {
  const { user, logout } = useAuthStore();
  const { 
    accounts, 
    analytics, 
    settings,
    isLoading, 
    fetchAccounts, 
    fetchAnalytics, 
    fetchSettings 
  } = useAdminStore();
  
  const [activeTab, setActiveTab] = useState<"businesses" | "create" | "analytics" | "settings">("businesses");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "SUPER_ADMIN") {
      router.replace("/");
      return;
    }
    fetchAccounts();
    fetchAnalytics();
    fetchSettings();
  }, [user, fetchAccounts, fetchAnalytics, fetchSettings, router]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => 
      acc.business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.owner.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [accounts, searchQuery]);

  const copyCredentials = (email: string, pass: string) => {
    const text = `Email: ${email}\nPassword: ${pass}`;
    navigator.clipboard.writeText(text);
    toast.success("Credentials copied to clipboard");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Platform <span className="text-indigo-400">Overview</span>
            </h1>
            <p className="text-zinc-400">Manage businesses, monitor performance, and configure settings.</p>
          </div>
          
          <div className="flex items-center gap-6 bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-2 pr-6 pl-2 rounded-full">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{user.email}</span>
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">Super Admin</span>
            </div>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button
              onClick={() => {
                logout();
                router.replace("/");
              }}
              className="text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex p-1 bg-zinc-900/80 backdrop-blur-md border border-white/5 rounded-full">
            {(["businesses", "create", "analytics", "settings"] as const).map(tab => (
              <TabButton key={tab} active={activeTab === tab} label={tab === 'create' ? '+ Create' : tab} onClick={() => setActiveTab(tab)} />
            ))}
          </div>

          {activeTab === "businesses" && (
             <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative group w-full md:w-64">
                 <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                   <svg className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search businesses..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                 />
               </div>
             </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "businesses" && (
            <motion.div 
              key="businesses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAccounts.map(({ business, owner, generatedPassword }) => (
                  <motion.div 
                    layout
                    key={business.id} 
                    className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 transition-all relative group overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

                      <div className="flex justify-between mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white font-bold border border-white/5 shadow-inner">
                            {business.name.substring(0,2).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-zinc-400 border border-white/5 flex items-center">{business.type}</span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-white relative z-10">{business.name}</h3>
                      <p className="text-sm text-zinc-500 mb-4 relative z-10">{business.address}</p>
                      
                      {generatedPassword && (
                        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 relative z-20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">New Password Generated</p>
                                    <p className="text-sm font-mono text-white select-all">
                                        {generatedPassword}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => copyCredentials(owner.email, generatedPassword)}
                                    className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                                    title="Copy Credentials"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-white/5 relative z-10">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Owner</p>
                          <p className="text-sm text-zinc-300 font-medium">{owner.name}</p>
                          <p className="text-xs text-zinc-500">{owner.email}</p>
                      </div>
                  </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "create" && (
             <motion.div 
               key="create"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">Register New Business</h2>
                    <p className="text-zinc-400">Fill in the details below to onboard a new vendor to the platform.</p>
                </div>
                <CreateBusinessForm onSuccess={() => setActiveTab('businesses')} />
             </motion.div>
          )}

          {activeTab === "analytics" && analytics && (
             <motion.div 
               key="analytics"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
             >
                <PlatformAnalyticsView data={analytics} />
             </motion.div>
          )}

          {activeTab === "settings" && settings && (
             <motion.div 
               key="settings"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
             >
                <GlobalSettings settings={settings} />
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}