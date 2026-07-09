<?php
// includes/view/public/services.php
// 🔥 Services Section - REX Couriers
?>

<!-- ============================================ -->
<!-- 🔥 SERVICES SECTION                          -->
<!-- ============================================ -->
<section class="services-section" id="services">
    <div class="container">
        
        <!-- Section Header -->
        <div class="section-header text-center">
            <span class="section-badge">
                <i class="bi bi-stars"></i> What We Offer
            </span>
            <h2 class="section-title">Our Premium Services</h2>
            <p class="section-subtitle">
                Comprehensive logistics solutions tailored to meet your business needs with cutting-edge technology and unmatched reliability
            </p>
        </div>
        
        <!-- Services Grid -->
        <div class="services-grid">
            
            <!-- Service 1: Express Delivery -->
            <div class="service-card" data-service="express">
                <div class="service-icon-wrapper">
                    <div class="service-icon">
                        <i class="bi bi-lightning-charge-fill"></i>
                    </div>
                    <div class="service-icon-bg"></div>
                </div>
                <h3 class="service-title">Express Delivery</h3>
                <p class="service-excerpt">
                    Lightning-fast domestic and international delivery with real-time tracking and guaranteed time slots.
                </p>
                <div class="service-meta">
                    <span class="service-tag"><i class="bi bi-clock"></i> Same Day</span>
                    <span class="service-tag"><i class="bi bi-geo-alt"></i> Nationwide</span>
                </div>
                <button class="service-btn" onclick="openServiceModal('express')">
                    <span>Learn More</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
            
            <!-- Service 2: International Shipping -->
            <div class="service-card" data-service="international">
                <div class="service-icon-wrapper">
                    <div class="service-icon">
                        <i class="bi bi-globe-asia-australia"></i>
                    </div>
                    <div class="service-icon-bg"></div>
                </div>
                <h3 class="service-title">International Shipping</h3>
                <p class="service-excerpt">
                    Global network covering 200+ countries with customs clearance, documentation, and door-to-door service.
                </p>
                <div class="service-meta">
                    <span class="service-tag"><i class="bi bi-globe"></i> 200+ Countries</span>
                    <span class="service-tag"><i class="bi bi-shield-check"></i> Insured</span>
                </div>
                <button class="service-btn" onclick="openServiceModal('international')">
                    <span>Learn More</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
            
            <!-- Service 3: Cargo & Freight -->
            <div class="service-card" data-service="cargo">
                <div class="service-icon-wrapper">
                    <div class="service-icon">
                        <i class="bi bi-truck-front-fill"></i>
                    </div>
                    <div class="service-icon-bg"></div>
                </div>
                <h3 class="service-title">Cargo & Freight</h3>
                <p class="service-excerpt">
                    Heavy cargo solutions via air, sea, and road. Specialized handling for oversized and hazardous materials.
                </p>
                <div class="service-meta">
                    <span class="service-tag"><i class="bi bi-box-seam"></i> Air & Sea</span>
                    <span class="service-tag"><i class="bi bi-graph-up"></i> Bulk Rates</span>
                </div>
                <button class="service-btn" onclick="openServiceModal('cargo')">
                    <span>Learn More</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
            
            <!-- Service 4: E-Commerce Solutions -->
            <div class="service-card" data-service="ecommerce">
                <div class="service-icon-wrapper">
                    <div class="service-icon">
                        <i class="bi bi-bag-check-fill"></i>
                    </div>
                    <div class="service-icon-bg"></div>
                </div>
                <h3 class="service-title">E-Commerce Solutions</h3>
                <p class="service-excerpt">
                    End-to-end logistics for online sellers with COD, inventory management, and API integration.
                </p>
                <div class="service-meta">
                    <span class="service-tag"><i class="bi bi-cash-coin"></i> COD</span>
                    <span class="service-tag"><i class="bi bi-plug"></i> API Ready</span>
                </div>
                <button class="service-btn" onclick="openServiceModal('ecommerce')">
                    <span>Learn More</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
            
            <!-- Service 5: Warehousing -->
            <div class="service-card" data-service="warehousing">
                <div class="service-icon-wrapper">
                    <div class="service-icon">
                        <i class="bi bi-building-fill"></i>
                    </div>
                    <div class="service-icon-bg"></div>
                </div>
                <h3 class="service-title">Warehousing</h3>
                <p class="service-excerpt">
                    State-of-the-art storage facilities with climate control, 24/7 security, and inventory management systems.
                </p>
                <div class="service-meta">
                    <span class="service-tag"><i class="bi bi-shield-lock"></i> Secure</span>
                    <span class="service-tag"><i class="bi bi-thermometer-snow"></i> Climate</span>
                </div>
                <button class="service-btn" onclick="openServiceModal('warehousing')">
                    <span>Learn More</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
            
            <!-- Service 6: Customs Clearance -->
            <div class="service-card" data-service="customs">
                <div class="service-icon-wrapper">
                    <div class="service-icon">
                        <i class="bi bi-file-earmark-check-fill"></i>
                    </div>
                    <div class="service-icon-bg"></div>
                </div>
                <h3 class="service-title">Customs Clearance</h3>
                <p class="service-excerpt">
                    Expert customs brokerage with fast clearance, duty calculation, and compliance management.
                </p>
                <div class="service-meta">
                    <span class="service-tag"><i class="bi bi-file-earmark-text"></i> Documentation</span>
                    <span class="service-tag"><i class="bi bi-lightning"></i> Fast</span>
                </div>
                <button class="service-btn" onclick="openServiceModal('customs')">
                    <span>Learn More</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
            
            <!-- Service 7: Same Day Delivery -->
            <div class="service-card" data-service="sameday">
                <div class="service-icon-wrapper">
                    <div class="service-icon">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <div class="service-icon-bg"></div>
                </div>
                <h3 class="service-title">Same Day Delivery</h3>
                <p class="service-excerpt">
                    Urgent delivery within hours for time-critical shipments in major cities with live tracking.
                </p>
                <div class="service-meta">
                    <span class="service-tag"><i class="bi bi-stopwatch"></i> 2-6 Hours</span>
                    <span class="service-tag"><i class="bi bi-pin-map"></i> Metro</span>
                </div>
                <button class="service-btn" onclick="openServiceModal('sameday')">
                    <span>Learn More</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
            
            <!-- Service 8: Corporate Solutions -->
            <div class="service-card" data-service="corporate">
                <div class="service-icon-wrapper">
                    <div class="service-icon">
                        <i class="bi bi-briefcase-fill"></i>
                    </div>
                    <div class="service-icon-bg"></div>
                </div>
                <h3 class="service-title">Corporate Solutions</h3>
                <p class="service-excerpt">
                    Dedicated account management, volume discounts, and customized logistics for enterprises.
                </p>
                <div class="service-meta">
                    <span class="service-tag"><i class="bi bi-percent"></i> Discounts</span>
                    <span class="service-tag"><i class="bi bi-people"></i> Dedicated</span>
                </div>
                <button class="service-btn" onclick="openServiceModal('corporate')">
                    <span>Learn More</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
            
        </div>
        
    </div>
