import React, { useState } from 'react';
import { Specimen } from '../types';
import { X, Search, Compass, ChevronRight } from 'lucide-react';

interface IndexDrawerProps {
  isOpen: boolean;
  theme: 'light' | 'dark';
  flowers: Specimen[];
  onSelectFlower: (flower: Specimen) => void;
  onClose: () => void;
}

export const IndexDrawer: React.FC<IndexDrawerProps> = ({
  isOpen,
  theme,
  flowers,
  onSelectFlower,
  onClose
}) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const searchLower = searchTerm.toLowerCase();
  const searchResults = flowers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchLower) ||
      f.vietnameseName.toLowerCase().includes(searchLower) ||
      f.latinName.toLowerCase().includes(searchLower) ||
      f.indexNumber.includes(searchLower) ||
      f.categoryLabelVi.toLowerCase().includes(searchLower)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end backdrop-blur-xl bg-black/60 animate-fadeIn">
      {/* Drawer Container: Full height on desktop, Bottom Sheet / Full screen on iPhone */}
      <div 
        className={`w-full sm:max-w-md h-full flex flex-col border-l shadow-2xl transition-colors duration-300 ${
          isDark 
            ? 'bg-[#151614] text-[#ede9df] border-white/15' 
            : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/15'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-current/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono uppercase tracking-widest font-bold">
              Bách Khoa Toàn Thư Hoa ({flowers.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Search Input (16px font to prevent iOS Safari auto-zoom) */}
        <div className="p-4 border-b border-current/10 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo tên hoa, giống Latinh, số hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-current/20 bg-black/5 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:opacity-50"
            />
          </div>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3 space-y-2 pb-safe">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center opacity-60 text-xs font-mono">
              Không tìm thấy tác phẩm hoa phù hợp với từ khóa "{searchTerm}".
            </div>
          ) : (
            searchResults.map((flower) => (
              <div
                key={flower.id}
                onClick={() => {
                  onClose();
                  onSelectFlower(flower);
                }}
                className="p-3 rounded-2xl border border-current/10 hover:border-amber-400/50 bg-black/5 dark:bg-white/5 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-all group"
              >
                <img
                  src={flower.image}
                  alt={flower.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-current/10"
                />

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block">
                    #{flower.indexNumber} · {flower.categoryLabelVi}
                  </span>
                  <h4 className="font-display font-medium text-sm truncate">
                    {flower.vietnameseName || flower.name}
                  </h4>
                  <p className="font-editorial italic text-xs opacity-75 truncate">
                    {flower.latinName}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
