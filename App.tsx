
import React, { useState, useEffect, useCallback } from 'react';
import { Product, ViewMode } from './types';
import { identifyFlower, autoTagProduct } from './services/geminiService';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  TableCellsIcon, 
  PhotoIcon, 
  XMarkIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// --- Components ---

const Header: React.FC<{ activeView: ViewMode, setView: (v: ViewMode) => void }> = ({ activeView, setView }) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <ShoppingBagIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          FloraAI Quote
        </h1>
      </div>
      <nav className="flex bg-slate-100 p-1 rounded-full">
        <button 
          onClick={() => setView('search')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeView === 'search' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <MagnifyingGlassIcon className="w-4 h-4" /> Tra cứu hình
        </button>
        <button 
          onClick={() => setView('inventory')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeView === 'inventory' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <TableCellsIcon className="w-4 h-4" /> Danh mục
        </button>
      </nav>
    </div>
  </header>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('search');
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ product: Product, confidence: number, reason: string } | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, category: 'Hoa Tươi', imageUrl: '', description: '' });
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem('flora_inventory');
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('flora_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onAddProduct = () => {
    if (!newProduct.imageUrl || !newProduct.name || !newProduct.price) return;
    const p: Product = {
      id: crypto.randomUUID(),
      name: newProduct.name as string,
      price: Number(newProduct.price),
      imageUrl: newProduct.imageUrl as string,
      category: newProduct.category || 'Hoa Tươi',
      description: newProduct.description || '',
      createdAt: Date.now()
    };
    setInventory([p, ...inventory]);
    setNewProduct({ name: '', price: 0, category: 'Hoa Tươi', imageUrl: '', description: '' });
    setIsAdding(false);
  };

  const onSearchByImage = async (base64: string) => {
    setIsSearching(true);
    setSearchResult(null);
    try {
      const result = await identifyFlower(base64, inventory);
      if (result && result.productId) {
        const found = inventory.find(p => p.id === result.productId);
        if (found) {
          setSearchResult({ product: found, confidence: result.confidence, reason: result.reason });
        }
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleAutoFill = async (base64: string) => {
    setIsAutoFilling(true);
    try {
      const { name, description } = await autoTagProduct(base64);
      setNewProduct(prev => ({ ...prev, name, description, imageUrl: base64 }));
    } catch (err) {
      setNewProduct(prev => ({ ...prev, imageUrl: base64 }));
    } finally {
      setIsAutoFilling(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header activeView={view} setView={setView} />

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {view === 'search' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-800">Tra cứu & Báo giá nhanh</h2>
              <p className="text-slate-500">Chụp ảnh hoặc tải hình hoa lên để xem giá ngay lập tức</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center gap-6 shadow-sm hover:border-emerald-400 transition-colors group">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhotoIcon className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="text-center">
                <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all shadow-md active:scale-95 inline-block">
                  Tải hình lên để tìm
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => onSearchByImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <p className="mt-4 text-xs text-slate-400 italic">Hỗ trợ JPG, PNG. AI sẽ nhận diện đặc điểm hoa để khớp giá.</p>
              </div>
            </div>

            {isSearching && (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-emerald-600 font-medium animate-pulse">Đang phân tích và đối soát kho hàng...</p>
              </div>
            )}

            {searchResult && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 flex flex-col md:flex-row animate-in slide-in-from-bottom-4 duration-500">
                <div className="md:w-1/2 aspect-square relative">
                  <img src={searchResult.product.imageUrl} alt={searchResult.product.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <CheckBadgeIcon className="w-4 h-4" />
                    Khớp {Math.round(searchResult.confidence * 100)}%
                  </div>
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">
                      <ShoppingBagIcon className="w-4 h-4" />
                      Thông tin sản phẩm
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">{searchResult.product.name}</h3>
                    <p className="text-slate-600 mb-6 italic">"{searchResult.reason}"</p>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="text-slate-400 text-sm font-medium mb-1 uppercase">Giá niêm yết</div>
                      <div className="text-4xl font-extrabold text-slate-900">
                        {searchResult.product.price.toLocaleString('vi-VN')} <span className="text-lg">₫</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSearchResult(null)}
                    className="mt-8 text-slate-400 hover:text-slate-600 font-medium transition-colors"
                  >
                    Hủy kết quả & tìm tiếp
                  </button>
                </div>
              </div>
            )}

            {!isSearching && !searchResult && inventory.length === 0 && (
              <div className="text-center p-12 bg-slate-100 rounded-3xl">
                <p className="text-slate-400">Bạn chưa có sản phẩm nào trong kho. Hãy qua tab "Danh mục" để thêm hoa.</p>
              </div>
            )}
          </div>
        )}

        {view === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Kho hàng hoa ({inventory.length})</h2>
                <p className="text-slate-500 text-sm">Quản lý giá và hình ảnh nhận diện</p>
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <PlusIcon className="w-5 h-5" /> Thêm hoa mới
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inventory.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button 
                      onClick={() => setInventory(inventory.filter(i => i.id !== p.id))}
                      className="absolute top-2 right-2 p-1.5 bg-black/30 hover:bg-red-500/80 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 truncate mb-1">{p.name}</h4>
                    <p className="text-emerald-600 font-bold text-sm">{p.price.toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>
              ))}
            </div>

            {inventory.length === 0 && (
              <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhotoIcon className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium">Kho chưa có hình ảnh nào</p>
                <p className="text-slate-300 text-sm">Thêm sản phẩm để AI bắt đầu nhận diện</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-lg">Thêm sản phẩm hoa mới</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Image Preview / Upload */}
              <div className="flex flex-col items-center">
                {newProduct.imageUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <img src={newProduct.imageUrl} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setNewProduct({ ...newProduct, imageUrl: '' })}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 transition-colors bg-slate-50">
                    <PhotoIcon className="w-10 h-10 text-slate-300" />
                    <span className="text-slate-400 text-sm font-medium mt-2">Chọn ảnh hoặc chụp trực tiếp</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => handleAutoFill(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                )}
                {isAutoFilling && (
                  <div className="mt-2 flex items-center gap-2 text-emerald-600 text-xs font-semibold">
                    <ArrowPathIcon className="w-3 h-3 animate-spin" /> 
                    AI Đang tự động phân loại tên hoa...
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tên hoa / Phân loại</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Hồng đỏ Đà Lạt loại 1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Giá bán (VNĐ)</label>
                  <input 
                    type="number" 
                    placeholder="250000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mô tả đặc điểm (Cho AI nhận diện tốt hơn)</label>
                  <textarea 
                    placeholder="Mô tả cánh hoa, màu sắc, đặc trưng riêng..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all h-20 resize-none"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
              </div>

              <button 
                onClick={onAddProduct}
                disabled={!newProduct.name || !newProduct.price || !newProduct.imageUrl}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95"
              >
                Xác nhận thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
