"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { rastgeleSec } from "@/utils/choose-random";
import { API } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "all", label: "Tüm Menü" },
  { id: "soup", label: "Çorbalar" },
  { id: "mainCourse", label: "Ana Yemekler" },
  { id: "side", label: "Eşlikçiler" },
  { id: "cold", label: "Soğuklar" },
  { id: "dessert", label: "Tatlılar" }
];

export default function MenuBoard({ date, selectedFoods, setSelectedFoods }) {
  const [dailyMenu, setDailyMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (!date) return;

    const fetchOrCreateMenu = async () => {
      setLoading(true);
      try {
        const existingMenus = await API.getMenuByDate(date);

        if (existingMenus.length > 0) {
          setDailyMenu(existingMenus[0]);
        } else {
          const foodPool = await API.getAllFoods();

          // 3. Havuzdan rastgele yeni bir menü oluştur
          const newMenu = {
            date: date,
            soup: rastgeleSec(foodPool.soup, 2),
            mainCourse: rastgeleSec(foodPool.mainCourse, 3),
            side: rastgeleSec(foodPool.side, 2),
            cold: rastgeleSec(foodPool.cold, 2),
            dessert: rastgeleSec(foodPool.dessert, 2)
          };

          // 4."Bu yeni menüyü veritabanına kaydet" de
          const savedMenu = await API.saveDailyMenu(newMenu);
          setDailyMenu(savedMenu);
        }
      } catch (error) {
        console.error("Menü yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateMenu();
  }, [date]);

  // YEMEĞE TIKLAMA MOTORU (Varsayılan olarak 1 Porsiyon ekler)
  const handleFoodClick = (food, categoryLabel) => {
    const isAlreadySelected = selectedFoods.find(item => item.name === food.name);

    if (isAlreadySelected) {
      setSelectedFoods(selectedFoods.filter(item => item.name !== food.name));
    } else {
      // Sadece bu kategoriden olmayan (eski) seçimleri filtrele ve yenisini ekle
      const filteredSelections = selectedFoods.filter(item => item.category !== categoryLabel);

      setSelectedFoods([...filteredSelections, {
        name: food.name,
        basePrice: food.price,
        price: food.price,
        portion: 1,
        category: categoryLabel
      }]);
    }
  };

  const handlePortionChange = (e, food, newPortion, categoryLabel) => {
    e.stopPropagation();

    const updatedFoods = selectedFoods.map(item => {
      if (item.name === food.name) {
        return {
          ...item,
          portion: newPortion,
          price: item.basePrice * newPortion
        };
      }
      return item;
    });

    setSelectedFoods(updatedFoods);
  };

  if (!dailyMenu || loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Gruplandırılmış Render Fonksiyonu
  const renderFoodGrid = (items, categoryLabel) => {
    if (!items || items.length === 0) return null;

    return (
      <div key={categoryLabel} className="mb-14">
        {/* Kategori Başlığı */}
        {activeCategory === "all" && (
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-4xl font-bebas text-gray-800 dark:text-white tracking-[0.1em] transition-colors duration-700">{categoryLabel}</h3>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 dark:from-primary-light/50 to-transparent transition-colors duration-700"></div>
          </div>
        )}

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {items.map((food) => {
              const selectedItem = selectedFoods.find(item => item.name === food.name);
              const isSelected = !!selectedItem;
              const displayPrice = isSelected ? selectedItem.price : food.price;
              const currentPortion = isSelected ? selectedItem.portion : 1;

              return (
                <motion.div
                  key={food.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`group relative overflow-hidden rounded-[28px] cursor-pointer bg-white dark:bg-[#111111] transition-all duration-400 flex flex-col ${isSelected
                    ? "ring-4 ring-primary ring-offset-2 ring-offset-background dark:ring-offset-[#111111] shadow-[0_20px_40px_rgba(20,184,166,0.25)] dark:shadow-[0_0_25px_rgba(139,92,246,0.4)] border-transparent"
                    : "border border-gray-100 dark:border-white/10 shadow-apple dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-apple-hover dark:hover:border-primary-light/50"
                    }`}
                  onClick={() => handleFoodClick(food, categoryLabel)}
                >
                  {/* RESİM BÖLÜMÜ */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-black">
                    <Image
                      src={food.image}
                      alt={food.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isSelected ? "brightness-[0.4] blur-[3px]" : ""}`}
                      priority={food.name === items[0].name}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-4 border-white"
                        >
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      </div>
                    )}
                    {/* Kategori Rozeti - Açık Temadan Koyu Temaya Geçiş */}
                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-full shadow-sm dark:border dark:border-white/10 transition-colors duration-700">
                      <span className="text-gray-700 dark:text-white/90 text-[11px] font-rajdhani font-extrabold tracking-widest uppercase">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* İÇERİK BÖLÜMÜ */}
                  <div className="p-6 flex-grow flex flex-col justify-between z-20 relative bg-white dark:bg-[#111111] transition-colors duration-700">
                    <div>
                      <h3 className="font-bebas text-[28px] text-gray-800 dark:text-white tracking-wide leading-tight mb-1 group-hover:text-primary transition-colors dark:drop-shadow-md">
                        {food.name}
                      </h3>
                      <p className="font-rajdhani text-[26px] font-bold text-primary-dark dark:text-primary-light group-hover:text-primary dark:group-hover:text-primary transition-colors dark:drop-shadow-md">
                        {displayPrice} ₺
                      </p>
                    </div>

                    {/* Porsiyon Kontrolleri */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="flex gap-2 justify-center py-2"
                        >
                          {[0.5, 1, 1.5, 2].map(p => (
                            <button
                              key={p}
                              onClick={(e) => handlePortionChange(e, food, p, categoryLabel)}
                              className={`w-11 h-11 rounded-full dark:rounded-[22px] font-rajdhani font-bold text-sm transition-all duration-300 border dark:border border-transparent dark:border-white/20 flex items-center justify-center shadow-sm
                                ${currentPortion === p
                                  ? "bg-primary border-primary text-white shadow-[0_5px_15px_rgba(20,184,166,0.3)] dark:shadow-[0_0_10px_rgba(139,92,246,0.4)] scale-110 dark:text-white"
                                  : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-black/60 dark:text-gray-300 hover:border-primary/40 dark:hover:border-primary-light/70 hover:bg-primary/5 hover:text-primary dark:hover:text-primary-light"
                                }`}
                            >
                              {p}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className="relative px-8 py-3.5 rounded-full font-rajdhani text-[18px] font-extrabold tracking-widest transition-all duration-300 z-10 overflow-hidden group shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-lg"
          >
            {activeCategory === category.id ? (
              <motion.div
                layoutId="activeCategoryLight"
                className="absolute inset-0 bg-primary rounded-full z-[-1] dark:bg-gradient-to-r dark:from-primary-dark dark:via-primary dark:to-primary-light"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            ) : (
              <div className="absolute inset-0 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 group-hover:border-gray-300 dark:group-hover:border-primary-light/50 rounded-full z-[-1] transition-colors duration-300" />
            )}
            <span className={`relative uppercase transition-colors duration-300 ${activeCategory === category.id ? "text-white dark:drop-shadow-md" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}>
              {category.label}
            </span>
          </button>
        ))}
      </div>

      {/* Grid Listeleme */}
      <div className="min-h-[500px]">
        {(activeCategory === "all" || activeCategory === "soup") && renderFoodGrid(dailyMenu.soup, "ÇORBA")}
        {(activeCategory === "all" || activeCategory === "mainCourse") && renderFoodGrid(dailyMenu.mainCourse, "ANA YEMEK")}
        {(activeCategory === "all" || activeCategory === "side") && renderFoodGrid(dailyMenu.side, "EŞLİKÇİ")}
        {(activeCategory === "all" || activeCategory === "cold") && renderFoodGrid(dailyMenu.cold, "SOĞUK")}
        {(activeCategory === "all" || activeCategory === "dessert") && renderFoodGrid(dailyMenu.dessert, "TATLI")}
      </div>
    </div>
  );
}