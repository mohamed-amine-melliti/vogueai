import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Zap, Box, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative border-b-4 border-black bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white border-2 border-black shadow-brutal font-bold transform -rotate-2">
            AI-POWERED FASHION
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-black mb-8 leading-none tracking-tighter">
            WEAR IT<br />
            <span className="text-white text-stroke-3">BEFORE YOU</span><br />
            BUY IT.
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-bold max-w-2xl mx-auto mb-12 border-l-4 border-black pl-4 text-left md:text-center md:border-none md:pl-0">
            Stop guessing. Start styling. The most aggressive AR technology on the web.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/tryon"
              className="px-8 py-4 bg-accent border-4 border-black text-black font-black text-xl hover:shadow-brutal-lg hover:-translate-y-2 hover:-translate-x-1 transition-all active:shadow-none active:translate-y-0 active:translate-x-0 flex items-center justify-center space-x-2"
            >
              <Shirt size={24} className="stroke-3" />
              <span>TRY IT ON</span>
            </Link>
            <Link
              to="/furniture"
              className="px-8 py-4 bg-white border-4 border-black text-black font-black text-xl hover:shadow-brutal-lg hover:-translate-y-2 hover:-translate-x-1 transition-all active:shadow-none active:translate-y-0 active:translate-x-0 flex items-center justify-center space-x-2"
            >
              <Box size={24} className="stroke-3" />
              <span>AR ROOM</span>
            </Link>
          </div>
        </div>
        
        {/* Decorative pattern */}
        <div className="h-12 bg-repeat-x w-full" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '20px 20px', backgroundColor: '#fff', height: '20px' }}></div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="text-black" size={32} strokeWidth={3} />}
            title="INSTANT"
            description="Our models are fast. Blazing fast. Blink and you'll miss the load time."
            color="bg-secondary"
          />
          <FeatureCard 
            icon={<Shirt className="text-black" size={32} strokeWidth={3} />}
            title="LIMITLESS"
            description="Upload anything. If it's an image, we can drape it on you. No questions asked."
            color="bg-accent"
          />
          <FeatureCard 
            icon={<Box className="text-black" size={32} strokeWidth={3} />}
            title="SPATIAL"
            description="Put furniture in your room. See if it fits. Don't buy a couch that's too big."
            color="bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, color: string }> = ({ icon, title, description, color }) => (
  <div className={`p-8 border-4 border-black shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1 ${color}`}>
    <div className="mb-4 bg-white w-16 h-16 flex items-center justify-center border-2 border-black shadow-brutal-sm rounded-full">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-black mb-4 uppercase">{title}</h3>
    <p className="text-black font-medium leading-relaxed border-t-2 border-black pt-4">{description}</p>
  </div>
);