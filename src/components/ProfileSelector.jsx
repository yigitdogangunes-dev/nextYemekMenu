"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { API } from "@/services/api";

// --- SKELETON COMPONENT (Yüklenme Durumu İçin Parlayan Kutucuklar) ---
const ProfileSkeleton = () => (
  <div className="group relative h-48 sm:h-56 rounded-[30px] flex flex-col items-center justify-center border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 animate-pulse">
    <div className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] rounded-full bg-gray-200 dark:bg-white/10 mb-4" />
    <div className="h-6 w-20 bg-gray-200 dark:bg-white/10 rounded-md" />
  </div>
);

export default function ProfileSelector({ selectedProfile, setSelectedProfile }) {
  // SWR ile kullanıcıları çekiyoruz
  const { data: profiles, error, isLoading } = useSWR('/users', API.getUsers);

  return (
    <div className="w-full relative">
      <div className="flex items-center gap-6 mb-8">
        <h2 className="font-bebas text-4xl text-foreground tracking-widest drop-shadow-sm opacity-90 transition-colors duration-700">
          PROFİLİNİZİ SEÇİN
        </h2>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-300 dark:from-primary-light/50 to-transparent transition-colors duration-700"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full col-span-full"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <ProfileSkeleton key={`skeleton-${i}`} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-10 text-center font-rajdhani text-red-500 font-bold"
            >
              Profiller yüklenemedi. Lütfen sayfayı yenileyin.
            </motion.div>
          ) : (
            <motion.div 
              key="profiles-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full col-span-full"
            >
              {profiles?.map((profile, i) => {
                const isSelected = selectedProfile === profile.firstName;
                const avatarImage = profile.image || "/assets/avatar.jpg";
                
                return (
                  <motion.div 
                    key={profile._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                    onClick={() => setSelectedProfile(isSelected ? null : profile.firstName)}
                    className={`group relative h-48 sm:h-56 rounded-[30px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ease-out border ${
                      isSelected 
                        ? "border-primary shadow-[0_0_30px_rgba(20,184,166,0.3)] dark:shadow-[0_0_40px_rgba(139,92,246,0.3)] bg-card dark:bg-gradient-to-b dark:from-primary-dark/20 dark:to-black/80 z-20 scale-[1.03] ring-1 ring-primary-light/50" 
                        : "border-gray-200/50 dark:border-white/5 bg-card dark:bg-white/5 shadow-apple dark:shadow-none hover:-translate-y-1 hover:border-gray-300 dark:hover:border-white/20 backdrop-blur-3xl"
                    } overflow-hidden hover:scale-[1.02]`}
                  >
                    {/* ... rest of the card looks fine ... */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:hidden z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out dark:hidden"></div>
                    
                    <div className={`absolute inset-0 transition-opacity duration-700 ${isSelected ? "opacity-30" : "opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20"}`}>
                       <Image 
                        src={avatarImage} 
                        alt="bg" 
                        fill 
                        className="object-cover blur-xl grayscale" 
                        sizes="(max-width: 768px) 20vw, 15vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-transparent to-gray-50/80 dark:to-black/90 -z-10 transition-colors duration-700"></div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className={`relative w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] rounded-full overflow-hidden transition-all duration-500 shadow-md dark:shadow-2xl border-2 ${
                        isSelected 
                          ? "border-primary scale-110 drop-shadow-[0_8px_16px_rgba(20,184,166,0.3)] dark:drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] filter-none grayscale-0" 
                          : "border-gray-200 dark:border-white/10 grayscale opacity-60 dark:opacity-50 group-hover:opacity-90 group-hover:grayscale-[50%] dark:group-hover:grayscale-[50%] group-hover:shadow-lg dark:group-hover:scale-105"
                      }`}>
                        <Image 
                          src={avatarImage} 
                          alt={`${profile.firstName} Avatar`} 
                          fill 
                          className="object-cover"
                          sizes="(max-width: 768px) 70px, 90px"
                        />
                      </div>
                      
                      <motion.div layout className="flex flex-col items-center">
                        <p className={`font-rajdhani text-2xl font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                           isSelected ? "text-primary" : "text-gray-600 dark:text-white/60 group-hover:text-foreground"
                        } line-clamp-1 break-all px-2 text-center w-full`}>
                          {profile.firstName}
                        </p>
                        
                        <div className={`mt-2 w-2 h-2 rounded-full transition-all duration-400 ${isSelected ? "bg-primary shadow-[0_0_10px_rgba(20,184,166,0.6)] dark:shadow-[0_0_12px_rgba(139,92,246,0.8)] scale-100" : "bg-transparent scale-0"}`} />
                      </motion.div>
                    </div>
                    
                    {isSelected && (
                      <motion.div 
                        layoutId="outlineProfile"
                        className="absolute inset-0 border-2 border-primary rounded-[30px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}