// assets/js/slider.js - HERO SLIDER FUNCTIONALITY
$(document).ready(function() {
    console.log("🚀 [slider.js] Hero slider initialized");
    
    // Initialize slider
    const slider = new HeroSlider({
        container: '#heroSlider',
        slides: '.slide',
        autoplay: true,
        interval: 6000, // 6 seconds per slide
        transitionSpeed: 800,
        pauseOnHover: true,
        showProgress: true,
        swipeEnabled: true
    });
    
    // Initialize stats counter animation
    initStatsCounter();
});

// ============================================
// 🔥 HERO SLIDER CLASS
// ============================================
class HeroSlider {
    constructor(options) {
        this.options = {
            container: '#heroSlider',
            slides: '.slide',
            autoplay: true,
            interval: 5000,
            transitionSpeed: 800,
            pauseOnHover: true,
            showProgress: true,
            swipeEnabled: true,
            ...options
        };
        
        this.$container = $(this.options.container);
        this.$slides = this.$container.find(this.options.slides);
        this.totalSlides = this.$slides.length;
        this.currentSlide = 0;
        this.autoplayTimer = null;
        this.progressTimer = null;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        // Create dots navigation
        this.createDots();
        
        // Create progress bar
        if (this.options.showProgress) {
            this.createProgressBar();
        }
        
        // Bind events
        this.bindEvents();
        
        // Start autoplay
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        // Initialize first slide
        this.goToSlide(0);
        
        console.log(`✅ Slider initialized with ${this.totalSlides} slides`);
    }
    
    createDots() {
        const $dotsContainer = this.$container.find('.slider-dots');
        $dotsContainer.empty();
        
        for (let i = 0; i < this.totalSlides; i++) {
            const $dot = $('<button>', {
                class: `dot${i === 0 ? ' active' : ''}`,
                'data-slide': i,
                'aria-label': `Go to slide ${i + 1}`
            });
            $dotsContainer.append($dot);
        }
    }
    
    createProgressBar() {
        if (this.$container.find('.slider-progress').length === 0) {
            this.$container.append('<div class="slider-progress"></div>');
        }
        this.$progress = this.$container.find('.slider-progress');
    }
    
    bindEvents() {
        // Navigation arrows
        this.$container.find('#sliderPrev').on('click', () => this.prev());
        this.$container.find('#sliderNext').on('click', () => this.next());
        
        // Dots navigation
        this.$container.on('click', '.dot', (e) => {
            const slideIndex = parseInt($(e.target).data('slide'));
            this.goToSlide(slideIndex);
        });
        
        // Pause on hover
        if (this.options.pauseOnHover) {
            this.$container.on('mouseenter', () => this.pause());
            this.$container.on('mouseleave', () => this.resume());
        }
        
        // Swipe support for mobile
        if (this.options.swipeEnabled) {
            this.initSwipe();
        }
        
        // Keyboard navigation
        $(document).on('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }
    
    initSwipe() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.$container.on('touchstart', (e) => {
            touchStartX = e.originalEvent.touches[0].clientX;
        });
        
        this.$container.on('touchend', (e) => {
            touchEndX = e.originalEvent.changedTouches[0].clientX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next(); // Swipe left - next slide
            } else {
                this.prev(); // Swipe right - previous slide
            }
        }
    }
    
    goToSlide(index) {
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        // Remove active class from current slide
        this.$slides.eq(this.currentSlide).removeClass('active');
        this.$container.find('.dot').eq(this.currentSlide).removeClass('active');
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide
        this.$slides.eq(this.currentSlide).addClass('active');
        this.$container.find('.dot').eq(this.currentSlide).addClass('active');
        
        // Reset progress bar
        if (this.options.showProgress && this.options.autoplay && !this.isPaused) {
            this.resetProgress();
        }
        
        console.log(`📍 Slide ${this.currentSlide + 1} of ${this.totalSlides}`);
    }
    
    next() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prev() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    startAutoplay() {
        if (this.autoplayTimer) clearInterval(this.autoplayTimer);
        
        this.autoplayTimer = setInterval(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, this.options.interval);
        
        // Start progress bar animation
        if (this.options.showProgress) {
            this.startProgress();
        }
        
        console.log("▶️ Autoplay started");
    }
    
    pause() {
        this.isPaused = true;
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.$progress.css('width', this.$progress.css('width'));
        }
        console.log("️ Autoplay paused");
    }
    
    resume() {
        this.isPaused = false;
        this.resetProgress();
        console.log("▶️ Autoplay resumed");
    }
    
    startProgress() {
        if (this.progressTimer) clearInterval(this.progressTimer);
        
        let progress = 0;
        const increment = 100 / (this.options.interval / 100);
        
        this.progressTimer = setInterval(() => {
            if (!this.isPaused) {
                progress += increment;
                if (progress >= 100) {
                    progress = 0;
                }
                this.$progress.css('width', `${progress}%`);
            }
        }, 100);
    }
    
    resetProgress() {
        if (this.progressTimer) clearInterval(this.progressTimer);
        this.$progress.css('width', '0%');
        this.startProgress();
    }
    
    destroy() {
        if (this.autoplayTimer) clearInterval(this.autoplayTimer);
        if (this.progressTimer) clearInterval(this.progressTimer);
        console.log("🗑️ Slider destroyed");
    }
}

// ============================================
// 🔥 STATS COUNTER ANIMATION
// ============================================
function initStatsCounter() {
    const $statsSection = $('.stats-bar');
    const $counters = $statsSection.find('.stat-number');
    let hasAnimated = false;
    
    function animateCounters() {
        $counters.each(function() {
            const $counter = $(this);
            const target = parseInt($counter.data('count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                $counter.text(Math.floor(current).toLocaleString());
            }, 16);
        });
    }
    
    // Check if stats section is in viewport
    function checkVisibility() {
        if (hasAnimated) return;
        
        const rect = $statsSection[0].getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
            animateCounters();
            hasAnimated = true;
        }
    }
    
    // Check on load and scroll
    $(window).on('scroll', checkVisibility);
    checkVisibility();
}
