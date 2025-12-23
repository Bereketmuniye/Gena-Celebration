import React, { useState, useEffect } from 'react';

const highlights = [
    {
        image: '/highlights/lalibela.png',
        title: 'The Sacred Night',
        description: 'Thousands gather at the rock-hewn churches of Lalibela, clad in white, holding candles as ancient chants fill the air.',
        color: 'text-amber-500'
    },
    {
        image: '/highlights/genna_chewata.png',
        title: 'Spirit of the Game',
        description: 'Ye-Genna Chewata: A traditional hockey-like game played with passion, celebrating the joy of the shepherds.',
        color: 'text-emerald-500'
    },
    {
        image: '/highlights/feast.png',
        title: 'The Grand Feast',
        description: 'Families break the fast with Doro Wat and Injera, a culinary celebration of unity and abundance.',
        color: 'text-red-500'
    }
];

const CelebrationHighlight: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % highlights.length);
            setIsTransitioning(false);
        }, 800);
    };

    return (
        <div className="relative w-full h-[600px] md:h-[700px] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] group border-8 border-white/10">
            {/* Background Images with Ken Burns Effect */}
            {highlights.map((h, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${i === currentIndex ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
                    <img
                        src={h.image}
                        alt={h.title}
                        className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${i === currentIndex ? 'scale-125 translate-y-[-5%]' : 'scale-100'
                            }`}
                    />
                </div>
            ))}

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 md:p-20">
                <div className={`max-w-4xl transition-all duration-1000 transform ${isTransitioning ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'}`}>
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="h-px w-12 bg-white/50"></div>
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/80">
                            The Habesha Odyssey
                        </span>
                    </div>

                    <h2 className={`text-5xl md:text-8xl font-serif font-bold mb-6 leading-tight ${highlights[currentIndex].color} drop-shadow-2xl`}>
                        {highlights[currentIndex].title}
                    </h2>

                    <p className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light italic drop-shadow-lg">
                        "{highlights[currentIndex].description}"
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center space-x-6 mt-16">
                    {highlights.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className="relative h-12 flex items-center group"
                        >
                            <div className={`h-1 transition-all duration-700 rounded-full ${i === currentIndex ? 'w-16 bg-white' : 'w-8 bg-white/20 group-hover:bg-white/40'
                                }`} />
                            <span className={`absolute -top-6 left-0 text-[10px] font-bold transition-opacity duration-500 ${i === currentIndex ? 'opacity-100 text-white' : 'opacity-0'
                                }`}>
                                0{i + 1}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 z-30 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length)}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] z-40"></div>
        </div>
    );
};

export default CelebrationHighlight;
