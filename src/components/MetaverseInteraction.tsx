import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Users, MessageSquare, Zap, Target, Home, Smartphone, Monitor, ShieldCheck, Cpu, LayoutGrid, ShoppingCart, Gem, PlusCircle, ArrowUpRight, Wallet, ExternalLink, Link, UserCircle, Tag, Check, X, ArrowLeftRight, Settings, Info, RefreshCw, Gamepad } from 'lucide-react';
import { AnimusVoid } from './AnimusVoid';
import { formatAddress } from '../lib/utils';
import { AvatarCustomizer } from './AvatarCustomizer';
import { SmartHomeIntegration } from './SmartHomeIntegration';
import { MetaverseWorldRuntime } from './MetaverseWorldRuntime';
import { profileService, UserProfile } from '../services/profileService';
import { auth } from '../lib/firebase';

interface MetaverseAsset {
  id: string;
  name: string;
  type: 'LAND' | 'ARTIFACT' | 'NFT';
  value: string; // e.g., "4.2" (stored as float string)
  rarity: 'COMMON' | 'RARE' | 'MYTHIC';
  thumbnail: string;
  coordinates?: string; // for LAND, e.g., "14, -45"
  sector?: string; // for LAND, e.g., "Alpha Prime"
}

const DEFAULT_VAULT_ASSETS: MetaverseAsset[] = [
  { id: 'asset-1', name: 'Alpha_Sector_Plot_09', type: 'LAND', value: '4.2', rarity: 'RARE', thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80', coordinates: '24, -109', sector: 'Alpha Sector' },
  { id: 'asset-2', name: 'Neural_Glaive', type: 'ARTIFACT', value: '1.8', rarity: 'MYTHIC', thumbnail: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&q=80' },
  { id: 'asset-3', name: 'Void_Fragment_#42', type: 'NFT', value: '0.5', rarity: 'COMMON', thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80' },
];

const DEFAULT_BAZAAR_ASSETS: MetaverseAsset[] = [
  { id: 'market-1', name: 'Genesis_District_Plot_104', type: 'LAND', value: '3.5', rarity: 'RARE', thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80', coordinates: '14, -45', sector: 'Genesis Prime' },
  { id: 'market-2', name: 'Cyber_Scythe_v2', type: 'ARTIFACT', value: '1.2', rarity: 'COMMON', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
  { id: 'market-3', name: 'Nebula_Crown', type: 'NFT', value: '2.5', rarity: 'MYTHIC', thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&q=80' },
  { id: 'market-4', name: 'Ethereal_Estate_Plot_88', type: 'LAND', value: '6.0', rarity: 'MYTHIC', thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80', coordinates: '88, 12', sector: 'Ethereal Heights' },
  { id: 'market-5', name: 'Chrono_Breaker', type: 'NFT', value: '0.7', rarity: 'COMMON', thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80' }
];

export function MetaverseInteraction() {
  const [activeTab, setActiveTab] = useState<'presence' | 'assets' | 'marketplace' | 'avatar' | 'devices' | 'world'>('presence');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [keyMap, setKeyMap] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('nexus-metaverse-keybindings');
    if (saved) return JSON.parse(saved);
    return {
      'move-forward': 'w',
      'move-backward': 's',
      'strafe-left': 'a',
      'strafe-right': 'd',
      'jump': ' ',
      'fire-weapon': 'f',
      'activate-shield': 'q',
      'build-voxel': 'e',
      'warp-drive': 'Shift',
      'launch-drone': 'x',
      'sub-kernel-sync': 'c'
    };
  });

  useEffect(() => {
    const handleBindingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setKeyMap(customEvent.detail);
      }
    };
    window.addEventListener('nexus-keybindings-updated', handleBindingsUpdate);
    return () => {
      window.removeEventListener('nexus-keybindings-updated', handleBindingsUpdate);
    };
  }, []);
  
  // Dynamic Cryptographic Assets State
  const [assets, setAssets] = useState<MetaverseAsset[]>(() => {
    const saved = localStorage.getItem('meta_vault_assets');
    return saved ? JSON.parse(saved) : DEFAULT_VAULT_ASSETS;
  });
  
  const [bazaarAssets, setBazaarAssets] = useState<MetaverseAsset[]>(() => {
    const saved = localStorage.getItem('meta_bazaar_assets');
    return saved ? JSON.parse(saved) : DEFAULT_BAZAAR_ASSETS;
  });

  const [walletAddress, setWalletAddress] = useState<string | null>(() => localStorage.getItem('meta_wallet'));
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('meta_balance');
    return saved ? parseFloat(saved) : 12.5; // Starting balance: 12.5 ETH
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [activeUserCount] = useState(124);
  const [partnerId, setPartnerId] = useState('PID-DEFAULT');
  const [isExtrapolationActive] = useState(() => localStorage.getItem('extrapolation') === 'd432k7l5kaa60e9f8394592n888b759l15h08d6aa69f1g759id4c8g');
  
  // Transaction Feedback Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Listing/Management Dialog State
  const [selectedListingAsset, setSelectedListingAsset] = useState<MetaverseAsset | null>(null);
  const [listingPrice, setListingPrice] = useState('1.5');
  const [selectedManageAsset, setSelectedManageAsset] = useState<MetaverseAsset | null>(null);
  const [manageCoords, setManageCoords] = useState('');
  const [manageSector, setManageSector] = useState('');
  
  // Filter States
  const [bazaarFilter, setBazaarFilter] = useState<'ALL' | 'LAND' | 'NFT' | 'ARTIFACT'>('ALL');
  const [vaultFilter, setVaultFilter] = useState<'ALL' | 'LAND' | 'NFT' | 'ARTIFACT'>('ALL');

  useEffect(() => {
    const getAuthenticatedUser = () => {
      if (auth?.currentUser) return auth.currentUser;
      const mockStr = localStorage.getItem('auth_user');
      return mockStr ? JSON.parse(mockStr) : null;
    };

    const user = getAuthenticatedUser();
    if (user) {
      profileService.getProfile(user.uid).then(p => {
        if (p) {
          setProfile(p);
          setPartnerId(p.aiPartnerId);
          if (p.ethereumAddress) {
            setWalletAddress(p.ethereumAddress);
          }
        }
      });
    }
  }, []);

  // Save states on change
  useEffect(() => {
    localStorage.setItem('meta_vault_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('meta_bazaar_assets', JSON.stringify(bazaarAssets));
  }, [bazaarAssets]);

  useEffect(() => {
    localStorage.setItem('meta_balance', walletBalance.toString());
  }, [walletBalance]);

  const connectWallet = () => {
    setIsConnecting(true);
    setTimeout(async () => {
      const mockAddr = '0xACE' + Math.random().toString(16).slice(2, 6).toUpperCase() + '...A2EL';
      setWalletAddress(mockAddr);
      localStorage.setItem('meta_wallet', mockAddr);
      setIsConnecting(false);
      showToast('MetaMask connected to resonance layer');

      if (profile) {
        const updatedProfile = {
          ...profile,
          ethereumAddress: mockAddr,
          authFactorStatus: {
            ...profile.authFactorStatus,
            metaMaskLinked: true
          }
        };
        setProfile(updatedProfile);
        await profileService.updateProfile(profile.userId, {
          ethereumAddress: mockAddr,
          authFactorStatus: updatedProfile.authFactorStatus
        });
      }
    }, 1200);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Buy item from Bazaar
  const handlePurchase = (item: MetaverseAsset) => {
    if (!walletAddress) {
      showToast('Error: Please link MetaMask wallet first');
      return;
    }

    const price = parseFloat(item.value);
    if (walletBalance < price) {
      showToast('Error: Insufficient crypto balance');
      return;
    }

    // Deduct balance and transfer ownership
    setWalletBalance(prev => parseFloat((prev - price).toFixed(2)));
    setBazaarAssets(prev => prev.filter(b => b.id !== item.id));
    
    const newOwnedAsset: MetaverseAsset = {
      ...item,
      id: `asset-${Date.now()}` // assign new owned asset ID
    };
    setAssets(prev => [...prev, newOwnedAsset]);
    
    showToast(`Purchased ${item.name} for ${item.value} ETH!`);
  };

  // List item on Bazaar
  const handleStartListing = (item: MetaverseAsset) => {
    setSelectedListingAsset(item);
    setListingPrice(item.value);
  };

  const handleConfirmListing = () => {
    if (!selectedListingAsset) return;
    const price = parseFloat(listingPrice);
    if (isNaN(price) || price <= 0) {
      showToast('Error: Please enter a valid listing price');
      return;
    }

    // Move from Vault to Bazaar
    setAssets(prev => prev.filter(a => a.id !== selectedListingAsset.id));
    
    const newBazaarItem: MetaverseAsset = {
      ...selectedListingAsset,
      id: `market-${Date.now()}`,
      value: price.toFixed(1)
    };
    setBazaarAssets(prev => [...prev, newBazaarItem]);
    
    setSelectedListingAsset(null);
    showToast(`Listed ${selectedListingAsset.name} for ${price.toFixed(1)} ETH!`);
  };

  // Manage Plot details
  const handleStartManage = (item: MetaverseAsset) => {
    setSelectedManageAsset(item);
    setManageCoords(item.coordinates || '0, 0');
    setManageSector(item.sector || 'Centruy District');
  };

  const handleSavePlotManagement = () => {
    if (!selectedManageAsset) return;
    setAssets(prev => prev.map(a => 
      a.id === selectedManageAsset.id 
        ? { ...a, coordinates: manageCoords, sector: manageSector }
        : a
    ));
    setSelectedManageAsset(null);
    showToast(`Updated Plot ${selectedManageAsset.name} coordinates.`);
  };

  // Calculate stats
  const totalPortfolioValue = assets.reduce((sum, item) => sum + parseFloat(item.value), 0);
  const totalLandUnits = assets.filter(item => item.type === 'LAND').length;

  // Filter lists
  const filteredBazaar = bazaarAssets.filter(item => 
    bazaarFilter === 'ALL' || item.type === bazaarFilter
  );

  const filteredVault = assets.filter(item => 
    vaultFilter === 'ALL' || item.type === vaultFilter
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-neural-bg rounded-[40px]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <AnimusVoid />
      </div>

      {/* Overlay UI Container */}
      <div className="absolute inset-0 z-10 p-10 flex flex-col pointer-events-none selection:bg-rose-500/30">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12 pointer-events-auto shrink-0">
          <div className="flex glass-card p-2 rounded-[32px] shadow-2xl backdrop-blur-3xl overflow-x-auto max-w-full">
            {[
              { id: 'presence', label: 'Collective', icon: <Users className="w-4 h-4" /> },
              { id: 'loadout', label: 'Loadout', icon: <Target className="w-4 h-4 text-cyan-400" /> },
              { id: 'world', label: 'World Engine', icon: <Gamepad className="w-4 h-4 text-purple-400" /> },
              { id: 'assets', label: 'Vault', icon: <Gem className="w-4 h-4" /> },
              { id: 'marketplace', label: 'Bazaar', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'avatar', label: 'Avatar', icon: <UserCircle className="w-4 h-4" /> },
              { id: 'devices', label: 'Smart Devices', icon: <Smartphone className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-[24px] text-[11px] font-display font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTab === tab.id ? 'bg-rose-vivid text-white shadow-[0_0_40px_rgba(244,63,94,0.4)]' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex gap-12 overflow-hidden px-4 mb-10">
          {/* Main Viewport Content */}
          <div className="flex-1 relative flex flex-col items-center overflow-hidden">
            
            {/* Realtime Transaction Toast */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="absolute top-2 z-[60] bg-rose-500/90 text-white font-mono text-[10px] tracking-widest uppercase px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-rose-400/20 backdrop-blur-md"
                >
                  <Zap className="w-3 h-3 text-cyan-300 animate-pulse" />
                  {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* COLLECTIVE VIEW */}
              {activeTab === 'presence' && (
                <motion.div 
                  key="presence"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex-1 flex flex-col items-center justify-center relative w-full"
                >
                   {/* Background Scanning Pulse */}
                   <div className="absolute inset-0 visible-grid opacity-10 pointer-events-none" />
                   
                   <div className="relative group cursor-pointer neural-shine rounded-full p-20">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1], 
                          borderColor: ['rgba(244,63,94,0.2)', 'rgba(6,182,212,0.4)', 'rgba(244,63,94,0.2)']
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="w-[380px] h-[380px] border-2 rounded-full flex items-center justify-center p-8"
                      >
                         <div className="w-full h-full border border-white/5 rounded-full animate-reverse-spin" />
                      </motion.div>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Globe className="w-32 h-32 text-rose-vivid drop-shadow-[0_0_50px_rgba(244,63,94,0.6)] animate-pulse mb-8" />
                          
                          <div className="flex flex-col items-center gap-3 pointer-events-auto">
                            <div className="flex gap-4">
                              <button 
                                onClick={connectWallet}
                                disabled={isConnecting || !!walletAddress}
                                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${walletAddress ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-white border border-white/10 text-black hover:scale-105 active:scale-95'}`}
                              >
                                <Wallet className="w-4 h-4" />
                                {isConnecting ? 'Linking_Neural_Wallet...' : walletAddress ? `Wallet: ${formatAddress(walletAddress)}` : 'Connect_MetaMask'}
                              </button>
                            </div>
                            {isExtrapolationActive && (
                              <span className="mt-4 text-[10px] font-mono text-rose-400 uppercase tracking-[0.5em] animate-bounce">Extrapolation_Sync_Active</span>
                            )}
                          </div>
                      </div>
                   </div>

                   <div className="mt-10 text-center space-y-4">
                      <h2 className="text-5xl font-display font-black italic text-white uppercase tracking-tighter drop-shadow-2xl">Collective_Presence</h2>
                      <div className="flex -space-x-4 justify-center items-center">
                         {[1,2,3,4,5].map(i => (
                           <div key={i} className="w-12 h-12 rounded-full border-4 border-neural-bg bg-white/5 overflow-hidden shadow-2xl relative group/avatar">
                              <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" className="w-full h-full object-cover group-hover/avatar:scale-125 transition-transform" />
                              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                           </div>
                         ))}
                         <div className="w-12 h-12 rounded-full border-4 border-neural-bg bg-rose-vivid flex items-center justify-center text-xs font-black text-white shadow-[0_0_30px_rgba(244,63,94,0.5)]">+{activeUserCount-5}</div>
                      </div>
                      <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.4em]">Bridging {activeUserCount} Architects in current synaptic sector</p>
                   </div>
                </motion.div>
              )}

              {/* VAULT / ASSETS VIEW */}
              {activeTab === 'assets' && (
                <motion.div 
                  key="assets"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="flex-1 w-full flex flex-col gap-6 pointer-events-auto overflow-y-auto px-4 pb-20 scrollbar-hide"
                >
                   {/* Filters */}
                   <div className="flex gap-3 justify-center">
                      {(['ALL', 'LAND', 'NFT', 'ARTIFACT'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setVaultFilter(f)}
                          className={`px-6 py-2 rounded-full text-[9px] font-mono uppercase tracking-widest border transition-all ${vaultFilter === f ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5'}`}
                        >
                          {f}
                        </button>
                      ))}
                   </div>

                   {filteredVault.length === 0 ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-20">
                        <Gem className="w-12 h-12 mb-4" />
                        <h4 className="text-sm font-black uppercase tracking-widest">No assets in this category</h4>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVault.map(asset => (
                          <div key={asset.id} className="group glass-card rounded-[40px] overflow-hidden hover:border-rose-500/50 transition-all flex flex-col hover:shadow-2xl hover:shadow-rose-500/10 active:scale-95 duration-500">
                             <div className="h-48 relative overflow-hidden">
                                <img src={asset.thumbnail} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 opacity-60 grayscale group-hover:grayscale-0" alt={asset.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-neural-bg via-transparent to-transparent opacity-60" />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-neural-border text-[8px] font-black text-rose-vivid uppercase tracking-widest">{asset.type}</div>
                                <div className="absolute top-4 right-4 px-3 py-1 bg-rose-500/10 backdrop-blur-md rounded-full border border-rose-500/20 text-[8px] font-black text-rose-400 uppercase tracking-widest">{asset.rarity}</div>
                             </div>
                             <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <h3 className="text-lg font-display font-black text-white italic uppercase tracking-tighter group-hover:text-rose-vivid transition-colors line-clamp-1">{asset.name}</h3>
                                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-1 block">ID: {asset.id.slice(0, 10)}</span>
                                   </div>
                                   <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-display font-black text-cyan-400">{asset.value} ETH</div>
                                </div>

                                {asset.type === 'LAND' && (
                                   <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between text-[9px] font-mono text-white/40">
                                      <span>Coordinates: <span className="text-white font-bold">{asset.coordinates || 'N/A'}</span></span>
                                      <span>Sector: <span className="text-white font-bold">{asset.sector || 'N/A'}</span></span>
                                   </div>
                                )}

                                <div className="flex gap-3">
                                   {asset.type === 'LAND' ? (
                                     <button 
                                       onClick={() => handleStartManage(asset)}
                                       className="flex-1 py-3 bg-white/5 border border-neural-border rounded-xl text-[9px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all"
                                     >
                                       Manage_Plot
                                     </button>
                                   ) : (
                                     <div className="flex-1 text-center py-3 bg-white/[0.02] border border-white/5 text-white/10 rounded-xl text-[9px] uppercase tracking-widest font-mono">
                                       Vaulted
                                     </div>
                                   )}
                                   <button 
                                     onClick={() => handleStartListing(asset)}
                                     className="flex-1 py-3 bg-rose-vivid/10 border border-rose-vivid/30 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-vivid hover:bg-rose-vivid hover:text-white transition-all"
                                   >
                                     Relist / Sell
                                   </button>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </motion.div>
              )}

              {/* BAZAAR / MARKETPLACE VIEW */}
              {activeTab === 'marketplace' && (
                <motion.div 
                  key="marketplace"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="flex-1 w-full flex flex-col gap-6 pointer-events-auto overflow-y-auto px-4 pb-20 scrollbar-hide"
                >
                   {/* Filter Header */}
                   <div className="flex gap-3 justify-center">
                      {(['ALL', 'LAND', 'NFT', 'ARTIFACT'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setBazaarFilter(f)}
                          className={`px-6 py-2 rounded-full text-[9px] font-mono uppercase tracking-widest border transition-all ${bazaarFilter === f ? 'bg-rose-500/10 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5'}`}
                        >
                          {f}
                        </button>
                      ))}
                   </div>

                   {filteredBazaar.length === 0 ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-20">
                        <ShoppingCart className="w-12 h-12 mb-4" />
                        <h4 className="text-sm font-black uppercase tracking-widest">Bazaar liquidity stabilizing</h4>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBazaar.map(item => (
                          <div key={item.id} className="group glass-card rounded-[40px] overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col hover:shadow-2xl hover:shadow-cyan-500/10 active:scale-95 duration-500">
                             <div className="h-48 relative overflow-hidden">
                                <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 opacity-60 grayscale group-hover:grayscale-0" alt={item.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-neural-bg via-transparent to-transparent opacity-60" />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-neural-border text-[8px] font-black text-cyan-400 uppercase tracking-widest">{item.type}</div>
                                <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500/10 backdrop-blur-md rounded-full border border-cyan-500/20 text-[8px] font-black text-cyan-300 uppercase tracking-widest">{item.rarity}</div>
                             </div>
                             <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <h3 className="text-lg font-display font-black text-white italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors line-clamp-1">{item.name}</h3>
                                      {item.type === 'LAND' && (
                                         <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest block mt-1">Sector: {item.sector || 'Centruy'}</span>
                                      )}
                                   </div>
                                   <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-display font-black text-rose-400">{item.value} ETH</div>
                                </div>

                                <button 
                                  onClick={() => handlePurchase(item)}
                                  className="w-full py-3.5 bg-rose-vivid text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                                >
                                  <ShoppingCart className="w-4 h-4" /> Acquire Asset
                                </button>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </motion.div>
              )}

              {/* AVATAR CUSTOMIZER TAB */}
              {activeTab === 'avatar' && (
                <motion.div 
                  key="avatar"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="w-full h-full p-4 pointer-events-auto"
                >
                   <AvatarCustomizer />
                </motion.div>
              )}

              {/* SMART DEVICES TAB */}
              {activeTab === 'devices' && (
                <motion.div 
                  key="devices"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full h-full relative z-20 pointer-events-auto"
                >
                   <SmartHomeIntegration />
                </motion.div>
              )}

              {/* WORLD RUNTIME ENGINE TAB */}
              {activeTab === 'world' && (
                <motion.div 
                  key="world"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="w-full h-full relative z-20 pointer-events-auto"
                >
                   <MetaverseWorldRuntime keyMap={keyMap} onDeployDrone={() => showToast('Drone Deployed! Mapping 3D Void...')} />
                </motion.div>
              )}
              
              {/* LOADOUT TAB */}
              {activeTab === 'loadout' && (
                <motion.div 
                  key="loadout"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full h-full p-10 flex flex-col items-center justify-center gap-6"
                >
                  <Target className="w-20 h-20 text-cyan-500 animate-pulse" />
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Drone Deployment</h2>
                  <button 
                    onClick={() => {
                        showToast('Drone Deployed! Mapping 3D Void...');
                        // Also trigger deployment in world engine
                        window.dispatchEvent(new CustomEvent('nexus-drone-deploy'));
                    }}
                    className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest rounded-full transition-all"
                  >
                    Launch Scout Drone
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Section: Status HUD */}
          <div className="w-96 flex flex-col gap-8 pointer-events-auto shrink-0 pr-4 shrink-0">
             
             {/* Dynamic Wallet Status Panel */}
             <div className="glass-card p-8 rounded-[40px] space-y-6 neural-shine">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-rose-vivid" />
                      <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-white">Cryptographic_Wallet</span>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {walletAddress ? (
                  <div className="space-y-4">
                     <div className="flex justify-between items-center bg-white/[0.02] border border-neural-border p-4 rounded-2xl">
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Address</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{formatAddress(walletAddress)}</span>
                     </div>
                     <div className="flex justify-between items-center bg-white/[0.02] border border-neural-border p-4 rounded-2xl">
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Crypto_Balance</span>
                        <span className="text-md font-display font-black text-rose-vivid">{walletBalance.toFixed(2)} ETH</span>
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-4">
                     <p className="text-[9px] font-mono text-white/20 uppercase">No active wallet link found</p>
                     <button 
                       onClick={connectWallet}
                       className="w-full py-3 bg-white text-black text-[9px] font-black uppercase rounded-2xl tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                     >
                       Link MetaMask Node
                     </button>
                  </div>
                )}
             </div>

             <div className="glass-card p-10 rounded-[48px] space-y-10 neural-shine">
                <div className="flex items-center gap-5">
                   <div className="p-4 bg-rose-500/10 rounded-3xl text-rose-vivid shadow-2xl shadow-rose-500/20">
                      <Target className="w-8 h-8" />
                   </div>
                   <div>
                      <div className="text-xs font-display font-black uppercase text-rose-vivid tracking-[0.3em]">Sovereign_Assets</div>
                      <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-1 italic">Portfolio_Summary_v7</div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between p-6 bg-white/[0.02] border border-neural-border rounded-3xl items-center hover:bg-white/[0.05] transition-all">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total_Portfolio:</span>
                      <span className="text-lg font-display font-black text-rose-vivid">{totalPortfolioValue.toFixed(1)} ETH</span>
                   </div>
                   <div className="flex justify-between p-6 bg-white/[0.02] border border-neural-border rounded-3xl items-center hover:bg-white/[0.05] transition-all">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">V-Land_Units:</span>
                      <span className="text-lg font-display font-black text-cyan-vivid">{totalLandUnits.toString().padStart(2, '0')}</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-neural-border">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <Zap className="w-4 h-4 text-cyan-vivid animate-pulse" />
                         <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-none">Infra_Integrity</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-vivid uppercase font-black tracking-widest">Active</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-cyan-vivid to-rose-vivid"
                        animate={{ width: ['70%', '95%', '85%'] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                      />
                   </div>
                </div>
             </div>

             <div className="p-8 bg-cyan-400/5 backdrop-blur-3xl border border-cyan-400/10 rounded-[40px] space-y-6 group hover:bg-cyan-400/10 transition-all duration-700">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 text-cyan-vivid">
                      <ShieldCheck className="w-5 h-5 group-hover:scale-125 transition-transform" />
                      <span className="text-[11px] font-display font-black uppercase tracking-[0.3em]">Syn_Correlator</span>
                   </div>
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]" />
                </div>
                <div className="text-2xl font-display font-black italic text-white tracking-tighter uppercase truncate leading-none">Architect_{partnerId}</div>
                <p className="text-[10px] font-mono text-white/20 uppercase leading-relaxed italic">Identity synchronized via resonance signature. Cryptographic assets locked.</p>
             </div>
          </div>
        </div>
      </div>

      {/* MODAL / OVERLAY FOR LISTING ASSETS (RELIST) */}
      <AnimatePresence>
        {selectedListingAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 pointer-events-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-[30px] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-rose-500" />
                    <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest">Relist Sovereign Asset</span>
                 </div>
                 <button onClick={() => setSelectedListingAsset(null)} className="p-2 text-white/40 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex gap-4 items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <img src={selectedListingAsset.thumbnail} className="w-16 h-16 object-cover rounded-xl border border-white/10" alt="" />
                 <div>
                    <h4 className="text-md font-display font-black uppercase text-white tracking-widest">{selectedListingAsset.name}</h4>
                    <span className="text-[8px] font-mono text-white/30 uppercase mt-1 block">Type: {selectedListingAsset.type} // {selectedListingAsset.rarity}</span>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[9px] font-mono uppercase text-white/40 tracking-widest">Listing Price (ETH)</label>
                 <input 
                   type="text" 
                   value={listingPrice}
                   onChange={(e) => setListingPrice(e.target.value)}
                   placeholder="1.5"
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-center font-mono text-2xl tracking-[0.2em] text-rose-500 focus:outline-none focus:border-rose-500/50"
                 />
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setSelectedListingAsset(null)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Cancel</button>
                 <button onClick={handleConfirmListing} className="flex-1 py-3 bg-rose-vivid text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-rose-500/20">List to Bazaar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL / OVERLAY FOR LAND PLOT MANAGEMENT */}
      <AnimatePresence>
        {selectedManageAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 pointer-events-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-[30px] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest">Manage Land Plot</span>
                 </div>
                 <button onClick={() => setSelectedManageAsset(null)} className="p-2 text-white/40 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex gap-4 items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <img src={selectedManageAsset.thumbnail} className="w-16 h-16 object-cover rounded-xl border border-white/10" alt="" />
                 <div>
                    <h4 className="text-md font-display font-black uppercase text-white tracking-widest">{selectedManageAsset.name}</h4>
                    <span className="text-[8px] font-mono text-white/30 uppercase mt-1 block">Virtual Estate // Coordinates: {selectedManageAsset.coordinates || '0,0'}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[8px] font-mono uppercase text-white/40 tracking-widest">Grid Coordinates (X, Y)</label>
                    <input 
                      type="text" 
                      value={manageCoords}
                      onChange={(e) => setManageCoords(e.target.value)}
                      placeholder="14, -45"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[8px] font-mono uppercase text-white/40 tracking-widest">Build Sector / Sub-District</label>
                    <input 
                      type="text" 
                      value={manageSector}
                      onChange={(e) => setManageSector(e.target.value)}
                      placeholder="Genesis Prime"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50"
                    />
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setSelectedManageAsset(null)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Cancel</button>
                 <button onClick={handleSavePlotManagement} className="flex-1 py-3 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/20">Save Configuration</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
