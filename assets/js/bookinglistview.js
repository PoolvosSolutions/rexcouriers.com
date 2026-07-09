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
window.printBooking = async function(bookingId) {
    try {
        const booking = await FirebaseDB.get(`shipments/${bookingId}`);
        if (!booking) return showEditErrorModal('Booking not found');

        const printContent = buildPrintContent(booking);
        
        const printWindow = window.open('', '', 'width=900,height=700');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
        
    } catch (error) {
        console.error("❌ Error printing booking:", error);
        showEditErrorModal('Failed to print booking: ' + error.message);
    }
};

function buildPrintContent(b) {
    const items = b.items || [];
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
            <title>AWB: ${b.awbNumber} | PI: ${b.piNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; color: #1A1A1A; }
                .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 1rem; margin-bottom: 2rem; }
                .header h1 { color: #dc2626; margin: 0; font-size: 2rem; }
                .header p { margin: 0.25rem 0 0; color: #6b7280; }
                .numbers { display: flex; justify-content: space-around; background: #f3f4f6; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
                .number-box { text-align: center; }
                .number-box .label { font-size: 0.85rem; color: #6b7280; display: block; }
                .number-box .value { font-size: 1.5rem; font-weight: 700; color: #dc2626; font-family: monospace; }
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
                <div class="number-box"><span class="label">AWB Number</span><span class="value">${b.awbNumber || '-'}</span></div>
                <div class="number-box"><span class="label">PI Number</span><span class="value">${b.piNumber || '-'}</span></div>
                <div class="number-box"><span class="label">Booking Date</span><span class="value">${b.bookingDate || '-'}</span></div>
                <div class="number-box"><span class="label">Status</span><span class="value">${b.status || '-'}</span></div>
            </div>
            
            <div class="section">
                <h3>Shipper Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Name</div><div class="value">${b.shipper?.name || '-'}</div></div>
                    <div class="field"><div class="label">Company</div><div class="value">${b.shipper?.company || '-'}</div></div>
                    <div class="field"><div class="label">City</div><div class="value">${b.shipper?.city || '-'}</div></div>
                    <div class="field"><div class="label">Country</div><div class="value">${b.shipper?.country || '-'}</div></div>
                    <div class="field"><div class="label">Contact</div><div class="value">${b.shipper?.contact || '-'}</div></div>
                    <div class="field"><div class="label">CNIC</div><div class="value">${b.shipper?.cnic || '-'}</div></div>
                </div>
            </div>
            
            <div class="section">
                <h3>Consignee Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Name</div><div class="value">${b.consignee?.name || '-'}</div></div>
                    <div class="field"><div class="label">Company</div><div class="value">${b.consignee?.company || '-'}</div></div>
                    <div class="field"><div class="label">Destination</div><div class="value">${b.consignee?.destination || '-'}</div></div>
                    <div class="field"><div class="label">City</div><div class="value">${b.consignee?.city || '-'}</div></div>
                    <div class="field"><div class="label">Country</div><div class="value">${b.consignee?.country || '-'}</div></div>
                    <div class="field"><div class="label">Contact</div><div class="value">${b.consignee?.contact || '-'}</div></div>
                </div>
                <div class="field"><div class="label">Address</div><div class="value">${b.consignee?.address || '-'}</div></div>
            </div>
            
            <div class="section">
                <h3>Shipment Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Pieces</div><div class="value">${b.shipment?.pieces || '-'}</div></div>
                    <div class="field"><div class="label">Weight</div><div class="value">${b.shipment?.weight || 0} KG</div></div>
                    <div class="field"><div class="label">Chargeable Weight</div><div class="value">${b.shipment?.chargeableWeight || 0} KG</div></div>
                    <div class="field"><div class="label">Type</div><div class="value">${b.shipment?.shipmentType || '-'}</div></div>
                </div>
            </div>
            
            ${items.length > 0 ? `
            <div class="section">
                <h3>Items</h3>
                <table>
                    <thead><tr><th>S.No</th><th>Item</th><th>HS Code</th><th>Origin</th><th>Qty</th><th>Unit (USD)</th><th>Sub Total (USD)</th></tr></thead>
                    <tbody>${itemsRows}</tbody>
                    <tfoot><tr><td colspan="6" style="text-align:right;font-weight:bold;">Items Sub Total:</td><td style="font-weight:bold;">${parseFloat(b.itemsSubtotalUSD || 0).toFixed(2)} USD</td></tr></tfoot>
                </table>
            </div>
            ` : ''}
            
            <div class="total-box">
                <div>Subtotal: PKR ${parseFloat(b.subtotal || 0).toFixed(2)}</div>
                <div>Tax: PKR ${parseFloat(b.taxAmount || 0).toFixed(2)}</div>
                <div class="grand">GRAND TOTAL: PKR ${parseFloat(b.grandTotal || 0).toFixed(2)}</div>
            </div>
            
            <div class="signature">
                <div class="signature-line"></div>
                <p>Shipper Signature</p>
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