</section>

<!-- ============================================ -->
<!-- 🔥 SERVICE DETAIL MODAL                      -->
<!-- ============================================ -->
<div class="modal fade" id="serviceDetailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header border-0">
                <div class="modal-header-content">
                    <div class="modal-icon-wrapper" id="modalIconWrapper">
                        <i class="bi bi-lightning-charge-fill"></i>
                    </div>
                    <div class="modal-title-wrapper">
                        <h4 class="modal-title" id="modalTitle">Service Title</h4>
                        <p class="modal-subtitle" id="modalSubtitle">Service Category</p>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                
                <!-- Overview Section -->
                <div class="modal-section">
                    <h5 class="section-heading">
                        <i class="bi bi-info-circle me-2"></i>Overview
                    </h5>
                    <p class="section-text" id="modalOverview">
                        Service overview content...
                    </p>
                </div>
                
                <!-- Key Features -->
                <div class="modal-section">
                    <h5 class="section-heading">
                        <i class="bi bi-star me-2"></i>Key Features
                    </h5>
                    <div class="features-grid" id="modalFeatures">
                        <!-- Features populated dynamically -->
                    </div>
                </div>
                
                <!-- How It Works -->
                <div class="modal-section">
                    <h5 class="section-heading">
                        <i class="bi bi-gear me-2"></i>How It Works
                    </h5>
                    <div class="process-steps" id="modalProcess">
                        <!-- Steps populated dynamically -->
                    </div>
                </div>
                
                <!-- Pricing & Benefits -->
                <div class="modal-section">
                    <h5 class="section-heading">
                        <i class="bi bi-tags me-2"></i>Pricing & Benefits
                    </h5>
                    <div class="pricing-content" id="modalPricing">
                        <!-- Pricing populated dynamically -->
                    </div>
                </div>
                
                <!-- Why Choose Us -->
                <div class="modal-section bg-light rounded p-4">
                    <h5 class="section-heading">
                        <i class="bi bi-award me-2"></i>Why Choose REX?
                    </h5>
                    <ul class="why-choose-list" id="modalWhyChoose">
                        <!-- Why choose items populated dynamically -->
                    </ul>
                </div>
                
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-outline-secondary btn-lg" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-2"></i>Cancel
                </button>
                <button type="button" class="btn btn-primary btn-lg" onclick="requestService()">
                    <i class="bi bi-send me-2"></i>Request This Service
                </button>
            </div>
        </div>
    </div>
</div>

