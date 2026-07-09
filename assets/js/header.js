// assets/js/header.js - HEADER & TRACKING FUNCTIONALITY
import { FirebaseDB } from "./firebase/firebase-crud.js";

// Status configuration
const STATUS_CONFIG = {
    'Booked': { icon: 'bi-clock', color: 'status-booked', label: 'Booked' },
    'Intransit': { icon: 'bi-truck', color: 'status-intransit', label: 'In Transit' },
    'Hold': { icon: 'bi-pause-circle', color: 'status-hold', label: 'On Hold' },
    'Delivered': { icon: 'bi-check-circle-fill', color: 'status-delivered', label: 'Delivered' },
    'Returned': { icon: 'bi-arrow-return-left', color: 'status-returned', label: 'Returned' },
    'Lost': { icon: 'bi-question-circle', color: 'status-lost', label: 'Lost' },
    'Destroyed': { icon: 'bi-x-octagon', color: 'status-destroyed', label: 'Destroyed' }
};

// Initialize header functionality
$(document).ready(function() {
    console.log("🚀 [header.js] Header initialized");
    
    setupUserProfileDropdown();
    setupTrackingSearch();
    setupMobileMenu();
});

// ============================================
// 🔥 USER PROFILE DROPDOWN
// ============================================
function setupUserProfileDropdown() {
    $('#userProfileBtn').on('click', function(e) {
        e.stopPropagation();
        $(this).closest('.user-profile-dropdown').toggleClass('open');
    });
    
    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.user-profile-dropdown').length) {
            $('.user-profile-dropdown').removeClass('open');
        }
    });
}

// ============================================
// 🔥 TRACKING SEARCH
// ============================================
function setupTrackingSearch() {
    // Desktop tracking
    $('#btnTrackShipment').on('click', performTracking);
    $('#trackingInput').on('keypress', function(e) {
        if (e.which === 13) performTracking();
    });
    
    // Mobile tracking
    $('.mobile-track-btn').on('click', function() {
        const mobileInput = $('#mobileTrackingInput').val().trim();
        $('#trackingInput').val(mobileInput);
        performTracking();
    });
    
    $('#mobileTrackingInput').on('keypress', function(e) {
        if (e.which === 13) {
            const mobileInput = $(this).val().trim();
            $('#trackingInput').val(mobileInput);
            performTracking();
        }
    });
    
    // Modal buttons
    $('#btnTryAgain').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('trackingErrorModal')).hide();
        setTimeout(() => $('#trackingInput').focus(), 400);
    });
    
    $('#btnTrackAnother').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('trackingSuccessModal')).hide();
        setTimeout(() => {
            $('#trackingInput').val('').focus();
        }, 400);
    });
    
    // 🔥 NEW: Print button handler
    $('#btnPrintTracking').on('click', function() {
        printTrackingReport();
    });
}




