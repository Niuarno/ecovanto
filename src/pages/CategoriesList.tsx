import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { ArrowUpRight } from 'lucide-react';

export const CategoriesList: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080808] pt-28 md:pt-36 pb-24 text-[#F4F4F0] select-none">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="pb-10 mb-12 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase block mb-2">
              TAXONOMY DIRECTORY
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display tracking-[0.15em] uppercase text-white">
              ALL CATEGORIES
            </h1>
          </div>
          <p className="text-xs md:text-sm font-light text-[#8A8A8A] max-w-md">
            Explore curated design groupings spanning steel-boned corsets, fluid bias gowns, structured tailoring, and modular accessories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group relative flex flex-col bg-[#111111] border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300"
            >
              <div className="aspect-[4/5] bg-black overflow-hidden relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-mono tracking-widest px-2 py-0.5 bg-black/80 text-[#8A8A8A] border border-white/15">
                  [{category.count} ITEMS]
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 bg-[#0E0E0E] group-hover:bg-[#161616] transition-colors border-t border-white/10">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-[#666] mb-1">
                    <span>SECTION 0{index + 1}</span>
                  </div>
                  <h2 className="text-base font-mono tracking-widest uppercase text-white font-medium">
                    {category.name}
                  </h2>
                  <p className="text-xs font-light text-[#8A8A8A] mt-2 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs font-mono tracking-widest text-[#8A8A8A] group-hover:text-white uppercase">
                  <span>DISCOVER</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
