// assets/js/footer.js - FOOTER FUNCTIONALITY
$(document).ready(function() {
    console.log("🚀 [footer.js] Footer initialized");
    
    initFooter();
});

// ============================================
// 🔥 INITIALIZE FOOTER
// ============================================
function initFooter() {
    setupFooterTracking();
    setupSmoothScroll();
    setupBackToTop();
    setupNewsletter();
    setupTrackingExamples();
}

// ============================================
// 🔥 FOOTER TRACKING (Reuses header tracking)
// ============================================
function setupFooterTracking() {
    // Form submission
    $('#footerTrackingForm').on('submit', function(e) {
        e.preventDefault();
        performFooterTracking();
    });
    
    // Enter key
    $('#footerTrackingInput').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            performFooterTracking();
        }
    });
}

// ============================================
// 🔥 PERFORM FOOTER TRACKING
// ============================================
async function performFooterTracking() {
    const trackingNumber = $('#footerTrackingInput').val().trim().toUpperCase();
    
    // Validation
    if (!trackingNumber) {
        showFooterTrackingError('Please enter an AWB or PI number');
        return;
    }
    
    if (trackingNumber.length < 8) {
        showFooterTrackingError('Invalid tracking number. Please check and try again.');
        return;
    }
    
    const $btn = $('#btnFooterTrack');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');
    
    try {
        console.log("🔍 Footer tracking search:", trackingNumber);
        
        // Get all shipments
        const shipments = await FirebaseDB.getList('shipments');
        
        // Search by AWB or PI number
        const shipment = shipments.find(s => 
            s.awbNumber === trackingNumber || 
            s.piNumber === trackingNumber
        );
        
        if (!shipment) {
            showFooterTrackingError(`No shipment found with number "${trackingNumber}"`);
            return;
        }
        
        // Store for tracking modal (reuse header's function)
        window.currentTrackedShipment = shipment;
        
        // Populate and show tracking modal (reuse header's modal)
        populateFooterTrackingSuccess(shipment);
        
        // Clear input
        $('#footerTrackingInput').val('');
        
        console.log("✅ Footer tracking successful");
        
    } catch (error) {
        console.error("❌ Footer tracking error:", error);
        showFooterTrackingError('An error occurred while searching. Please try again.');
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

// ============================================
// 🔥 POPULATE FOOTER TRACKING SUCCESS
// ============================================
function populateFooterTrackingSuccess(s) {
    // Use the same modal as header
    const status = s.status || 'Booked';
    const statusConfig = {
        'Booked': { icon: 'bi-clock', label: 'Booked' },
        'Intransit': { icon: 'bi-truck', label: 'In Transit' },
        'Hold': { icon: 'bi-pause-circle', label: 'On Hold' },
        'Delivered': { icon: 'bi-check-circle-fill', label: 'Delivered' },
        'Returned': { icon: 'bi-arrow-return-left', label: 'Returned' },
        'Lost': { icon: 'bi-question-circle', label: 'Lost' },
        'Destroyed': { icon: 'bi-x-octagon', label: 'Destroyed' }
    };
    
    const config = statusConfig[status] || statusConfig['Booked'];
    
    // Populate modal (using header's modal IDs)
    $('#trackingAWB').text(s.awbNumber || '-');
    $('#trackingStatus').text(config.label);
    $('#trackingDate').text(formatFooterDate(s.bookingDate));
    $('#statusIcon').html(`<i class="bi ${config.icon}"></i>`);
    
    // Shipment Details
    $('#trackingShipper').text(s.shipper?.name || '-');
    $('#trackingDestination').text(s.consignee?.destination || s.consignee?.city || '-');
    $('#trackingPieces').text(s.shipment?.pieces || '-');
    $('#trackingWeight').text((s.shipment?.chargeableWeight || s.shipment?.weight || 0) + ' KG');
    
    // Timeline
    renderFooterTimeline(s.statusHistory || [{
        status: 'Booked',
        date: s.bookingDate,
        changedBy: 'System',
        changedAt: s.createdAt
    }]);
    
    // Delivery Info
    if (status === 'Delivered' && s.statusHistory) {
        const deliveryEntry = s.statusHistory.find(h => h.status === 'Delivered');
        if (deliveryEntry && deliveryEntry.details) {
            $('#deliverySection').removeClass('d-none');
            $('#deliveredTo').text(deliveryEntry.details.deliveredTo || '-');
            $('#deliveryDate').text(deliveryEntry.date || '-');
            $('#deliveryTime').text(deliveryEntry.details.deliveryTime || '-');
        } else {
            $('#deliverySection').addClass('d-none');
        }
    } else {
        $('#deliverySection').addClass('d-none');
    }
    
    // Show modal
    new bootstrap.Modal(document.getElementById('trackingSuccessModal')).show();
}

// ============================================
// 🔥 RENDER FOOTER TIMELINE
// ============================================
function renderFooterTimeline(history) {
    const $timeline = $('#trackingTimeline').empty();
    
    if (!history || history.length === 0) {
        $timeline.html('<p class="text-muted small">No tracking history available</p>');
        return;
    }
    
    history.forEach((entry, index) => {
        const isLast = index === history.length - 1;
        const statusConfig = {
            'Booked': { icon: 'bi-clock', label: 'Booked' },
            'Intransit': { icon: 'bi-truck', label: 'In Transit' },
            'Hold': { icon: 'bi-pause-circle', label: 'On Hold' },
            'Delivered': { icon: 'bi-check-circle-fill', label: 'Delivered' },
            'Returned': { icon: 'bi-arrow-return-left', label: 'Returned' },
            'Lost': { icon: 'bi-question-circle', label: 'Lost' },
            'Destroyed': { icon: 'bi-x-octagon', label: 'Destroyed' }
        };
        
        const config = statusConfig[entry.status] || statusConfig['Booked'];
        const itemClass = isLast ? 'current' : 'completed';
        
        let reasonHtml = '';
        if (entry.reason) {
            reasonHtml = `<div class="timeline-reason-box">
                <div class="reason-header"><i class="bi bi-chat-left-text-fill"></i><span>Reason</span></div>
                <div class="reason-text">${entry.reason}</div>
            </div>`;
        }
        
        let detailsHtml = '';
        if (entry.details) {
            const d = entry.details;
            let items = [];
            
            if (d.currentLocation) items.push(`<div class="detail-item"><i class="bi bi-geo-alt-fill"></i><span><strong>Location:</strong> ${d.currentLocation}</span></div>`);
            if (d.expectedDeliveryDate) items.push(`<div class="detail-item"><i class="bi bi-calendar-event"></i><span><strong>Expected:</strong> ${formatFooterDate(d.expectedDeliveryDate)}</span></div>`);
            if (d.deliveredTo) items.push(`<div class="detail-item highlight"><i class="bi bi-person-check-fill"></i><span><strong>Received By:</strong> ${d.deliveredTo}</span></div>`);
            if (d.deliveryTime) items.push(`<div class="detail-item"><i class="bi bi-clock-fill"></i><span><strong>Time:</strong> ${d.deliveryTime}</span></div>`);
            if (d.holdReasonCategory) items.push(`<div class="detail-item warning"><i class="bi bi-exclamation-triangle-fill"></i><span><strong>Hold:</strong> ${d.holdReasonCategory}</span></div>`);
            if (d.returnReasonCategory) items.push(`<div class="detail-item warning"><i class="bi bi-arrow-return-left"></i><span><strong>Return:</strong> ${d.returnReasonCategory}</span></div>`);
            
            if (items.length > 0) {
                detailsHtml = `<div class="timeline-details-box">${items.join('')}</div>`;
            }
        }
        
        $timeline.append(`
            <div class="timeline-item ${itemClass}">
                <div class="timeline-status"><i class="bi ${config.icon} me-1"></i>${config.label}</div>
                <div class="timeline-date"><i class="bi bi-calendar me-1"></i>${entry.date || '-'} ${entry.time ? `at ${entry.time}` : ''}</div>
                ${reasonHtml}
                ${detailsHtml}
            </div>
        `);
    });
}

// ============================================
// 🔥 SHOW FOOTER TRACKING ERROR
// ============================================
function showFooterTrackingError(message) {
    $('#trackingErrorMessage').text(message);
    new bootstrap.Modal(document.getElementById('trackingErrorModal')).show();
}

// ============================================
// 🔥 TRACKING EXAMPLES
// ============================================
function setupTrackingExamples() {
    $('.example-btn').on('click', function() {
        const awb = $(this).data('awb');
        $('#footerTrackingInput').val(awb);
        performFooterTracking();
    });
}

// ============================================
// 🔥 SMOOTH SCROLL
// ============================================
function setupSmoothScroll() {
    $('.smooth-scroll').on('click', function(e) {
        const href = $(this).attr('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = $(href);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800);
            }
        }
    });
}

// ============================================
// 🔥 BACK TO TOP BUTTON
// ============================================
function setupBackToTop() {
    const $backToTop = $('#backToTop');
    
    // Show/hide on scroll
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 400) {
            $backToTop.addClass('visible');
        } else {
            $backToTop.removeClass('visible');
        }
    });
    
    // Click to scroll top
    $backToTop.on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    });
}

// ============================================
// 🔥 NEWSLETTER SUBSCRIPTION
// ============================================
function setupNewsletter() {
    $('#newsletterForm').on('submit', async function(e) {
        e.preventDefault();
        
        const email = $('.newsletter-input').val().trim();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        try {
            console.log("📧 Subscribing to newsletter:", email);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Save to Firebase (uncomment when ready)
            /*
            await FirebaseDB.push('newsletterSubscriptions', {
                email: email,
                subscribedAt: new Date().toISOString(),
                source: 'Footer'
            });
            */
            
            alert(`✅ Thank you for subscribing!\n\nWe've added ${email} to our newsletter list.\n\nYou'll receive updates on new services and offers.`);
            
            // Reset form
            $('.newsletter-input').val('');
            
        } catch (error) {
            console.error("❌ Newsletter error:", error);
            alert('Failed to subscribe. Please try again.');
        }
    });
}

// ============================================
// 🔥 HELPER: FORMAT DATE
// ============================================
function formatFooterDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
}