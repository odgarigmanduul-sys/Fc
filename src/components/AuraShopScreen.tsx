import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Eye, Heart, Shield, Flame, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/sound';
import { AuraSkin, generate60Skins } from '../utils/auraData';

interface AuraShopScreenProps {
  gems: number;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  activeAura: AuraSkin | null;
  setActiveAura: React.Dispatch<React.SetStateAction<AuraSkin | null>>;
  unlockedAuraIds: number[];
  setUnlockedAuraIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function AuraShopScreen({ 
  gems, 
  setGems, 
  activeAura, 
  setActiveAura, 
  unlockedAuraIds, 
  setUnlockedAuraIds 
}: AuraShopScreenProps) {
  
  // High dopamine 60 skins load
  const [allSkins] = useState<AuraSkin[]>(() => generate60Skins());
  const [activeRarityTag, setActiveRarityTag] = useState<"All" | "Common" | "Rare" | "Epic" | "Legendary" | "Cosmic">("All");

  // Buy skin handler
  const handlePurchaseSkin = (skin: AuraSkin) => {
    if (unlockedAuraIds.includes(skin.id)) {
      // Already unlocked, equip it!
      setActiveAura(skin);
      sounds.playCardFlip();
      return;
    }

    if (gems < skin.price) {
      sounds.playWrong();
      alert("🚨 Хангалттай Эрдэнэ хүрэлцэхгүй байна! Слот машин буюу Дасгал ажил хийж Эрдэнэ олж ирнэ үү.");
      return;
    }

    // Deduct and unlock
    setGems(prev => prev - skin.price);
    setUnlockedAuraIds(prev => [...prev, skin.id]);
    setActiveAura(skin);
    
    sounds.playSlotWin();
  };

  // Filter skins list
  const filteredSkins = allSkins.filter(skin => {
    if (activeRarityTag === "All") return true;
    return skin.rarity === activeRarityTag;
  });

  return (
    <div className="flex-1 flex flex-col justify-start bg-[#131F24] text-white select-none">
      
      {/* Visual Shop Title banner */}
      <div className="p-4 bg-gradient-to-r from-purple-900 to-amber-900 text-center relative overflow-hidden select-none shrink-0 mb-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/25 via-transparent to-transparent opacity-80" />
        
        <span className="text-3xl block animate-bounce">🎨🛡️💎</span>
        <h3 className="text-sm font-black text-amber-300 tracking-wider uppercase mt-1">Аура Хүрээний Их Дэлгүүр</h3>
        <p className="text-[9px] text-amber-100/70 font-semibold uppercase mt-0.5 max-w-[280px] mx-auto">
          60 ширхэг ховор Аз тааруулах хамгаалалтын аура цуглуулаарай!
        </p>
      </div>

      {/* Rarity filter sub-tabs tags list */}
      <div className="px-4 flex gap-1.5 overflow-x-auto pb-3Scroll select-none py-1 mb-3 scrollbar-none shrink-0">
        {(["All", "Common", "Rare", "Epic", "Legendary", "Cosmic"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setActiveRarityTag(r)}
            className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-tight cursor-pointer shrink-0 transition-all uppercase border ${
              activeRarityTag === r 
                ? 'bg-amber-400 text-neutral-900 border-amber-300 shadow-md transform scale-102 font-black' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {r === 'All' ? 'Бүгд' : r}
          </button>
        ))}
      </div>

      {/* Grid container of corresponding skins */}
      <div className="flex-1 overflow-y-auto px-4 pb-12 grid grid-cols-2 gap-3.5 scrollbar-thin scrollbar-thumb-amber-600/10">
        {filteredSkins.map((skin) => {
          const isOwn = unlockedAuraIds.includes(skin.id);
          const isEquipped = activeAura?.id === skin.id;

          // Compute rarity color pill
          let rarityColorClass = "text-gray-400 bg-gray-500/10";
          let bgStyleClass = "bg-neutral-900";
          let specialBadge = "";

          if (skin.rarity === 'Rare') {
            rarityColorClass = "text-purple-400 bg-purple-500/10";
            bgStyleClass = "bg-gradient-to-b from-neutral-900 via-neutral-900 to-purple-950/20";
          } else if (skin.rarity === 'Epic') {
            rarityColorClass = "text-pink-400 bg-pink-500/10";
            bgStyleClass = "bg-gradient-to-b from-neutral-900 via-neutral-900 to-rose-950/30";
            specialBadge = "💥 CARTOON";
          } else if (skin.rarity === 'Legendary') {
            rarityColorClass = "text-amber-400 bg-amber-500/15 animate-pulse";
            bgStyleClass = "bg-gradient-to-b from-neutral-900 over-y-hidden via-neutral-900 to-amber-950/50 border border-amber-500/30";
            specialBadge = "🔥 ANIME DEITY";
          } else if (skin.rarity === 'Cosmic') {
            rarityColorClass = "text-fuchsia-450 bg-fuchsia-500/20 animate-pulse border border-fuchsia-500/30";
            bgStyleClass = "bg-gradient-to-b from-neutral-900 via-slate-900 to-indigo-950/60 border-2 border-fuchsia-500/20";
            specialBadge = "🌀 GOD-TIER ULTIMATE";
          }

          return (
            <div 
              key={skin.id}
              className={`p-3.5 rounded-2xl border-2 select-none flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${bgStyleClass} ${
                isEquipped 
                  ? 'border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.5)] ' + skin.glowStyle
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {/* Top info badge tags */}
              <div className="flex flex-col gap-1 items-start mb-2 z-10">
                <div className="w-full flex justify-between items-center">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${rarityColorClass}`}>
                    {skin.rarity}
                  </span>
                  {specialBadge && (
                    <span className="text-[7px] font-black text-white/90 bg-black/60 px-1 rounded-sm tracking-wider">
                      {specialBadge}
                    </span>
                  )}
                </div>
                {isOwn && (
                  <span className="text-[7px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-1 py-0.5 rounded-sm">
                    Таны Сонголт ✅
                  </span>
                )}
              </div>

              {/* Avatar aura mockup preview */}
              <div className="flex justify-center py-2.5 mb-2 relative z-10">
                {/* Simulated aura element glow ring background */}
                <div className="absolute inset-0 m-auto w-14 h-14 bg-gradient-to-tr opacity-20 blur-xl scale-125 rounded-full" />
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-transform bg-neutral-850 justify-self-center relative border-3 ${skin.glowStyle} ${skin.animationClass}`}>
                  {skin.emoji}
                </div>
              </div>

              {/* Skin text descriptors */}
              <div className="text-center space-y-1 select-none z-10">
                <h4 className="text-[10px] font-black leading-tight text-white line-clamp-2 min-h-[24px]">
                  {skin.name}
                </h4>
                <p className="text-[8px] text-gray-400/90 font-bold max-w-[140px] block mx-auto leading-normal min-h-[30px] line-clamp-3">
                  {skin.desc}
                </p>
              </div>

              {/* Bottom interactive action button */}
              <div className="mt-3 pt-2 border-t border-white/5 z-10">
                {isEquipped ? (
                  <button 
                    disabled 
                    className="w-full bg-amber-400 text-neutral-950 text-[10px] font-black py-2 rounded-xl border-none cursor-default uppercase shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                  >
                     Идэвхтэй ✨
                  </button>
                ) : isOwn ? (
                  <button
                    onClick={() => handlePurchaseSkin(skin)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[10px] font-extrabold py-2 rounded-xl transition-all cursor-pointer uppercase shadow-md shadow-emerald-950/60"
                  >
                    Тоноглох 🛡️
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchaseSkin(skin)}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white text-[10px] font-extrabold py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer uppercase border border-white/5 shadow-md"
                  >
                    <span>💎 {skin.price}</span>
                  </button>
                )}
              </div>

              {/* Index indicator */}
              <div className="absolute right-2 top-2 text-[7px] font-mono text-gray-600 font-bold opacity-60 z-10">
                #{skin.id}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
