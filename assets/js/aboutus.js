// assets/js/aboutus.js - ABOUT US FUNCTIONALITY
$(document).ready(function() {
    console.log("🚀 [aboutus.js] About Us section initialized");
    
    initAboutUsSection();
});

// ============================================
// 🔥 INITIALIZE ABOUT US SECTION
// ============================================
function initAboutUsSection() {
    // Setup button handlers
    $('#btnReadFullStory').on('click', openAboutUsModal);
    $('#btnViewFullTimeline').on('click', openAboutUsModal);
    
    // Initialize stats counter animation
    initAboutStatsCounter();
    
    // Initialize scroll animations
    initScrollAnimations();
}

// ============================================
// 🔥 OPEN ABOUT US MODAL
// ============================================
function openAboutUsModal() {
    const modal = new bootstrap.Modal(document.getElementById('aboutUsModal'));
    modal.show();
    
    console.log("📖 About Us modal opened");
}

// ============================================
// 🔥 STATS COUNTER ANIMATION
// ============================================
function initAboutStatsCounter() {
    const $statsSection = $('.stats-showcase');
    const $counters = $statsSection.find('.stat-number');
    let hasAnimated = false;
    
    function animateCounters() {
        $counters.each(function() {
            const $counter = $(this);
            const target = parseInt($counter.data('count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number with + for large numbers
                let displayValue = Math.floor(current);
                if (target >= 100) {
                    displayValue = displayValue.toLocaleString() + '+';
                }
                
                $counter.text(displayValue);
            }, 16);
        });
    }
    
    function checkVisibility() {
        if (hasAnimated) return;
        
        const rect = $statsSection[0].getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
            animateCounters();
            hasAnimated = true;
        }
    }
    
    $(window).on('scroll', checkVisibility);
    checkVisibility();
}

// ============================================
// 🔥 SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.mvv-card, .timeline-item, .highlight-item').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// 🔥 CONTACT FROM ABOUT US
// ============================================
// ============================================
// 🔥 CONTACT FROM ABOUT US
// ============================================
function contactAboutUs() {
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('aboutUsModal')).hide();
    
    // Scroll to contact section
    setTimeout(() => {
        const contactSection = document.getElementById('contactus');
        if (contactSection) {
            $('html, body').animate({
                scrollTop: $(contactSection).offset().top - 80
            }, 800);
            
            // Focus on name field after scrolling
            setTimeout(() => {
                $('#contactName').focus();
            }, 900);
        }
    }, 300);
}