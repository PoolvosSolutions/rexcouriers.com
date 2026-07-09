// assets/js/breadcrumb.js - BREADCRUMB FUNCTIONALITY
$(document).ready(function() {
    console.log("🚀 [breadcrumb.js] Breadcrumb initialized");
    
    initBreadcrumb();
});

// ============================================
// 🔥 INITIALIZE BREADCRUMB
// ============================================
function initBreadcrumb() {
    // Setup scroll indicator click
    setupScrollIndicator();
    
    // Setup smooth scroll for action buttons
    setupActionButtons();
    
    // Update breadcrumb based on current page
    updateBreadcrumbForCurrentPage();
    
    // Animate on scroll
    animateOnScroll();
}

// ============================================
// 🔥 SCROLL INDICATOR
// ============================================
function setupScrollIndicator() {
    $('.scroll-indicator').on('click', function() {
        $('html, body').animate({
            scrollTop: $('#breadcrumbSection').outerHeight()
        }, 800);
    });
}

// ============================================
// 🔥 ACTION BUTTONS
// ============================================
function setupActionButtons() {
    // Back to Home
    window.goToHome = function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    };
    
    // Scroll to Tracking
    window.scrollToTracking = function() {
        const trackingSection = $('#contactus, #footerTrackingForm').first();
        if (trackingSection.length) {
            $('html, body').animate({
                scrollTop: trackingSection.offset().top - 100
            }, 800);
        } else {
            // If not found, scroll to footer
            $('html, body').animate({
                scrollTop: $(document).height()
            }, 800);
        }
    };
    
    // Scroll to Contact
    window.scrollToContact = function() {
        const contactSection = $('#contactus');
        if (contactSection.length) {
            $('html, body').animate({
                scrollTop: contactSection.offset().top - 80
            }, 800);
        } else {
            // If not found, scroll to footer
            $('html, body').animate({
                scrollTop: $(document).height()
            }, 800);
        }
    };
}

// ============================================
// 🔥 UPDATE BREADCRUMB FOR CURRENT PAGE
// ============================================
function updateBreadcrumbForCurrentPage() {
    // Get current page/view
    const currentPage = getCurrentPage();
    
    // Define breadcrumb structure for each page
    const breadcrumbConfig = {
        'home': {
            title: 'Welcome to REX Worldwide Courier',
            description: 'Your trusted logistics partner since 1999',
            trail: []
        },
        'newbooking': {
            title: 'New Booking',
            description: 'Create a new shipment booking',
            trail: [
                { label: 'Services', icon: 'bi-stars', page: 'services' },
                { label: 'New Booking', icon: 'bi-plus-circle', page: 'newbooking', active: true }
            ]
        },
        'trackshipment': {
            title: 'Track Shipment',
            description: 'Track your shipment in real-time',
            trail: [
                { label: 'Tracking', icon: 'bi-geo-alt', page: 'trackshipment', active: true }
            ]
        },
        'services': {
            title: 'Our Services',
            description: 'Comprehensive logistics solutions',
            trail: [
                { label: 'Services', icon: 'bi-stars', page: 'services', active: true }
            ]
        },
        'aboutus': {
            title: 'About Us',
            description: 'Learn about our journey and values',
            trail: [
                { label: 'Company', icon: 'bi-building', page: 'aboutus', active: true }
            ]
        },
        'contactus': {
            title: 'Contact Us',
            description: 'Get in touch with our team',
            trail: [
                { label: 'Contact', icon: 'bi-envelope', page: 'contactus', active: true }
            ]
        },
        'billinggeneration': {
            title: 'Generate Bill',
            description: 'Create billing for shipments',
            trail: [
                { label: 'Finance', icon: 'bi-cash-coin', page: 'finance' },
                { label: 'Generate Bill', icon: 'bi-file-earmark-ruled', page: 'billinggeneration', active: true }
            ]
        },
        'bookinglist': {
            title: 'Manage Bookings',
            description: 'View and manage all bookings',
            trail: [
                { label: 'Operations', icon: 'bi-box-seam', page: 'operations' },
                { label: 'Bookings', icon: 'bi-list-ul', page: 'bookinglist', active: true }
            ]
        }
    };
    
    // Get config for current page or use default
    const config = breadcrumbConfig[currentPage] || breadcrumbConfig['home'];
    
    // Update title and description
    $('#pageTitle span').text(config.title);
    $('#pageDescription').text(config.description);
    
    // Build breadcrumb trail
    buildBreadcrumbTrail(config.trail);
    
    // Update background image based on page
    updateBackgroundImage(currentPage);
    
    console.log(`📍 Breadcrumb updated for: ${currentPage}`);
}

