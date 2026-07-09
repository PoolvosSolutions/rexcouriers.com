// assets/js/services.js - SERVICES FUNCTIONALITY
$(document).ready(function() {
    console.log("🚀 [services.js] Services section initialized");
    
    // Initialize service cards hover effects
    initServiceCards();
});

// ============================================
// 🔥 SERVICE CARDS INTERACTION
// ============================================
function initServiceCards() {
    // Add click handler to service cards
    $('.service-card').on('click', function(e) {
        // Don't trigger if clicking the button
        if (!$(e.target).closest('.service-btn').length) {
            const serviceType = $(this).data('service');
            openServiceModal(serviceType);
        }
    });
    
    // Add hover effect for icon
    $('.service-card').on('mouseenter', function() {
        $(this).find('.service-icon').addClass('pulse');
    }).on('mouseleave', function() {
        $(this).find('.service-icon').removeClass('pulse');
    });
}

// ============================================
// 🔥 SERVICE DATA
// ============================================
const serviceData = {
    express: {
        icon: 'bi-lightning-charge-fill',
        title: 'Express Delivery',
        subtitle: 'Fast & Reliable Courier Service',
        overview: 'Our Express Delivery service is designed for time-sensitive shipments that demand immediate attention. With our extensive network and priority handling, we ensure your packages reach their destination within the shortest possible timeframe. Whether it\'s urgent documents, medical supplies, or critical business materials, our express service guarantees on-time delivery with real-time tracking every step of the way.',
        features: [
            { icon: 'bi-clock-fill', text: 'Same-day and next-day delivery options' },
            { icon: 'bi-geo-alt-fill', text: 'Nationwide coverage with local hubs' },
            { icon: 'bi-phone-fill', text: 'Real-time SMS and email tracking updates' },
            { icon: 'bi-shield-check', text: '100% delivery guarantee or money back' },
            { icon: 'bi-clock-history', text: 'Flexible pickup and delivery time slots' },
            { icon: 'bi-box-seam', text: 'Special handling for fragile items' }
        ],
        process: [
            { step: 1, title: 'Book Your Shipment', desc: 'Schedule pickup online or call our hotline. Provide pickup and delivery details.' },
            { step: 2, title: 'We Pick Up', desc: 'Our courier collects your package within 2 hours of booking confirmation.' },
            { step: 3, title: 'Priority Processing', desc: 'Package is prioritized at sorting facility and loaded on next available vehicle.' },
            { step: 4, title: 'Express Transit', desc: 'Direct route to destination with minimal handling and maximum security.' },
            { step: 5, title: 'Delivered', desc: 'Package delivered to recipient with signature confirmation and photo proof.' }
        ],
        pricing: 'Starting from PKR 250 for documents and PKR 500 for parcels. Volume discounts available for businesses. Same-day delivery at 50% premium. Corporate accounts enjoy 20-40% discounts based on volume.',
        whyChoose: [
            'Average delivery time 4-6 hours in major cities',
            '99.8% on-time delivery rate',
            'Dedicated express fleet with GPS tracking',
            '24/7 customer support hotline',
            'Insurance coverage up to PKR 100,000',
            'Eco-friendly delivery options available'
        ]
    },
    
    international: {
        icon: 'bi-globe-asia-australia',
        title: 'International Shipping',
        subtitle: 'Global Logistics Solutions',
        overview: 'Connect your business to the world with our comprehensive international shipping services. We partner with leading global carriers to provide seamless cross-border logistics to over 200 countries. Our expertise in customs clearance, documentation, and international regulations ensures smooth transit of your shipments worldwide.',
        features: [
            { icon: 'bi-globe', text: 'Coverage in 200+ countries worldwide' },
            { icon: 'bi-file-earmark-check', text: 'Complete customs documentation support' },
            { icon: 'bi-currency-dollar', text: 'Competitive international rates' },
            { icon: 'bi-door-open', text: 'Door-to-door delivery service' },
            { icon: 'bi-shield-lock', text: 'Full insurance and liability coverage' },
            { icon: 'bi-phone', text: 'Dedicated international support team' }
        ],
        process: [
            { step: 1, title: 'Consultation', desc: 'Discuss your international shipping needs with our experts.' },
            { step: 2, title: 'Documentation', desc: 'We prepare all required customs forms and commercial invoices.' },
            { step: 3, title: 'Pickup & Export', desc: 'Collection from your location and export clearance.' },
            { step: 4, title: 'International Transit', desc: 'Air or sea freight via our global partner network.' },
            { step: 5, title: 'Import & Delivery', desc: 'Customs clearance at destination and final delivery.' }
        ],
        pricing: 'Rates vary by destination, weight, and service level. Economy (7-14 days): From PKR 2,500/kg. Express (3-5 days): From PKR 4,500/kg. Priority (1-3 days): From PKR 7,500/kg. Volume discounts and contract rates available.',
        whyChoose: [
            'Partnerships with DHL, FedEx, UPS, and Emirates Post',
            'In-house customs brokerage team',
            'Real-time international tracking',
            'Multi-currency payment options',
            'Warehousing in Dubai, UK, and USA',
            'Compliance with all international trade regulations'
        ]
    },
    
    cargo: {
        icon: 'bi-truck-front-fill',
        title: 'Cargo & Freight',
        subtitle: 'Heavy Duty Logistics',
        overview: 'From palletized goods to oversized cargo, our freight division handles heavy and bulky shipments with precision. We offer air freight, sea freight (FCL/LCL), and road transport solutions. Our specialized equipment and trained personnel ensure safe handling of sensitive, hazardous, and temperature-controlled cargo.',
        features: [
            { icon: 'bi-box-seam', text: 'Air freight for urgent cargo' },
            { icon: 'bi-water', text: 'Sea freight - Full and Less Container Load' },
            { icon: 'bi-truck', text: 'Road transport across Pakistan' },
            { icon: 'bi-thermometer-snow', text: 'Cold chain and temperature control' },
            { icon: 'bi-exclamation-triangle', text: 'Hazardous materials handling' },
            { icon: 'bi-rulers', text: 'Oversized and project cargo' }
        ],
        process: [
            { step: 1, title: 'Cargo Assessment', desc: 'Evaluate cargo type, dimensions, weight, and special requirements.' },
            { step: 2, title: 'Route Planning', desc: 'Determine optimal transport mode and route for cost and time efficiency.' },
            { step: 3, title: 'Packaging & Loading', desc: 'Professional packing, crating, and secure loading.' },
            { step: 4, title: 'Transport & Tracking', desc: 'Movement with GPS tracking and regular status updates.' },
            { step: 5, title: 'Delivery & Unloading', desc: 'Safe delivery with specialized equipment if needed.' }
        ],
        pricing: 'Air freight: PKR 350-650/kg depending on destination. Sea freight FCL: From PKR 150,000 per 20ft container. LCL: From PKR 8,500 per CBM. Road transport: PKR 150-300/kg. Special cargo quoted individually.',
        whyChoose: [
            'IATA certified air cargo handlers',
            'Own fleet of 50+ trucks and trailers',
            'Temperature-controlled warehouses',
            'Dangerous goods certified staff',
            'Project cargo engineering support',
            'Cargo insurance up to PKR 10 million'
        ]
    },
    
    ecommerce: {
        icon: 'bi-bag-check-fill',
        title: 'E-Commerce Solutions',
        subtitle: 'Power Your Online Business',
        overview: 'Tailored logistics for e-commerce businesses of all sizes. From single sellers to large marketplaces, we provide end-to-end fulfillment services including warehousing, pick-pack-ship, cash on delivery (COD), returns management, and seamless API integration with major platforms like Shopify, WooCommerce, and Daraz.',
        features: [
            { icon: 'bi-cash-coin', text: 'Cash on Delivery (COD) with daily settlements' },
            { icon: 'bi-plug', text: 'API integration with major platforms' },
            { icon: 'bi-box', text: 'Inventory management system' },
            { icon: 'bi-arrow-left-right', text: 'Easy returns and reverse logistics' },
            { icon: 'bi-graph-up', text: 'Real-time analytics dashboard' },
            { icon: 'bi-tags', text: 'Bulk shipping discounts' }
        ],
        process: [
            { step: 1, title: 'Integration', desc: 'Connect your store via API or upload orders manually.' },
            { step: 2, title: 'Inventory Sync', desc: 'Real-time inventory updates across all channels.' },
            { step: 3, title: 'Order Processing', desc: 'Automatic order import and label generation.' },
            { step: 4, title: 'Fulfillment', desc: 'Pick, pack, and ship with quality checks.' },
            { step: 5, title: 'COD Collection', desc: 'Cash collection and daily bank transfers.' }
        ],
        pricing: 'No setup fees. Storage: PKR 500/month per shelf. Pick & Pack: PKR 30-50 per order. Shipping: From PKR 150 per parcel. COD: 2% of collected amount. API integration: Free for premium plans. Volume discounts up to 40%.',
        whyChoose: [
            '99.9% order accuracy rate',
            'Same-day dispatch for orders before 3 PM',
            'COD remittance within 24 hours',
            'Dedicated account manager',
            'Multi-channel inventory sync',
            'Branded packaging options'
        ]
    },
    
    warehousing: {
        icon: 'bi-building-fill',
        title: 'Warehousing',
        subtitle: 'Smart Storage Solutions',
        overview: 'Modern warehousing facilities strategically located in Karachi, Lahore, and Islamabad. Our warehouses feature climate control, 24/7 security with CCTV, fire suppression systems, and advanced WMS (Warehouse Management System). Perfect for inventory storage, distribution, and fulfillment operations.',
        features: [
            { icon: 'bi-shield-lock', text: '24/7 security with biometric access' },
            { icon: 'bi-thermometer-snow', text: 'Climate-controlled environment' },
            { icon: 'bi-camera', text: 'CCTV surveillance throughout' },
            { icon: 'bi-fire', text: 'Advanced fire suppression systems' },
            { icon: 'bi-laptop', text: 'Cloud-based WMS integration' },
            { icon: 'bi-people', text: 'Trained warehouse staff' }
        ],
        process: [
            { step: 1, title: 'Space Assessment', desc: 'Determine your storage needs and requirements.' },
            { step: 2, title: 'Contract & Setup', desc: 'Sign agreement and configure WMS for your business.' },
            { step: 3, title: 'Inventory Inbound', desc: 'Receive, inspect, and barcode your inventory.' },
            { step: 4, title: 'Storage & Management', desc: 'Organized storage with regular cycle counts.' },
            { step: 5, title: 'Outbound Fulfillment', desc: 'Pick, pack, and ship as per orders.' }
        ],
        pricing: 'Small storage (up to 100 sq ft): PKR 15,000/month. Medium (100-500 sq ft): PKR 60,000/month. Large (500+ sq ft): PKR 100,000/month. Handling charges: PKR 25 per pallet in/out. Value-added services quoted separately.',
        whyChoose: [
            'Prime locations near major highways',
            '99.99% inventory accuracy',
            'Scalable space - expand or reduce',
            'Same-day order processing',
            'Integration with major ERPs',
            'Insurance coverage included'
        ]
    },
    
    customs: {
        icon: 'bi-file-earmark-check-fill',
        title: 'Customs Clearance',
        subtitle: 'Expert Brokerage Services',
        overview: 'Navigate complex customs regulations with ease. Our licensed customs brokers handle all aspects of import and export clearance, including duty calculation, tariff classification, documentation, and liaison with customs authorities. Minimize delays and ensure compliance with all regulations.',
        features: [
            { icon: 'bi-file-earmark-text', text: 'Complete documentation preparation' },
            { icon: 'bi-calculator', text: 'Accurate duty and tax calculation' },
            { icon: 'bi-shield-check', text: 'HS code classification expertise' },
            { icon: 'bi-lightning', text: 'Fast clearance - average 24 hours' },
            { icon: 'bi-briefcase', text: 'Licensed customs brokers' },
            { icon: 'bi-patch-check', text: 'Compliance guarantee' }
        ],
        process: [
            { step: 1, title: 'Document Collection', desc: 'Gather invoice, packing list, BL/AWB, and certificates.' },
            { step: 2, title: 'Classification', desc: 'Determine correct HS codes and duty rates.' },
            { step: 3, title: 'Filing', desc: 'Submit goods declaration to customs electronically.' },
            { step: 4, title: 'Assessment', desc: 'Customs reviews and assesses duties and taxes.' },
            { step: 5, title: 'Clearance', desc: 'Pay duties and obtain release order for delivery.' }
        ],
        pricing: 'Documentation fee: PKR 3,500 per shipment. Customs clearance: 1.5% of CIF value (minimum PKR 5,000). Duty payment handling: 0.5% of duty amount. Storage and demurrage: Actuals. Consultation: Free for first 30 minutes.',
        whyChoose: [
            'Licensed by Pakistan Customs',
            'Average clearance time 18-24 hours',
            'Zero penalty record for clients',
            'Expert knowledge of trade agreements',
            'Pre-clearance advisory services',
            'Duty drawback and refund assistance'
        ]
    },
    
    sameday: {
        icon: 'bi-clock-history',
        title: 'Same Day Delivery',
        subtitle: 'Ultra-Fast Urban Logistics',
        overview: 'When time is of the essence, our same-day delivery service gets your packages there within hours. Available in all major metropolitan areas with dedicated riders and vehicles. Perfect for urgent documents, medical samples, legal papers, and time-critical business materials.',
        features: [
            { icon: 'bi-stopwatch', text: 'Delivery within 2-6 hours' },
            { icon: 'bi-pin-map', text: 'Coverage in 15+ major cities' },
            { icon: 'bi-phone-vibrate', text: 'Live rider tracking on map' },
            { icon: 'bi-messenger', text: 'Direct rider-customer communication' },
            { icon: 'bi-clock', text: 'Flexible pickup windows' },
            { icon: 'bi-receipt', text: 'Digital proof of delivery' }
        ],
        process: [
            { step: 1, title: 'Instant Booking', desc: 'Book via app, website, or phone call.' },
            { step: 2, title: 'Rider Assignment', desc: 'Nearest available rider assigned within 10 minutes.' },
            { step: 3, title: 'Pickup', desc: 'Rider collects package and confirms via app.' },
            { step: 4, title: 'Direct Transit', desc: 'Rider goes directly to destination - no sorting.' },
            { step: 5, title: 'Delivery', desc: 'Package delivered with OTP or signature confirmation.' }
        ],
        pricing: 'Base fare: PKR 200 for first 3 km. Per km: PKR 40/km thereafter. Urgent (within 2 hours): 50% premium. Night delivery (8 PM - 12 AM): 25% premium. Corporate accounts: Monthly packages from PKR 25,000.',
        whyChoose: [
            'Average delivery time 3.5 hours',
            'Real-time GPS tracking',
            'Verified and trained riders',
            'Cashless payment options',
            'Delivery guarantee or refund',
            '24/7 availability including weekends'
        ]
    },
    
    corporate: {
        icon: 'bi-briefcase-fill',
        title: 'Corporate Solutions',
        subtitle: 'Enterprise Logistics',
        overview: 'Comprehensive logistics management for large enterprises and corporations. Dedicated account management, volume-based pricing, customized workflows, and SLA-backed performance guarantees. Integrate our services seamlessly into your supply chain with API access and dedicated support.',
        features: [
            { icon: 'bi-people-fill', text: 'Dedicated account manager' },
            { icon: 'bi-percent', text: 'Volume-based discounts up to 50%' },
            { icon: 'bi-file-earmark-break', text: 'Custom SLA agreements' },
            { icon: 'bi-code-slash', text: 'API access and webhooks' },
            { icon: 'bi-graph-up-arrow', text: 'Monthly performance reports' },
            { icon: 'bi-headset', text: 'Priority 24/7 support' }
        ],
        process: [
            { step: 1, title: 'Needs Analysis', desc: 'Deep dive into your logistics requirements and pain points.' },
            { step: 2, title: 'Solution Design', desc: 'Custom workflow and pricing structure creation.' },
            { step: 3, title: 'Contract & SLA', desc: 'Service level agreement with KPIs and penalties.' },
            { step: 4, title: 'Integration', desc: 'API integration and staff training.' },
            { step: 5, title: 'Go Live & Optimize', desc: 'Launch with continuous improvement reviews.' }
        ],
        pricing: 'Custom pricing based on volume, frequency, and service mix. Typical discounts: 20-30% for 100+ shipments/month, 30-40% for 500+ shipments/month, 40-50% for 1000+ shipments/month. Implementation fee waived for annual contracts.',
        whyChoose: [
            'Fortune 500 company experience',
            'Dedicated infrastructure and team',
            'Quarterly business reviews',
            'Custom reporting and analytics',
            'Flexible contract terms',
            'Multi-location support'
        ]
    }
};

