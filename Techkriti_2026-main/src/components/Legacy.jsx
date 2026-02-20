const Legacy = () => {
    const milestones = [
        { year: '2020', title: 'Inception', desc: 'Started as a small coding meet.' },
        { year: '2022', title: 'National Level', desc: 'Witnessed participation from all over India.' },
        { year: '2024', title: 'Global Reach', desc: 'Hybrid mode with international speakers.' },
        { year: '2026', title: 'The Future', desc: 'Setting new benchmarks in tech fests.' }
    ];

    return (
        <section id="legacy" className="section">

            <div className="container">
                <h2 className="section-title">Our Legacy</h2>
                <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "60px", marginTop: "60px" }}>
                    <h2>A Legacy in Frames</h2>
                    <img src="/gallery/cds_inauguration.jpg" style={{
                        width: "max(360px,40vw)", height: "400px", marginTop: "60px", objectFit: 'cover', borderRadius: '1rem'
                    }} />
                </div>
                <div className="container " style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "60px", marginTop: "60px" }}>

                    <h2>Choose your arena. Prove your edge</h2>
                    <p>Participate in competitions and hands-on-workshops designed to upgrade your skills and prepare you for cutting-edge industries.</p>


                    {/* <div className="card-3d" style={{ marginTop: "120px", marginBottom: "60px" }}>
                        <div style={{ backgroundImage: 'url(/gallery/army1.jpg)', backgroundSize: 'cover' }}></div>
                        <div style={{ backgroundImage: 'url(/gallery/drill.jpg)', backgroundSize: 'cover' }}></div>
                        <div style={{ backgroundImage: 'url(/gallery/air.jpg)', backgroundSize: 'cover' }}></div>
                        <div style={{ backgroundImage: 'url(/gallery/robo6.jpg)', backgroundSize: 'cover' }}></div>
                        <div style={{ backgroundImage: 'url(/gallery/guns1.jpg)', backgroundSize: 'cover' }}></div>
                    </div> */}

                    <p style={{
                        fontSize: '2.5rem',
                        fontStyle: 'italic',
                        lineHeight: '2.5',
                        letterSpacing: '0.1em',
                        color: 'hsl(var(--color-text-muted))',
                        fontWeight: '600',
                        marginTop: '1.3rem'
                    }}>
                        To Be Announced...
                    </p>

                </div>

            </div>
        </section>
    );
};



export default Legacy;
