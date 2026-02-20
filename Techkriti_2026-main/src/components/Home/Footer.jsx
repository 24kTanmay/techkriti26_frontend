


const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="grid grid-cols-[3fr_1fr] gap-4 p-4">
                        <div className="bg-blue-200 p-4"><div className="footer-brand">
                            <h2>TECHKRITI <span className="highlight">26</span></h2>
                            <p>Asia's largest technical and entrepreneurial fest by IIT Kanpur since 1995, drawing 175,000+ participants from 25+ countries with Robowars, ML Hackathons, AI/robotics workshops.</p>
                        </div>
                            <div className="social-links" style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                                {/* Add social links here later */}
                                <a href="https://www.instagram.com/techkriti.iitk/.**" className="icon-link">
                                    <i className="fa-brands fa-instagram fa-xl"></i>
                                </a>
                                <a href="https://www.youtube.com/c/techkritiiitkanpur.**" className="icon-link">
                                    <i className="fa-brands fa-youtube fa-xl"></i>
                                </a>

                                <a href="https://in.linkedin.com/school/techkriti-iitk/.**" className="icon-link">
                                    <i className="fa-brands fa-linkedin-in fa-xl"></i>
                                </a>
                                <a href="https://www.facebook.com/techkriti.iitk/.**" className="icon-link">
                                    <i className="fa-brands fa-facebook-f fa-xl"></i>
                                </a>



                            </div></div>
                        <div className="bg-green-200 p-4" style={{ display: "flex", justifyContent: "center" }}><img src="/tech.jpeg" height="300" width="300"></img></div>

                    </div>

                    <hr style={{ marginTop: "24px", marginBottom: "16px" }}></hr>
                    <p className="copyright">&copy; 2026 TechKriti. All rights reserved.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