// ============================================
// 🔥 OPEN SERVICE MODAL
// ============================================
function openServiceModal(serviceType) {
    const service = serviceData[serviceType];
    if (!service) {
        console.error('Service not found:', serviceType);
        return;
    }
    
    // Populate modal content
    $('#modalIconWrapper i').attr('class', `bi ${service.icon}`);
    $('#modalTitle').text(service.title);
    $('#modalSubtitle').text(service.subtitle);
    $('#modalOverview').text(service.overview);
    
    // Populate features
    let featuresHtml = '';
    service.features.forEach(feature => {
        featuresHtml += `
            <div class="feature-item">
                <i class="bi ${feature.icon} feature-icon"></i>
                <span class="feature-text">${feature.text}</span>
            </div>
        `;
    });
    $('#modalFeatures').html(featuresHtml);
    
    // Populate process steps
    let processHtml = '';
    service.process.forEach(step => {
        processHtml += `
            <div class="process-step">
                <div class="step-number">${step.step}</div>
                <div class="step-content">
                    <h6>${step.title}</h6>
                    <p>${step.desc}</p>
                </div>
            </div>
        `;
    });
    $('#modalProcess').html(processHtml);
    
    // Populate pricing
    $('#modalPricing').html(`<p>${service.pricing}</p>`);
    
    // Populate why choose
    let whyHtml = '';
    service.whyChoose.forEach(item => {
        whyHtml += `<li><i class="bi bi-check-circle-fill"></i>${item}</li>`;
    });
    $('#modalWhyChoose').html(whyHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('serviceDetailModal'));
    modal.show();
    
    console.log(`📋 Service modal opened: ${serviceType}`);
}

// ============================================
// 🔥 REQUEST SERVICE
// ============================================
function requestService() {
    const serviceTitle = $('#modalTitle').text();
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('serviceDetailModal')).hide();
    
    // Show confirmation or redirect to booking
    setTimeout(() => {
        alert(`Thank you for your interest in ${serviceTitle}!\n\nOur team will contact you within 24 hours to discuss your requirements.\n\nAlternatively, you can book now by filling out the booking form.`);
        
        // Optionally redirect to booking page
        // loadView('newbooking');
    }, 300);
}