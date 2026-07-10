// assets/js/bookinglistview.js - COMPLETE BOOKING LIST MANAGEMENT
import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

// Global state
let allBookings = [];
let filteredBookings = [];
let currentPage = 1;
let itemsPerPage = 50;
let currentBookingId = null;

window.initBookingListView = function() {
    console.log("🚀 [bookinglistview.js] initBookingListView() executed successfully!");
    
    setupFilters();
    setupPagination();
    setupViewModal();
    setupEditModal();
    loadBookings();
};

// ============================================
// 🔥 LOAD BOOKINGS
// ============================================
async function loadBookings() {
    try {
        console.log("📥 Fetching bookings from Firebase...");
        const bookings = await FirebaseDB.getList('shipments');
        allBookings = Array.isArray(bookings) ? bookings : [];
        
        // Sort by createdAt descending (newest first)
        allBookings.sort((a, b) => {
            const dateA = a.createdAt || '';
            const dateB = b.createdAt || '';
            return dateB.localeCompare(dateA);
        });
        
        console.log("✅ Loaded", allBookings.length, "bookings");
        
        updateStats();
        applyFilters();
    } catch (error) {
        console.error("❌ Error loading bookings:", error);
        showEditErrorModal('Failed to load bookings: ' + error.message);
    }
}

// ============================================
// 🔥 STATS
// ============================================
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const total = allBookings.length;
    const todayCount = allBookings.filter(b => b.bookingDate === today).length;
    const bookedCount = allBookings.filter(b => b.status === 'Booked').length;
    const deliveredCount = allBookings.filter(b => b.status === 'Delivered').length;
    
    $('#statTotal').text(total);
    $('#statToday').text(todayCount);
    $('#statBooked').text(bookedCount);
    $('#statDelivered').text(deliveredCount);
}

// ============================================
// 🔥 FILTERS
// ============================================
function setupFilters() {
    $('#searchInput').on('input', debounce(applyFilters, 300));
    $('#filterStatus, #filterServiceType, #filterCustomerType').on('change', applyFilters);
    $('#filterDateFrom, #filterDateTo').on('change', applyFilters);
    
    $('#btnClearFilters').on('click', function() {
        $('#searchInput, #filterStatus, #filterServiceType, #filterCustomerType, #filterDateFrom, #filterDateTo').val('');
        applyFilters();
    });
}

function applyFilters() {
    const search = $('#searchInput').val().toLowerCase().trim();
    const status = $('#filterStatus').val();
    const serviceType = $('#filterServiceType').val();
    const customerType = $('#filterCustomerType').val();
    const dateFrom = $('#filterDateFrom').val();
    const dateTo = $('#filterDateTo').val();

    filteredBookings = allBookings.filter(b => {
        // Search (AWB, PI, customer name, destination)
        if (search) {
            const searchFields = [
                b.awbNumber, b.piNumber, 
                b.shipper?.name, b.consignee?.name,
                b.consignee?.destination, b.consignee?.city,
                b.accountNumber
            ].map(f => (f || '').toLowerCase());
            if (!searchFields.some(f => f.includes(search))) return false;
        }

        // Status
        if (status && b.status !== status) return false;

        // Service Type
        if (serviceType && b.serviceType !== serviceType) return false;

        // Customer Type
        if (customerType && b.customerType !== customerType) return false;

        // Date Range
        if (dateFrom && b.bookingDate && b.bookingDate < dateFrom) return false;
        if (dateTo && b.bookingDate && b.bookingDate > dateTo) return false;

        return true;
    });

    currentPage = 1;
    renderTable();
    renderPagination();
}

