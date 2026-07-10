// assets/js/trackingview.js - FINAL WORKING VERSION
import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

// Global state
let allShipments = [];
let filteredShipments = [];
let currentPage = 1;
let itemsPerPage = 50;
let carriersList = [];
let currentShipmentId = null;
let currentShipmentData = null;

// 🔥 Setup flags to prevent duplicate event binding
let isTrackingSetup = false;

// Status definitions
const STATUS_CONFIG = {
    'Booked': { icon: 'bi-clock', color: 'status-booked', label: 'Booked' },
    'Intransit': { icon: 'bi-truck', color: 'status-intransit', label: 'In Transit' },
    'Hold': { icon: 'bi-pause-circle', color: 'status-hold', label: 'On Hold' },
    'Delivered': { icon: 'bi-check-circle-fill', color: 'status-delivered', label: 'Delivered' },
    'Returned': { icon: 'bi-arrow-return-left', color: 'status-returned', label: 'Returned' },
    'Lost': { icon: 'bi-question-circle', color: 'status-lost', label: 'Lost' },
    'Destroyed': { icon: 'bi-x-octagon', color: 'status-destroyed', label: 'Destroyed' }
};

const STATUS_TRANSITIONS = {
    'Booked': ['Intransit', 'Hold', 'Cancelled'],
    'Intransit': ['Hold', 'Delivered', 'Returned', 'Lost'],
    'Hold': ['Intransit', 'Returned', 'Lost'],
    'Delivered': [],
    'Returned': ['Booked'],
    'Lost': ['Returned'],
    'Destroyed': []
};

// ============================================
// 🔥 SAFE MODAL CLEANUP HELPER (CORE FIX)
// ============================================
function safeHideModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;
    
    try {
        // Use getOrCreateInstance to ensure we have a modal instance
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        if (modal) modal.hide();
    } catch (e) {
        console.warn("⚠️ Modal hide error:", e);
    }
    
    // Clean up lingering backdrops after hide animation
    setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
    }, 350);
}

// ============================================
// 🔥 INITIALIZATION (WITH SETUP FLAG)
// ============================================
window.initTrackingView = function() {
    console.log("🚀 [trackingview.js] initTrackingView() executed");
    
    // 🔥 CRITICAL: Only setup event handlers ONCE
    if (!isTrackingSetup) {
        setupFilters();
        setupPagination();
        setupUpdateStatusModal();
        setupViewModal();
        setupAssignCarrierModal();
        isTrackingSetup = true;
        console.log("✅ Event handlers bound (first time only)");
    } else {
        console.log("ℹ️ Event handlers already bound, skipping");
    }
    
    loadCarriers();
    loadShipments();
};

// ============================================
// 🔥 LOAD CARRIERS
// ============================================
// ============================================
// 🔥 LOAD CARRIERS
// ============================================
async function loadCarriers() {
    try {
        const carriers = await FirebaseDB.getList('carriers');
        carriersList = carriers.filter(c => c.status === 'Active');
        
        // Filter dropdown
        const $filterSelect = $('#filterCarrier');
        $filterSelect.empty().append('<option value="">All Carriers</option>');
        carriersList.forEach(c => {
            $filterSelect.append(`<option value="${c.id}">${c.carrierName}</option>`);
        });
        
        // Update status modal dropdown
        const $updateSelect = $('#newCarrier');
        $updateSelect.empty().append('<option value="" disabled selected>Select Carrier</option>');
        carriersList.forEach(c => {
            $updateSelect.append(`<option value="${c.id}" data-name="${c.carrierName}">${c.carrierName} (${c.carrierCode || ''})</option>`);
        });
        
        // Intransit carrier dropdown
        const $intransitSelect = $('#intransitCarrier');
        $intransitSelect.empty().append('<option value="" disabled selected>Select Carrier</option>');
        carriersList.forEach(c => {
            $intransitSelect.append(`<option value="${c.id}" data-name="${c.carrierName}">${c.carrierName} (${c.carrierCode || ''})</option>`);
        });
        
        // Assign carrier modal dropdown
        const $assignSelect = $('#assignCarrierSelect');
        $assignSelect.empty().append('<option value="" disabled selected>Select Carrier</option>');
        carriersList.forEach(c => {
            $assignSelect.append(`<option value="${c.id}" data-name="${c.carrierName}">${c.carrierName} (${c.carrierCode || ''})</option>`);
        });
        
        console.log("✅ Loaded", carriersList.length, "carriers");
    } catch (error) {
        console.error("❌ Error loading carriers:", error);
    }
}



// ============================================
// 🔥 LOAD SHIPMENTS
// ============================================
async function loadShipments() {
    try {
        const shipments = await FirebaseDB.getList('shipments');
        allShipments = Array.isArray(shipments) ? shipments : [];
        
        allShipments.sort((a, b) => {
            const dateA = a.createdAt || '';
            const dateB = b.createdAt || '';
            return dateB.localeCompare(dateA);
        });
        
        updateStats();
        applyFilters();
    } catch (error) {
        console.error("❌ Error loading shipments:", error);
        showErrorModal('Failed to load shipments: ' + error.message);
    }
}

// ============================================
// 🔥 STATS
// ============================================
function updateStats() {
    $('#statTotal').text(allShipments.length);
    $('#statBooked').text(allShipments.filter(s => s.status === 'Booked').length);
    $('#statIntransit').text(allShipments.filter(s => s.status === 'Intransit').length);
    $('#statDelivered').text(allShipments.filter(s => s.status === 'Delivered').length);
    $('#statHold').text(allShipments.filter(s => s.status === 'Hold').length);
    $('#statException').text(allShipments.filter(s => ['Returned', 'Lost', 'Destroyed'].includes(s.status)).length);
}

// ============================================
// 🔥 FILTERS
// ============================================

// ============================================
// 🔥 FILTERS
// ============================================
function setupFilters() {
    $('#searchInput, #searchReceipt').off('input').on('input', debounce(applyFilters, 300));
    $('#filterStatus, #filterCarrier, #filterServiceType').off('change').on('change', applyFilters);
    $('#filterDateFrom, #filterDateTo').off('change').on('change', applyFilters);
    
    $('#btnClearFilters').off('click').on('click', function() {
        $('#searchInput, #searchReceipt, #filterStatus, #filterCarrier, #filterServiceType, #filterDateFrom, #filterDateTo').val('');
        applyFilters();
    });
}

function applyFilters() {
    const search = $('#searchInput').val().toLowerCase().trim();
    const searchReceipt = $('#searchReceipt').val().toLowerCase().trim();
    const status = $('#filterStatus').val();
    const carrier = $('#filterCarrier').val();
    const serviceType = $('#filterServiceType').val();
    const dateFrom = $('#filterDateFrom').val();
    const dateTo = $('#filterDateTo').val();

    filteredShipments = allShipments.filter(s => {
        // Search (AWB, PI, customer name, destination)
        if (search) {
            const searchFields = [
                s.awbNumber, s.piNumber, 
                s.shipper?.name, s.consignee?.name,
                s.consignee?.destination, s.consignee?.city,
                s.carrierName, s.accountNumber
            ].map(f => (f || '').toLowerCase());
            if (!searchFields.some(f => f.includes(search))) return false;
        }
        
        // Search by carrier receipt number
        if (searchReceipt) {
            const receipt = (s.carrierReceiptNumber || '').toLowerCase();
            if (!receipt.includes(searchReceipt)) return false;
        }
        
        if (status && s.status !== status) return false;
        if (carrier && s.carrierId !== carrier) return false;
        if (serviceType && s.serviceType !== serviceType) return false;
        if (dateFrom && s.bookingDate && s.bookingDate < dateFrom) return false;
        if (dateTo && s.bookingDate && s.bookingDate > dateTo) return false;
        return true;
    });

    currentPage = 1;
    renderTable();
    renderPagination();
}




// ============================================
// 🔥 RENDER TABLE
// ============================================

