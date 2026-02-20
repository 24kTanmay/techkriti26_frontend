const Theme = () => {
    return (
        <section id="theme" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, hsl(var(--color-secondary) / 0.1) 0%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: -1
            }}></div>
            <div className="container">
                <h2 className="section-title" style={{ fontSize: '4.5rem' }}><span className="highlight">Theme</span></h2>
                <div className="glass-card" style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    textAlign: 'center',
                    opacity: 0.9,
                    border: '1px solid hsl(var(--color-primary) / 0.2)',
                    boxShadow: '0 0 40px hsl(var(--color-primary) / 0.1), inset 0 0 20px hsl(var(--color-primary) / 0.05)',
                    padding: '4rem 2rem'
                }}>
                    <p style={{
                        fontSize: '1.5rem',
                        fontStyle: 'italic',
                        lineHeight: '2.5',
                        letterSpacing: '0.1em',
                        color: 'hsl(var(--color-text-muted))',
                        fontWeight: '300',
                    }}>
                        Theme Coming Soon...
                    </p>
                    <div style={{
                        marginTop: '3rem',
                        height: '1px',
                        width: '80px',
                        background: 'linear-gradient(to right, transparent, hsl(var(--color-primary)), transparent)',
                        margin: '2rem auto',
                    }}></div>
                </div>
            </div>
        </section>
    );
};

export default Theme;
