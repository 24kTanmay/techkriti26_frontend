import { useEffect, useRef } from 'react';

const Hero = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.55;
        }
    }, []);

    return (
        <header className="hero">
            <div className="hero-bg">
                <div className="hero-overlay"></div>
                {/* <video
                    ref={videoRef}
                    src="/hero.mp4"
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                /> */}
                <video
                    ref={videoRef}
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                >
                    <source src="/hero_optimized.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="container hero-content" style={{ textAlign: 'center' }}>
                <h1 className="hero-title animate-fade-in">TECHKRITI 2026</h1>
                <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    NEO · NOVUS · SINGULARITA
                </p>
            </div>
        </header>
    );
};

export default Hero;