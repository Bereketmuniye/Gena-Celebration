import React, { useEffect, useRef, useState } from 'react';

const BackgroundMusic: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const initializePlayer = () => {
            playerRef.current = new (window as any).YT.Player('youtube-player', {
                height: '0',
                width: '0',
                videoId: 'QOgWPcu-lvE',
                playerVars: {
                    autoplay: 0,
                    loop: 1,
                    playlist: 'QOgWPcu-lvE',
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                },
                events: {
                    onReady: () => {
                        setIsReady(true);
                    },
                    onStateChange: (event: any) => {
                        if (event.data === (window as any).YT.PlayerState.ENDED) {
                            playerRef.current.playVideo();
                        }
                    }
                },
            });
        };

        if ((window as any).YT && (window as any).YT.Player) {
            initializePlayer();
        } else {
            (window as any).onYouTubeIframeAPIReady = initializePlayer;
        }

        return () => {
        };
    }, []);

    const togglePlay = () => {
        if (playerRef.current && isReady) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-24 left-6 z-[10001] md:bottom-8 md:left-8">
            <div id="youtube-player" className="hidden"></div>
            <button
                onClick={togglePlay}
                disabled={!isReady}
                className={`glass-card p-4 rounded-full shadow-2xl hover:scale-110 transition-all border-amber-500/50 group flex items-center justify-center ${!isReady ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={isPlaying ? "Pause Background Music" : "Play Background Music"}
            >
                <div className="relative flex items-center justify-center">
                    {isPlaying ? (
                        <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}

                    {isPlaying && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-end space-x-1 h-3">
                            <div className="w-0.5 bg-amber-500 animate-[music-bar_0.6s_ease-in-out_infinite]" style={{ height: '60%' }}></div>
                            <div className="w-0.5 bg-amber-500 animate-[music-bar_0.8s_ease-in-out_infinite]" style={{ height: '100%' }}></div>
                            <div className="w-0.5 bg-amber-500 animate-[music-bar_0.7s_ease-in-out_infinite]" style={{ height: '80%' }}></div>
                        </div>
                    )}
                </div>

                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 text-[10px] uppercase tracking-widest font-bold text-amber-500 whitespace-nowrap">
                    {isPlaying ? "Now Playing: Genna Music" : "Play Festive Music"}
                </span>
            </button>

            <style>{`
        @keyframes music-bar {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
      `}</style>
        </div>
    );
};

export default BackgroundMusic;