// ============================================
// 🔥 RENDER TABLE
// ============================================
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageShipments = filteredShipments.slice(start, end);

    $('#showingFrom').text(filteredShipments.length > 0 ? start + 1 : 0);
    $('#showingTo').text(Math.min(end, filteredShipments.length));
    $('#showingTotal').text(filteredShipments.length);

    const $tbody = $('#shipmentTableBody').empty();

    if (pageShipments.length === 0) {
        $tbody.html(`
            <tr>
                <td colspan="8" class="text-center py-5">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i>
                    <p class="mt-3 text-muted">No shipments found</p>
                </td>
            </tr>
        `);
        return;
    }

    pageShipments.forEach(s => {
        const awb = s.awbNumber || '-';
        const pi = s.piNumber || '-';
        const receipt = s.carrierReceiptNumber || '';
        const date = s.bookingDate ? formatDate(s.bookingDate) : '-';
        const customerName = s.shipper?.name || '-';
        const customerAccount = s.accountNumber || '';
        const destination = s.consignee?.destination || s.consignee?.city || '-';
        const destinationCountry = s.consignee?.country || '';
        
        const carrierName = s.carrierName || 'Not Assigned';
        const carrierClass = s.carrierId ? 'assigned' : 'unassigned';
        const carrierIcon = s.carrierId ? 'bi-truck' : 'bi-truck-front';
        const carrierBadge = `<span class="carrier-badge ${carrierClass}"><i class="bi ${carrierIcon}"></i> ${carrierName}</span>`;
        
        // Carrier Receipt Cell
        const receiptCell = receipt ? 
            `<div class="receipt-cell">
                <span class="receipt-number">${receipt}</span>
                <small class="text-muted">${carrierName}</small>
            </div>` : 
            '<span class="text-muted fst-italic">Not Assigned</span>';
        
        const status = s.status || 'Booked';
        const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['Booked'];
        const statusBadge = `<span class="status-badge ${statusConfig.color}"><i class="bi ${statusConfig.icon}"></i> ${statusConfig.label}</span>`;

        const row = `
            <tr>
                <td class="ps-4">
                    <div class="awb-pi-cell">
                        <span class="awb-number">${awb}</span>
                        <span class="pi-number">PI: ${pi}</span>
                    </div>
                </td>
                <td>${receiptCell}</td>
                <td><small>${date}</small></td>
                <td>
                    <span class="customer-name">${customerName}</span>
                    ${customerAccount ? `<span class="customer-account">${customerAccount}</span>` : ''}
                </td>
                <td>
                    <span class="destination-city">${destination}</span>
                    ${destinationCountry ? `<span class="destination-country">${destinationCountry}</span>` : ''}
                </td>
                <td>${carrierBadge}</td>
                <td>${statusBadge}</td>
                <td class="text-center pe-4">
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewShipment('${s.id}')" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn-action btn-update" onclick="updateShipmentStatus('${s.id}')" title="Update Status">
                            <i class="bi bi-arrow-repeat"></i>
                        </button>
                        <button class="btn-action btn-assign-carrier" onclick="assignCarrier('${s.id}')" title="Assign Carrier">
                            <i class="bi bi-truck"></i>
                        </button>
                        <button class="btn-action btn-print" onclick="printShipment('${s.id}')" title="Print AWB / PI">
                            <i class="bi bi-printer-fill"></i>
                        </button>                        
                        <button class="btn-action btn-print-status" onclick="printStatusReport('${s.id}')" title="Print Status Report">
                            <i class="bi bi-file-earmark-pdf"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });
}



// ============================================
// 🔥 PAGINATION
// ============================================
function setupPagination() {
    $('#itemsPerPage').off('change').on('change', function() {
        itemsPerPage = parseInt($(this).val());
        currentPage = 1;
        renderTable();
        renderPagination();
    });
}

function renderPagination() {
    const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
    const $c = $('#paginationContainer').empty();
    
    if (totalPages <= 1) return;

    $c.append(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}">Prev</a></li>`);
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            $c.append(`<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            $c.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
    }
    
    $c.append(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>`);

    $c.find('.page-link').off('click').on('click', function(e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        if (page && page !== currentPage) {
            currentPage = page;
            renderTable();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ============================================
// 🔥 UPDATE STATUS MODAL SETUP
// ============================================
// ============================================
// 🔥 UPDATE STATUS MODAL SETUP
// ============================================
function setupUpdateStatusModal() {
    console.log("🔧 Setting up update status modal...");
    
    // Bind save button
    $('#btnSaveStatus').off('click').on('click', saveStatusUpdate);
    
    // 🔥 CRITICAL: Bind status change handler
    $('#newStatus').off('change').on('change', function() {
        const newStatus = $(this).val();
        console.log("🔄 Status changed to:", newStatus);
        handleStatusChange(newStatus);
    });
    
    // Verify binding
    console.log("✅ Event handlers bound");
    console.log("🔍 #newStatus element exists:", $('#newStatus').length);
    console.log("🔍 #intransitDetails element exists:", $('#intransitDetails').length);
}

// ============================================
// 🔥 ASSIGN CARRIER MODAL SETUP
// ============================================
function setupAssignCarrierModal() {
    // 🔥 FIX: Use .off().on() to prevent duplicate handlers
    $('#btnConfirmAssignCarrier').off('click').on('click', confirmAssignCarrier);
    
    $('#assignCarrierSelect').off('change').on('change', function() {
        const carrierId = $(this).val();
        const carrier = carriersList.find(c => c.id === carrierId);
        
        if (carrier) {
            $('#previewCarrierName').text(carrier.carrierName || '-');
            $('#previewCarrierCode').text(carrier.carrierCode || '-');
            $('#previewCarrierType').text(carrier.carrierType || '-');
            $('#previewCarrierContact').text(carrier.contactNumber || '-');
            $('#carrierDetailsPreview').removeClass('d-none');
        } else {
            $('#carrierDetailsPreview').addClass('d-none');
        }
    });
    
    // 🔥 FIX: Use safeHideModal
    $('#btnCloseCarrierSuccess').off('click').on('click', function() {
        safeHideModal('carrierAssignSuccessModal');
        setTimeout(() => loadShipments(), 400);
    });
}

// ============================================
// 🔥 ASSIGN CARRIER FUNCTION
// ============================================
// ============================================
// 🔥 ASSIGN CARRIER FUNCTION (WITH RECEIPT NUMBER)
// ============================================
window.assignCarrier = async function(shipmentId) {
    try {
        const shipment = await FirebaseDB.get(`shipments/${shipmentId}`);
        if (!shipment) return showErrorModal('Shipment not found');

        currentShipmentId = shipmentId;
        currentShipmentData = shipment;

        $('#assignShipmentId').val(shipmentId);
        $('#assignAWB').text(shipment.awbNumber || '-');
        $('#assignPI').text(shipment.piNumber || '-');
        
        const status = shipment.status || 'Booked';
        const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['Booked'];
        $('#assignCurrentStatus').html(`<span class="status-badge ${statusConfig.color}">${statusConfig.label}</span>`);
        
        $('#assignShipper').text(shipment.shipper?.name || '-');
        $('#assignDestination').text(shipment.consignee?.destination || shipment.consignee?.city || '-');

        if (shipment.carrierId) {
            $('#currentCarrierDisplay').html(`
                <span class="carrier-badge assigned">
                    <i class="bi bi-truck"></i> ${shipment.carrierName || 'Unknown'}
                </span>
                <small class="text-muted d-block mt-1">
                    Assigned on: ${shipment.carrierAssignedDate ? formatDate(shipment.carrierAssignedDate) : 'Unknown'}
                    ${shipment.carrierReceiptNumber ? `<br>Receipt: <strong>${shipment.carrierReceiptNumber}</strong>` : ''}
                </small>
            `);
        } else {
            $('#currentCarrierDisplay').html(`
                <span class="carrier-badge unassigned">
                    <i class="bi bi-truck-front"></i> Not Assigned
                </span>
            `);
        }

        const $select = $('#assignCarrierSelect').empty();
        $select.append('<option value="" disabled selected>Select Carrier</option>');
        carriersList.forEach(c => {
            const selected = c.id === shipment.carrierId ? 'selected' : '';
            $select.append(`<option value="${c.id}" data-name="${c.carrierName}" ${selected}>${c.carrierName} (${c.carrierCode || ''})</option>`);
        });

        // Pre-fill receipt number if exists
        $('#assignCarrierReceipt').val(shipment.carrierReceiptNumber || '');
        $('#carrierAssignmentNotes').val('');
        $('#carrierDetailsPreview').addClass('d-none');

        new bootstrap.Modal(document.getElementById('assignCarrierModal')).show();
    } catch (error) {
        console.error("❌ Error loading shipment:", error);
        showErrorModal('Failed to load shipment: ' + error.message);
    }
};

// ============================================
// 🔥 CONFIRM ASSIGN CARRIER (FIXED)
// ============================================
// ============================================
// 🔥 CONFIRM ASSIGN CARRIER (WITH RECEIPT NUMBER)
// ============================================
async function confirmAssignCarrier() {
    const shipmentId = $('#assignShipmentId').val();
    const carrierId = $('#assignCarrierSelect').val();
    const receiptNumber = $('#assignCarrierReceipt').val().trim();
    const notes = $('#carrierAssignmentNotes').val().trim();

    if (!carrierId) {
        showErrorModal('Please select a carrier');
        return;
    }
    
    if (!receiptNumber) {
        showErrorModal('Carrier Receipt Number is required');
        $('#assignCarrierReceipt').focus();
        return;
    }

    const $btn = $('#btnConfirmAssignCarrier');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');

    try {
        const carrier = carriersList.find(c => c.id === carrierId);
        if (!carrier) throw new Error('Carrier not found');

        const adminUser = FirebaseAuth.getCurrentUser();
        const assignedBy = adminUser ? adminUser.email : 'unknown';

        const carrierHistoryEntry = {
            carrierId: carrierId,
            carrierName: carrier.carrierName,
            carrierCode: carrier.carrierCode || '',
            carrierReceiptNumber: receiptNumber,
            assignedDate: new Date().toISOString().split('T')[0],
            assignedTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
            assignedBy: assignedBy,
            notes: notes || null
        };

        const updateData = {
            carrierId: carrierId,
            carrierName: carrier.carrierName,
            carrierCode: carrier.carrierCode || '',
            carrierReceiptNumber: receiptNumber,
            carrierAssignedDate: new Date().toISOString(),
            carrierAssignedBy: assignedBy,
            carrierAssignmentNotes: notes || '',
            carrierHistory: [
                ...(currentShipmentData.carrierHistory || []),
                carrierHistoryEntry
            ],
            lastUpdated: new Date().toISOString()
        };

        await FirebaseDB.update(`shipments/${shipmentId}`, updateData);
        console.log("✅ Carrier assigned successfully with receipt:", receiptNumber);

        $('#successAssignAWB').text(currentShipmentData.awbNumber);
        $('#successAssignCarrier').text(`${carrier.carrierName} - ${receiptNumber}`);
        $('#successAssignDate').text(new Date().toLocaleDateString('en-GB'));

        safeHideModal('assignCarrierModal');
        
        setTimeout(() => {
            new bootstrap.Modal(document.getElementById('carrierAssignSuccessModal')).show();
        }, 400);

    } catch (error) {
        console.error("❌ Error assigning carrier:", error);
        showErrorModal('Failed to assign carrier: ' + error.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}




// ============================================
// 🔥 UPDATE SHIPMENT STATUS
// ============================================
window.updateShipmentStatus = async function(shipmentId) {
    try {
        const shipment = await FirebaseDB.get(`shipments/${shipmentId}`);
        if (!shipment) return showErrorModal('Shipment not found');

        currentShipmentId = shipmentId;
        currentShipmentData = shipment;

        $('#updateShipmentId').val(shipmentId);
        $('#updateAWB').text(shipment.awbNumber || '-');
        
        const currentStatus = shipment.status || 'Booked';
        const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Booked'];
        $('#updateCurrentStatus').html(`<span class="status-badge ${statusConfig.color}"><i class="bi ${statusConfig.icon}"></i> ${statusConfig.label}</span>`);
        
        $('#updateCurrentCarrier').text(shipment.carrierName || 'Not Assigned');

        if (!shipment.carrierId) {
            $('#noCarrierWarning').removeClass('d-none');
        } else {
            $('#noCarrierWarning').addClass('d-none');
        }

        const validTransitions = STATUS_TRANSITIONS[currentStatus] || [];
        const $statusSelect = $('#newStatus').empty();
        $statusSelect.append('<option value="" disabled selected>Select New Status</option>');
        
        if (validTransitions.length === 0) {
            $statusSelect.append('<option value="" disabled>No transitions available (terminal state)</option>');
            $('#btnSaveStatus').prop('disabled', true);
            $('#statusTransitionHint').text('This is a terminal state. No further status changes allowed.');
        } else {
            $('#btnSaveStatus').prop('disabled', false);
            $('#statusTransitionHint').text('');
            validTransitions.forEach(status => {
                const config = STATUS_CONFIG[status];
                if (config) $statusSelect.append(`<option value="${status}">${config.label}</option>`);
            });
        }

        $('#statusDate').val(new Date().toISOString().split('T')[0]);
        $('#newCarrier').val('');
        $('#statusReason').val('');
        $('#deliveredTo').val('');
        $('#deliveryTime').val('');
        $('#deliveryRemarks').val('');
        $('#carrierSection, #reasonSection, #podSection').addClass('d-none');

        renderStatusHistory(shipment.statusHistory || []);

        new bootstrap.Modal(document.getElementById('updateStatusModal')).show();
    } catch (error) {
        console.error("❌ Error loading shipment:", error);
        showErrorModal('Failed to load shipment: ' + error.message);
    }
};
// ============================================
// 🔥 HANDLE STATUS CHANGE (ENHANCED)
// ============================================


// ============================================
// 🔥 HANDLE STATUS CHANGE (ENHANCED)
// ============================================
// ============================================
// 🔥 HANDLE STATUS CHANGE (DEBUG VERSION)
// ============================================
function handleStatusChange(newStatus) {
    console.log("🔍 handleStatusChange called with:", newStatus);
    console.log("🔍 Current shipment data:", currentShipmentData);
    
    // Hide all conditional sections first
    const sectionsToHide = '#carrierSection, #intransitDetails, #holdDetails, #podSection, #returnDetails, #lostDetails';
    $(sectionsToHide).addClass('d-none');
    console.log("✅ All sections hidden");
    
    // Check if Intransit is selected
    if (newStatus === 'Intransit') {
        console.log("✅ Intransit status detected");
        
        // Show Intransit details section
        const $intransitDetails = $('#intransitDetails');
        console.log("🔍 #intransitDetails element found:", $intransitDetails.length);
        
        if ($intransitDetails.length > 0) {
            $intransitDetails.removeClass('d-none');
            console.log("✅ #intransitDetails section shown");
            
            // Load quick reasons
            loadQuickReasons('Intransit');
            
            // Pre-fill carrier if already assigned
            if (currentShipmentData?.carrierId) {
                console.log("✅ Pre-filling carrier:", currentShipmentData.carrierId);
                $('#intransitCarrier').val(currentShipmentData.carrierId);
                $('#carrierReceiptNumber').val(currentShipmentData.carrierReceiptNumber || '');
            } else {
                console.log("⚠️ No carrier assigned, showing carrier selection");
            }
        } else {
            console.error("❌ #intransitDetails element NOT FOUND in DOM!");
            console.error("❌ Please check if the HTML section exists in tracking.php");
            
            // Show error to user
            showErrorModal('InTransit details section is missing. Please refresh the page.');
        }
    } else if (newStatus === 'Hold') {
        console.log("✅ Hold status detected");
        $('#holdDetails').removeClass('d-none');
        loadQuickReasons('Hold');
    } else if (newStatus === 'Delivered') {
        console.log("✅ Delivered status detected");
        $('#podSection').removeClass('d-none');
        loadQuickReasons('Delivered');
    } else if (newStatus === 'Returned') {
        console.log("✅ Returned status detected");
        $('#returnDetails').removeClass('d-none');
        loadQuickReasons('Returned');
    } else if (newStatus === 'Lost') {
        console.log("✅ Lost status detected");
        $('#lostDetails').removeClass('d-none');
        loadQuickReasons('Lost');
    } else if (newStatus === 'Destroyed') {
        console.log("✅ Destroyed status detected");
        loadQuickReasons('Destroyed');
    } else {
        console.log("ℹ️ Other status:", newStatus);
        loadQuickReasons(newStatus);
    }
    
    // Update placeholder based on status
    updateReasonPlaceholder(newStatus);
}




// ============================================
// 🔥 LOAD QUICK REASONS
// ============================================
function loadQuickReasons(status) {
    const quickReasons = {
        'Intransit': [
            'Shipment picked up from origin',
            'In transit to destination hub',
            'Awaiting customs clearance',
            'In sorting facility',
            'Out for delivery',
            'Delayed due to weather',
            'Transferring to local carrier'
        ],
        'Hold': [
            'Address incomplete or incorrect',
            'Recipient not available',
            'Business closed',
            'Payment pending from customer',
            'Documentation required',
            'Customs hold - additional documents needed',
            'Customer requested to hold',
            'Weather conditions - unsafe to deliver'
        ],
        'Delivered': [
            'Delivered to consignee personally',
            'Handed to family member',
            'Left at reception desk',
            'Given to security guard',
            'Delivered to authorized person',
            'Left at doorstep (with photo)',
            'Delivered to office colleague'
        ],
        'Returned': [
            'Address not found after multiple attempts',
            'Recipient refused delivery',
            'Customer cancelled order',
            'Undeliverable - incorrect address',
            'Multiple delivery attempts failed',
            'Recipient not available after 3 attempts'
        ],
        'Lost': [
            'Shipment missing from last known location',
            'Unable to locate after investigation',
            'Lost in transit - under investigation',
            'Theft suspected - police report filed'
        ],
        'Destroyed': [
            'Damaged beyond repair during transit',
            'Destroyed by customs authorities',
            'Hazardous material - destroyed for safety',
            'Natural disaster - shipment destroyed'
        ],
        'Booked': [
            'Booking confirmed',
            'Shipment registered in system'
        ]
    };
    
    const reasons = quickReasons[status] || [];
    const $container = $('#quickReasons').empty();
    
    if (reasons.length === 0) {
        $container.html('<small class="text-muted">No quick reasons available for this status</small>');
        return;
    }
    
    reasons.forEach(reason => {
        const btn = `<button type="button" class="btn btn-sm btn-outline-secondary quick-reason-btn" data-reason="${reason}">
            ${reason}
        </button>`;
        $container.append(btn);
    });
    
    // Click handler for quick reasons
    $('.quick-reason-btn').on('click', function() {
        const reason = $(this).data('reason');
        $('#statusReason').val(reason).trigger('input');
    });
}

// ============================================
// 🔥 UPDATE REASON PLACEHOLDER
// ============================================
function updateReasonPlaceholder(status) {
    const placeholders = {
        'Intransit': 'e.g., Shipment picked up and in transit to destination hub...',
        'Hold': 'e.g., Address incomplete, recipient not available, business closed...',
        'Delivered': 'e.g., Delivered to consignee personally, handed to security...',
        'Returned': 'e.g., Address not found after 3 attempts, recipient refused...',
        'Lost': 'e.g., Last seen at Karachi hub, investigation ongoing...',
        'Destroyed': 'e.g., Damaged beyond repair during transit...',
        'Booked': 'e.g., Booking confirmed and registered...'
    };
    
    const placeholder = placeholders[status] || 'Enter reason for status change...';
    $('#statusReason').attr('placeholder', placeholder);
}

// ============================================
// 🔥 REASON CHARACTER COUNT
// ============================================
$(document).on('input', '#statusReason', function() {
    const count = $(this).val().length;
    $('#reasonCharCount').text(count);
    
    if (count > 500) {
        $(this).val($(this).val().substring(0, 500));
        $('#reasonCharCount').text(500);
    }
});




// ============================================
// 🔥 RENDER STATUS HISTORY (ENHANCED)
// ============================================
function renderStatusHistory(history) {
    const $container = $('#statusHistoryPreview');
    
    if (!history || history.length === 0) {
        $container.html('<p class="text-muted small">No status history available</p>');
        return;
    }
    
    let html = '<div class="status-timeline">';
    history.forEach((entry, index) => {
        const isLast = index === history.length - 1;
        const statusConfig = STATUS_CONFIG[entry.status] || STATUS_CONFIG['Booked'];
        const itemClass = isLast ? 'current' : 'completed';
        
        html += `
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
                ${entry.carrierName ? `<div class="timeline-meta">Carrier: ${entry.carrierName}</div>` : ''}
                ${entry.reason ? `<div class="timeline-meta"><strong>Reason:</strong> ${entry.reason}</div>` : ''}
                ${entry.reasonCategory ? `<div class="timeline-meta">Category: ${entry.reasonCategory}</div>` : ''}
                ${entry.details?.deliveredTo ? `<div class="timeline-meta">Delivered to: ${entry.details.deliveredTo}</div>` : ''}
                ${entry.details?.currentLocation ? `<div class="timeline-meta">Location: ${entry.details.currentLocation}</div>` : ''}
                ${entry.changedBy ? `<div class="timeline-meta">By: ${entry.changedBy}</div>` : ''}
            </div>
        `;
    });
    html += '</div>';
    
    $container.html(html);
}



// ============================================
// 🔥 SAVE STATUS UPDATE (FIXED)
// ============================================
// ============================================
// 🔥 SAVE STATUS UPDATE (ENHANCED)
// ============================================
// ============================================
// 🔥 SAVE STATUS UPDATE (ENHANCED WITH CARRIER RECEIPT)
// ============================================
async function saveStatusUpdate() {
    const shipmentId = $('#updateShipmentId').val();
    const newStatus = $('#newStatus').val();
    const statusDate = $('#statusDate').val();
    const reason = $('#statusReason').val().trim();
    
    // Validation
    if (!newStatus) {
        showErrorModal('Please select a new status');
        return;
    }
    if (!statusDate) {
        showErrorModal('Please enter the status change date');
        return;
    }
    if (!reason) {
        showErrorModal('Please provide a reason for this status change');
        $('#statusReason').focus();
        return;
    }
    
    // 🔥 CRITICAL: Intransit requires carrier and receipt number
    if (newStatus === 'Intransit') {
        const carrierId = currentShipmentData?.carrierId || $('#intransitCarrier').val();
        const receiptNumber = $('#carrierReceiptNumber').val().trim();
        
        if (!carrierId) {
            showErrorModal('Carrier is mandatory for In Transit status');
            return;
        }
        if (!receiptNumber) {
            showErrorModal('Carrier Receipt Number is mandatory for In Transit status');
            $('#carrierReceiptNumber').focus();
            return;
        }
    }
    
    if (newStatus === 'Hold') {
        const holdCategory = $('#holdReasonCategory').val();
        if (!holdCategory) {
            showErrorModal('Please select a hold reason category');
            return;
        }
    }
    
    if (newStatus === 'Delivered') {
        const deliveredTo = $('#deliveredTo').val().trim();
        if (!deliveredTo) {
            showErrorModal('Please enter the name of person who received the shipment');
            $('#deliveredTo').focus();
            return;
        }
    }
    
    if (newStatus === 'Returned') {
        const returnCategory = $('#returnReasonCategory').val();
        if (!returnCategory) {
            showErrorModal('Please select a return reason category');
            return;
        }
    }

    const $btn = $('#btnSaveStatus');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');

    try {
        const adminUser = FirebaseAuth.getCurrentUser();
        const changedBy = adminUser ? adminUser.email : 'unknown';
        
        // Build history entry
        const historyEntry = {
            status: newStatus,
            date: statusDate,
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            changedBy: changedBy,
            changedAt: new Date().toISOString(),
            reason: reason,
            reasonCategory: null,
            details: {}
        };
        
        const updateData = {
            status: newStatus,
            lastUpdated: new Date().toISOString(),
            statusHistory: [...(currentShipmentData.statusHistory || []), historyEntry]
        };
        
        // 🔥 CRITICAL: Handle Intransit carrier assignment
        if (newStatus === 'Intransit') {
            const carrierId = currentShipmentData?.carrierId || $('#intransitCarrier').val();
            const receiptNumber = $('#carrierReceiptNumber').val().trim();
            const carrier = carriersList.find(c => c.id === carrierId);
            
            // Update carrier info
            updateData.carrierId = carrierId;
            updateData.carrierName = carrier?.carrierName || '';
            updateData.carrierCode = carrier?.carrierCode || '';
            updateData.carrierReceiptNumber = receiptNumber;
            updateData.carrierAssignedDate = new Date().toISOString();
            updateData.carrierAssignedBy = changedBy;
            
            // Add to history
            historyEntry.carrierId = carrierId;
            historyEntry.carrierName = carrier?.carrierName || '';
            historyEntry.details.carrierReceiptNumber = receiptNumber;
        }
        
        // Add Intransit details
        if (newStatus === 'Intransit') {
            historyEntry.details = {
                ...historyEntry.details,
                currentLocation: $('#currentLocation').val().trim() || null,
                expectedDeliveryDate: $('#expectedDeliveryDate').val() || null,
                transitNotes: $('#transitNotes').val().trim() || null
            };
        }
        
        // Add Hold details
        if (newStatus === 'Hold') {
            historyEntry.reasonCategory = $('#holdReasonCategory').val();
            historyEntry.details = {
                holdReasonCategory: $('#holdReasonCategory').val(),
                detailedReason: $('#holdDetailedReason').val().trim() || null,
                expectedResolutionDate: $('#holdResolutionDate').val() || null
            };
        }
        
        // Add POD details
        if (newStatus === 'Delivered') {
            historyEntry.details = {
                deliveredTo: $('#deliveredTo').val().trim(),
                recipientRelationship: $('#recipientRelationship').val() || null,
                deliveryTime: $('#deliveryTime').val() || null,
                recipientId: $('#recipientId').val().trim() || null,
                deliveryRemarks: $('#deliveryRemarks').val().trim() || null
            };
        }
        
        // Add Return details
        if (newStatus === 'Returned') {
            historyEntry.reasonCategory = $('#returnReasonCategory').val();
            historyEntry.details = {
                returnReasonCategory: $('#returnReasonCategory').val(),
                detailedReason: $('#returnDetailedReason').val().trim() || null,
                returnDate: $('#returnDate').val() || null
            };
        }
        
        // Add Lost details
        if (newStatus === 'Lost') {
            historyEntry.details = {
                lastKnownLocation: $('#lastKnownLocation').val().trim() || null,
                lastSeenDate: $('#lastSeenDate').val() || null,
                investigationNotes: $('#investigationNotes').val().trim() || null
            };
        }
        
        // Add Destroyed details
        if (newStatus === 'Destroyed') {
            historyEntry.details = {
                destructionReason: reason
            };
        }

        await FirebaseDB.update(`shipments/${shipmentId}`, updateData);
        console.log("✅ Status updated successfully");

        const statusConfig = STATUS_CONFIG[newStatus];
        $('#successAWB').text(currentShipmentData.awbNumber);
        $('#successStatus').html(`<span class="status-badge ${statusConfig.color}">${statusConfig.label}</span>`);

        safeHideModal('updateStatusModal');
        
        setTimeout(() => {
            new bootstrap.Modal(document.getElementById('statusUpdateSuccessModal')).show();
        }, 400);
        
        await loadShipments();

    } catch (error) {
        console.error("❌ Error updating status:", error);
        showErrorModal('Failed to update status: ' + error.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}



// ============================================
// 🔥 VIEW SHIPMENT MODAL SETUP
// ============================================
function setupViewModal() {
    // 🔥 FIX: Use .off().on() and safeHideModal
    $('#btnUpdateFromView').off('click').on('click', function() {
        safeHideModal('viewShipmentModal');
        setTimeout(() => updateShipmentStatus(currentShipmentId), 400);
    });
    
    $('#btnPrintFromView').off('click').on('click', function() {
        if (currentShipmentId) printShipment(currentShipmentId);
    });
    
    $('#btnAssignCarrierFromView').off('click').on('click', function() {
        safeHideModal('viewShipmentModal');
        setTimeout(() => assignCarrier(currentShipmentId), 400);
    });
}

window.viewShipment = async function(shipmentId) {
    try {
        const shipment = await FirebaseDB.get(`shipments/${shipmentId}`);
        if (!shipment) return showErrorModal('Shipment not found');

        currentShipmentId = shipmentId;
        currentShipmentData = shipment;
        
        const content = buildViewContent(shipment);
        $('#viewShipmentContent').html(content);
        
        new bootstrap.Modal(document.getElementById('viewShipmentModal')).show();
    } catch (error) {
        console.error("❌ Error loading shipment:", error);
        showErrorModal('Failed to load shipment: ' + error.message);
    }
};

function buildViewContent(s) {
    const status = s.status || 'Booked';
    const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['Booked'];
    
    let timelineHtml = '';
    const history = s.statusHistory || [{
        status: 'Booked',
        date: s.bookingDate,
        changedBy: s.createdByEmail || s.createdBy,
        changedAt: s.createdAt
    }];
    
    history.forEach((entry, index) => {
        const isLast = index === history.length - 1;
        const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG['Booked'];
        const itemClass = isLast ? 'current' : 'completed';
        
        timelineHtml += `
            <div class="timeline-item ${itemClass}">
                <div class="timeline-status">
                    <i class="bi ${config.icon} me-1"></i>
                    ${config.label}
                </div>
                <div class="timeline-date">
                    <i class="bi bi-calendar me-1"></i>
                    ${entry.date || '-'}
                    ${entry.time ? `at ${entry.time}` : ''}
                </div>
                ${entry.carrierName ? `<div class="timeline-meta">Carrier: ${entry.carrierName}</div>` : ''}
                ${entry.reason ? `<div class="timeline-meta">Reason: ${entry.reason}</div>` : ''}
                ${entry.deliveredTo ? `<div class="timeline-meta">Delivered to: ${entry.deliveredTo}</div>` : ''}
                ${entry.changedBy ? `<div class="timeline-meta">By: ${entry.changedBy}</div>` : ''}
            </div>
        `;
    });

    return `
        <div class="view-numbers-grid">
            <div class="view-number-box"><span class="label">AWB Number</span><span class="value">${s.awbNumber || '-'}</span></div>
            <div class="view-number-box"><span class="label">PI Number</span><span class="value">${s.piNumber || '-'}</span></div>
            <div class="view-number-box"><span class="label">Current Status</span><span class="value"><span class="status-badge ${statusConfig.color}">${statusConfig.label}</span></span></div>
            <div class="view-number-box"><span class="label">Booking Date</span><span class="value">${s.bookingDate || '-'}</span></div>
            <div class="view-number-box"><span class="label">Carrier</span><span class="value">${s.carrierName || 'Not Assigned'}</span></div>
            <div class="view-number-box"><span class="label">Service</span><span class="value">${s.serviceType || '-'}</span></div>
        </div>

        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-clock-history me-2"></i>Status Timeline</h6>
            <div class="status-timeline">${timelineHtml}</div>
        </div>

        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-person-badge me-2"></i>Shipper Details</h6>
            <div class="view-grid">
                <div class="view-field"><span class="label">Name:</span><span class="value">${s.shipper?.name || '-'}</span></div>
                <div class="view-field"><span class="label">Company:</span><span class="value">${s.shipper?.company || '-'}</span></div>
                <div class="view-field"><span class="label">City:</span><span class="value">${s.shipper?.city || '-'}</span></div>
                <div class="view-field"><span class="label">Country:</span><span class="value">${s.shipper?.country || '-'}</span></div>
                <div class="view-field"><span class="label">Contact:</span><span class="value">${s.shipper?.contact || '-'}</span></div>
                <div class="view-field"><span class="label">CNIC:</span><span class="value">${s.shipper?.cnic || '-'}</span></div>
            </div>
        </div>

        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-geo-alt me-2"></i>Consignee Details</h6>
            <div class="view-grid">
                <div class="view-field"><span class="label">Name:</span><span class="value">${s.consignee?.name || '-'}</span></div>
                <div class="view-field"><span class="label">Company:</span><span class="value">${s.consignee?.company || '-'}</span></div>
                <div class="view-field"><span class="label">Destination:</span><span class="value">${s.consignee?.destination || '-'}</span></div>
                <div class="view-field"><span class="label">City:</span><span class="value">${s.consignee?.city || '-'}</span></div>
                <div class="view-field"><span class="label">Country:</span><span class="value">${s.consignee?.country || '-'}</span></div>
                <div class="view-field"><span class="label">Contact:</span><span class="value">${s.consignee?.contact || '-'}</span></div>
            </div>
            <div class="view-field mt-2"><span class="label">Address:</span><span class="value">${s.consignee?.address || '-'}</span></div>
        </div>

                <!-- Carrier Information -->
        ${s.carrierId ? `
        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-truck me-2"></i>Carrier Information</h6>
            <div class="view-grid">
                <div class="view-field"><span class="label">Carrier:</span><span class="value">${s.carrierName || '-'}</span></div>
                <div class="view-field"><span class="label">Carrier Code:</span><span class="value">${s.carrierCode || '-'}</span></div>
                <div class="view-field"><span class="label">Receipt Number:</span><span class="value fw-bold text-primary">${s.carrierReceiptNumber || '-'}</span></div>
                <div class="view-field"><span class="label">Assigned Date:</span><span class="value">${s.carrierAssignedDate ? new Date(s.carrierAssignedDate).toLocaleString() : '-'}</span></div>
            </div>
        </div>
        ` : ''}

        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-box-seam me-2"></i>Shipment Details</h6>
            <div class="view-grid">
                <div class="view-field"><span class="label">Pieces:</span><span class="value">${s.shipment?.pieces || '-'}</span></div>
                <div class="view-field"><span class="label">Weight:</span><span class="value">${s.shipment?.weight || 0} KG</span></div>
                <div class="view-field"><span class="label">Chargeable Weight:</span><span class="value fw-bold text-primary">${s.shipment?.chargeableWeight || 0} KG</span></div>
                <div class="view-field"><span class="label">Type:</span><span class="value">${s.shipment?.shipmentType || '-'}</span></div>
                <div class="view-field"><span class="label">Contents:</span><span class="value">${s.shipment?.contents || '-'}</span></div>
                <div class="view-field"><span class="label">Grand Total:</span><span class="value fw-bold">PKR ${parseFloat(s.grandTotal || 0).toFixed(2)}</span></div>
            </div>
        </div>
    `;
}

// ============================================
// 🔥 PRINT FUNCTIONS
// ============================================
// ============================================
// 🔥 PRINT SHIPMENT (TWO-SECTION: AWB + PI)
// ============================================


// ============================================
// 🔥 PRINT SHIPMENT (TWO PAGES: AWB + PI)
// ============================================
window.printShipment = async function(shipmentId) {
    try {
        console.log("🖨️ Loading shipment for printing:", shipmentId);
        
        const shipment = await FirebaseDB.get(`shipments/${shipmentId}`);
        if (!shipment) return showErrorModal('Shipment not found');

        let tcContent = 'Terms & Conditions not configured';
        try {
            const terms = await FirebaseDB.getList('systemSettings/termsAndConditions');
            const activeTC = terms.find(t => t.status === 'Active') || terms[0];
            if (activeTC) tcContent = activeTC.contentText || activeTC.content || tcContent;
        } catch (e) {
            console.warn("⚠️ Could not load T&C:", e);
        }

        let undertakingContent = 'Undertaking not configured';
        try {
            const undertakings = await FirebaseDB.getList('systemSettings/undertakings');
            const activeUnd = undertakings.find(u => u.status === 'Active') || undertakings[0];
            if (activeUnd) undertakingContent = activeUnd.contentText || activeUnd.content || undertakingContent;
        } catch (e) {
            console.warn("⚠️ Could not load Undertaking:", e);
        }

        const printContent = buildTwoPagePrintContent(shipment, tcContent, undertakingContent);
        
        const printWindow = window.open('', '', 'width=900,height=1100');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 600);
        
    } catch (error) {
        console.error("❌ Error printing shipment:", error);
        showErrorModal('Failed to print: ' + error.message);
    }
};

// ============================================
// 🔥 BUILD TWO-PAGE PRINT CONTENT
// ============================================
function buildTwoPagePrintContent(s, tcContent, undertakingContent) {
    const items = s.items || [];
    const itemsRows = items.map(item => `
        <tr>
            <td class="it-sno">${item.sno}</td>
            <td class="it-name">${item.name || '-'}</td>
            <td class="it-hs">${item.hsCode || '-'}</td>
            <td class="it-origin">${item.origin || 'Pakistan'}</td>
            <td class="it-qty">${item.quantity}</td>
            <td class="it-unit">${parseFloat(item.unitValue || 0).toFixed(2)}</td>
            <td class="it-sub">${parseFloat(item.subtotal || 0).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <title>AWB: ${s.awbNumber} | PI: ${s.piNumber}</title>
    <style>
        /* ===== PAGE SETUP ===== */
        @page {
            size: A4 portrait;
            margin: 12mm;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 10pt;
            color: #000;
            line-height: 1.4;
            background: #fff;
        }
        
        /* ===== PAGE CONTAINER ===== */
        .page {
            width: 100%;
            min-height: 100vh;
            padding: 0;
            position: relative;
            page-break-after: always;
        }
        
        .page:last-child {
            page-break-after: auto;
        }
        
        /* ===== COMPANY HEADER ===== */
        .company-header {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        
        .company-header h1 {
            font-size: 22pt;
            font-weight: 900;
            letter-spacing: 2px;
            margin-bottom: 3px;
        }
        
        .company-header .tagline {
            font-size: 9pt;
            font-style: italic;
            color: #444;
        }
        
        .doc-type {
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
        
        /* ===== DOCUMENT NUMBER BOX ===== */
        .number-box {
            border: 2px solid #000;
            padding: 10px 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .number-box .num-block {
            flex: 1;
        }
        
        .number-box .num-label {
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #555;
        }
        
        .number-box .num-value {
            font-size: 20pt;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            margin-top: 2px;
        }
        
        .number-box .date-info {
            font-size: 9pt;
            text-align: right;
            line-height: 1.6;
        }
        
        .number-box .date-info strong {
            display: inline-block;
            min-width: 90px;
            text-align: left;
        }
        
        /* ===== SECTION TITLE ===== */
        .sec-title {
            border-bottom: 2px solid #000;
            padding: 5px 10px;
            font-size: 10pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 12px 0 8px 0;
            background: #f0f0f0;
        }
        
        /* ===== TWO COLUMN LAYOUT ===== */
        .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 10px;
        }
        
        .col-box {
            border: 1px solid #000;
            padding: 8px 10px;
        }
        
        .col-box-title {
            font-size: 9pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            margin-bottom: 5px;
        }
        
        /* ===== DETAILS GRID ===== */
        .details {
            font-size: 9pt;
        }
        
        .detail-row {
            display: flex;
            padding: 3px 0;
            border-bottom: 1px dotted #999;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-row .lbl {
            font-weight: 700;
            min-width: 80px;
            font-size: 8pt;
            text-transform: uppercase;
            color: #333;
        }
        
        .detail-row .val {
            flex: 1;
            font-weight: 600;
            word-break: break-word;
        }
        
        /* ===== SHIPMENT INFO ROW ===== */
        .info-row {
            display: flex;
            border: 1px solid #000;
            margin-bottom: 10px;
        }
        
        .info-cell {
            flex: 1;
            padding: 6px 10px;
            border-right: 1px solid #000;
            text-align: center;
        }
        
        .info-cell:last-child {
            border-right: none;
        }
        
        .info-cell .info-label {
            font-size: 7pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #555;
            letter-spacing: 0.5px;
        }
        
        .info-cell .info-value {
            font-size: 11pt;
            font-weight: 900;
            margin-top: 2px;
        }
        
        /* ===== CHARGES TABLE ===== */
        .charges-tbl {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-top: 5px;
        }
        
        .charges-tbl th {
            background: #000;
            color: #fff;
            padding: 6px 8px;
            text-align: left;
            font-size: 8pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid #000;
        }
        
        .charges-tbl td {
            padding: 5px 8px;
            border: 1px solid #000;
        }
        
        .charges-tbl .amt {
            text-align: right;
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }
        
        .charges-tbl .total-row {
            background: #e5e5e5;
            font-weight: 700;
        }
        
        .charges-tbl .grand-row {
            background: #000;
            color: #fff;
            font-size: 11pt;
            font-weight: 900;
        }
        
        .charges-tbl .grand-row td {
            border-color: #000;
        }
        
        /* ===== LEGAL BOX ===== */
        .legal-box {
            border: 1px solid #000;
            padding: 8px 10px;
            margin-top: 10px;
            font-size: 8pt;
            line-height: 1.4;
        }
        
        .legal-box-title {
            font-weight: 900;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            margin-bottom: 5px;
        }
        
        /* ===== ITEMS TABLE ===== */
        .items-tbl {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-top: 5px;
        }
        
        .items-tbl th {
            background: #000;
            color: #fff;
            padding: 6px 8px;
            text-align: left;
            font-size: 8pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid #000;
        }
        
        .items-tbl td {
            padding: 5px 8px;
            border: 1px solid #000;
        }
        
        .items-tbl tr:nth-child(even) {
            background: #f5f5f5;
        }
        
        .items-tbl .it-sno {
            text-align: center;
            width: 35px;
            font-weight: 700;
        }
        
        .items-tbl .it-qty,
        .items-tbl .it-unit,
        .items-tbl .it-sub {
            text-align: right;
            font-family: 'Courier New', monospace;
        }
        
        .items-tbl tfoot {
            background: #e5e5e5;
            font-weight: 700;
        }
        
        .items-tbl tfoot td {
            border: 1px solid #000;
        }
        
        /* ===== SIGNATURE SECTION ===== */
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            gap: 60px;
        }
        
        .sig-box {
            flex: 1;
            text-align: center;
        }
        
        .sig-line {
            border-top: 1.5px solid #000;
            margin-bottom: 5px;
            padding-top: 3px;
            min-height: 40px;
        }
        
        .sig-label {
            font-size: 9pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .sig-sub {
            font-size: 8pt;
            color: #555;
            margin-top: 2px;
        }
        
        /* ===== PAGE FOOTER ===== */
        .page-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 7pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 4px;
        }
        
        /* ===== PAGE NUMBER INDICATOR ===== */
        .page-indicator {
            text-align: right;
            font-size: 8pt;
            font-weight: 700;
            margin-bottom: 5px;
            color: #555;
        }
        
        /* ===== PRINT STYLES ===== */
        @media print {
            body { margin: 0; padding: 0; }
            .page {
                page-break-after: always;
                page-break-inside: avoid;
            }
            .page:last-child {
                page-break-after: auto;
            }
        }
    </style>
</head>
<body>
    
    <!-- ============================================ -->
    <!-- 🔥 PAGE 1: AIR WAYBILL (AWB)                 -->
    <!-- ============================================ -->
    <div class="page">
        
        <div class="page-indicator">PAGE 1 OF 2</div>
        
        <!-- Company Header -->
        <div class="company-header">
            <h1>REX WORLDWIDE COURIER</h1>
            <div class="tagline">Trusted Global Courier & Logistics Partner</div>
            <div class="doc-type">AIR WAYBILL</div>
        </div>
        
        <!-- AWB Number Box -->
        <div class="number-box">
            <div class="num-block">
                <div class="num-label">AWB Number</div>
                <div class="num-value">${s.awbNumber || '-'}</div>
            </div>
            <div class="date-info">
                <strong>Booking Date:</strong> ${formatPrintDate(s.bookingDate)}<br>
                <strong>Status:</strong> ${s.status || 'Booked'}<br>
                <strong>Payment:</strong> ${s.paymentMode || '-'}
            </div>
        </div>
        
        <!-- Shipper + Consignee -->
        <div class="two-col">
            <div class="col-box">
                <div class="col-box-title">Shipper (Sender)</div>
                <div class="details">
                    <div class="detail-row"><span class="lbl">Name:</span><span class="val">${s.shipper?.name || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Company:</span><span class="val">${s.shipper?.company || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Contact:</span><span class="val">${s.shipper?.contact || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">City:</span><span class="val">${s.shipper?.city || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Country:</span><span class="val">${s.shipper?.country || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">CNIC:</span><span class="val">${s.shipper?.cnic || '-'}</span></div>
                    ${s.accountNumber ? `<div class="detail-row"><span class="lbl">Account #:</span><span class="val">${s.accountNumber}</span></div>` : ''}
                </div>
            </div>
            <div class="col-box">
                <div class="col-box-title">Consignee (Receiver)</div>
                <div class="details">
                    <div class="detail-row"><span class="lbl">Name:</span><span class="val">${s.consignee?.name || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Company:</span><span class="val">${s.consignee?.company || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Contact:</span><span class="val">${s.consignee?.contact || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Destination:</span><span class="val">${s.consignee?.destination || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">City:</span><span class="val">${s.consignee?.city || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Country:</span><span class="val">${s.consignee?.country || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Address:</span><span class="val">${s.consignee?.address || '-'}</span></div>
                </div>
            </div>
        </div>
        
        <!-- Shipment Info Row -->
        <div class="info-row">
            <div class="info-cell">
                <div class="info-label">Pieces</div>
                <div class="info-value">${s.shipment?.pieces || '-'}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Actual Weight</div>
                <div class="info-value">${s.shipment?.weight || 0} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Chargeable Weight</div>
                <div class="info-value">${s.shipment?.chargeableWeight || 0} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Shipment Type</div>
                <div class="info-value">${s.shipment?.shipmentType || '-'}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Service</div>
                <div class="info-value">${s.serviceType || '-'}</div>
            </div>
        </div>
        
        <!-- Contents -->
        <div class="detail-row" style="border: 1px solid #000; padding: 5px 10px; margin-bottom: 10px;">
            <span class="lbl">Contents:</span>
            <span class="val">${s.shipment?.contents || '-'}</span>
        </div>
        
        <!-- Charges Summary -->
        <div class="sec-title">Charges Summary</div>
        <table class="charges-tbl">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align:right; width: 140px;">Amount (PKR)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Base Shipment Charges</td>
                    <td class="amt">${parseFloat(s.shipmentCharges || 0).toFixed(2)}</td>
                </tr>
                ${(s.additionalCharges || []).map(ch => `
                    <tr>
                        <td>${ch.chargeName || 'Additional Charge'}</td>
                        <td class="amt">${parseFloat(ch.amount || 0).toFixed(2)}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td><strong>Subtotal</strong></td>
                    <td class="amt"><strong>${parseFloat(s.subtotal || 0).toFixed(2)}</strong></td>
                </tr>
                ${(s.taxes || []).map(tax => `
                    <tr>
                        <td>${tax.name} (${tax.rate}%)</td>
                        <td class="amt">${parseFloat(tax.amount || 0).toFixed(2)}</td>
                    </tr>
                `).join('')}
                <tr class="grand-row">
                    <td>GRAND TOTAL</td>
                    <td class="amt">PKR ${parseFloat(s.grandTotal || 0).toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
        
        <!-- Undertaking -->
        <div class="legal-box">
            <div class="legal-box-title">Undertaking Declaration</div>
            <div>${undertakingContent}</div>
        </div>
        
        <div class="page-footer">
            REX WORLDWIDE COURIER - Air Waybill | AWB: ${s.awbNumber || '-'} | Page 1 of 2
        </div>
        
    </div>
    
    <!-- ============================================ -->
    <!-- 🔥 PAGE 2: PROFORMA INVOICE (PI)             -->
    <!-- ============================================ -->
    <div class="page">
        
        <div class="page-indicator">PAGE 2 OF 2</div>
        
        <!-- Company Header -->
        <div class="company-header">
            <h1>REX WORLDWIDE COURIER</h1>
            <div class="tagline">Trusted Global Courier & Logistics Partner</div>
            <div class="doc-type">PROFORMA INVOICE</div>
        </div>
        
        <!-- PI Number Box -->
        <div class="number-box">
            <div class="num-block">
                <div class="num-label">PI Number</div>
                <div class="num-value">${s.piNumber || '-'}</div>
            </div>
            <div class="date-info">
                <strong>Booking Date:</strong> ${formatPrintDate(s.bookingDate)}<br>
                <strong>AWB Reference:</strong> ${s.awbNumber || '-'}
            </div>
        </div>
        
        <!-- Shipper + Consignee (Limited) -->
        <div class="two-col">
            <div class="col-box">
                <div class="col-box-title">Shipper</div>
                <div class="details">
                    <div class="detail-row"><span class="lbl">Name:</span><span class="val">${s.shipper?.name || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Company:</span><span class="val">${s.shipper?.company || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Contact:</span><span class="val">${s.shipper?.contact || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">City:</span><span class="val">${s.shipper?.city || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Country:</span><span class="val">${s.shipper?.country || '-'}</span></div>
                </div>
            </div>
            <div class="col-box">
                <div class="col-box-title">Consignee</div>
                <div class="details">
                    <div class="detail-row"><span class="lbl">Name:</span><span class="val">${s.consignee?.name || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Company:</span><span class="val">${s.consignee?.company || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Contact:</span><span class="val">${s.consignee?.contact || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Destination:</span><span class="val">${s.consignee?.destination || '-'}</span></div>
                    <div class="detail-row"><span class="lbl">Country:</span><span class="val">${s.consignee?.country || '-'}</span></div>
                </div>
            </div>
        </div>
        
        <!-- Shipment Info (Weight Only) -->
        <div class="info-row">
            <div class="info-cell">
                <div class="info-label">Pieces</div>
                <div class="info-value">${s.shipment?.pieces || '-'}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Actual Weight</div>
                <div class="info-value">${s.shipment?.weight || 0} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Chargeable Weight</div>
                <div class="info-value">${s.shipment?.chargeableWeight || 0} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Shipment Type</div>
                <div class="info-value">${s.shipment?.shipmentType || '-'}</div>
            </div>
        </div>
        
        <!-- Items Table -->
        <div class="sec-title">Items Details</div>
        ${items.length > 0 ? `
        <table class="items-tbl">
            <thead>
                <tr>
                    <th class="it-sno">S.No</th>
                    <th>Item / Goods Description</th>
                    <th>HS Code</th>
                    <th>Country of Origin</th>
                    <th class="it-qty">Qty</th>
                    <th class="it-unit">Unit Value (USD)</th>
                    <th class="it-sub">Sub Total (USD)</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6" style="text-align:right;"><strong>Items Sub Total:</strong></td>
                    <td class="it-sub"><strong>${parseFloat(s.itemsSubtotalUSD || 0).toFixed(2)}</strong></td>
                </tr>
            </tfoot>
        </table>
        ` : `
        <div style="text-align:center; padding: 20px; border: 1px dashed #999; font-style: italic; color: #666;">
            No items recorded
        </div>
        `}
        
        <!-- Terms & Conditions -->
        <div class="legal-box">
            <div class="legal-box-title">Terms & Conditions</div>
            <div>${tcContent}</div>
        </div>
        
        <!-- Signatures -->
        <div class="signatures">
            <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-label">Shipper Signature</div>
                <div class="sig-sub">Name: _________________________</div>
                <div class="sig-sub">Date: _________________________</div>
            </div>
            <div class="sig-box">
                <div class="sig-line"></div>
                <div class="sig-label">Authorized Signature</div>
                <div class="sig-sub">REX Worldwide Courier</div>
                <div class="sig-sub">Date: _________________________</div>
            </div>
        </div>
        
        <div class="page-footer">
            Generated: ${new Date().toLocaleString()} | REX WORLDWIDE COURIER - Proforma Invoice | PI: ${s.piNumber || '-'} | Page 2 of 2
        </div>
        
    </div>
    
</body>
</html>
    `;
}

// ============================================
// 🔥 HELPER: FORMAT DATE FOR PRINT
// ============================================
function formatPrintDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}


window.printStatusReport = async function(shipmentId) {
    try {
        const shipment = await FirebaseDB.get(`shipments/${shipmentId}`);
        if (!shipment) return showErrorModal('Shipment not found');

        const printContent = buildStatusPrintContent(shipment);
        const printWindow = window.open('', '', 'width=900,height=700');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    } catch (error) {
        console.error("❌ Error printing status report:", error);
        showErrorModal('Failed to print status report: ' + error.message);
    }
};

function buildAWBPrintContent(s) {
    const items = s.items || [];
    const itemsRows = items.map(item => `
        <tr>
            <td>${item.sno}</td>
            <td>${item.name || '-'}</td>
            <td>${item.hsCode || '-'}</td>
            <td>${item.origin || '-'}</td>
            <td>${item.quantity}</td>
            <td>${parseFloat(item.unitValue || 0).toFixed(2)}</td>
            <td>${parseFloat(item.subtotal || 0).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>AWB: ${s.awbNumber} | PI: ${s.piNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; color: #1A1A1A; }
                .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 1rem; margin-bottom: 2rem; }
                .header h1 { color: #dc2626; margin: 0; font-size: 2rem; }
                .header p { margin: 0.25rem 0 0; color: #6b7280; }
                .numbers { display: flex; justify-content: space-around; background: #f3f4f6; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
                .number-box { text-align: center; }
                .number-box .label { font-size: 0.85rem; color: #6b7280; display: block; }
                .number-box .value { font-size: 1.3rem; font-weight: 700; color: #dc2626; font-family: monospace; }
                .section { margin-bottom: 1.5rem; }
                .section h3 { background: #dc2626; color: white; padding: 0.5rem 1rem; margin: 0 0 0.5rem 0; border-radius: 4px; font-size: 1rem; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
                .field { padding: 0.25rem 0; }
                .field .label { font-size: 0.8rem; color: #6b7280; }
                .field .value { font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
                th, td { border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; font-size: 0.85rem; }
                th { background: #f3f4f6; }
                .total-box { background: #fef3c7; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: right; }
                .total-box .grand { font-size: 1.5rem; font-weight: 700; color: #dc2626; }
                .signature { margin-top: 3rem; text-align: center; }
                .signature-line { border-top: 2px solid #000; width: 300px; margin: 0 auto 0.5rem; }
                @media print { body { padding: 0.5rem; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>REX WORLDWIDE COURIER</h1>
                <p>Air Waybill / Proforma Invoice</p>
            </div>
            <div class="numbers">
                <div class="number-box"><span class="label">AWB Number</span><span class="value">${s.awbNumber || '-'}</span></div>
                <div class="number-box"><span class="label">PI Number</span><span class="value">${s.piNumber || '-'}</span></div>
                <div class="number-box"><span class="label">Booking Date</span><span class="value">${s.bookingDate || '-'}</span></div>
                <div class="number-box"><span class="label">Status</span><span class="value">${s.status || 'Booked'}</span></div>
            </div>
            <div class="section">
                <h3>Shipper Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Name</div><div class="value">${s.shipper?.name || '-'}</div></div>
                    <div class="field"><div class="label">Company</div><div class="value">${s.shipper?.company || '-'}</div></div>
                    <div class="field"><div class="label">City</div><div class="value">${s.shipper?.city || '-'}</div></div>
                    <div class="field"><div class="label">Country</div><div class="value">${s.shipper?.country || '-'}</div></div>
                    <div class="field"><div class="label">Contact</div><div class="value">${s.shipper?.contact || '-'}</div></div>
                    <div class="field"><div class="label">CNIC</div><div class="value">${s.shipper?.cnic || '-'}</div></div>
                </div>
            </div>
            <div class="section">
                <h3>Consignee Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Name</div><div class="value">${s.consignee?.name || '-'}</div></div>
                    <div class="field"><div class="label">Company</div><div class="value">${s.consignee?.company || '-'}</div></div>
                    <div class="field"><div class="label">Destination</div><div class="value">${s.consignee?.destination || '-'}</div></div>
                    <div class="field"><div class="label">City</div><div class="value">${s.consignee?.city || '-'}</div></div>
                    <div class="field"><div class="label">Country</div><div class="value">${s.consignee?.country || '-'}</div></div>
                    <div class="field"><div class="label">Contact</div><div class="value">${s.consignee?.contact || '-'}</div></div>
                </div>
                <div class="field"><div class="label">Address</div><div class="value">${s.consignee?.address || '-'}</div></div>
            </div>
            <div class="section">
                <h3>Shipment Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Pieces</div><div class="value">${s.shipment?.pieces || '-'}</div></div>
                    <div class="field"><div class="label">Weight</div><div class="value">${s.shipment?.weight || 0} KG</div></div>
                    <div class="field"><div class="label">Chargeable Weight</div><div class="value">${s.shipment?.chargeableWeight || 0} KG</div></div>
                    <div class="field"><div class="label">Type</div><div class="value">${s.shipment?.shipmentType || '-'}</div></div>
                    <div class="field"><div class="label">Carrier</div><div class="value">${s.carrierName || 'Not Assigned'}</div></div>
                </div>
            </div>
            ${items.length > 0 ? `
            <div class="section">
                <h3>Items</h3>
                <table>
                    <thead><tr><th>S.No</th><th>Item</th><th>HS Code</th><th>Origin</th><th>Qty</th><th>Unit (USD)</th><th>Sub Total (USD)</th></tr></thead>
                    <tbody>${itemsRows}</tbody>
                    <tfoot><tr><td colspan="6" style="text-align:right;font-weight:bold;">Items Sub Total:</td><td style="font-weight:bold;">${parseFloat(s.itemsSubtotalUSD || 0).toFixed(2)} USD</td></tr></tfoot>
                </table>
            </div>
            ` : ''}
            <div class="total-box">
                <div>Subtotal: PKR ${parseFloat(s.subtotal || 0).toFixed(2)}</div>
                <div>Tax: PKR ${parseFloat(s.taxAmount || 0).toFixed(2)}</div>
                <div class="grand">GRAND TOTAL: PKR ${parseFloat(s.grandTotal || 0).toFixed(2)}</div>
            </div>
            <div class="signature">
                <div class="signature-line"></div>
                <p>Shipper Signature</p>
            </div>
        </body>
        </html>
    `;
}

function buildStatusPrintContent(s) {
    const status = s.status || 'Booked';
    const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['Booked'];
    
    const history = s.statusHistory || [{
        status: 'Booked',
        date: s.bookingDate,
        changedBy: s.createdByEmail || s.createdBy,
        changedAt: s.createdAt
    }];
    
    let timelineRows = '';
    history.forEach((entry, index) => {
        const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG['Booked'];
        const isCurrent = index === history.length - 1;
        
        timelineRows += `
            <tr ${isCurrent ? 'style="background:#fef3c7;font-weight:bold;"' : ''}>
                <td>${index + 1}</td>
                <td>${config.label}</td>
                <td>${entry.date || '-'}</td>
                <td>${entry.time || '-'}</td>
                <td>${entry.carrierName || '-'}</td>
                <td>${entry.reason || '-'}</td>
                <td>${entry.deliveredTo || '-'}</td>
                <td>${entry.changedBy || '-'}</td>
            </tr>
        `;
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Status Report - AWB: ${s.awbNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; color: #1A1A1A; }
                .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 1rem; margin-bottom: 2rem; }
                .header h1 { color: #dc2626; margin: 0; font-size: 1.8rem; }
                .header p { margin: 0.25rem 0 0; color: #6b7280; }
                .status-banner { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 1.5rem; border-radius: 10px; text-align: center; margin-bottom: 1.5rem; }
                .status-banner .awb { font-size: 2rem; font-weight: 700; font-family: monospace; letter-spacing: 2px; }
                .status-banner .status { font-size: 1.5rem; margin-top: 0.5rem; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
                .info-box { background: #f3f4f6; padding: 1rem; border-radius: 8px; }
                .info-box .label { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; font-weight: 600; }
                .info-box .value { font-size: 1rem; font-weight: 600; margin-top: 0.25rem; }
                .section { margin-bottom: 1.5rem; }
                .section h3 { background: #dc2626; color: white; padding: 0.5rem 1rem; margin: 0 0 0.5rem 0; border-radius: 4px; font-size: 1rem; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
                .field { padding: 0.25rem 0; }
                .field .label { font-size: 0.8rem; color: #6b7280; }
                .field .value { font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
                th, td { border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; font-size: 0.85rem; }
                th { background: #f3f4f6; font-weight: 600; }
                .footer { margin-top: 3rem; text-align: center; font-size: 0.85rem; color: #6b7280; }
                .signature { margin-top: 3rem; display: flex; justify-content: space-around; }
                .signature-box { text-align: center; width: 250px; }
                .signature-line { border-top: 2px solid #000; width: 100%; margin-bottom: 0.5rem; }
                @media print { body { padding: 0.5rem; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>REX WORLDWIDE COURIER</h1>
                <p>Shipment Status Report</p>
            </div>
            <div class="status-banner">
                <div class="awb">${s.awbNumber || '-'}</div>
                <div class="status">Current Status: ${statusConfig.label}</div>
            </div>
            <div class="info-grid">
                <div class="info-box"><div class="label">PI Number</div><div class="value">${s.piNumber || '-'}</div></div>
                <div class="info-box"><div class="label">Booking Date</div><div class="value">${s.bookingDate || '-'}</div></div>
                <div class="info-box"><div class="label">Carrier</div><div class="value">${s.carrierName || 'Not Assigned'}</div></div>
            </div>
            <div class="section">
                <h3>Shipper</h3>
                <div class="grid">
                    <div class="field"><div class="label">Name</div><div class="value">${s.shipper?.name || '-'}</div></div>
                    <div class="field"><div class="label">Contact</div><div class="value">${s.shipper?.contact || '-'}</div></div>
                    <div class="field"><div class="label">City</div><div class="value">${s.shipper?.city || '-'}</div></div>
                    <div class="field"><div class="label">Country</div><div class="value">${s.shipper?.country || '-'}</div></div>
                </div>
            </div>
            <div class="section">
                <h3>Consignee</h3>
                <div class="grid">
                    <div class="field"><div class="label">Name</div><div class="value">${s.consignee?.name || '-'}</div></div>
                    <div class="field"><div class="label">Contact</div><div class="value">${s.consignee?.contact || '-'}</div></div>
                    <div class="field"><div class="label">Destination</div><div class="value">${s.consignee?.destination || '-'}</div></div>
                    <div class="field"><div class="label">City / Country</div><div class="value">${s.consignee?.city || '-'}, ${s.consignee?.country || '-'}</div></div>
                </div>
                <div class="field"><div class="label">Address</div><div class="value">${s.consignee?.address || '-'}</div></div>
            </div>
            <div class="section">
                <h3>Shipment Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Pieces</div><div class="value">${s.shipment?.pieces || '-'}</div></div>
                    <div class="field"><div class="label">Weight</div><div class="value">${s.shipment?.weight || 0} KG</div></div>
                    <div class="field"><div class="label">Chargeable Weight</div><div class="value">${s.shipment?.chargeableWeight || 0} KG</div></div>
                    <div class="field"><div class="label">Service Type</div><div class="value">${s.serviceType || '-'}</div></div>
                </div>
            </div>
            <div class="section">
                <h3>Status History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th><th>Status</th><th>Date</th><th>Time</th><th>Carrier</th><th>Reason</th><th>Delivered To</th><th>Updated By</th>
                        </tr>
                    </thead>
                    <tbody>${timelineRows}</tbody>
                </table>
            </div>
            <div class="signature">
                <div class="signature-box"><div class="signature-line"></div><p>Prepared By</p></div>
                <div class="signature-box"><div class="signature-line"></div><p>Authorized Signature</p></div>
            </div>
            <div class="footer">
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p>REX WORLDWIDE COURIER - Tracking Report</p>
            </div>
        </body>
        </html>
    `;
}

// ============================================
// 🔥 HELPERS
// ============================================
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function showErrorModal(message) {
    $('#trackingErrorMessage').html(message);
    new bootstrap.Modal(document.getElementById('trackingErrorModal')).show();
}

function debounce(func, wait) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => func(...args), wait);
    };
}

// Success modal close handlers
$(document).ready(function() {
    $('#btnCloseStatusSuccess').off('click').on('click', function() {
        safeHideModal('statusUpdateSuccessModal');
    });
});