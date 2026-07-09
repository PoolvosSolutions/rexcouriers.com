<?php
// includes/view/public/slider.php
// 🔥 Hero Banner Slider - REX Couriers
?>

<!-- ============================================ -->
<!-- 🔥 HERO BANNER SLIDER                        -->
<!-- ============================================ -->
<section class="hero-slider" id="heroSlider">
    
    <!-- Slider Container -->
    <div class="slider-container">
        
        <!-- Slide 1: Express Delivery -->
        <div class="slide active" data-slide="0">
            <div class="slide-background" style="background-image: url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=800&fit=crop');">
                <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
                <div class="container">
                    <div class="slide-text">
                        <span class="slide-badge"><i class="bi bi-lightning-fill"></i> Express Delivery</span>
                        <h1 class="slide-title">Lightning Fast<br>Worldwide Courier</h1>
                        <p class="slide-description">Same-day and next-day delivery services across Pakistan and international destinations. Your packages, our priority.</p>
                        <div class="slide-actions">
                            <a href="home.php" class="btn btn-primary btn-lg" onclick="loadView('newbooking'); return false;">
                                <i class="bi bi-plus-circle me-2"></i>Book Now
                            </a>
                            <a href="home.php" class="btn btn-outline-light btn-lg" onclick="loadView('trackshipment'); return false;">
                                <i class="bi bi-geo-alt me-2"></i>Track Shipment
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Slide 2: Cargo Services -->
        <div class="slide" data-slide="1">
            <div class="slide-background" style="background-image: url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=800&fit=crop');">
                <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
                <div class="container">
                    <div class="slide-text">
                        <span class="slide-badge"><i class="bi bi-truck"></i> Cargo Solutions</span>
                        <h1 class="slide-title">Heavy Cargo<br>Made Simple</h1>
                        <p class="slide-description">From small parcels to heavy cargo, we handle it all. Air freight, sea freight, and road transport with competitive rates.</p>
                        <div class="slide-actions">
                            <a href="home.php" class="btn btn-primary btn-lg" onclick="loadView('newbooking'); return false;">
                                <i class="bi bi-box-seam me-2"></i>Ship Cargo
                            </a>
                            <a href="#services" class="btn btn-outline-light btn-lg">
                                <i class="bi bi-info-circle me-2"></i>Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Slide 3: International Shipping -->
        <div class="slide" data-slide="2">
            <div class="slide-background" style="background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&h=800&fit=crop');">
                <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
                <div class="container">
                    <div class="slide-text">
                        <span class="slide-badge"><i class="bi bi-globe"></i> Global Network</span>
                        <h1 class="slide-title">Connecting You<br>To The World</h1>
                        <p class="slide-description">International shipping to 200+ countries. Customs clearance, documentation support, and door-to-door delivery.</p>
                        <div class="slide-actions">
                            <a href="home.php" class="btn btn-primary btn-lg" onclick="loadView('newbooking'); return false;">
                                <i class="bi bi-send me-2"></i>Send Internationally
                            </a>
                            <a href="#coverage" class="btn btn-outline-light btn-lg">
                                <i class="bi bi-map me-2"></i>View Coverage
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Slide 4: E-Commerce -->
        <div class="slide" data-slide="3">
            <div class="slide-background" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=800&fit=crop');">
                <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
                <div class="container">
                    <div class="slide-text">
                        <span class="slide-badge"><i class="bi bi-bag-check"></i> E-Commerce</span>
                        <h1 class="slide-title">Power Your<br>Online Business</h1>
                        <p class="slide-description">Specialized logistics for e-commerce sellers. COD services, bulk shipping discounts, and real-time tracking integration.</p>
                        <div class="slide-actions">
                            <a href="#ecommerce" class="btn btn-primary btn-lg">
                                <i class="bi bi-shop me-2"></i>Business Solutions
                            </a>
                            <a href="#contact" class="btn btn-outline-light btn-lg">
                                <i class="bi bi-phone me-2"></i>Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Slide 5: Secure & Reliable -->
        <div class="slide" data-slide="4">
            <div class="slide-background" style="background-image: url('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&h=800&fit=crop');">
                <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
                <div class="container">
                    <div class="slide-text">
                        <span class="slide-badge"><i class="bi bi-shield-check"></i> 100% Secure</span>
                        <h1 class="slide-title">Trusted By<br>Thousands</h1>
                        <p class="slide-description">Insurance coverage, secure handling, and real-time tracking. Your valuable items are in safe hands with REX Couriers.</p>
                        <div class="slide-actions">
                            <a href="#insurance" class="btn btn-primary btn-lg">
                                <i class="bi bi-shield me-2"></i>Get Insured
                            </a>
                            <a href="#testimonials" class="btn btn-outline-light btn-lg">
                                <i class="bi bi-star me-2"></i>Our Reviews
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    
    <!-- Navigation Arrows -->
    <button class="slider-arrow prev" id="sliderPrev" aria-label="Previous slide">
        <i class="bi bi-chevron-left"></i>
    </button>
    <button class="slider-arrow next" id="sliderNext" aria-label="Next slide">
        <i class="bi bi-chevron-right"></i>
    </button>
    
    <!-- Dots Navigation -->
    <div class="slider-dots" id="sliderDots">
        <button class="dot active" data-slide="0" aria-label="Go to slide 1"></button>
        <button class="dot" data-slide="1" aria-label="Go to slide 2"></button>
        <button class="dot" data-slide="2" aria-label="Go to slide 3"></button>
        <button class="dot" data-slide="3" aria-label="Go to slide 4"></button>
        <button class="dot" data-slide="4" aria-label="Go to slide 5"></button>
    </div>
    
    <!-- Progress Bar -->
    <div class="slider-progress" id="sliderProgress"></div>
    
</section>

<!-- ============================================ -->
<!-- 🔥 STATS BAR (Below Slider)                  -->
<!-- ============================================ -->
<section class="stats-bar">
    <div class="container">
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-icon"><i class="bi bi-box-seam-fill"></i></div>
                <div class="stat-info">
                    <div class="stat-number" data-count="50000">0</div>
                    <div class="stat-label">Shipments Delivered</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="bi bi-globe"></i></div>
                <div class="stat-info">
                    <div class="stat-number" data-count="200">0</div>
                    <div class="stat-label">Countries Covered</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="bi bi-people-fill"></i></div>
                <div class="stat-info">
                    <div class="stat-number" data-count="10000">0</div>
                    <div class="stat-label">Happy Customers</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="bi bi-clock-fill"></i></div>
                <div class="stat-info">
                    <div class="stat-number" data-count="24">0</div>
                    <div class="stat-label">Hour Service</div>
                </div>
            </div>
        </div>
    </div>
</section>

