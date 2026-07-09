<?php
// includes/view/public/breadcrumb.php
// 🔥 Smart Breadcrumb - REX Couriers
?>

<!-- ============================================ -->
<!-- 🔥 SMART BREADCRUMB SECTION                  -->
<!-- ============================================ -->
<section class="breadcrumb-section" id="breadcrumbSection">
    
    <!-- Background Image with Overlay -->
    <div class="breadcrumb-background">
        <div class="breadcrumb-image" style="background-image: url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=600&fit=crop');">
            <div class="image-dither"></div>
        </div>
        <div class="breadcrumb-overlay"></div>
    </div>
    
    <!-- Breadcrumb Content -->
    <div class="breadcrumb-content">
        <div class="container">
            
            <!-- Page Title -->
            <div class="breadcrumb-header">
                <h1 class="page-title" id="pageTitle">
                    <i class="bi bi-house-door-fill"></i>
                    <span>Welcome to REX</span>
                </h1>
                <p class="page-description" id="pageDescription">
                    Your trusted logistics partner since 1999
                </p>
            </div>
            
            <!-- Breadcrumb Trail -->
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
                <ol class="breadcrumb-trail" id="breadcrumbTrail">
                    <!-- Home Link -->
                    <li class="breadcrumb-item">
                        <a href="home.php" class="breadcrumb-link home-link" data-page="home">
                            <i class="bi bi-house-door-fill"></i>
                            <span>Home</span>
                        </a>
                    </li>
                    
                    <!-- Dynamic breadcrumbs will be inserted here -->
                    
                </ol>
            </nav>
            
            <!-- Quick Actions -->
            <div class="breadcrumb-actions">
                <button type="button" class="action-btn back-to-home" onclick="goToHome()" title="Back to Home">
                    <i class="bi bi-house-heart-fill"></i>
                    <span>Back to Home</span>
                </button>
                <button type="button" class="action-btn track-shipment" onclick="scrollToTracking()" title="Track Shipment">
                    <i class="bi bi-geo-alt-fill"></i>
                    <span>Track Shipment</span>
                </button>
                <button type="button" class="action-btn contact-us" onclick="scrollToContact()" title="Contact Us">
                    <i class="bi bi-envelope-fill"></i>
                    <span>Contact Us</span>
                </button>
            </div>
            
        </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
        <div class="mouse">
            <div class="wheel"></div>
        </div>
        <span>Scroll Down</span>
    </div>
    
</section>
