// assets/js/billinggenerationview.js - COMPLETE BILLING LOGIC
import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

// Global state
let accountCustomers = [];
let previewData = []; // Array of {customer, shipments, total}
let selectedShipments = new Set(); // Set of shipment IDs

window.initBillingGenerationView = function() {
    console.log("🚀 [billinggenerationview.js] initBillingGenerationView() executed");
    
    setDefaultDates();
    setupEventHandlers();
    loadAccountCustomers();
};

// ============================================
// 🔥 SET DEFAULT DATES (Last 30 days)
// ============================================
function setDefaultDates() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    $('#billToDate').val(today.toISOString().split('T')[0]);
    $('#billFromDate').val(thirtyDaysAgo.toISOString().split('T')[0]);
}

// ============================================
// 🔥 LOAD ACCOUNT CUSTOMERS
// ============================================
async function loadAccountCustomers() {
    try {
        const customers = await FirebaseDB.getList('customers');
        accountCustomers = customers.filter(c => 
            c.customerType === 'Account' && c.status === 'Active'
        );
        
        const $select = $('#specificCustomer').empty();
        $select.append('<option value="" disabled selected>Select Customer</option>');
        accountCustomers.forEach(c => {
            $select.append(`<option value="${c.id}" data-name="${c.customerName}" data-account="${c.accountNumber}">${c.customerName} (${c.accountNumber})</option>`);
        });
        
        console.log("✅ Loaded", accountCustomers.length, "account customers");
    } catch (error) {
        console.error("❌ Error loading customers:", error);
        showErrorModal('Failed to load customers: ' + error.message);
    }
}

// ============================================
// 🔥 EVENT HANDLERS
// ============================================
function setupEventHandlers() {
    // Customer scope toggle
    $('input[name="customerScope"]').on('change', function() {
        const scope = $(this).val();
        if (scope === 'specific') {
            $('#specificCustomerWrapper').removeClass('d-none');
        } else {
            $('#specificCustomerWrapper').addClass('d-none');
        }
    });
    
    // Quick date buttons
    $('.quick-date').on('click', function() {
        const days = $(this).data('days');
        const month = $(this).data('month');
        const today = new Date();
        
        if (days) {
            const fromDate = new Date();
            fromDate.setDate(today.getDate() - days);
            $('#billFromDate').val(fromDate.toISOString().split('T')[0]);
            $('#billToDate').val(today.toISOString().split('T')[0]);
        } else if (month === 'current') {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            $('#billFromDate').val(firstDay.toISOString().split('T')[0]);
            $('#billToDate').val(today.toISOString().split('T')[0]);
        } else if (month === 'last') {
            const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
            $('#billFromDate').val(firstDay.toISOString().split('T')[0]);
            $('#billToDate').val(lastDay.toISOString().split('T')[0]);
        }
    });
    
    // Preview button
    $('#btnPreviewShipments').on('click', previewUnbilledShipments);
    
    // Reset button
    $('#btnResetConfig').on('click', function() {
        setDefaultDates();
        $('#scopeAll').prop('checked', true);
        $('#specificCustomerWrapper').addClass('d-none');
        $('#specificCustomer').val('');
        $('.status-filter').prop('checked', false);
        $('#statusDelivered').prop('checked', true);
        $('#excludeBilled').prop('checked', true);
        resetPreview();
    });
    
    // Select all per customer
    $(document).on('change', '.customer-select-all', function() {
        const customerId = $(this).data('customer-id');
        const checked = $(this).is(':checked');
        $(`.shipment-checkbox[data-customer-id="${customerId}"]`).prop('checked', checked).trigger('change');
    });
    
    // Individual shipment selection
    $(document).on('change', '.shipment-checkbox', function() {
        const shipmentId = $(this).data('shipment-id');
        const customerId = $(this).data('customer-id');
        
        if ($(this).is(':checked')) {
            selectedShipments.add(shipmentId);
            $(this).closest('.shipment-row').addClass('selected');
        } else {
            selectedShipments.delete(shipmentId);
            $(this).closest('.shipment-row').removeClass('selected');
        }
        
        updateCustomerGroupSelection(customerId);
        updateSelectionStats();
    });
    
    // Select all button
    $('#btnSelectAll').on('click', function() {
        const allCheckboxes = $('.shipment-checkbox');
        const allChecked = allCheckboxes.length === allCheckboxes.filter(':checked').length;
        
        allCheckboxes.prop('checked', !allChecked).trigger('change');
        $('.customer-select-all').prop('checked', !allChecked);
    });
    
    // Generate bills button
    $('#btnGenerateBills').on('click', showGenerateConfirmation);
    
    // Confirm generate
    $('#btnConfirmGenerate').on('click', generateBills);
    
    // Success modal buttons
    $('#btnNewBilling').on('click', function() {
        safeHideModal('billingSuccessModal');
        setTimeout(() => {
            resetPreview();
            setDefaultDates();
        }, 400);
    });
    
    $('#btnViewBills').on('click', function() {
        safeHideModal('billingSuccessModal');
        setTimeout(() => loadView('billinglist'), 400);
    });
}