// ============================================
// 🔥 RENDER TABLE
// ============================================
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageBookings = filteredBookings.slice(start, end);

    $('#showingFrom').text(filteredBookings.length > 0 ? start + 1 : 0);
    $('#showingTo').text(Math.min(end, filteredBookings.length));
    $('#showingTotal').text(filteredBookings.length);

    const $tbody = $('#bookingTableBody').empty();

    if (pageBookings.length === 0) {
        $tbody.html(`
            <tr>
                <td colspan="9" class="text-center py-5">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i>
                    <p class="mt-3 text-muted">No bookings found</p>
                </td>
            </tr>
        `);
        return;
    }

    pageBookings.forEach(b => {
        const awb = b.awbNumber || '-';
        const pi = b.piNumber || '-';
        const date = b.bookingDate ? formatDate(b.bookingDate) : '-';
        const customerName = b.shipper?.name || '-';
        const customerType = b.customerType || 'Cash';
        const destination = b.consignee?.destination || b.consignee?.city || '-';
        const destinationCountry = b.consignee?.country || '';
        const serviceType = b.serviceType || '-';
        const weight = b.shipment?.chargeableWeight || b.shipment?.weight || 0;
        const total = b.grandTotal || 0;
        const status = b.status || 'Booked';

        // AWB/PI Cell
        const awbPiCell = `
            <div class="awb-pi-cell">
                <span class="awb-number">${awb}</span>
                <span class="pi-number">PI: ${pi}</span>
            </div>
        `;

        // Customer Cell
        const customerCell = `
            <div class="customer-cell">
                <span class="customer-name">${customerName}</span>
                <span class="customer-type-badge ${customerType.toLowerCase()}">${customerType}</span>
            </div>
        `;

        // Destination Cell
        const destinationCell = `
            <div class="destination-cell">
                <span class="destination-city">${destination}</span>
                ${destinationCountry ? `<span class="destination-country">${destinationCountry}</span>` : ''}
            </div>
        `;

        // Service Badge
        const serviceClass = serviceType.toLowerCase().replace(' ', '-');
        const serviceIcon = serviceType === 'International' ? 'bi-globe' : 'bi-geo-alt';
        const serviceBadge = `<span class="service-badge service-${serviceClass}"><i class="bi ${serviceIcon}"></i> ${serviceType}</span>`;

        // Status Badge
        const statusClass = status.toLowerCase().replace(' ', '-');
        let statusIcon = 'bi-clock';
        if (status === 'Delivered') statusIcon = 'bi-check-circle-fill';
        else if (status === 'In Transit') statusIcon = 'bi-truck';
        else if (status === 'Picked Up') statusIcon = 'bi-box-arrow-up';
        else if (status === 'Cancelled') statusIcon = 'bi-x-circle-fill';
        else if (status === 'Draft') statusIcon = 'bi-pencil';
        
        const statusBadge = `<span class="status-badge status-${statusClass}"><i class="bi ${statusIcon}"></i> ${status}</span>`;

        const row = `
            <tr>
                <td class="ps-4">${awbPiCell}</td>
                <td><small>${date}</small></td>
                <td>${customerCell}</td>
                <td>${destinationCell}</td>
                <td>${serviceBadge}</td>
                <td>${weight} KG</td>
                <td class="amount-cell">PKR ${total.toFixed(2)}</td>
                <td>${statusBadge}</td>
                <td class="text-center pe-4">
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewBooking('${b.id}')" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="editBooking('${b.id}')" title="Edit Booking">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn-action btn-print" onclick="printBooking('${b.id}')" title="Print AWB/PI">
                            <i class="bi bi-printer"></i>
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
    $('#itemsPerPage').on('change', function() {
        itemsPerPage = parseInt($(this).val());
        currentPage = 1;
        renderTable();
        renderPagination();
    });
}

function renderPagination() {
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
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

    $c.find('.page-link').on('click', function(e) {
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
// 🔥 VIEW BOOKING MODAL
// ============================================
function setupViewModal() {
    $('#btnEditFromView').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('viewBookingModal')).hide();
        setTimeout(() => editBooking(currentBookingId), 300);
    });
    
    $('#btnPrintFromView').on('click', function() {
        if (currentBookingId) printBooking(currentBookingId);
    });
}

window.viewBooking = async function(bookingId) {
    try {
        const booking = await FirebaseDB.get(`shipments/${bookingId}`);
        if (!booking) return showEditErrorModal('Booking not found');

        currentBookingId = bookingId;
        
        const content = buildViewContent(booking);
        $('#viewBookingContent').html(content);
        
        new bootstrap.Modal(document.getElementById('viewBookingModal')).show();
    } catch (error) {
        console.error("❌ Error loading booking:", error);
        showEditErrorModal('Failed to load booking: ' + error.message);
    }
};

function buildViewContent(b) {
    // Items table
    let itemsHtml = '';
    if (b.items && b.items.length > 0) {
        itemsHtml = `
            <table class="table table-sm table-bordered view-items-table">
                <thead class="table-light">
                    <tr>
                        <th>S.No</th>
                        <th>Item</th>
                        <th>HS Code</th>
                        <th>Origin</th>
                        <th>Qty</th>
                        <th>Unit (USD)</th>
                        <th>Sub Total (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    ${b.items.map(item => `
                        <tr>
                            <td>${item.sno}</td>
                            <td>${item.name || '-'}</td>
                            <td>${item.hsCode || '-'}</td>
                            <td>${item.origin || '-'}</td>
                            <td>${item.quantity}</td>
                            <td>${parseFloat(item.unitValue || 0).toFixed(2)}</td>
                            <td>${parseFloat(item.subtotal || 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr class="table-primary">
                        <td colspan="6" class="text-end fw-bold">Items Sub Total:</td>
                        <td class="fw-bold">${parseFloat(b.itemsSubtotalUSD || 0).toFixed(2)} USD</td>
                    </tr>
                </tfoot>
            </table>
        `;
    } else {
        itemsHtml = '<p class="text-muted">No items recorded</p>';
    }

    // Additional charges
    let additionalChargesHtml = '';
    if (b.additionalCharges && b.additionalCharges.length > 0) {
        b.additionalCharges.forEach(charge => {
            additionalChargesHtml += `
                <div class="view-charge-row">
                    <span>${charge.chargeName}:</span>
                    <span>PKR ${parseFloat(charge.amount || 0).toFixed(2)}</span>
                </div>
            `;
        });
    }

    // Taxes
    let taxesHtml = '';
    if (b.taxes && b.taxes.length > 0) {
        b.taxes.forEach(tax => {
            taxesHtml += `
                <div class="view-charge-row">
                    <span>${tax.name} (${tax.rate}%):</span>
                    <span>PKR ${parseFloat(tax.amount || 0).toFixed(2)}</span>
                </div>
            `;
        });
    }

    return `
        <!-- Booking Numbers -->
        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-hash me-2"></i>Booking Information</h6>
            <div class="view-numbers-grid">
                <div class="view-number-box">
                    <span class="label">AWB Number</span>
                    <span class="value">${b.awbNumber || '-'}</span>
                </div>
                <div class="view-number-box">
                    <span class="label">PI Number</span>
                    <span class="value">${b.piNumber || '-'}</span>
                </div>
                <div class="view-number-box">
                    <span class="label">Booking Date</span>
                    <span class="value">${b.bookingDate || '-'}</span>
                </div>
                <div class="view-number-box">
                    <span class="label">Service Type</span>
                    <span class="value">${b.serviceType || '-'}</span>
                </div>
                <div class="view-number-box">
                    <span class="label">Status</span>
                    <span class="value">${b.status || 'Booked'}</span>
                </div>
                <div class="view-number-box">
                    <span class="label">Payment Mode</span>
                    <span class="value">${b.paymentMode || '-'}</span>
                </div>
            </div>
        </div>

        <!-- Shipper -->
        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-person-badge me-2"></i>Shipper Details</h6>
            <div class="view-grid">
                <div class="view-field"><span class="label">Name:</span><span class="value">${b.shipper?.name || '-'}</span></div>
                <div class="view-field"><span class="label">Company:</span><span class="value">${b.shipper?.company || '-'}</span></div>
                <div class="view-field"><span class="label">City:</span><span class="value">${b.shipper?.city || '-'}</span></div>
                <div class="view-field"><span class="label">Country:</span><span class="value">${b.shipper?.country || '-'}</span></div>
                <div class="view-field"><span class="label">Contact:</span><span class="value">${b.shipper?.contact || '-'}</span></div>
                <div class="view-field"><span class="label">Email:</span><span class="value">${b.shipper?.email || '-'}</span></div>
                <div class="view-field"><span class="label">CNIC:</span><span class="value">${b.shipper?.cnic || '-'}</span></div>
                <div class="view-field"><span class="label">NTN:</span><span class="value">${b.shipper?.ntn || '-'}</span></div>
            </div>
        </div>

        <!-- Consignee -->
        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-geo-alt me-2"></i>Consignee Details</h6>
            <div class="view-grid">
                <div class="view-field"><span class="label">Name:</span><span class="value">${b.consignee?.name || '-'}</span></div>
                <div class="view-field"><span class="label">Company:</span><span class="value">${b.consignee?.company || '-'}</span></div>
                <div class="view-field"><span class="label">Destination:</span><span class="value">${b.consignee?.destination || '-'}</span></div>
                <div class="view-field"><span class="label">City:</span><span class="value">${b.consignee?.city || '-'}</span></div>
                <div class="view-field"><span class="label">Country:</span><span class="value">${b.consignee?.country || '-'}</span></div>
                <div class="view-field"><span class="label">Contact:</span><span class="value">${b.consignee?.contact || '-'}</span></div>
                <div class="view-field"><span class="label">Email:</span><span class="value">${b.consignee?.email || '-'}</span></div>
                <div class="view-field"><span class="label">Postal Code:</span><span class="value">${b.consignee?.postalCode || '-'}</span></div>
            </div>
            <div class="view-field mt-2"><span class="label">Address:</span><span class="value">${b.consignee?.address || '-'}</span></div>
        </div>

        <!-- Shipment -->
        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-box-seam me-2"></i>Shipment Details</h6>
            <div class="view-grid">
                <div class="view-field"><span class="label">Pieces:</span><span class="value">${b.shipment?.pieces || '-'}</span></div>
                <div class="view-field"><span class="label">Weight:</span><span class="value">${b.shipment?.weight || 0} KG</span></div>
                <div class="view-field"><span class="label">Dimensions:</span><span class="value">${b.shipment?.dimensions?.length || 0} × ${b.shipment?.dimensions?.width || 0} × ${b.shipment?.dimensions?.height || 0} CM</span></div>
                <div class="view-field"><span class="label">Volumetric Weight:</span><span class="value">${b.shipment?.volumetricWeight || 0} KG</span></div>
                <div class="view-field"><span class="label">Chargeable Weight:</span><span class="value fw-bold text-primary">${b.shipment?.chargeableWeight || 0} KG</span></div>
                <div class="view-field"><span class="label">Shipment Type:</span><span class="value">${b.shipment?.shipmentType || '-'}</span></div>
                <div class="view-field"><span class="label">Contents:</span><span class="value">${b.shipment?.contents || '-'}</span></div>
            </div>
        </div>

        <!-- Items -->
        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-list-columns-reverse me-2"></i>Items (${(b.items || []).length})</h6>
            ${itemsHtml}
        </div>

        <!-- Charges -->
        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-calculator me-2"></i>Charges & Taxes</h6>
            <div class="view-charges-box">
                <div class="view-charge-row">
                    <span>Base Shipment Charges:</span>
                    <span>PKR ${parseFloat(b.shipmentCharges || 0).toFixed(2)}</span>
                </div>
                ${additionalChargesHtml}
                <div class="view-charge-row subtotal">
                    <span>Subtotal:</span>
                    <span>PKR ${parseFloat(b.subtotal || 0).toFixed(2)}</span>
                </div>
                ${taxesHtml}
                <div class="view-charge-row grand-total">
                    <span>GRAND TOTAL:</span>
                    <span>PKR ${parseFloat(b.grandTotal || 0).toFixed(2)}</span>
                </div>
            </div>
        </div>

        <!-- Metadata -->
        <div class="view-section">
            <h6 class="view-section-title"><i class="bi bi-clock-history me-2"></i>Metadata</h6>
            <div class="view-grid">
                <div class="view-field"><span class="label">Created:</span><span class="value">${b.createdAt ? new Date(b.createdAt).toLocaleString() : '-'}</span></div>
                <div class="view-field"><span class="label">Last Updated:</span><span class="value">${b.lastUpdated ? new Date(b.lastUpdated).toLocaleString() : '-'}</span></div>
                <div class="view-field"><span class="label">Created By:</span><span class="value">${b.createdByEmail || b.createdBy || '-'}</span></div>
            </div>
        </div>
    `;
}

// ============================================
// 🔥 EDIT BOOKING MODAL
// ============================================
function setupEditModal() {
    $('#btnSaveBookingEdit').on('click', saveBookingEdit);
    $('#btnCloseEditSuccess').on('click', () => {
        bootstrap.Modal.getInstance(document.getElementById('bookingEditSuccessModal')).hide();
        loadBookings(); // Refresh list
    });
}

window.editBooking = async function(bookingId) {
    try {
        const booking = await FirebaseDB.get(`shipments/${bookingId}`);
        if (!booking) return showEditErrorModal('Booking not found');

        currentBookingId = bookingId;

        // Populate form
        $('#editBookingId').val(bookingId);
        $('#editAWB').val(booking.awbNumber || '');
        $('#editPI').val(booking.piNumber || '');
        $('#editBookingDate').val(booking.bookingDate || '');
        $('#editStatus').val(booking.status || 'Booked');
        
        // Shipper
        $('#editShipperName').val(booking.shipper?.name || '');
        $('#editShipperCompany').val(booking.shipper?.company || '');
        $('#editShipperContact').val(booking.shipper?.contact || '');
        $('#editShipperCity').val(booking.shipper?.city || '');
        $('#editShipperCountry').val(booking.shipper?.country || '');
        $('#editShipperCnic').val(booking.shipper?.cnic || '');
        
        // Consignee
        $('#editConsigneeName').val(booking.consignee?.name || '');
        $('#editConsigneeCompany').val(booking.consignee?.company || '');
        $('#editConsigneeContact').val(booking.consignee?.contact || '');
        $('#editDestination').val(booking.consignee?.destination || '');
        $('#editConsigneeCity').val(booking.consignee?.city || '');
        $('#editConsigneeCountry').val(booking.consignee?.country || '');
        $('#editConsigneeAddress').val(booking.consignee?.address || '');
        
        // Shipment
        $('#editPieces').val(booking.shipment?.pieces || 1);
        $('#editWeight').val(booking.shipment?.weight || 0);
        $('#editChargeableWeight').val(booking.shipment?.chargeableWeight || 0);
        $('#editShipmentType').val(booking.shipment?.shipmentType || 'Parcel');
        $('#editServiceType').val(booking.serviceType || 'International');
        $('#editContents').val(booking.shipment?.contents || '');
        
        // Charges
        $('#editShipmentCharges').val(booking.shipmentCharges || 0);
        $('#editTaxAmount').val(booking.taxAmount || 0);
        $('#editGrandTotal').val(booking.grandTotal || 0);
        $('#editPaymentMode').val(booking.paymentMode || 'Cash');
        
        // Notes
        $('#editNotes').val(booking.notes || '');

        new bootstrap.Modal(document.getElementById('editBookingModal')).show();
    } catch (error) {
        console.error("❌ Error loading booking:", error);
        showEditErrorModal('Failed to load booking: ' + error.message);
    }
};

async function saveBookingEdit() {
    const bookingId = $('#editBookingId').val();
    
    // Validation
    const errors = [];
    if (!$('#editShipperName').val().trim()) errors.push('Shipper Name is required');
    if (!$('#editConsigneeName').val().trim()) errors.push('Consignee Name is required');
    if (!$('#editDestination').val().trim()) errors.push('Destination is required');
    if (!$('#editBookingDate').val()) errors.push('Booking Date is required');
    
    if (errors.length > 0) {
        showEditErrorModal('<strong>Please fix:</strong><br>' + errors.join('<br>'));
        return;
    }

    const $btn = $('#btnSaveBookingEdit');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');

    try {
        const updateData = {
            bookingDate: $('#editBookingDate').val(),
            status: $('#editStatus').val(),
            serviceType: $('#editServiceType').val(),
            
            shipper: {
                name: $('#editShipperName').val().trim(),
                company: $('#editShipperCompany').val().trim(),
                contact: $('#editShipperContact').val().trim(),
                city: $('#editShipperCity').val().trim(),
                country: $('#editShipperCountry').val().trim(),
                cnic: $('#editShipperCnic').val().trim()
            },
            
            consignee: {
                name: $('#editConsigneeName').val().trim(),
                company: $('#editConsigneeCompany').val().trim(),
                contact: $('#editConsigneeContact').val().trim(),
                destination: $('#editDestination').val().trim(),
                city: $('#editConsigneeCity').val().trim(),
                country: $('#editConsigneeCountry').val().trim(),
                address: $('#editConsigneeAddress').val().trim()
            },
            
            shipment: {
                pieces: parseInt($('#editPieces').val()) || 1,
                weight: parseFloat($('#editWeight').val()) || 0,
                chargeableWeight: parseFloat($('#editChargeableWeight').val()) || 0,
                shipmentType: $('#editShipmentType').val(),
                contents: $('#editContents').val().trim()
            },
            
            shipmentCharges: parseFloat($('#editShipmentCharges').val()) || 0,
            taxAmount: parseFloat($('#editTaxAmount').val()) || 0,
            grandTotal: parseFloat($('#editGrandTotal').val()) || 0,
            paymentMode: $('#editPaymentMode').val(),
            
            notes: $('#editNotes').val().trim(),
            lastUpdated: new Date().toISOString(),
            updatedBy: FirebaseAuth.getCurrentUser() ? FirebaseAuth.getCurrentUser().uid : 'unknown'
        };

        await FirebaseDB.update(`shipments/${bookingId}`, updateData);
        console.log("✅ Booking updated successfully");

        bootstrap.Modal.getInstance(document.getElementById('editBookingModal')).hide();
        new bootstrap.Modal(document.getElementById('bookingEditSuccessModal')).show();

    } catch (error) {
        console.error("❌ Error updating booking:", error);
        showEditErrorModal('Failed to update booking: ' + error.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

// ============================================
// 🔥 PRINT BOOKING (Opens in new window - placeholder for PDF)
// ============================================
// ============================================
// 🔥 PRINT BOOKING (A4 OPTIMIZED - 2 PAGES WITH BARCODES)
// ============================================
// ============================================
// 🔥 PRINT BOOKING (A4 OPTIMIZED - 2 PAGES WITH BARCODES)
// ============================================
window.printBooking = async function(bookingId) {
    try {
        console.log("🖨️ Loading booking for reprint:", bookingId);
        
        const booking = await FirebaseDB.get(`shipments/${bookingId}`);
        if (!booking) return showEditErrorModal('Booking not found');

        const printContent = buildPrintContent(booking);
        
        const printWindow = window.open('', '', 'width=900,height=1100');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // 🔥 FIX: Use reliable barcode generation with retry logic
        generateBarcodesInPrintWindow(printWindow, booking);
        
    } catch (error) {
        console.error("❌ Error printing booking:", error);
        showEditErrorModal('Failed to print booking: ' + error.message);
    }
};

// ============================================
// 🔥 GENERATE BARCODES IN PRINT WINDOW (RELIABLE)
// ============================================
function generateBarcodesInPrintWindow(printWindow, booking) {
    let attempts = 0;
    const maxAttempts = 20;
    
    function tryGenerateBarcodes() {
        attempts++;
        
        try {
            // Check if JsBarcode is loaded
            if (typeof printWindow.JsBarcode === 'undefined') {
                if (attempts < maxAttempts) {
                    console.log(`⏳ Waiting for JsBarcode to load... (attempt ${attempts}/${maxAttempts})`);
                    setTimeout(tryGenerateBarcodes, 200);
                    return;
                } else {
                    console.error("❌ JsBarcode failed to load after multiple attempts");
                    return;
                }
            }
            
            // Check if SVG elements exist
            const awbSvg = printWindow.document.getElementById('awbBarcode');
            const piSvg = printWindow.document.getElementById('piBarcode');
            
            if (!awbSvg || !piSvg) {
                console.error("❌ Barcode SVG elements not found");
                return;
            }
            
            // Generate AWB Barcode (Page 1)
            printWindow.JsBarcode(awbSvg, booking.awbNumber, {
                format: "CODE128",
                width: 2,
                height: 60,
                displayValue: false,
                margin: 5,
                background: "#ffffff",
                lineColor: "#000000"
            });
            
            // Generate PI Barcode (Page 2)
            printWindow.JsBarcode(piSvg, booking.piNumber, {
                format: "CODE128",
                width: 2,
                height: 60,
                displayValue: false,
                margin: 5,
                background: "#ffffff",
                lineColor: "#000000"
            });
            
            console.log("✅ Barcodes generated successfully");
            
        } catch (error) {
            console.error("❌ Error generating barcodes:", error);
        }
    }
    
    // Start trying after a short delay
    setTimeout(tryGenerateBarcodes, 500);
}



// ============================================
// 🔥 BUILD TWO-PAGE PRINT CONTENT (A4 OPTIMIZED)
// ============================================
function buildPrintContent(b) {
    const items = b.items || [];
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>AWB: ${b.awbNumber} | PI: ${b.piNumber}</title>
    
    <!-- 🔥 LOAD JsBarcode LIBRARY -->
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
    
    <style>
        /* 🔥 A4 PAGE SETUP */
        @page {
            size: A4 portrait;
            margin: 10mm;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 9pt;
            color: #000;
            line-height: 1.3;
            background: #fff;
        }
        
        /* Print Actions (hidden when printing) */
        .print-actions {
            text-align: center;
            margin-bottom: 15px;
            padding: 10px;
            background: #f0f0f0;
            border: 1px dashed #999;
            border-radius: 4px;
        }
        
        .print-actions button {
            background: #000;
            color: #fff;
            border: none;
            padding: 8px 20px;
            font-size: 10pt;
            font-weight: 700;
            cursor: pointer;
            border-radius: 4px;
            margin: 0 3px;
        }
        
        .print-actions button:hover {
            background: #333;
        }
        
        .print-actions .hint {
            font-size: 7pt;
            color: #666;
            margin-top: 5px;
        }
        
        /* 🔥 PAGE CONTAINER - A4 SIZE */
        .page {
            width: 190mm;
            min-height: 277mm;
            max-height: 277mm;
            padding: 0;
            position: relative;
            page-break-after: always;
            overflow: hidden;
        }
        
        .page:last-child {
            page-break-after: auto;
        }
        
        /* Header - Compact */
        .header {
            text-align: center;
            border-bottom: 2px double #000;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        
        .header h1 {
            font-size: 18pt;
            font-weight: 900;
            letter-spacing: 1.5px;
            margin-bottom: 2px;
        }
        
        .header .tagline {
            font-size: 7pt;
            color: #555;
            font-style: italic;
        }
        
        .doc-type {
            display: inline-block;
            border: 1.5px solid #000;
            padding: 3px 15px;
            font-size: 9pt;
            font-weight: 900;
            letter-spacing: 1.5px;
            margin-top: 6px;
            background: #000;
            color: #fff;
        }
        
        /* Barcode Section - Compact */
        .barcode-section {
            text-align: center;
            margin: 10px 0;
            padding: 10px;
            background: #f9f9f9;
            border: 1.5px solid #000;
            border-radius: 6px;
        }
        
        .barcode-label {
            font-size: 7pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #333;
            margin-bottom: 5px;
        }
        
        .barcode-svg {
            width: 100%;
            max-width: 350px;
            height: auto;
            max-height: 70px;
        }
        
        .barcode-number {
            font-size: 12pt;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            letter-spacing: 1.5px;
            margin-top: 5px;
        }
        
        /* Number Box - Compact */
        .number-box {
            border: 1.5px solid #000;
            padding: 8px 12px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9f9f9;
        }
        
        .number-box .num-label {
            font-size: 7pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #555;
        }
        
        .number-box .num-value {
            font-size: 16pt;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            letter-spacing: 1.5px;
            margin-top: 1px;
        }
        
        .number-box .info {
            text-align: right;
            font-size: 8pt;
            line-height: 1.4;
        }
        
        .number-box .info strong {
            display: inline-block;
            min-width: 75px;
            text-align: left;
        }
        
        /* Section */
        .section {
            margin-bottom: 10px;
        }
        
        .section h3 {
            background: #000;
            color: #fff;
            padding: 4px 10px;
            font-size: 8pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        /* Grid - Two Column */
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .col-box {
            border: 1px solid #000;
            padding: 8px 10px;
        }
        
        .col-title {
            font-size: 8pt;
            font-weight: 900;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            margin-bottom: 5px;
        }
        
        .field {
            padding: 2px 0;
            font-size: 8pt;
            border-bottom: 1px dotted #ccc;
        }
        
        .field:last-child {
            border-bottom: none;
        }
        
        .field .label {
            font-weight: 700;
            color: #333;
            font-size: 7pt;
            text-transform: uppercase;
            display: inline-block;
            width: 65px;
        }
        
        .field .value {
            font-weight: 600;
            color: #000;
        }
        
        /* Info Row */
        .info-row {
            display: flex;
            border: 1px solid #000;
            margin-bottom: 10px;
        }
        
        .info-cell {
            flex: 1;
            padding: 5px 8px;
            border-right: 1px solid #000;
            text-align: center;
        }
        
        .info-cell:last-child {
            border-right: none;
        }
        
        .info-cell .info-label {
            font-size: 6pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #555;
        }
        
        .info-cell .info-value {
            font-size: 9pt;
            font-weight: 900;
            margin-top: 2px;
        }
        
        /* Table - Compact */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            margin-top: 3px;
        }
        
        th, td {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: left;
        }
        
        th {
            background: #000;
            color: #fff;
            font-size: 7pt;
            text-transform: uppercase;
            font-weight: 700;
        }
        
        tr:nth-child(even) {
            background: #f5f5f5;
        }
        
        .amt {
            text-align: right;
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }
        
        /* Total Box - Compact */
        .total-box {
            background: #f0f0f0;
            border: 1.5px solid #000;
            padding: 8px 12px;
            margin: 8px 0;
            text-align: right;
            font-size: 8pt;
        }
        
        .total-box .grand {
            font-size: 12pt;
            font-weight: 900;
            margin-top: 3px;
            padding-top: 3px;
            border-top: 1.5px solid #000;
        }
        
        /* Legal Box (Undertaking/T&C) - Compact */
        .legal-box {
            border: 1px solid #000;
            padding: 8px 10px;
            margin-top: 10px;
            font-size: 7.5pt;
            line-height: 1.35;
            background: #fafafa;
        }
        
        .legal-box-title {
            font-weight: 900;
            font-size: 8pt;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            margin-bottom: 5px;
        }
        
        /* Signature - Compact */
        .signature {
            margin-top: 25px;
            display: flex;
            justify-content: space-between;
            gap: 60px;
        }
        
        .sig-box {
            flex: 1;
            text-align: center;
        }
        
        .sig-line {
            border-top: 1.5px solid #000;
            margin-bottom: 3px;
            padding-top: 2px;
            min-height: 35px;
        }
        
        .sig-label {
            font-size: 8pt;
            font-weight: 900;
            text-transform: uppercase;
        }
        
        .sig-sub {
            font-size: 7pt;
            color: #555;
            margin-top: 1px;
        }
        
        /* Footer */
        .page-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding-top: 6px;
            border-top: 1px solid #000;
            text-align: center;
            font-size: 7pt;
            color: #555;
        }
        
        /* 🔥 ITEMS TABLE - SPACE FOR 5-6 ROWS */
        .items-section {
            margin-bottom: 8px;
        }
        
        .items-section table {
            margin-bottom: 0;
        }
        
        .items-section table tbody tr {
            height: 22px;
        }
        
        /* Empty rows for space */
        .empty-row {
            height: 22px;
            background: #fff !important;
        }
        
        .empty-row td {
            border: 1px solid #ddd;
        }
        
        @media print {
            .print-actions { display: none !important; }
            body { margin: 0; padding: 0; }
            .page {
                width: 190mm;
                min-height: 277mm;
                max-height: 277mm;
            }
        }
    </style>
</head>
<body>
    
    <!-- Print Actions (hidden when printing) -->
    <div class="print-actions">
        <button onclick="window.print()">🖨️ Print Document</button>
        <button onclick="window.close()">✕ Close</button>
        <div class="hint">💡 Tip: Select "Save as PDF" to download as PDF file</div>
    </div>
    
    <!-- ============================================ -->
    <!-- 🔥 PAGE 1: AIR WAYBILL (AWB)                 -->
    <!-- ============================================ -->
    <div class="page">
        
        <!-- Header -->
        <div class="header">
            <h1>REX WORLDWIDE COURIER</h1>
            <div class="tagline">Trusted Global Courier & Logistics Partner</div>
            <div class="doc-type">AIR WAYBILL (AWB)</div>
        </div>
        
        <!-- AWB Barcode -->
        <div class="barcode-section">
            <div class="barcode-label">AWB Number</div>
            <svg id="awbBarcode" class="barcode-svg"></svg>
            <div class="barcode-number">${b.awbNumber}</div>
        </div>
        
        <!-- AWB Number Box -->
        <div class="number-box">
            <div>
                <div class="num-label">AWB Number</div>
                <div class="num-value">${b.awbNumber}</div>
            </div>
            <div class="info">
                <strong>Booking Date:</strong> ${b.bookingDate}<br>
                <strong>Service:</strong> ${b.serviceType}<br>
                <strong>Payment:</strong> ${b.paymentMode}
            </div>
        </div>
        
        <!-- Shipper + Consignee -->
        <div class="grid">
            <div class="col-box">
                <div class="col-title">Shipper (Sender)</div>
                <div class="field"><span class="label">Name:</span> <span class="value">${b.shipper?.name || '-'}</span></div>
                <div class="field"><span class="label">Company:</span> <span class="value">${b.shipper?.company || '-'}</span></div>
                <div class="field"><span class="label">Contact:</span> <span class="value">${b.shipper?.contact || '-'}</span></div>
                <div class="field"><span class="label">City:</span> <span class="value">${b.shipper?.city || '-'}</span></div>
                <div class="field"><span class="label">Country:</span> <span class="value">${b.shipper?.country || '-'}</span></div>
                <div class="field"><span class="label">CNIC:</span> <span class="value">${b.shipper?.cnic || '-'}</span></div>
                ${b.accountNumber ? `<div class="field"><span class="label">Account #:</span> <span class="value">${b.accountNumber}</span></div>` : ''}
            </div>
            <div class="col-box">
                <div class="col-title">Consignee (Receiver)</div>
                <div class="field"><span class="label">Name:</span> <span class="value">${b.consignee?.name || '-'}</span></div>
                <div class="field"><span class="label">Company:</span> <span class="value">${b.consignee?.company || '-'}</span></div>
                <div class="field"><span class="label">Contact:</span> <span class="value">${b.consignee?.contact || '-'}</span></div>
                <div class="field"><span class="label">Destination:</span> <span class="value">${b.consignee?.destination || '-'}</span></div>
                <div class="field"><span class="label">City:</span> <span class="value">${b.consignee?.city || '-'}</span></div>
                <div class="field"><span class="label">Country:</span> <span class="value">${b.consignee?.country || '-'}</span></div>
                <div class="field"><span class="label">Address:</span> <span class="value">${b.consignee?.address || '-'}</span></div>
            </div>
        </div>
        
        <!-- Shipment Details -->
        <div class="info-row">
            <div class="info-cell">
                <div class="info-label">Pieces</div>
                <div class="info-value">${b.shipment?.pieces || '-'}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Actual Weight</div>
                <div class="info-value">${b.shipment?.weight || 0} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Chargeable Weight</div>
                <div class="info-value">${b.shipment?.chargeableWeight || 0} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Shipment Type</div>
                <div class="info-value">${b.shipment?.shipmentType || '-'}</div>
            </div>
        </div>
        
        <!-- Charges Summary -->
        <div class="section">
            <h3>Charges Summary</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Base Shipment Charges</td>
                        <td class="amt">PKR ${parseFloat(b.shipmentCharges || 0).toFixed(2)}</td>
                    </tr>
                    ${(b.additionalCharges || []).map(ch => `
                        <tr>
                            <td>${ch.chargeName || 'Additional Charge'}</td>
                            <td class="amt">PKR ${parseFloat(ch.amount || 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr style="background:#e5e5e5; font-weight:700;">
                        <td>Subtotal</td>
                        <td class="amt">PKR ${parseFloat(b.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    ${(b.taxes || []).map(tax => `
                        <tr>
                            <td>${tax.name} (${tax.rate}%)</td>
                            <td class="amt">PKR ${parseFloat(tax.amount || 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Grand Total -->
        <div class="total-box">
            <div>Subtotal: PKR ${parseFloat(b.subtotal || 0).toFixed(2)} | Tax: PKR ${parseFloat(b.taxAmount || 0).toFixed(2)}</div>
            <div class="grand">GRAND TOTAL: PKR ${parseFloat(b.grandTotal || 0).toFixed(2)}</div>
        </div>
        
        <!-- Undertaking (Footer) -->
        <div class="legal-box">
            <div class="legal-box-title">Undertaking Declaration</div>
            <div>
                I/We declare that the information provided above is true and correct. The goods are of Pakistan origin 
                and do not contain any prohibited items (drugs, contraband, cash, passport, antique, or any item 
                unacceptable for carriage). REX Worldwide Courier is not liable for indirect, consequential, or 
                business losses arising from delay, loss, or damage. Sender is responsible for insuring the shipment. 
                Uninsured shipments travel at sender's risk and are subject to limited carrier liability only.
            </div>
        </div>
        
        <!-- Page Footer -->
        <div class="page-footer">
            REX WORLDWIDE COURIER - Air Waybill | AWB: ${b.awbNumber} | Page 1 of 2
        </div>
        
    </div>
    
    <!-- ============================================ -->
    <!-- 🔥 PAGE 2: PROFORMA INVOICE (PI)             -->
    <!-- ============================================ -->
    <div class="page">
        
        <!-- Header -->
        <div class="header">
            <h1>REX WORLDWIDE COURIER</h1>
            <div class="tagline">Trusted Global Courier & Logistics Partner</div>
            <div class="doc-type">PROFORMA INVOICE (PI)</div>
        </div>
        
        <!-- PI Barcode -->
        <div class="barcode-section">
            <div class="barcode-label">PI Number</div>
            <svg id="piBarcode" class="barcode-svg"></svg>
            <div class="barcode-number">${b.piNumber}</div>
        </div>
        
        <!-- PI Number Box -->
        <div class="number-box">
            <div>
                <div class="num-label">PI Number</div>
                <div class="num-value">${b.piNumber}</div>
            </div>
            <div class="info">
                <strong>Booking Date:</strong> ${b.bookingDate}<br>
                <strong>AWB Reference:</strong> ${b.awbNumber}
            </div>
        </div>
        
        <!-- Shipper + Consignee (Limited) -->
        <div class="grid">
            <div class="col-box">
                <div class="col-title">Shipper</div>
                <div class="field"><span class="label">Name:</span> <span class="value">${b.shipper?.name || '-'}</span></div>
                <div class="field"><span class="label">Company:</span> <span class="value">${b.shipper?.company || '-'}</span></div>
                <div class="field"><span class="label">Contact:</span> <span class="value">${b.shipper?.contact || '-'}</span></div>
                <div class="field"><span class="label">City:</span> <span class="value">${b.shipper?.city || '-'}</span></div>
                <div class="field"><span class="label">Country:</span> <span class="value">${b.shipper?.country || '-'}</span></div>
            </div>
            <div class="col-box">
                <div class="col-title">Consignee</div>
                <div class="field"><span class="label">Name:</span> <span class="value">${b.consignee?.name || '-'}</span></div>
                <div class="field"><span class="label">Company:</span> <span class="value">${b.consignee?.company || '-'}</span></div>
                <div class="field"><span class="label">Contact:</span> <span class="value">${b.consignee?.contact || '-'}</span></div>
                <div class="field"><span class="label">Destination:</span> <span class="value">${b.consignee?.destination || '-'}</span></div>
                <div class="field"><span class="label">Country:</span> <span class="value">${b.consignee?.country || '-'}</span></div>
            </div>
        </div>
        
        <!-- Shipment Info (Weight Only) -->
        <div class="info-row">
            <div class="info-cell">
                <div class="info-label">Pieces</div>
                <div class="info-value">${b.shipment?.pieces || '-'}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Actual Weight</div>
                <div class="info-value">${b.shipment?.weight || 0} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Chargeable Weight</div>
                <div class="info-value">${b.shipment?.chargeableWeight || 0} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Shipment Type</div>
                <div class="info-value">${b.shipment?.shipmentType || '-'}</div>
            </div>
        </div>
        
        <!-- Items Table - WITH SPACE FOR 5-6 ROWS -->
        <div class="items-section">
            <div class="section">
                <h3>Items Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th style="width:30px;">S.No</th>
                            <th>Item / Goods Description</th>
                            <th style="width:70px;">HS Code</th>
                            <th style="width:85px;">Country of Origin</th>
                            <th style="width:40px;">Qty</th>
                            <th style="width:75px;">Unit (USD)</th>
                            <th style="width:85px;">Sub Total (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.sno}</td>
                                <td>${item.name || '-'}</td>
                                <td>${item.hsCode || '-'}</td>
                                <td>${item.origin}</td>
                                <td>${item.quantity}</td>
                                <td class="amt">${parseFloat(item.unitValue || 0).toFixed(2)}</td>
                                <td class="amt">${parseFloat(item.subtotal || 0).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        ${(() => {
                            // Add empty rows to make space for 6 rows total
                            const emptyRowsNeeded = Math.max(0, 6 - items.length);
                            let emptyRows = '';
                            for (let i = 0; i < emptyRowsNeeded; i++) {
                                emptyRows += `<tr class="empty-row"><td colspan="7">&nbsp;</td></tr>`;
                            }
                            return emptyRows;
                        })()}
                    </tbody>
                    <tfoot>
                        <tr style="background:#e5e5e5; font-weight:700;">
                            <td colspan="6" style="text-align:right;">Items Sub Total:</td>
                            <td class="amt">${parseFloat(b.itemsSubtotalUSD || 0).toFixed(2)} USD</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        
        <!-- Terms & Conditions (Footer) -->
        <div class="legal-box">
            <div class="legal-box-title">Terms & Conditions</div>
            <div>
                1. Carrier's standard terms and conditions apply and limit the carrier's liability.<br>
                2. The Warsaw Convention may apply to international shipments.<br>
                3. Sender is responsible for insuring the shipment. Uninsured shipments travel at sender's risk.<br>
                4. Destination custom duty, fines, storage charges, and local taxes are payable by receiver.<br>
                5. REX Worldwide Courier is not liable for indirect, consequential, or business losses.<br>
                6. Prohibited items: drugs, contraband, cash, passport, antique, or unacceptable items.<br>
                7. All claims must be submitted within 30 days with proper documentation.<br>
                8. This invoice is valid for customs declaration purposes.
            </div>
        </div>
        
        <!-- Signatures -->
        <div class="signature">
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
        
        <!-- Page Footer -->
        <div class="page-footer">
            Generated: ${new Date().toLocaleString()} | REX WORLDWIDE COURIER - Proforma Invoice | PI: ${b.piNumber} | Page 2 of 2
        </div>
        
    </div>
    
    <!-- 🔥 BARCODE GENERATION SCRIPT -->
    <script>
        window.onload = function() {
            try {
                if (typeof JsBarcode !== 'undefined') {
                    // Generate AWB Barcode (Page 1)
                    JsBarcode("#awbBarcode", "${b.awbNumber}", {
                        format: "CODE128",
                        width: 2,
                        height: 60,
                        displayValue: false,
                        margin: 5,
                        background: "#ffffff",
                        lineColor: "#000000"
                    });
                    
                    // Generate PI Barcode (Page 2)
                    JsBarcode("#piBarcode", "${b.piNumber}", {
                        format: "CODE128",
                        width: 2,
                        height: 60,
                        displayValue: false,
                        margin: 5,
                        background: "#ffffff",
                        lineColor: "#000000"
                    });
                    
                    console.log("✅ Barcodes generated successfully");
                } else {
                    console.error("❌ JsBarcode library not loaded");
                }
            } catch (error) {
                console.error("❌ Error generating barcodes:", error);
            }
        };
    <\/script>
    
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

function showEditErrorModal(message) {
    $('#bookingEditErrorMessage').html(message);
    new bootstrap.Modal(document.getElementById('bookingEditErrorModal')).show();
}

function debounce(func, wait) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => func(...args), wait);
    };
}