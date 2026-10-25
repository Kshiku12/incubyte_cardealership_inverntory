import React, { useState, useEffect } from 'react';
import type { NewsArticle } from '../types';
import { fetchNewsArticles } from '../services/api';
import { Clock, X } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNewsArticles()
      .then((data) => setArticles(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['All', 'EV Revolution', 'Hypercars', 'Tech & Autonomy', 'Industry Insights'];

  const filtered = selectedCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const leadArticle = filtered[0];
  const secondaryArticles = filtered.slice(1);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="border-b-2 border-white/20 pb-6 mb-8 text-center">
        <div className="text-[11px] font-extrabold tracking-[0.4em] uppercase text-luxury-gold mb-1">
          Aura Motors Daily Journal • Vol. XIV • Issue 108
        </div>
        <h2 className="text-4xl sm:text-6xl font-extrabold font-['Outfit'] text-white uppercase tracking-tight">
          The Automotive Gazette
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2 italic font-serif">
          Global dispatches on extreme engineering, autonomous mobility, synthetic fuels, and rare automotive acquisitions.
        </p>

        {/* Category bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-4 border-t border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                selectedCategory === cat
                  ? 'bg-luxury-gold text-black shadow-md'
                  : 'bg-dark-900 text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading daily editions...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-400">No dispatches found in this category.</div>
      ) : (
        <div className="space-y-12">
          
          {/* Front Page Lead Story (Full-bleed newspaper hero) */}
          {leadArticle && (
            <div
              onClick={() => setActiveArticle(leadArticle)}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 cursor-pointer group hover:border-luxury-gold/50 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 h-80 sm:h-96 lg:h-auto overflow-hidden relative">
                  <img
                    src={leadArticle.imageUrl}
                    alt={leadArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-luxury-gold border border-luxury-gold/30">
                    Lead Editorial
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-dark-900/60">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-luxury-gold uppercase font-bold tracking-wider mb-2">
                      <span>{leadArticle.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {leadArticle.readTime}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white group-hover:text-luxury-gold transition-colors leading-tight">
                      {leadArticle.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-300 font-serif leading-relaxed line-clamp-3">
                      {leadArticle.subtitle}
                    </p>

                    <p className="mt-4 text-xs text-slate-400 line-clamp-4 leading-relaxed">
                      {leadArticle.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>By {leadArticle.author}</span>
                    <span className="text-luxury-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Full Story &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Stories Grid */}
          {secondaryArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {secondaryArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 cursor-pointer group flex flex-col justify-between hover:border-luxury-gold/40 transition"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative bg-dark-900">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 text-slate-200">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                        <Clock className="w-3 h-3 text-luxury-gold" />
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>

                      <h4 className="text-lg font-bold font-['Outfit'] text-white group-hover:text-luxury-gold transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>

                      <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 mt-4">
                    <span className="truncate max-w-[150px]">{article.author}</span>
                    <span className="text-luxury-gold font-semibold">Read &rarr;</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl glass-panel border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-luxury-gold uppercase tracking-widest mb-3">
              <span>{activeArticle.category}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] text-white leading-tight">
              {activeArticle.title}
            </h2>

            <p className="mt-3 text-base sm:text-lg text-slate-300 font-serif italic border-l-2 border-luxury-gold pl-4 py-1">
              {activeArticle.subtitle}
            </p>

            <div className="my-6 h-72 rounded-2xl overflow-hidden bg-dark-900">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs text-slate-400 pb-4 border-b border-white/10 mb-6 flex justify-between">
              <span>By {activeArticle.author}</span>
              <span>Published {new Date(activeArticle.publishedAt).toLocaleDateString()}</span>
            </div>

            <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif space-y-4">
              <p>{activeArticle.content}</p>
              <p>
                As continuous innovations reshape vehicular intelligence and structural lightweight materials, 
                our editorial desk maintains around-the-clock telemetry tracking across European test tracks and 
                battery gigafactories. Subscribe to the Aura Motors gazette for weekly executive briefings.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
