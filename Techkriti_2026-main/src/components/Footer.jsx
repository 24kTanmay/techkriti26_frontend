


const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content-wrapper">
                    <div className="footer-grid">
                        <div className="footer-col brand-col">
                            <div className="footer-brand">
                                <h2>TECHKRITI <span className="highlight">26</span></h2>
                                <p>Asia's largest technical and entrepreneurial fest by IIT Kanpur since 1995, drawing 175,000+ participants from 25+ countries.</p>
                            </div>
                            <div className="social-links">
                                <a href="https://www.instagram.com/techkriti.iitk/" className="icon-link">
                                    <i className="fa-brands fa-instagram fa-xl"></i>
                                </a>
                                <a href="https://www.youtube.com/c/techkritiiitkanpur" className="icon-link">
                                    <i className="fa-brands fa-youtube fa-xl"></i>
                                </a>
                                <a href="https://in.linkedin.com/school/techkriti-iitk/" className="icon-link">
                                    <i className="fa-brands fa-linkedin-in fa-xl"></i>
                                </a>
                                <a href="https://www.facebook.com/techkriti.iitk/" className="icon-link">
                                    <i className="fa-brands fa-facebook-f fa-xl"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div className="footer-col logo-col">
                            <img src="/tech.jpeg" alt="Techkriti Logo" height="150" width="150" className="footer-logo-img" />
                        </div>
                    </div>

                    <hr className="footer-divider" />
                    <p className="copyright">&copy; 2026 TechKriti. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
