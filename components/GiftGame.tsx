import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playLevelUpSound } from '../services/audio';

interface Gift {
    id: number;
    x: number;
    y: number;
    type: 'red' | 'gold' | 'green' | 'candle' | 'coffee' | 'scarf' | 'cross' | 'crown' | 'special';
    speed: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    emoji?: string;
}

interface FloatingText {
    id: number;
    x: number;
    y: number;
    text: string;
    life: number;
}

const getTimeBonus = (score: number) => {
    // Scale time with performance but cap it to avoid infinite play
    return Math.min(45, Math.floor(score / 100) + 10);
};

const GiftGame: React.FC = () => {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const [shake, setShake] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [isBoxOpen, setIsBoxOpen] = useState(false);
    const [hasClickedBox, setHasClickedBox] = useState(false);
    const gameRef = useRef<HTMLDivElement>(null);
    const nextId = useRef(0);
    const nextParticleId = useRef(0);
    const nextTextId = useRef(0);

    const getLevelInfo = (s: number) => {

        if (s >= 10000) return {
            level: 5,
            gift: 'Golden Crown of Lalibela',
            icon: '👑',
            color: 'text-amber-600',
            theme: {
                bg: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200 via-yellow-100 to-amber-50',
                border: 'border-amber-400',
                shadow: 'shadow-[0_0_50px_rgba(245,158,11,0.5)]',
                text: 'text-amber-900',
                accent: 'text-amber-600',
                pattern: 'opacity-20 bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d97706\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")]'
            }
        };
        if (s >= 6000) return {
            level: 4,
            gift: 'Ceramic Coffee Set (Jebena)',
            icon: '☕',
            color: 'text-stone-800',
            theme: {
                bg: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-300 via-stone-200 to-stone-100',
                border: 'border-stone-600',
                shadow: 'shadow-[0_0_50px_rgba(87,83,78,0.5)]',
                text: 'text-stone-900',
                accent: 'text-stone-700',
                pattern: 'opacity-10 bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1h2v2H1V1zm4 0h2v2H5V1zm4 0h2v2H9V1z\' fill=\'%23292524\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
            }
        };
        if (s >= 3000) return {
            level: 3,
            gift: 'Royal Gabi (Traditional Blanket)',
            icon: '🧣',
            color: 'text-emerald-700',
            theme: {
                bg: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-200 via-green-100 to-emerald-50',
                border: 'border-emerald-400',
                shadow: 'shadow-[0_0_50px_rgba(16,185,129,0.5)]',
                text: 'text-emerald-900',
                accent: 'text-emerald-600',
                pattern: 'opacity-20 bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17l-7-7h14l-7 7z\' fill=\'%23059669\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]'
            }
        };
        if (s >= 1000) return {
            level: 2,
            gift: 'Handcrafted Meskel Cross',
            icon: '✝️',
            color: 'text-red-800',
            theme: {
                bg: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-200 via-rose-100 to-red-50',
                border: 'border-red-400',
                shadow: 'shadow-[0_0_50px_rgba(239,68,68,0.5)]',
                text: 'text-red-900',
                accent: 'text-red-600',
                pattern: 'opacity-15 bg-[url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23b91c1c\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")]'
            }
        };
        if (s >= 300) return {
            level: 1,
            gift: 'Traditional Netela (Elegant Scarf)',
            icon: '🎗️',
            color: 'text-stone-600',
            theme: {
                bg: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-200 via-gray-100 to-stone-50',
                border: 'border-stone-400',
                shadow: 'shadow-[0_0_50px_rgba(168,162,158,0.5)]',
                text: 'text-stone-800',
                accent: 'text-stone-500',
                pattern: 'opacity-10 bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'2\' fill=\'%2357534e\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")]'
            }
        };
        return {
            level: 0,
            gift: 'Small Genna Candle',
            icon: '🕯️',
            color: 'text-stone-400',
            theme: {
                bg: 'bg-stone-50/30',
                border: 'border-white/50',
                shadow: 'shadow-xl',
                text: 'text-stone-900',
                accent: 'text-amber-800',
                pattern: ''
            }
        };
    };

    const levelInfo = getLevelInfo(score);

    useEffect(() => {
        const saved = localStorage.getItem('gennaHighScore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('gennaHighScore', score.toString());
        }
    }, [score, highScore]);

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
        setParticles([]);
        setFloatingTexts([]);
        setIsPlaying(true);
        setIsPaused(false);
        setTimeLeft(30);
    };

    useEffect(() => {
        if (!isPlaying || showLevelUp || isPaused) return;

        const spawnInterval = setInterval(() => {
            if (gameRef.current) {
                const width = gameRef.current.offsetWidth;

                // 5% chance to spawn a special time-bonus gift
                const isSpecial = Math.random() < 0.05;

                let type: Gift['type'];
                let speed: number;

                if (isSpecial) {
                    type = 'special';
                    speed = Math.random() * 3 + 4 + (currentLevel * 1.5); // Fast!
                } else {
                    // Determine available gift types based on level
                    const availableTypes: Gift['type'][] = ['red', 'gold', 'green'];
                    if (currentLevel >= 1) availableTypes.push('candle', 'scarf');
                    if (currentLevel >= 2) availableTypes.push('coffee', 'cross');
                    if (currentLevel >= 3) availableTypes.push('crown');
                    type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                    speed = Math.random() * 2 + 2 + (currentLevel * 2.5);
                }

                const newGift: Gift = {
                    id: nextId.current++,
                    x: Math.random() * (width - 60) + 30,
                    y: -100,
                    type,
                    speed,
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
    }, [isPlaying, showLevelUp, isPaused]);

    useEffect(() => {
        if (!isPlaying || showLevelUp || isPaused) return;

        const moveInterval = setInterval(() => {
            setGifts((prev) =>
                prev
                    .map((g) => ({ ...g, y: g.y + g.speed }))
                    .filter((g) => g.y < 1000)
            );

            // Update particles
            setParticles(prev => prev
                .map(p => ({
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    vy: p.vy + 0.5, // gravity
                    life: p.life - 1
                }))
                .filter(p => p.life > 0)
            );

            // Update floating texts
            setFloatingTexts(prev => prev
                .map(t => ({
                    ...t,
                    y: t.y - 1,
                    life: t.life - 1
                }))
                .filter(t => t.life > 0)
            );

            // Reduce shake
            setShake(prev => prev > 0 ? prev - 1 : 0);

        }, 16);

        return () => clearInterval(moveInterval);
    }, [isPlaying, showLevelUp, isPaused]);

    const spawnParticles = (x: number, y: number, color: string) => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 8; i++) {
            newParticles.push({
                id: nextParticleId.current++,
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                life: 30 + Math.random() * 20,
                color,
                emoji: ['✨', '⭐', '💫'][Math.floor(Math.random() * 3)]
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    };

    const catchGift = (id: number, x: number, y: number, type: string) => {
        let points = 10;
        let color = '#ef4444';

        switch (type) {
            case 'crown': points = 100; color = '#fbbf24'; break; // Amber
            case 'special': points = 50; color = '#ec4899'; break; // Pink
            case 'cross': points = 40; color = '#b91c1c'; break; // Red
            case 'coffee': points = 30; color = '#78350f'; break; // Brown
            case 'scarf': points = 25; color = '#14b8a6'; break; // Teal
            case 'candle': points = 20; color = '#f97316'; break; // Orange
            case 'gold': points = 15; color = '#eab308'; break; // Yellow
            case 'green': points = 10; color = '#22c55e'; break; // Green
            default: points = 10; color = '#ef4444'; break; // Red
        }

        const isSpecial = type === 'special';

        setScore((prev) => prev + points);
        setGifts((prev) => prev.filter((g) => g.id !== id));

        if (isSpecial) {
            setTimeLeft((prev) => prev + 5);
            playLevelUpSound(); // Reuse sound for special effect
        }

        // Visual Juice
        setShake(isSpecial ? 10 : 5);
        spawnParticles(x, y, color);

        // Floating Text
        setFloatingTexts(prev => [...prev, {
            id: nextTextId.current++,
            x,
            y,
            text: isSpecial ? `+${points} 🕒` : `+${points}`,
            life: 40
        }]);
    };

    // Calculate progress to next level
    const nextLevelScore =
        score < 300 ? 300 :
            score < 1000 ? 1000 :
                score < 3000 ? 3000 :
                    score < 6000 ? 6000 :
                        score < 10000 ? 10000 : 10000;

    const prevLevelScore =
        score < 300 ? 0 :
            score < 1000 ? 300 :
                score < 3000 ? 1000 :
                    score < 6000 ? 3000 :
                        score < 10000 ? 6000 : 6000;

    const progress = Math.min(100, Math.max(0, ((score - prevLevelScore) / (nextLevelScore - prevLevelScore)) * 100));

    return (
        <div className="h-full flex flex-col space-y-6">
            <motion.div
                animate={{
                    borderColor: levelInfo.level > 0 ? 'var(--border-color)' : 'transparent',
                }}
                className={`glass-card p-3 md:p-6 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 transition-all duration-500 ${levelInfo.theme.shadow} border-2 ${levelInfo.theme.border}`}
            >
                <div className="flex items-center space-x-3 md:space-x-6">
                    <div className="text-center">
                        <p className="text-[7px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-0.5 md:mb-1">Score</p>
                        <p className={`text-lg md:text-3xl font-serif font-bold ${levelInfo.theme.accent}`}>{score}</p>
                        <p className="text-[6px] md:text-[8px] font-bold text-stone-400">HI: {highScore}</p>
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
                    {isPlaying && (
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="ml-2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 transition-all shadow-sm border border-stone-200 active:scale-95 z-50"
                            title={isPaused ? "Resume" : "Pause"}
                        >
                            {isPaused ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>

                {!isPlaying ? (
                    <button
                        onClick={startGame}
                        className="shine-effect w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-stone-950 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs md:text-base"
                    >
                        {timeLeft === 0 ? 'Play Again' : 'Start Game'}
                    </button>
                ) : (
                    <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-3 md:space-x-4">
                            <div className="text-right">
                                <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400">Next Reward</p>
                                <p className="text-[10px] md:text-xs font-bold text-stone-900">{levelInfo.gift}</p>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-24 md:w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${progress}%` }}
                                className={`h-full ${levelInfo.color.replace('text-', 'bg-')}`}
                            />
                        </div>
                    </div>
                )}
            </motion.div>

            <motion.div
                ref={gameRef}
                animate={{
                    backgroundColor: 'var(--bg-color)',
                    x: shake > 0 ? [0, -5, 5, -5, 5, 0] : 0
                }}
                transition={{ duration: 0.2 }}
                className={`relative flex-1 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border-2 md:border-4 transition-colors duration-500 shadow-inner min-h-[400px] md:min-h-[800px] ${levelInfo.theme.bg} ${levelInfo.theme.border}`}
            >
                {/* Background Pattern */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${levelInfo.theme.pattern}`} />
                {!isPlaying && timeLeft === 30 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8 z-10">
                        <div className="text-5xl md:text-6xl mb-4 md:mb-6 animate-float">🎁</div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-2 md:mb-4">Genna Gift Catch</h2>
                        <p className="text-stone-600 max-w-sm mb-6 md:mb-8 font-medium text-xs md:text-base">
                            Catch falling items to level up and earn traditional Ethiopian Genna gifts!
                        </p>
                        <div className="grid grid-cols-2 gap-2 md:gap-4 text-left max-w-md">
                            <div className="text-[8px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest col-span-2 mb-1 md:mb-2">Rewards</div>
                            <div className="text-[10px] md:text-xs font-medium">300+ pts: Netela</div>
                            <div className="text-[10px] md:text-xs font-medium">1000+ pts: Meskel Cross</div>
                            <div className="text-[10px] md:text-xs font-medium">3000+ pts: Royal Gabi</div>
                            <div className="text-[10px] md:text-xs font-medium">6000+ pts: Coffee Set</div>
                        </div>
                    </div>
                )}

                {/* Pause Overlay */}
                {isPaused && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-sm z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card p-8 rounded-3xl border-stone-200 shadow-xl text-center"
                        >
                            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Game Paused</h2>
                            <button
                                onClick={() => setIsPaused(false)}
                                className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                            >
                                Resume
                            </button>
                        </motion.div>
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
                            onPointerDown={() => catchGift(gift.id, gift.x, gift.y, gift.type)}
                            className="absolute cursor-pointer select-none z-50 p-4 -m-4 md:p-6 md:-m-6"
                            style={{ left: gift.x, top: gift.y }}
                        >
                            <div className={`text-3xl md:text-6xl filter drop-shadow-2xl hover:scale-125 transition-transform active:scale-90 ${gift.type === 'special' ? 'animate-spin' : ''}`}>
                                {gift.type === 'red' ? '🎁' :
                                    gift.type === 'gold' ? '⭐' :
                                        gift.type === 'green' ? '🎄' :
                                            gift.type === 'candle' ? '🕯️' :
                                                gift.type === 'coffee' ? '☕' :
                                                    gift.type === 'scarf' ? '🧣' :
                                                        gift.type === 'cross' ? '✝️' :
                                                            gift.type === 'crown' ? '👑' : '🌟'}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Particles */}
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute pointer-events-none text-xl md:text-2xl"
                        style={{
                            left: p.x,
                            top: p.y,
                            opacity: p.life / 30,
                            transform: `scale(${p.life / 30})`
                        }}
                    >
                        {p.emoji}
                    </div>
                ))}

                {/* Floating Texts */}
                {floatingTexts.map(t => (
                    <div
                        key={t.id}
                        className="absolute pointer-events-none font-bold text-amber-600 text-xl md:text-3xl shadow-sm"
                        style={{
                            left: t.x,
                            top: t.y,
                            opacity: t.life / 20,
                        }}
                    >
                        {t.text}
                    </div>
                ))}

                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-[20rem] font-serif font-bold ${levelInfo.theme.text}`}>
                        GENNA
                    </div>
                </div>
            </motion.div>
        </div >
    );
};

export default GiftGame;
