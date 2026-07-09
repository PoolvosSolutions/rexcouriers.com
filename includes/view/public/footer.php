<?php
// includes/view/public/footer.php
// 🔥 Smart Footer - REX Couriers
?>

<!-- ============================================ -->
<!-- 🔥 SMART FOOTER                              -->
<!-- ============================================ -->
<footer class="rex-footer">
    
    <!-- Main Footer Content -->
    <div class="footer-main">
        <div class="container">
            <div class="footer-grid">
                
                <!-- Column 1: Company Info -->
                <div class="footer-col footer-about">
                    <div class="footer-logo">
                        <div class="footer-logo-icon">
                            <i class="bi bi-box-seam-fill"></i>
                        </div>
                        <div class="footer-logo-text">
                            <span class="logo-main">REX</span>
                            <span class="logo-sub">WORLDWIDE COURIER</span>
                        </div>
                    </div>
                    <p class="footer-description">
                        Pakistan's trusted courier and logistics partner. Delivering excellence, 
                        reliability, and innovation since 1999. Connecting businesses to customers 
                        across 200+ countries worldwide.
                    </p>
                    
                    <!-- Social Icons -->
                    <div class="footer-social">
                        <h6 class="social-title">Follow Us</h6>
                        <div class="social-icons">
                            <a href="https://facebook.com" target="_blank" class="social-icon facebook" aria-label="Facebook">
                                <i class="bi bi-facebook"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" class="social-icon twitter" aria-label="Twitter">
                                <i class="bi bi-twitter-x"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" class="social-icon instagram" aria-label="Instagram">
                                <i class="bi bi-instagram"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" class="social-icon linkedin" aria-label="LinkedIn">
                                <i class="bi bi-linkedin"></i>
                            </a>
                            <a href="https://youtube.com" target="_blank" class="social-icon youtube" aria-label="YouTube">
                                <i class="bi bi-youtube"></i>
                            </a>
                            <a href="https://wa.me/9203001115231" target="_blank" class="social-icon whatsapp" aria-label="WhatsApp">
                                <i class="bi bi-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Column 2: Quick Links -->
                <div class="footer-col">
                    <h5 class="footer-title">Quick Links</h5>
                    <ul class="footer-links">
                        <li><a href="#home" class="footer-link smooth-scroll"><i class="bi bi-house-door"></i>Home</a></li>
                        <li><a href="#services" class="footer-link smooth-scroll"><i class="bi bi-stars"></i>Our Services</a></li>
                        <li><a href="#aboutus" class="footer-link smooth-scroll"><i class="bi bi-building"></i>About Us</a></li>
                        <li><a href="#contactus" class="footer-link smooth-scroll"><i class="bi bi-envelope"></i>Contact Us</a></li>                        
                    </ul>
                </div>
                
                <!-- Column 3: Our Services -->
                <div class="footer-col">
                    <h5 class="footer-title">Our Services</h5>
                    <ul class="footer-links">
                        <li><a href="#services" class="footer-link smooth-scroll" onclick="openServiceModal('express'); return false;"><i class="bi bi-lightning-charge"></i>Express Delivery</a></li>
                        <li><a href="#services" class="footer-link smooth-scroll" onclick="openServiceModal('international'); return false;"><i class="bi bi-globe"></i>International Shipping</a></li>
                        <li><a href="#services" class="footer-link smooth-scroll" onclick="openServiceModal('cargo'); return false;"><i class="bi bi-truck"></i>Cargo & Freight</a></li>
                        <li><a href="#services" class="footer-link smooth-scroll" onclick="openServiceModal('ecommerce'); return false;"><i class="bi bi-bag-check"></i>E-Commerce Solutions</a></li>
                        <li><a href="#services" class="footer-link smooth-scroll" onclick="openServiceModal('warehousing'); return false;"><i class="bi bi-building"></i>Warehousing</a></li>
                        <li><a href="#services" class="footer-link smooth-scroll" onclick="openServiceModal('sameday'); return false;"><i class="bi bi-clock-history"></i>Same Day Delivery</a></li>
                    </ul>
                </div>
                
                <!-- Column 4: Track Shipment -->
                <div class="footer-col footer-tracking">
                    <h5 class="footer-title">
                        <i class="bi bi-geo-alt-fill"></i>Track Shipment
                    </h5>
                    <p class="tracking-description">
                        Enter your AWB or PI number to track your shipment in real-time.
                    </p>
                    
                    <!-- Footer Tracking Form -->
                    <form id="footerTrackingForm" class="footer-tracking-form">
                        <div class="footer-tracking-input-wrapper">
                            <i class="bi bi-search tracking-icon"></i>
                            <input 
                                type="text" 
                                id="footerTrackingInput" 
                                class="footer-tracking-input" 
                                placeholder="AWB / PI Number"
                                autocomplete="off"
                                maxlength="20"
                            >
                        </div>
                        <button type="submit" class="footer-tracking-btn" id="btnFooterTrack">
                            <span class="btn-text"><i class="bi bi-arrow-right-circle-fill"></i></span>
                            <span class="btn-loader d-none">
                                <span class="spinner-border spinner-border-sm"></span>
                            </span>
                        </button>
                    </form>
                    
                    <small class="tracking-hint">
                        <i class="bi bi-info-circle"></i>
                        Format: <code>07081001</code> or <code>202607081001</code>
                    </small>
                    
                    <!-- Quick Track Examples -->
                    <div class="tracking-examples">
                        <span>Try:</span>
                        <button type="button" class="example-btn" data-awb="07081001">07081001</button>
                        <button type="button" class="example-btn" data-awb="202607081001">202607081001</button>
                    </div>
                </div>
                
                
                
            </div>
        </div>
    </div>
    
    <!-- Newsletter Bar -->
    <div class="footer-newsletter">
        <div class="container">
            <div class="newsletter-content">
                <div class="newsletter-text">
                    <h6><i class="bi bi-envelope-paper me-2"></i>Subscribe to Our Newsletter</h6>
                    <p>Get updates on new services, offers, and logistics insights</p>
                </div>
                <form class="newsletter-form" id="newsletterForm">
                    <input 
                        type="email" 
                        class="newsletter-input" 
                        placeholder="Enter your email address"
                        required
                    >
                    <button type="submit" class="newsletter-btn">
                        <i class="bi bi-send-fill me-1"></i>Subscribe
                    </button>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Copyright Bar -->
    <div class="footer-bottom">
        <div class="container">
            <div class="footer-bottom-content">
                <div class="copyright-text">
                    <p>
                        &copy; <?php echo date('Y'); ?> <strong>REX Worldwide Courier</strong>. All Rights Reserved.
                    </p>
                </div>
                <div class="footer-bottom-links">
                    <a href="#privacy" class="bottom-link">Privacy Policy</a>
                    <span class="divider">|</span>
                    <a href="#terms" class="bottom-link">Terms of Service</a>
                    <span class="divider">|</span>
                    <a href="#sitemap" class="bottom-link">Sitemap</a>
                </div>
            </div>
        </div>
    </div>
    
</footer>

<!-- ============================================ -->
<!-- 🔥 BACK TO TOP BUTTON                        -->
<!-- ============================================ -->
<button class="back-to-top" id="backToTop" aria-label="Back to top">
    <i class="bi bi-arrow-up"></i>
</button>