// ============================================
// 🔥 GET CURRENT PAGE
// ============================================
function getCurrentPage() {
    // Check URL hash for view name
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        return hash;
    }
    
    // Check for view parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    if (view) {
        return view;
    }
    
    // Default to home
    return 'home';
}

// ============================================
// 🔥 BUILD BREADCRUMB TRAIL
// ============================================
function buildBreadcrumbTrail(trail) {
    const $trail = $('#breadcrumbTrail');
    $trail.empty();
    
    // Always add home link first
    $trail.append(`
        <li class="breadcrumb-item">
            <a href="home.php" class="breadcrumb-link home-link" data-page="home" onclick="navigateToPage('home'); return false;">
                <i class="bi bi-house-door-fill"></i>
                <span>Home</span>
            </a>
        </li>
    `);
    
    // Add trail items
    trail.forEach((item, index) => {
        const separator = index < trail.length - 1 ? 
            '<li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>' : '';
        
        const linkClass = item.active ? 'breadcrumb-link active' : 'breadcrumb-link';
        const icon = item.icon || 'bi-circle';
        
        if (item.active) {
            $trail.append(`
                <li class="breadcrumb-item">
                    <span class="${linkClass}">
                        <i class="bi ${icon}"></i>
                        <span>${item.label}</span>
                    </span>
                </li>
                ${separator}
            `);
        } else {
            $trail.append(`
                <li class="breadcrumb-item">
                    <a href="#" class="${linkClass}" data-page="${item.page}" onclick="navigateToPage('${item.page}'); return false;">
                        <i class="bi ${icon}"></i>
                        <span>${item.label}</span>
                    </a>
                </li>
                ${separator}
            `);
        }
    });
}

// ============================================
// 🔥 NAVIGATE TO PAGE
// ============================================
function navigateToPage(pageName) {
    console.log(`🔄 Navigating to: ${pageName}`);
    
    // If it's a valid view, use loadView
    if (window.loadView) {
        loadView(pageName);
    } else {
        // Fallback: redirect to home with hash
        window.location.hash = pageName;
        location.reload();
    }
}

// ============================================
// 🔥 UPDATE BACKGROUND IMAGE
// ============================================
function updateBackgroundImage(page) {
    const backgrounds = {
        'home': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=600&fit=crop',
        'newbooking': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&h=600&fit=crop',
        'trackshipment': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&h=600&fit=crop',
        'services': 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=600&fit=crop',
        'aboutus': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&h=600&fit=crop',
        'contactus': 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=1920&h=600&fit=crop',
        'billinggeneration': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=600&fit=crop',
        'bookinglist': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=600&fit=crop'
    };
    
    const imageUrl = backgrounds[page] || backgrounds['home'];
    $('.breadcrumb-image').css('background-image', `url('${imageUrl}')`);
}

// ============================================
// 🔥 ANIMATE ON SCROLL
// ============================================
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe breadcrumb elements
    document.querySelectorAll('.breadcrumb-item, .action-btn').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// ============================================
// 🔥 PARALLAX EFFECT
// ============================================
$(window).on('scroll', function() {
    const scrolled = $(this).scrollTop();
    const $image = $('.breadcrumb-image');
    
    if ($image.length && scrolled < 600) {
        const parallaxSpeed = 0.5;
        const yPos = -(scrolled * parallaxSpeed);
        $image.css('transform', `translateY(${yPos}px) scale(1.1)`);
    }
});

// ============================================
// 🔥 KEYBOARD NAVIGATION
// ============================================
$(document).on('keydown', function(e) {
    // Alt + Home = Go to home
    if (e.altKey && e.key === 'Home') {
        e.preventDefault();
        goToHome();
    }
    
    // Alt + T = Track shipment
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        scrollToTracking();
    }
    
    // Alt + C = Contact us
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        scrollToContact();
    }
});
