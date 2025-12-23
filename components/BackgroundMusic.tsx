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
        <div className="fixed bottom-8 left-8 z-[100]">
            <div id="youtube-player" className="hidden"></div>
            <button
                onClick={togglePlay}
                disabled={!isReady}
                className="group flex items-center space-x-3 bg-white/10 backdrop-blur-2xl border border-white/20 p-3 rounded-2xl shadow-2xl hover:bg-white/20 transition-all duration-500 disabled:opacity-50"
            >
                <div className="w-10 h-10 bg-stone-950 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {isPlaying ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </div>
                <div className="pr-4 overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-700 ease-in-out">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 whitespace-nowrap">
                        {isPlaying ? 'Atmosphere: ON' : 'Atmosphere: OFF'}
                    </span>
                </div>
            </button>
        </div>
    );
};

export default BackgroundMusic;
