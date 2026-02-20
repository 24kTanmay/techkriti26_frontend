const Community = () => {
    return (
        <section id="community" className="section">
            <div className="container" style={{ textAlign: 'center' }}>
                <div className="glass-card" style={{
                    background: 'radial-gradient(circle at center, hsl(220 50% 15%), hsl(220 50% 10%))',
                    border: 'none',
                    boxShadow: 'none'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Join Our Community</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        Be a part of the conversation. Get instant updates, exclusive content,
                        and network with fellow tech enthusiasts on our WhatsApp Community.
                    </p>
                    <a href="https://whatsapp.com/channel/0029Vay74G1I1rciyKefK13E" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
                        Join WhatsApp Channel
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Community;