// ============================================
// 🔥 PERFORM TRACKING
// ============================================
async function performTracking() {
    const trackingNumber = $('#trackingInput').val().trim().toUpperCase();
    
    // Validation
    if (!trackingNumber) {
        showTrackingError('Please enter an AWB or PI number to track your shipment.');
        return;
    }
    
    if (trackingNumber.length < 8) {
        showTrackingError('Invalid tracking number. Please check and try again.');
        return;
    }
    
    const $btn = $('#btnTrackShipment');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');
    
    try {
        console.log("🔍 Searching for shipment:", trackingNumber);
        
        // Get all shipments
        const shipments = await FirebaseDB.getList('shipments');
        
        // Search by AWB or PI number
        const shipment = shipments.find(s => 
            s.awbNumber === trackingNumber || 
            s.piNumber === trackingNumber
        );
        
        if (!shipment) {
            console.log("❌ Shipment not found");
            showTrackingError(`No shipment found with number "${trackingNumber}". Please check and try again.`);
            return;
        }
        
        console.log("✅ Shipment found:", shipment.awbNumber);
        
        // Populate success modal
        populateTrackingSuccess(shipment);
        
        // Show success modal
        new bootstrap.Modal(document.getElementById('trackingSuccessModal')).show();
        
    } catch (error) {
        console.error("❌ Error tracking shipment:", error);
        showTrackingError('An error occurred while searching. Please try again later.');
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

// ============================================
// 🔥 POPULATE TRACKING SUCCESS
// ============================================
function populateTrackingSuccess(s) {

    // 🔥 Store shipment data for print function
    window.currentTrackedShipment = s;
    // Status Banner
    const status = s.status || 'Booked';
    const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['Booked'];
    
    $('#trackingAWB').text(s.awbNumber || '-');
    $('#trackingStatus').text(statusConfig.label);
    $('#trackingDate').text(formatTrackingDate(s.bookingDate));
    
    // Update status icon
    const $statusIcon = $('#statusIcon');
    $statusIcon.html(`<i class="bi ${statusConfig.icon}"></i>`);
    
    // Update banner color based on status
    const $banner = $('#trackingStatusBanner');
    $banner.removeClass('bg-success bg-warning bg-danger bg-info');
    
    if (status === 'Delivered') {
        $banner.css('background', 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)');
    } else if (status === 'Intransit') {
        $banner.css('background', 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)');
    } else if (['Lost', 'Destroyed', 'Returned'].includes(status)) {
        $banner.css('background', 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)');
    } else {
        $banner.css('background', 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)');
    }
    
    // Shipment Details (Customer View Only)
    $('#trackingShipper').text(s.shipper?.name || '-');
    $('#trackingDestination').text(s.consignee?.destination || s.consignee?.city || '-');
    $('#trackingPieces').text(s.shipment?.pieces || '-');
    $('#trackingWeight').text((s.shipment?.chargeableWeight || s.shipment?.weight || 0) + ' KG');
    
    // Status Timeline
    renderTrackingTimeline(s.statusHistory || [{
        status: 'Booked',
        date: s.bookingDate,
        changedBy: 'System',
        changedAt: s.createdAt
    }]);
    
    // Delivery Information (if delivered)
    if (status === 'Delivered' && s.statusHistory) {
        const deliveryEntry = s.statusHistory.find(h => h.status === 'Delivered');
        if (deliveryEntry) {
            $('#deliverySection').removeClass('d-none');
            $('#deliveredTo').text(deliveryEntry.deliveredTo || '-');
            $('#deliveryDate').text(deliveryEntry.date || '-');
            $('#deliveryTime').text(deliveryEntry.time || '-');
        } else {
            $('#deliverySection').addClass('d-none');
        }
    } else {
        $('#deliverySection').addClass('d-none');
    }
}

// ============================================
// 🔥 RENDER TRACKING TIMELINE
// ============================================
// ============================================
// 🔥 RENDER TRACKING TIMELINE (CUSTOMER VIEW)
// ============================================
// ============================================
// 🔥 RENDER TRACKING TIMELINE (ENHANCED - SHOWS REASONS)
// ============================================
function renderTrackingTimeline(history) {
    const $timeline = $('#trackingTimeline').empty();
    
    if (!history || history.length === 0) {
        $timeline.html('<p class="text-muted small">No tracking history available</p>');
        return;
    }
    
    history.forEach((entry, index) => {
        const isLast = index === history.length - 1;
        const statusConfig = STATUS_CONFIG[entry.status] || STATUS_CONFIG['Booked'];
        const itemClass = isLast ? 'current' : 'completed';
        
        // 🔥 REASON - Always shown prominently
        let reasonHtml = '';
        if (entry.reason) {
            reasonHtml = `
                <div class="timeline-reason-box">
                    <div class="reason-header">
                        <i class="bi bi-chat-left-text-fill"></i>
                        <span>Reason</span>
                    </div>
                    <div class="reason-text">${entry.reason}</div>
                </div>
            `;
        }
        
        // 🔥 CUSTOMER-FRIENDLY DETAILS
        let detailsHtml = '';
        if (entry.details) {
            const d = entry.details;
            let detailItems = [];
            
            // For Intransit
            if (d.currentLocation) {
                detailItems.push(`<div class="detail-item"><i class="bi bi-geo-alt-fill"></i><span><strong>Current Location:</strong> ${d.currentLocation}</span></div>`);
            }
            if (d.expectedDeliveryDate) {
                detailItems.push(`<div class="detail-item"><i class="bi bi-calendar-event"></i><span><strong>Expected Delivery:</strong> ${formatTrackingDate(d.expectedDeliveryDate)}</span></div>`);
            }
            if (d.transitNotes) {
                detailItems.push(`<div class="detail-item"><i class="bi bi-info-circle"></i><span><strong>Note:</strong> ${d.transitNotes}</span></div>`);
            }
            
            // For Delivered
            if (d.deliveredTo) {
                detailItems.push(`<div class="detail-item highlight"><i class="bi bi-person-check-fill"></i><span><strong>Received By:</strong> ${d.deliveredTo}${d.recipientRelationship ? ` <em>(${d.recipientRelationship})</em>` : ''}</span></div>`);
            }
            if (d.deliveryTime) {
                detailItems.push(`<div class="detail-item"><i class="bi bi-clock-fill"></i><span><strong>Delivery Time:</strong> ${d.deliveryTime}</span></div>`);
            }
            if (d.deliveryRemarks) {
                detailItems.push(`<div class="detail-item"><i class="bi bi-chat-dots"></i><span><strong>Remarks:</strong> ${d.deliveryRemarks}</span></div>`);
            }
            
            // For Hold
            if (d.holdReasonCategory) {
                detailItems.push(`<div class="detail-item warning"><i class="bi bi-exclamation-triangle-fill"></i><span><strong>Hold Category:</strong> ${d.holdReasonCategory}</span></div>`);
            }
            if (d.expectedResolutionDate) {
                detailItems.push(`<div class="detail-item"><i class="bi bi-calendar-check"></i><span><strong>Expected Resolution:</strong> ${formatTrackingDate(d.expectedResolutionDate)}</span></div>`);
            }
            
            // For Returned
            if (d.returnReasonCategory) {
                detailItems.push(`<div class="detail-item warning"><i class="bi bi-arrow-return-left"></i><span><strong>Return Reason:</strong> ${d.returnReasonCategory}</span></div>`);
            }
            
            // For Lost
            if (d.lastKnownLocation) {
                detailItems.push(`<div class="detail-item warning"><i class="bi bi-geo-alt"></i><span><strong>Last Known Location:</strong> ${d.lastKnownLocation}</span></div>`);
            }
            
            if (detailItems.length > 0) {
                detailsHtml = `<div class="timeline-details-box">${detailItems.join('')}</div>`;
            }
        }
        
        const timelineItem = `
            <div class="timeline-item ${itemClass}">
                <div class="timeline-status">
                    <i class="bi ${statusConfig.icon} me-1"></i>
                    ${statusConfig.label}
                </div>
                <div class="timeline-date">
                    <i class="bi bi-calendar me-1"></i>
                    ${entry.date || '-'}
                    ${entry.time ? `at ${entry.time}` : ''}
                </div>
                ${reasonHtml}
                ${detailsHtml}
            </div>
        `;
        
        $timeline.append(timelineItem);
    });
}

// ============================================
// 🔥 PRINT TRACKING REPORT (PDF-READY)
// ============================================
function printTrackingReport() {
    const awb = $('#trackingAWB').text();
    const status = $('#trackingStatus').text();
    const date = $('#trackingDate').text();
    const shipper = $('#trackingShipper').text();
    const destination = $('#trackingDestination').text();
    const pieces = $('#trackingPieces').text();
    const weight = $('#trackingWeight').text();
    
    // Get current shipment data (stored when tracking was successful)
    const shipment = window.currentTrackedShipment;
    if (!shipment) {
        alert('No shipment data available for printing');
        return;
    }
    
    const history = shipment.statusHistory || [{
        status: 'Booked',
        date: shipment.bookingDate,
        changedBy: 'System',
        changedAt: shipment.createdAt
    }];
    
    // Build timeline HTML for print
    let timelineHtml = '';
    history.forEach((entry, index) => {
        const statusConfig = STATUS_CONFIG[entry.status] || STATUS_CONFIG['Booked'];
        const isLast = index === history.length - 1;
        
        let reasonHtml = '';
        if (entry.reason) {
            reasonHtml = `
                <div class="p-reason">
                    <strong>Reason:</strong> ${entry.reason}
                </div>
            `;
        }
        
        let detailsHtml = '';
        if (entry.details) {
            const d = entry.details;
            let items = [];
            
            if (d.currentLocation) items.push(`<li><strong>Current Location:</strong> ${d.currentLocation}</li>`);
            if (d.expectedDeliveryDate) items.push(`<li><strong>Expected Delivery:</strong> ${formatTrackingDate(d.expectedDeliveryDate)}</li>`);
            if (d.transitNotes) items.push(`<li><strong>Note:</strong> ${d.transitNotes}</li>`);
            if (d.deliveredTo) items.push(`<li><strong>Received By:</strong> ${d.deliveredTo}${d.recipientRelationship ? ` (${d.recipientRelationship})` : ''}</li>`);
            if (d.deliveryTime) items.push(`<li><strong>Delivery Time:</strong> ${d.deliveryTime}</li>`);
            if (d.deliveryRemarks) items.push(`<li><strong>Remarks:</strong> ${d.deliveryRemarks}</li>`);
            if (d.holdReasonCategory) items.push(`<li><strong>Hold Category:</strong> ${d.holdReasonCategory}</li>`);
            if (d.returnReasonCategory) items.push(`<li><strong>Return Reason:</strong> ${d.returnReasonCategory}</li>`);
            if (d.lastKnownLocation) items.push(`<li><strong>Last Known Location:</strong> ${d.lastKnownLocation}</li>`);
            
            if (items.length > 0) {
                detailsHtml = `<ul class="p-details">${items.join('')}</ul>`;
            }
        }
        
        timelineHtml += `
            <div class="p-timeline-item ${isLast ? 'p-current' : ''}">
                <div class="p-timeline-dot"></div>
                <div class="p-timeline-content">
                    <div class="p-timeline-header">
                        <strong>${statusConfig.label}</strong>
                        <span class="p-timeline-date">${entry.date || '-'} ${entry.time ? `at ${entry.time}` : ''}</span>
                    </div>
                    ${reasonHtml}
                    ${detailsHtml}
                </div>
            </div>
        `;
    });
    
    // Delivery info (if delivered)
    let deliverySection = '';
    if (shipment.status === 'Delivered') {
        const deliveryEntry = history.find(h => h.status === 'Delivered');
        if (deliveryEntry && deliveryEntry.details) {
            deliverySection = `
                <div class="p-section">
                    <h3>Delivery Information</h3>
                    <table class="p-info-table">
                        <tr><td class="p-label">Received By:</td><td>${deliveryEntry.details.deliveredTo || '-'}</td></tr>
                        ${deliveryEntry.details.recipientRelationship ? `<tr><td class="p-label">Relationship:</td><td>${deliveryEntry.details.recipientRelationship}</td></tr>` : ''}
                        <tr><td class="p-label">Delivery Date:</td><td>${deliveryEntry.date || '-'}</td></tr>
                        ${deliveryEntry.details.deliveryTime ? `<tr><td class="p-label">Delivery Time:</td><td>${deliveryEntry.details.deliveryTime}</td></tr>` : ''}
                        ${deliveryEntry.details.deliveryRemarks ? `<tr><td class="p-label">Remarks:</td><td>${deliveryEntry.details.deliveryRemarks}</td></tr>` : ''}
                    </table>
                </div>
            `;
        }
    }
    
    const printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Tracking Report - AWB: ${awb}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 10pt;
            color: #000;
            line-height: 1.4;
            background: #fff;
        }
        
        .p-container {
            max-width: 100%;
        }
        
        /* Company Header */
        .p-header {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        
        .p-header h1 {
            font-size: 22pt;
            font-weight: 900;
            letter-spacing: 2px;
        }
        
        .p-header .p-tagline {
            font-size: 9pt;
            font-style: italic;
            color: #444;
            margin-top: 3px;
        }
        
        .p-doc-type {
            display: inline-block;
            border: 2px solid #000;
            padding: 3px 20px;
            font-size: 11pt;
            font-weight: 900;
            letter-spacing: 2px;
            margin-top: 8px;
            background: #000;
            color: #fff;
        }
        
        /* AWB Box */
        .p-awb-box {
            border: 2px solid #000;
            padding: 12px 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9f9f9;
        }
        
        .p-awb-label {
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #555;
        }
        
        .p-awb-value {
            font-size: 20pt;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            margin-top: 2px;
        }
        
        .p-awb-info {
            text-align: right;
            font-size: 9pt;
            line-height: 1.6;
        }
        
        .p-awb-info strong {
            display: inline-block;
            min-width: 90px;
            text-align: left;
        }
        
        /* Section Title */
        .p-section {
            margin-bottom: 18px;
        }
        
        .p-section h3 {
            border-bottom: 2px solid #000;
            padding: 5px 10px;
            font-size: 10pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            background: #f0f0f0;
        }
        
        /* Two Column Layout */
        .p-two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 10px;
        }
        
        .p-col-box {
            border: 1px solid #000;
            padding: 10px 12px;
        }
        
        .p-col-title {
            font-size: 9pt;
            font-weight: 900;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
            margin-bottom: 6px;
        }
        
        /* Info Table */
        .p-info-table {
            width: 100%;
            font-size: 9pt;
        }
        
        .p-info-table tr {
            border-bottom: 1px dotted #999;
        }
        
        .p-info-table tr:last-child {
            border-bottom: none;
        }
        
        .p-info-table td {
            padding: 4px 0;
            vertical-align: top;
        }
        
        .p-info-table .p-label {
            font-weight: 700;
            color: #333;
            width: 120px;
            text-transform: uppercase;
            font-size: 8pt;
        }
        
        /* Shipment Info Row */
        .p-info-row {
            display: flex;
            border: 1px solid #000;
            margin-bottom: 12px;
        }
        
        .p-info-cell {
            flex: 1;
            padding: 8px 10px;
            border-right: 1px solid #000;
            text-align: center;
        }
        
        .p-info-cell:last-child {
            border-right: none;
        }
        
        .p-info-cell .p-info-label {
            font-size: 7pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #555;
        }
        
        .p-info-cell .p-info-value {
            font-size: 11pt;
            font-weight: 900;
            margin-top: 2px;
        }
        
        /* Timeline */
        .p-timeline {
            position: relative;
            padding-left: 30px;
        }
        
        .p-timeline::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #000;
        }
        
        .p-timeline-item {
            position: relative;
            padding-bottom: 15px;
            padding-left: 15px;
        }
        
        .p-timeline-item:last-child {
            padding-bottom: 0;
        }
        
        .p-timeline-dot {
            position: absolute;
            left: -24px;
            top: 5px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #000;
        }
        
        .p-timeline-item.p-current .p-timeline-dot {
            background: #000;
        }
        
        .p-timeline-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
            padding-bottom: 3px;
            border-bottom: 1px dotted #ccc;
        }
        
        .p-timeline-header strong {
            font-size: 10pt;
        }
        
        .p-timeline-date {
            font-size: 8pt;
            color: #555;
        }
        
        .p-reason {
            background: #f5f5f5;
            border-left: 3px solid #000;
            padding: 6px 10px;
            margin-top: 6px;
            font-size: 9pt;
            font-style: italic;
        }
        
        .p-details {
            margin-top: 6px;
            padding-left: 20px;
            font-size: 8.5pt;
        }
        
        .p-details li {
            margin-bottom: 3px;
        }
        
        /* Footer */
        .p-footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #000;
            text-align: center;
            font-size: 7.5pt;
            color: #555;
        }
        
        /* Print Button (hidden when printing) */
        .print-action-bar {
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background: #f0f0f0;
            border: 1px dashed #999;
        }
        
        .print-action-bar button {
            background: #000;
            color: #fff;
            border: none;
            padding: 10px 25px;
            font-size: 11pt;
            font-weight: 700;
            cursor: pointer;
            border-radius: 4px;
            margin: 0 5px;
        }
        
        .print-action-bar button:hover {
            background: #333;
        }
        
        .print-action-bar .print-hint {
            font-size: 8pt;
            color: #666;
            margin-top: 8px;
        }
        
        @media print {
            .print-action-bar {
                display: none !important;
            }
            body {
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    
    <!-- Print Action Bar (hidden when printing) -->
    <div class="print-action-bar">
        <button onclick="window.print()">
            🖨️ Print / Save as PDF
        </button>
        <button onclick="window.close()">
            ✕ Close
        </button>
        <div class="print-hint">
            💡 Tip: In the print dialog, select <strong>"Save as PDF"</strong> as destination to download as PDF file
        </div>
    </div>
    
    <div class="p-container">
        
        <!-- Company Header -->
        <div class="p-header">
            <h1>REX WORLDWIDE COURIER</h1>
            <div class="p-tagline">Trusted Global Courier & Logistics Partner</div>
            <div class="p-doc-type">SHIPMENT TRACKING REPORT</div>
        </div>
        
        <!-- AWB Box -->
        <div class="p-awb-box">
            <div>
                <div class="p-awb-label">AWB Number</div>
                <div class="p-awb-value">${awb}</div>
            </div>
            <div class="p-awb-info">
                <strong>Booking Date:</strong> ${date}<br>
                <strong>Current Status:</strong> ${status}<br>
                <strong>PI Reference:</strong> ${shipment.piNumber || '-'}
            </div>
        </div>
        
        <!-- Shipper + Consignee -->
        <div class="p-two-col">
            <div class="p-col-box">
                <div class="p-col-title">Shipper (Sender)</div>
                <table class="p-info-table">
                    <tr><td class="p-label">Name:</td><td>${shipper}</td></tr>
                    <tr><td class="p-label">Company:</td><td>${shipment.shipper?.company || '-'}</td></tr>
                    <tr><td class="p-label">City:</td><td>${shipment.shipper?.city || '-'}</td></tr>
                    <tr><td class="p-label">Country:</td><td>${shipment.shipper?.country || '-'}</td></tr>
                </table>
            </div>
            <div class="p-col-box">
                <div class="p-col-title">Consignee (Receiver)</div>
                <table class="p-info-table">
                    <tr><td class="p-label">Name:</td><td>${destination}</td></tr>
                    <tr><td class="p-label">Company:</td><td>${shipment.consignee?.company || '-'}</td></tr>
                    <tr><td class="p-label">City:</td><td>${shipment.consignee?.city || '-'}</td></tr>
                    <tr><td class="p-label">Country:</td><td>${shipment.consignee?.country || '-'}</td></tr>
                </table>
            </div>
        </div>
        
        <!-- Shipment Info -->
        <div class="p-info-row">
            <div class="p-info-cell">
                <div class="p-info-label">Pieces</div>
                <div class="p-info-value">${pieces}</div>
            </div>
            <div class="p-info-cell">
                <div class="p-info-label">Weight</div>
                <div class="p-info-value">${weight}</div>
            </div>
            <div class="p-info-cell">
                <div class="p-info-label">Shipment Type</div>
                <div class="p-info-value">${shipment.shipment?.shipmentType || '-'}</div>
            </div>
            <div class="p-info-cell">
                <div class="p-info-label">Service</div>
                <div class="p-info-value">${shipment.serviceType || '-'}</div>
            </div>
        </div>
        
        <!-- Contents -->
        ${shipment.shipment?.contents ? `
        <div style="border: 1px solid #000; padding: 8px 12px; margin-bottom: 15px;">
            <strong>Contents:</strong> ${shipment.shipment.contents}
        </div>
        ` : ''}
        
        <!-- Tracking Timeline -->
        <div class="p-section">
            <h3>Shipment Journey & Status Updates</h3>
            <div class="p-timeline">
                ${timelineHtml}
            </div>
        </div>
        
        <!-- Delivery Information (if delivered) -->
        ${deliverySection}
        
        <!-- Footer -->
        <div class="p-footer">
            Generated on: ${new Date().toLocaleString()}<br>
            REX WORLDWIDE COURIER - Shipment Tracking Report<br>
            For any queries, contact: support@rexcouriers.com | +92-XXX-XXXXXXX
        </div>
        
    </div>
    
</body>
</html>
    `;
    
    const printWindow = window.open('', '', 'width=900,height=1100');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
}





// ============================================
// 🔥 SHOW TRACKING ERROR
// ============================================
function showTrackingError(message) {
    $('#trackingErrorMessage').text(message);
    new bootstrap.Modal(document.getElementById('trackingErrorModal')).show();
}

// ============================================
// 🔥 MOBILE MENU
// ============================================
function setupMobileMenu() {
    $('#mobileMenuToggle').on('click', function() {
        $('.mobile-tracking-bar').slideToggle(300);
    });
}

// ============================================
// 🔥 HELPERS
// ============================================
function formatTrackingDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
}