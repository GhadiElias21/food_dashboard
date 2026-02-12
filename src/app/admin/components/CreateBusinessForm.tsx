"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminStore } from "@/app/store/useAdminStore";
import { CreateBusinessPayload } from "@/app/types/admin";
import toast from "react-hot-toast";

const BUSINESS_TYPES = [
  { id: "RESTAURANT", label: "Restaurant", icon: "🍽️", color: "from-orange-500/20 to-red-500/20" },
  { id: "SUPERMARKET", label: "Supermarket", icon: "🛒", color: "from-blue-500/20 to-cyan-500/20" },
  { id: "VEGETABLES", label: "Vegetables", icon: "🥦", color: "from-green-500/20 to-emerald-500/20" },
  { id: "TOBACCO", label: "Tobacco", icon: "🚬", color: "from-amber-700/20 to-yellow-600/20" },
  { id: "HYGIENE", label: "Hygiene", icon: "🧴", color: "from-purple-500/20 to-pink-500/20" },
  { id: "CUSTOM", label: "Custom", icon: "✨", color: "from-gray-500/20 to-zinc-500/20" },
];

export default function CreateBusinessForm({ onSuccess }: { onSuccess: () => void }) {
  const { createAccount, isCreating } = useAdminStore();
  
  const [formData, setFormData] = useState<CreateBusinessPayload>({
    businessName: "",
    ownerName: "",
    ownerEmail: "",
    address: "",
    phoneNumber: "",
    type: "RESTAURANT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.ownerEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    await createAccount(formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">01</span>
              Business Details
            </h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 ml-1">Business Name</label>
                  <input
                    required
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g., The Midnight Diner"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 ml-1">Owner Name</label>
                  <input
                    required
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="e.g., John Doe"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div>
                   <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 ml-1">Owner Email</label>
                   <input
                    required
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="owner@example.com"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 ml-1">Address</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full street address..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>
          
           <div className="flex justify-end pt-2">
             <button
               type="submit"
               disabled={isCreating}
               className="px-8 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {isCreating ? (
                 <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
               ) : (
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
               )}
               Create Account & Generate Password
             </button>
          </div>
        </div>

        <div className="lg:col-span-1">
           <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl h-full">
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">02</span>
                Business Type
             </h3>
             
             <div className="grid grid-cols-1 gap-3">
               {BUSINESS_TYPES.map((type) => {
                 const isActive = formData.type === type.id;
                 return (
                   <div 
                     key={type.id}
                     onClick={() => setFormData({ ...formData, type: type.id })}
                     className={`cursor-pointer relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                       isActive 
                        ? "bg-white/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
                        : "bg-black/20 border-white/5 hover:border-white/10 hover:bg-white/5"
                     }`}
                   >
                     {isActive && (
                       <motion.div 
                         layoutId="activeTypeGlow"
                         className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-20`}
                       />
                     )}
                     <div className="relative z-10 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <span className="text-2xl">{type.icon}</span>
                         <span className={`font-medium ${isActive ? "text-white" : "text-zinc-400"}`}>
                           {type.label}
                         </span>
                       </div>
                       {isActive && (
                         <motion.div
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                         >
                           <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                         </motion.div>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>
      </div>
    </form>
  );
}