import React from 'react';
import { Moon, Camera, Database, Info, Shield, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings, addToast } = useAppContext();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-black mb-8 uppercase tracking-tighter border-b-4 border-black pb-4 inline-block">Settings</h1>

        <div className="space-y-8">
          {/* Preferences */}
          <section className="bg-white border-4 border-black shadow-brutal p-6">
            <h2 className="text-xl font-black text-black mb-6 flex items-center gap-2 uppercase">
              <Zap size={24} className="text-black" strokeWidth={3} /> General
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                   <p className="text-black font-bold text-lg uppercase">High Contrast</p>
                   <p className="text-sm text-gray-600 font-medium">Always on for maximum impact</p>
                 </div>
                 <div className="bg-black text-white px-3 py-1 font-bold text-xs uppercase border-2 border-black">
                    LOCKED
                 </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t-2 border-black">
                 <div>
                   <p className="text-black font-bold text-lg uppercase">Auto-save</p>
                   <p className="text-sm text-gray-600 font-medium">Keep every generated look</p>
                 </div>
                 <input 
                    type="checkbox" 
                    checked={settings.autoSave}
                    onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                    className="w-6 h-6 border-2 border-black rounded-none text-black focus:ring-0 checked:bg-black checked:hover:bg-gray-800 transition-colors cursor-pointer"
                  />
              </div>
            </div>
          </section>

          {/* Data */}
          <section className="bg-white border-4 border-black shadow-brutal p-6">
            <h2 className="text-xl font-black text-black mb-6 flex items-center gap-2 uppercase">
              <Database size={24} className="text-black" strokeWidth={3} /> Storage
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black font-bold text-lg uppercase">Nuke Gallery</p>
                <p className="text-sm text-gray-600 font-medium">Delete all local data. No undo.</p>
              </div>
              <button 
                onClick={() => {
                   localStorage.removeItem('vogueai_results');
                   window.location.reload();
                }}
                className="px-6 py-2 bg-red-500 border-2 border-black shadow-brutal text-white font-bold uppercase hover:translate-y-[-2px] hover:shadow-brutal-lg active:translate-y-0 active:shadow-none transition-all"
              >
                Clear Data
              </button>
            </div>
          </section>

           {/* About */}
           <section className="bg-black text-white border-4 border-black shadow-brutal p-6">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2 uppercase">
              <Info size={24} className="text-white" strokeWidth={3} /> System
            </h2>
            <div className="text-sm font-mono space-y-2">
               <p>BUILD: v1.0.0-BETA</p>
               <p>CORP: VOGUE_AI_INC</p>
               <div className="flex gap-2 mt-4">
                 <span className="px-2 py-1 bg-green-500 text-black font-bold border border-white">STATUS: ONLINE</span>
                 <span className="px-2 py-1 bg-blue-500 text-black font-bold border border-white">REACT: v18</span>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};