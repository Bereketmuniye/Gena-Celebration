import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playLevelUpSound } from '../services/audio';

interface Gift {
    id: number;
    x: number;
    y: number;
    type: 'red' | 'gold' | 'green';
    speed: number;
}

const getTimeBonus = (score: number) => {
    // Scale time with performance: higher score -> larger bonus.
    // Floor keeps it predictable; minimum cushion prevents zero bonus.
    return Math.max(5, Math.floor(score / 20));
};

const GiftGame: React.FC = () => {
    const [score, setScore] = useState(0);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [isBoxOpen, setIsBoxOpen] = useState(false);
    const [hasClickedBox, setHasClickedBox] = useState(false);
    const gameRef = useRef<HTMLDivElement>(null);
    const nextId = useRef(0);

    const getLevelInfo = (s: number) => {
        if (s >= 1200) return { level: 5, gift: 'Golden Crown of Lalibela', icon: '👑', color: 'text-amber-600' };
        if (s >= 800) return { level: 4, gift: 'Ceramic Coffee Set (Jebena)', icon: '☕', color: 'text-stone-800' };
        if (s >= 500) return { level: 3, gift: 'Royal Gabi (Traditional Blanket)', icon: '🧣', color: 'text-emerald-700' };
        if (s >= 250) return { level: 2, gift: 'Handcrafted Meskel Cross', icon: '✝️', color: 'text-red-800' };
        if (s >= 100) return { level: 1, gift: 'Traditional Netela (Elegant Scarf)', icon: '🎗️', color: 'text-stone-600' };
        return { level: 0, gift: 'Small Genna Candle', icon: '🕯️', color: 'text-stone-400' };
    };

    const levelInfo = getLevelInfo(score);

    useEffect(() => {
        if (levelInfo.level > currentLevel) {
            setCurrentLevel(levelInfo.level);
            if (isPlaying) {
                playLevelUpSound();
                setTimeLeft((prev) => prev + getTimeBonus(score));
                setShowLevelUp(true);
                setIsBoxOpen(false);
                setHasClickedBox(false);
                // We don't auto-open anymore. User must click!
            }
        }
    }, [levelInfo.level, currentLevel, isPlaying]);

    const handleOpenBox = () => {
        if (hasClickedBox) return;
        setHasClickedBox(true);
        setTimeout(() => setIsBoxOpen(true), 600);
        setTimeout(() => setShowLevelUp(false), 5000);
    };

    const startGame = () => {
        setScore(0);
        setCurrentLevel(0);
        setGifts([]);
        setIsPlaying(true);
        setTimeLeft(30);
    };

    useEffect(() => {
        if (!isPlaying || showLevelUp) return;

        const spawnInterval = setInterval(() => {
            if (gameRef.current) {
                const width = gameRef.current.offsetWidth;
                const newGift: Gift = {
                    id: nextId.current++,
                    x: Math.random() * (width - 60) + 30,
                    y: -100,
                    type: ['red', 'gold', 'green'][Math.floor(Math.random() * 3)] as any,
                    speed: Math.random() * 2 + 2,
                };
                setGifts((prev) => [...prev, newGift]);
            }
        }, 800);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (showLevelUp) return prev;
                if (prev <= 1) {
                    setIsPlaying(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(spawnInterval);
            clearInterval(timer);
        };
    }, [isPlaying, showLevelUp]);

    useEffect(() => {
        if (!isPlaying || showLevelUp) return;

        const moveInterval = setInterval(() => {
            setGifts((prev) =>
                prev
                    .map((g) => ({ ...g, y: g.y + g.speed }))
                    .filter((g) => g.y < 1000)
            );
        }, 16);

        return () => clearInterval(moveInterval);
    }, [isPlaying, showLevelUp]);

    const catchGift = (id: number) => {
        setScore((prev) => prev + 10);
        setGifts((prev) => prev.filter((g) => g.id !== id));
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="glass-card p-3 md:p-6 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 shadow-xl">
                <div className="flex items-center space-x-3 md:space-x-6">
                    <div className="text-center">
                        <p className="text-[7px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-0.5 md:mb-1">Score</p>
                        <p className="text-lg md:text-3xl font-serif font-bold text-amber-800">{score}</p>
                    </div>
                    <div className="h-6 md:h-10 w-px bg-stone-200"></div>
                    <div className="text-center">
                        <p className="text-[7px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-0.5 md:mb-1">Level</p>
                        <p className={`text-lg md:text-3xl font-serif font-bold ${levelInfo.color}`}>{levelInfo.level}</p>
                    </div>
                    <div className="h-6 md:h-10 w-px bg-stone-200"></div>
                    <div className="text-center">
                        <p className="text-[7px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-0.5 md:mb-1">Time</p>
                        <p className="text-lg md:text-3xl font-serif font-bold text-red-800">{timeLeft}s</p>
                    </div>
                </div>

                {!isPlaying ? (
                    <button
                        onClick={startGame}
                        className="shine-effect w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-stone-950 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs md:text-base"
                    >
                        {timeLeft === 0 ? 'Play Again' : 'Start Game'}
                    </button>
                ) : (
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="text-right">
                            <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400">Next Reward</p>
                            <p className="text-[10px] md:text-xs font-bold text-stone-900">{levelInfo.gift}</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                )}
            </div>

            <div
                ref={gameRef}
                className="relative flex-1 glass-card rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border-2 md:border-4 border-white/50 shadow-inner bg-stone-50/30 min-h-[400px] md:min-h-[800px]"
            >
                {!isPlaying && timeLeft === 30 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8">
                        <div className="text-5xl md:text-6xl mb-4 md:mb-6 animate-float">🎁</div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-2 md:mb-4">Genna Gift Catch</h2>
                        <p className="text-stone-600 max-w-sm mb-6 md:mb-8 font-medium text-xs md:text-base">
                            Catch falling items to level up and earn traditional Ethiopian Genna gifts!
                        </p>
                        <div className="grid grid-cols-2 gap-2 md:gap-4 text-left max-w-md">
                            <div className="text-[8px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest col-span-2 mb-1 md:mb-2">Rewards</div>
                            <div className="text-[10px] md:text-xs font-medium">100+ pts: Netela</div>
                            <div className="text-[10px] md:text-xs font-medium">250+ pts: Meskel Cross</div>
                            <div className="text-[10px] md:text-xs font-medium">500+ pts: Royal Gabi</div>
                            <div className="text-[10px] md:text-xs font-medium">800+ pts: Coffee Set</div>
                        </div>
                    </div>
                )}

                {!isPlaying && timeLeft === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-8 bg-white/60 backdrop-blur-md z-50">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-amber-500/30 shadow-2xl space-y-4 md:space-y-6 w-full max-w-sm md:max-w-md"
                        >
                            <div className="text-5xl md:text-8xl mb-2 md:mb-4">{levelInfo.icon}</div>
                            <div>
                                <h2 className="text-xl md:text-4xl font-serif font-bold text-stone-900 mb-1 md:mb-2">Level {levelInfo.level} Reached!</h2>
                                <p className="text-base md:text-xl text-amber-800 font-bold">Score: {score}</p>
                            </div>

                            <div className="py-3 md:py-6 px-4 md:px-8 bg-amber-50 rounded-xl md:rounded-2xl border border-amber-200">
                                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-amber-600 mb-1 md:mb-2">You Earned</p>
                                <h3 className="text-lg md:text-2xl font-serif font-bold text-stone-900">{levelInfo.gift}</h3>
                            </div>

                            <button
                                onClick={startGame}
                                className="w-full py-3 md:py-4 bg-stone-950 text-white rounded-xl md:rounded-2xl font-bold shadow-xl hover:scale-105 transition-all text-sm md:text-base"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    </div>
                )}

                <AnimatePresence>
                    {showLevelUp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-[60] bg-stone-900/60 backdrop-blur-xl"
                        >
                            <div className="relative flex flex-col items-center">
                                {!hasClickedBox && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="absolute -top-20 md:-top-32 text-center w-full px-4"
                                    >
                                        <h2 className="text-xl md:text-4xl font-serif font-bold text-white mb-1 md:mb-2">Level {levelInfo.level} Reached!</h2>
                                        <p className="text-amber-400 font-bold animate-pulse tracking-widest uppercase text-[8px] md:text-sm">Tap the box to reveal your gift</p>
                                    </motion.div>
                                )}

                                <AnimatePresence mode="wait">
                                    {!isBoxOpen ? (
                                        <motion.div
                                            key="closed-box"
                                            onClick={handleOpenBox}
                                            animate={{
                                                rotate: hasClickedBox ? [0, -10, 10, -10, 10, 0] : [0, -3, 3, -3, 3, 0],
                                                scale: hasClickedBox ? [1, 1.2, 1] : [1, 1.05, 1]
                                            }}
                                            transition={{ duration: hasClickedBox ? 0.2 : 0.4, repeat: hasClickedBox ? 3 : Infinity }}
                                            className="relative w-40 h-40 md:w-72 md:h-72 flex items-center justify-center cursor-pointer group"
                                        >
                                            {/* Custom SVG Gift Box */}
                                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_60px_rgba(255,215,0,0.5)] transition-all">
                                                {/* Box Bottom */}
                                                <rect x="25" y="45" width="50" height="40" fill="#8B0000" rx="2" />
                                                <rect x="45" y="45" width="10" height="40" fill="#FFD700" />

                                                {/* Lid */}
                                                <motion.g
                                                    animate={hasClickedBox ? { y: -150, x: 50, rotate: 45, opacity: 0 } : {}}
                                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                                >
                                                    <rect x="20" y="35" width="60" height="12" fill="#A52A2A" rx="2" />
                                                    <rect x="45" y="35" width="10" height="12" fill="#FFD700" />
                                                    {/* Bow */}
                                                    <path d="M50 35 Q40 20 30 35 Q40 35 50 35 Q60 20 70 35 Q60 35 50 35" fill="#FFD700" />
                                                </motion.g>
                                            </svg>

                                            {!hasClickedBox && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className="absolute inset-0 border-4 border-amber-500/30 rounded-full scale-125 md:scale-150 pointer-events-none"
                                                />
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="reveal"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                            className="relative flex flex-col items-center justify-center"
                                        >
                                            {/* Confetti Explosion */}
                                            <div className="absolute inset-0 pointer-events-none">
                                                {['🎉', '✨', '🎊', '🌸', '⭐', '🇪🇹'].map((emoji, i) => (
                                                    <motion.span
                                                        key={i}
                                                        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                                                        animate={{
                                                            x: (Math.random() - 0.5) * 400,
                                                            y: (Math.random() - 0.5) * 400,
                                                            opacity: 0,
                                                            scale: 2,
                                                            rotate: Math.random() * 360
                                                        }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className="absolute text-3xl md:text-5xl"
                                                    >
                                                        {emoji}
                                                    </motion.span>
                                                ))}
                                            </div>

                                            <div className="glass-card p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-amber-500 shadow-[0_0_120px_rgba(255,215,0,0.5)] bg-white/95 text-center min-w-[260px] md:min-w-[360px] relative z-10">
                                                <motion.div
                                                    animate={{
                                                        y: [0, -20, 0],
                                                        rotate: [0, 10, -10, 0]
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="text-6xl md:text-[10rem] mb-4 md:mb-8 filter drop-shadow-2xl"
                                                >
                                                    {levelInfo.icon}
                                                </motion.div>
                                                <h2 className="text-2xl md:text-5xl font-serif font-bold text-stone-950 mb-1 md:mb-2">SURPRISE!</h2>
                                                <p className="text-stone-500 text-[8px] md:text-sm uppercase tracking-[0.4em] font-bold mb-3 md:mb-6">Level {levelInfo.level} Unlocked</p>
                                                <div className="py-4 md:py-6 px-4 md:px-10 bg-amber-50 rounded-xl md:rounded-3xl border-2 border-amber-200 shadow-inner">
                                                    <p className="text-[8px] md:text-xs uppercase tracking-widest font-bold text-amber-600 mb-1 md:mb-2">You Found</p>
                                                    <h3 className="text-lg md:text-3xl font-serif font-bold text-stone-900">{levelInfo.gift}</h3>
                                                </div>

                                                <div className="mt-6 md:mt-10 flex justify-center space-x-3 md:space-x-6">
                                                    {['🎈', '🎊', '🙌', '✨'].map((e, i) => (
                                                        <motion.span
                                                            key={i}
                                                            animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
                                                            transition={{ delay: i * 0.1, duration: 0.6, repeat: Infinity }}
                                                            className="text-xl md:text-4xl"
                                                        >
                                                            {e}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Light Burst Effect */}
                                {isBoxOpen && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 6, 0], opacity: [0, 1, 0] }}
                                        transition={{ duration: 1 }}
                                        className="absolute inset-0 bg-white rounded-full blur-[100px] z-[-1]"
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {gifts.map((gift) => (
                        <motion.div
                            key={gift.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            onPointerDown={() => catchGift(gift.id)}
                            className="absolute cursor-pointer select-none z-50 p-4 -m-4 md:p-6 md:-m-6"
                            style={{ left: gift.x, top: gift.y }}
                        >
                            <div className="text-3xl md:text-6xl filter drop-shadow-2xl hover:scale-125 transition-transform active:scale-90">
                                {gift.type === 'red' ? '🎁' : gift.type === 'gold' ? '⭐' : '🎄'}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-[20rem] font-serif font-bold text-stone-900">
                        GENNA
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftGame;