// ============================================
// 🔥 PREVIEW UNBILLED SHIPMENTS
// ============================================
async function previewUnbilledShipments() {
    const fromDate = $('#billFromDate').val();
    const toDate = $('#billToDate').val();
    const scope = $('input[name="customerScope"]:checked').val();
    const specificCustomerId = $('#specificCustomer').val();
    const selectedStatuses = $('.status-filter:checked').map((_, el) => $(el).val()).get();
    const excludeBilled = $('#excludeBilled').is(':checked');
    
    // Validation
    const errors = [];
    if (!fromDate) errors.push('From Date is required');
    if (!toDate) errors.push('To Date is required');
    if (fromDate && toDate && fromDate > toDate) errors.push('From Date cannot be after To Date');
    if (scope === 'specific' && !specificCustomerId) errors.push('Please select a customer');
    if (selectedStatuses.length === 0) errors.push('Please select at least one shipment status');
    
    if (errors.length > 0) {
        showErrorModal('<strong>Please fix:</strong><br>' + errors.join('<br>'));
        return;
    }
    
    const $btn = $('#btnPreviewShipments');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');
    
    // Show loading
    $('#previewContent').html(`
        <div class="loading-preview">
            <div class="spinner-border" role="status"></div>
            <p>Searching for unbilled shipments...</p>
        </div>
    `);
    $('#previewStats').removeClass('d-none');
    
    try {
        // Get all shipments
        const shipments = await FirebaseDB.getList('shipments');
        
        // Filter shipments
        let filteredShipments = shipments.filter(s => {
            // Must be Credit payment (not Cash)
            if (s.paymentMode !== 'Credit') return false;
            
            // Must be within date range
            if (s.bookingDate < fromDate || s.bookingDate > toDate) return false;
            
            // Must match selected status
            if (!selectedStatuses.includes(s.status)) return false;
            
            // Exclude already billed if checked
            if (excludeBilled && s.billingStatus === 'Billed') return false;
            
            // Customer filter
            if (scope === 'specific') {
                // Match by account number or customer linkage
                const selectedCustomer = accountCustomers.find(c => c.id === specificCustomerId);
                if (!selectedCustomer) return false;
                if (s.accountNumber !== selectedCustomer.accountNumber) return false;
            } else {
                // Must have account number (credit customer)
                if (!s.accountNumber) return false;
            }
            
            return true;
        });
        
        console.log("📊 Found", filteredShipments.length, "unbilled shipments");
        
        if (filteredShipments.length === 0) {
            showNoShipmentsState();
            updateStats([], 0, 0);
            return;
        }
        
        // Group by customer
        const customerMap = {};
        filteredShipments.forEach(s => {
            const accountNo = s.accountNumber;
            if (!customerMap[accountNo]) {
                const customer = accountCustomers.find(c => c.accountNumber === accountNo);
                if (!customer) return;
                customerMap[accountNo] = {
                    customer: customer,
                    shipments: [],
                    total: 0
                };
            }
            customerMap[accountNo].shipments.push(s);
            customerMap[accountNo].total += parseFloat(s.grandTotal || 0);
        });
        
        previewData = Object.values(customerMap);
        selectedShipments = new Set();
        
        renderPreview();
        updateStats(previewData, filteredShipments.length, filteredShipments.reduce((sum, s) => sum + parseFloat(s.grandTotal || 0), 0));
        
    } catch (error) {
        console.error("❌ Error previewing shipments:", error);
        $('#previewContent').html(`
            <div class="no-shipments-state">
                <i class="bi bi-exclamation-triangle"></i>
                <h5>Error Loading Shipments</h5>
                <p>${error.message}</p>
            </div>
        `);
        showErrorModal('Failed to preview shipments: ' + error.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

// ============================================
// 🔥 RENDER PREVIEW
// ============================================
function renderPreview() {
    if (previewData.length === 0) {
        showNoShipmentsState();
        return;
    }
    
    let html = '';
    previewData.forEach(group => {
        const c = group.customer;
        html += `
            <div class="customer-bill-group" data-customer-id="${c.id}">
                <div class="customer-bill-header">
                    <div class="customer-bill-info">
                        <h6>
                            <i class="bi bi-person-circle text-primary"></i>
                            ${c.customerName}
                            <span class="account-no">${c.accountNumber}</span>
                        </h6>
                        <small>
                            ${group.shipments.length} shipment${group.shipments.length > 1 ? 's' : ''} • 
                            ${c.contactNumber || c.email || 'No contact'}
                        </small>
                    </div>
                    <div class="customer-bill-totals">
                        <div class="bill-total-badge">
                            <small>Shipments:</small> <strong>${group.shipments.length}</strong>
                        </div>
                        <div class="bill-total-badge total">
                            <small>Total:</small> <strong>PKR ${group.total.toFixed(2)}</strong>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input customer-select-all" type="checkbox" data-customer-id="${c.id}">
                            <label class="form-check-label small">Select All</label>
                        </div>
                    </div>
                </div>
                <div class="shipments-list">
                    ${group.shipments.map(s => renderShipmentRow(s, c.id)).join('')}
                </div>
            </div>
        `;
    });
    
    $('#previewContent').html(html);
    $('#previewActions').removeClass('d-none');
    updateSelectionStats();
}

function renderShipmentRow(s, customerId) {
    const isSelected = selectedShipments.has(s.id);
    return `
        <div class="shipment-row ${isSelected ? 'selected' : ''}" data-shipment-id="${s.id}">
            <div class="form-check">
                <input class="form-check-input shipment-checkbox" type="checkbox" 
                       data-shipment-id="${s.id}" data-customer-id="${customerId}"
                       ${isSelected ? 'checked' : ''}>
            </div>
            <div class="shipment-info">
                <div>
                    <div class="shipment-awb">${s.awbNumber}</div>
                    <div class="shipment-date">${formatDate(s.bookingDate)}</div>
                </div>
                <div class="shipment-destination">
                    <i class="bi bi-geo-alt me-1"></i>
                    ${s.consignee?.destination || s.consignee?.city || '-'}
                </div>
                <div>
                    <span class="shipment-status ${s.status}">${s.status}</span>
                </div>
                <div class="shipment-amount">
                    PKR ${parseFloat(s.grandTotal || 0).toFixed(2)}
                </div>
            </div>
        </div>
    `;
}

function showNoShipmentsState() {
    $('#previewContent').html(`
        <div class="no-shipments-state">
            <i class="bi bi-inbox"></i>
            <h5>No Unbilled Shipments Found</h5>
            <p>There are no shipments matching your criteria. Try adjusting the date range or filters.</p>
        </div>
    `);
    $('#previewActions').addClass('d-none');
}

function resetPreview() {
    previewData = [];
    selectedShipments = new Set();
    $('#previewContent').html(`
        <div class="empty-preview-state">
            <i class="bi bi-inbox"></i>
            <h5>No Preview Available</h5>
            <p>Configure your bill settings and click <strong>"Preview Unbilled Shipments"</strong> to see available shipments for billing.</p>
        </div>
    `);
    $('#previewStats').addClass('d-none');
    $('#previewActions').addClass('d-none');
}

// ============================================
// 🔥 UPDATE STATS
// ============================================
function updateStats(data, totalShipments, totalAmount) {
    $('#statCustomers').text(data.length);
    $('#statShipments').text(totalShipments);
    $('#statTotalAmount').text('PKR ' + totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    updateSelectionStats();
}

function updateSelectionStats() {
    const count = selectedShipments.size;
    $('#statSelected').text(count);
    $('#selectedCount').text(count);
    
    if (count > 0) {
        $('#btnGenerateBills').prop('disabled', false);
    } else {
        $('#btnGenerateBills').prop('disabled', true);
    }
}

function updateCustomerGroupSelection(customerId) {
    const $group = $(`.customer-bill-group[data-customer-id="${customerId}"]`);
    const total = $group.find('.shipment-checkbox').length;
    const checked = $group.find('.shipment-checkbox:checked').length;
    
    if (checked > 0) {
        $group.addClass('has-selection');
    } else {
        $group.removeClass('has-selection');
    }
    
    $group.find('.customer-select-all').prop('checked', checked === total);
}

// ============================================
// 🔥 SHOW GENERATE CONFIRMATION
// ============================================
function showGenerateConfirmation() {
    if (selectedShipments.size === 0) {
        showErrorModal('Please select at least one shipment to generate bills');
        return;
    }
    
    // Group selected shipments by customer
    const billsToGenerate = [];
    previewData.forEach(group => {
        const selectedForCustomer = group.shipments.filter(s => selectedShipments.has(s.id));
        if (selectedForCustomer.length > 0) {
            billsToGenerate.push({
                customer: group.customer,
                shipments: selectedForCustomer,
                total: selectedForCustomer.reduce((sum, s) => sum + parseFloat(s.grandTotal || 0), 0)
            });
        }
    });
    
    // Render confirmation
    let html = '';
    let totalShipments = 0;
    let grandTotal = 0;
    
    billsToGenerate.forEach(bill => {
        totalShipments += bill.shipments.length;
        grandTotal += bill.total;
        
        html += `
            <div class="confirm-bill-item">
                <div>
                    <div class="customer-name">
                        <i class="bi bi-person-circle me-1"></i>
                        ${bill.customer.customerName}
                    </div>
                    <div class="customer-meta">${bill.customer.accountNumber}</div>
                </div>
                <div class="bill-details">
                    <div class="shipment-count">${bill.shipments.length} shipment${bill.shipments.length > 1 ? 's' : ''}</div>
                    <div class="bill-amount">PKR ${bill.total.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
    
    $('#confirmBillsList').html(html);
    $('#confirmTotalBills').text(billsToGenerate.length);
    $('#confirmTotalShipments').text(totalShipments);
    $('#confirmTotalAmount').text('PKR ' + grandTotal.toFixed(2));
    
    // Store for actual generation
    window.billsToGenerate = billsToGenerate;
    
    new bootstrap.Modal(document.getElementById('generateConfirmModal')).show();
}

// ============================================
// 🔥 GENERATE BILLS (ACTUAL SAVE)
// ============================================
async function generateBills() {
    const billsToGenerate = window.billsToGenerate || [];
    
    if (billsToGenerate.length === 0) {
        showErrorModal('No bills to generate');
        return;
    }
    
    const $btn = $('#btnConfirmGenerate');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');
    
    try {
        const adminUser = FirebaseAuth.getCurrentUser();
        if (!adminUser) throw new Error('Session expired. Please login again.');
        
        const fromDate = $('#billFromDate').val();
        const toDate = $('#billToDate').val();
        const generatedAt = new Date().toISOString();
        
        let totalBillsCreated = 0;
        let totalShipmentsBilled = 0;
        let totalAmountBilled = 0;
        const createdBillNumbers = [];
        
        // Process each customer bill
        for (const billData of billsToGenerate) {
            // Generate unique bill number
            const billNumber = await FirebaseDB.getNextBillNumber();
            
            // Build bill document
            const billDocument = {
                billNumber: billNumber,
                billDate: new Date().toISOString().split('T')[0],
                generatedAt: generatedAt,
                generatedBy: adminUser.uid,
                generatedByEmail: adminUser.email,
                
                // Bill period
                billPeriod: {
                    from: fromDate,
                    to: toDate
                },
                
                // Customer
                customerId: billData.customer.id,
                customerName: billData.customer.customerName,
                customerAccountNumber: billData.customer.accountNumber,
                customerEmail: billData.customer.email || '',
                customerContact: billData.customer.contactNumber || '',
                
                // Shipments
                shipmentIds: billData.shipments.map(s => s.id),
                shipmentCount: billData.shipments.length,
                shipments: billData.shipments.map(s => ({
                    shipmentId: s.id,
                    awbNumber: s.awbNumber,
                    piNumber: s.piNumber,
                    bookingDate: s.bookingDate,
                    destination: s.consignee?.destination || s.consignee?.city || '',
                    country: s.consignee?.country || '',
                    weight: s.shipment?.chargeableWeight || s.shipment?.weight || 0,
                    pieces: s.shipment?.pieces || 0,
                    shipmentCharges: parseFloat(s.shipmentCharges || 0),
                    taxAmount: parseFloat(s.taxAmount || 0),
                    grandTotal: parseFloat(s.grandTotal || 0)
                })),
                
                // Amounts
                subtotal: billData.shipments.reduce((sum, s) => sum + parseFloat(s.shipmentCharges || 0), 0),
                taxAmount: billData.shipments.reduce((sum, s) => sum + parseFloat(s.taxAmount || 0), 0),
                grandTotal: billData.total,
                
                // Payment tracking
                paidAmount: 0,
                outstandingAmount: billData.total,
                paymentStatus: 'Unpaid', // Unpaid, Partial, Paid
                
                // Metadata
                status: 'Active', // Active, Void
                notes: '',
                lastUpdated: generatedAt
            };
            
            // Save bill
            await FirebaseDB.push('bills', billDocument);
            totalBillsCreated++;
            totalShipmentsBilled += billData.shipments.length;
            totalAmountBilled += billData.total;
            createdBillNumbers.push(billNumber);
            
            // Update each shipment as "Billed"
            for (const shipment of billData.shipments) {
                await FirebaseDB.update(`shipments/${shipment.id}`, {
                    billingStatus: 'Billed',
                    billedAt: generatedAt,
                    billNumber: billNumber,
                    billId: billDocument.id || null, // Will be set by push
                    lastUpdated: generatedAt
                });
            }
            
            console.log(`✅ Bill generated: ${billNumber} for ${billData.customer.customerName}`);
        }
        
        // Show success
        $('#successMessage').text(`Successfully generated ${totalBillsCreated} bill${totalBillsCreated > 1 ? 's' : ''}. All shipments have been marked as billed.`);
        $('#successBillCount').text(totalBillsCreated);
        $('#successShipmentCount').text(totalShipmentsBilled);
        $('#successAmount').text('PKR ' + totalAmountBilled.toFixed(2));
        
        safeHideModal('generateConfirmModal');
        setTimeout(() => {
            new bootstrap.Modal(document.getElementById('billingSuccessModal')).show();
        }, 400);
        
        console.log("✅ All bills generated successfully");
        
    } catch (error) {
        console.error("❌ Error generating bills:", error);
        showErrorModal('Failed to generate bills: ' + error.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

// ============================================
// 🔥 HELPERS
// ============================================
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function showErrorModal(message) {
    $('#billingErrorMessage').html(message);
    new bootstrap.Modal(document.getElementById('billingErrorModal')).show();
}

function safeHideModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;
    
    try {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        if (modal) modal.hide();
    } catch (e) {
        console.warn("⚠️ Modal hide error:", e);
    }
    
    setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
    }, 350);
}