import React, { useState, useEffect } from 'react';
import { initialFlowers } from './data/flowers';
import { Specimen } from './types';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { DuoCollection } from './components/DuoCollection';
import { MobileDock } from './components/MobileDock';
import { SpecimenModal } from './components/SpecimenModal';
import { SommelierModal } from './components/SommelierModal';
import { MoodboardModal } from './components/MoodboardModal';
import { CommissionModal } from './components/CommissionModal';
import { WorkshopModal } from './components/WorkshopModal';
import { IndexDrawer } from './components/IndexDrawer';
import { Footer } from './components/Footer';
import { Sparkles, Calendar } from 'lucide-react';

export const App: React.FC = () => {
  // Theme State with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ju_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  // Wishlist (Moodboard) State with localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ju_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['flower-1791388842716']; // Default first specimen
  });

  // Modals & Navigation state
  const [selectedFlower, setSelectedFlower] = useState<Specimen | null>(null);
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);
  const [isMoodboardOpen, setIsMoodboardOpen] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [commissionFlower, setCommissionFlower] = useState<Specimen | null>(null);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  // Sync theme with html root element
  useEffect(() => {
    try {
      localStorage.setItem('ju_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }, [theme]);

  // Sync wishlist with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ju_wishlist', JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextFlower = () => {
    if (!selectedFlower) return;
    const currentIndex = initialFlowers.findIndex((f) => f.id === selectedFlower.id);
    const nextIndex = (currentIndex + 1) % initialFlowers.length;
    setSelectedFlower(initialFlowers[nextIndex]);
  };

  const handlePrevFlower = () => {
    if (!selectedFlower) return;
    const currentIndex = initialFlowers.findIndex((f) => f.id === selectedFlower.id);
    const prevIndex = (currentIndex - 1 + initialFlowers.length) % initialFlowers.length;
    setSelectedFlower(initialFlowers[prevIndex]);
  };

  const handleOpenCommissionWithFlower = (flower: Specimen) => {
    setCommissionFlower(flower);
    setIsCommissionOpen(true);
  };

  const handleOpenGeneralCommission = () => {
    setCommissionFlower(null);
    setIsCommissionOpen(true);
  };

  const wishlistFlowers = initialFlowers.filter((f) => wishlistIds.includes(f.id));

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'theme-dark bg-[#141414] text-[#ede9df]' : 'bg-[#dcd8cf] text-[#141414]'
    }`}>
      {/* 1. Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        wishlistCount={wishlistIds.length}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenMoodboard={() => setIsMoodboardOpen(true)}
        onOpenSommelier={() => setIsSommelierOpen(true)}
        onOpenCommission={handleOpenGeneralCommission}
      />

      {/* 2. Main Content */}
      <main className="flex-1 w-full pb-20 md:pb-8">
        {/* Hero Slider with iPhone 4:5 Portrait Canvas */}
        <HeroSlider
          theme={theme}
          onExploreCollection={() => {
            const el = document.getElementById('collection-archive');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Core iPhone Duo 2-Column Collection Lookbook */}
        <DuoCollection
          flowers={initialFlowers}
          theme={theme}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onSelectFlower={(flower) => setSelectedFlower(flower)}
        />

        {/* Workshop Spotlight Banner */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 my-10">
          <div className="p-6 sm:p-8 rounded-3xl border border-current/15 bg-black/5 dark:bg-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block">
                ATELIER MASTERCLASS & CORPORATE WORKSHOPS
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">
                Không Gian Trải Nghiệm Hoa Cùng JU et Saigon
              </h3>
              <p className="text-xs sm:text-sm font-sans opacity-80 max-w-xl leading-relaxed">
                Tổ chức workshop cắm hoa thư giãn tại văn phòng doanh nghiệp hoặc tham gia các buổi Masterclass riêng tư tại Lầu 1, 31 Nguyễn Trãi, Quận 1.
              </p>
            </div>

            <button
              onClick={() => setIsWorkshopOpen(true)}
              className={`px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0 ${
                theme === 'dark'
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Khám Phá Các Khóa Học</span>
            </button>
          </div>
        </section>
      </main>

      {/* 3. Footer */}
      <Footer
        theme={theme}
        onOpenCommission={handleOpenGeneralCommission}
        onOpenWorkshops={() => setIsWorkshopOpen(true)}
      />

      {/* 4. Floating Mobile Dock on iPhone */}
      <MobileDock
        theme={theme}
        flowerCount={initialFlowers.length}
        wishlistCount={wishlistIds.length}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenSommelier={() => setIsSommelierOpen(true)}
        onOpenMoodboard={() => setIsMoodboardOpen(true)}
        onOpenCommission={handleOpenGeneralCommission}
      />

      {/* 5. Modals (iOS Bottom Sheet Drawer on Mobile) */}
      <SpecimenModal
        flower={selectedFlower}
        isOpen={!!selectedFlower}
        theme={theme}
        isWishlisted={selectedFlower ? wishlistIds.includes(selectedFlower.id) : false}
        onToggleWishlist={toggleWishlist}
        onClose={() => setSelectedFlower(null)}
        onCommission={handleOpenCommissionWithFlower}
        onNext={handleNextFlower}
        onPrev={handlePrevFlower}
      />

      <SommelierModal
        isOpen={isSommelierOpen}
        theme={theme}
        flowers={initialFlowers}
        onClose={() => setIsSommelierOpen(false)}
        onSelectFlower={(flower) => setSelectedFlower(flower)}
        onCommission={handleOpenCommissionWithFlower}
      />

      <MoodboardModal
        isOpen={isMoodboardOpen}
        theme={theme}
        wishlistFlowers={wishlistFlowers}
        onRemove={toggleWishlist}
        onClear={() => setWishlistIds([])}
        onSelectFlower={(flower) => setSelectedFlower(flower)}
        onClose={() => setIsMoodboardOpen(false)}
      />

      <CommissionModal
        isOpen={isCommissionOpen}
        theme={theme}
        selectedFlower={commissionFlower}
        onClose={() => setIsCommissionOpen(false)}
      />

      <WorkshopModal
        isOpen={isWorkshopOpen}
        theme={theme}
        onClose={() => setIsWorkshopOpen(false)}
      />

      <IndexDrawer
        isOpen={isIndexOpen}
        theme={theme}
        flowers={initialFlowers}
        onSelectFlower={(flower) => setSelectedFlower(flower)}
        onClose={() => setIsIndexOpen(false)}
      />
    </div>
  );
};

export default App;
