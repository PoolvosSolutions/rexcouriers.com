// assets/js/newbookingview.js - FIXED VERSION
import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

// Global state
let countriesData = [];
let chargesList = [];
let taxesList = [];
let tcData = null;
let undertakingData = null;
let itemRowCount = 0;

window.initNewBookingView = function() {
    console.log("🚀 [newbookingview.js] initNewBookingView() executed successfully!");
    
    initializeForm();
    loadCountries();
    loadCharges();
    loadTaxes();
    loadTermsAndUndertaking();
    setupEventHandlers();
    addItemRow();
    setTimeout(calculateWeights, 200);
};

// ============================================
// 🔥 INITIALIZE FORM
// ============================================
async function initializeForm() {
    const today = new Date().toISOString().split('T')[0];
    $('#bookingDate').val(today);
    
    try {
        const awb = await FirebaseDB.peekNextAWBNumber();
        const pi = await FirebaseDB.peekNextPINumber();
        $('#awbNumber').val(awb);
        $('#piNumber').val(pi);
        console.log("✅ AWB (peek):", awb, "PI (peek):", pi);
    } catch (error) {
        console.error("❌ Error generating numbers:", error);
        showErrorModal('Failed to generate booking numbers: ' + error.message);
    }
}

// ============================================
// 🔥 LOAD COUNTRIES
// ============================================
async function loadCountries() {
    try {
        console.log("📥 Fetching countries from Firebase...");
        const countries = await FirebaseDB.getList('countries');
        countriesData = Array.isArray(countries) ? countries : [];
        
        console.log("✅ Loaded", countriesData.length, "countries from Firebase");
        
        const $select = $('#consigneeCountry');
        $select.empty().append('<option value="" disabled selected>Select Country</option>');
        
        countriesData.sort((a, b) => a.name.localeCompare(b.name));
        
        countriesData.forEach(c => {
            $select.append(`<option value="${c.name}">${c.name}</option>`);
        });
        
    } catch (error) {
        console.error("❌ Error loading countries:", error);
        $('#consigneeCountry').html('<option value="">Failed to load countries</option>');
    }
}

// ============================================
// 🔥 LOAD CHARGES
// ============================================
async function loadCharges() {
    try {
        const charges = await FirebaseDB.getList('systemSettings/chargeRules');
        chargesList = charges.filter(c => c.status === 'Active' && c.showOnBooking);
        chargesList.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
        
        renderCharges();
        console.log("✅ Loaded", chargesList.length, "charges");
    } catch (error) {
        console.error("❌ Error loading charges:", error);
        $('#chargesContainer').html('<div class="text-danger">Failed to load charges</div>');
    }
}

function renderCharges() {
    const $container = $('#chargesContainer').empty();
    
    if (chargesList.length === 0) {
        $container.html('<div class="col-12 text-center text-muted py-3">No active charges configured</div>');
        return;
    }
    
    chargesList.forEach((charge, index) => {
        const col = `
            <div class="col-md-6">
                <div class="charge-row" data-charge-id="${charge.id}" data-default="${charge.defaultValue || 0}">
                    <div class="form-check">
                        <input class="form-check-input charge-checkbox" type="checkbox" id="charge_${index}" data-charge-id="${charge.id}">
                    </div>
                    <div class="charge-info">
                        <div class="charge-name">${charge.chargeName}</div>
                        <div class="charge-code">${charge.chargeCode || ''}</div>
                    </div>
                    <div class="charge-input">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">PKR</span>
                            <input type="number" class="form-control charge-amount" disabled 
                                   value="${charge.defaultValue || 0}" min="0" step="0.01">
                        </div>
                    </div>
                </div>
            </div>
        `;
        $container.append(col);
    });
}

// ============================================
// 🔥 LOAD TAXES
// ============================================
async function loadTaxes() {
    try {
        const taxes = await FirebaseDB.getList('systemSettings/taxRates');
        taxesList = taxes.filter(t => t.status === 'Active' && t.showOnBooking);
        taxesList.sort((a, b) => (a.priority || 99) - (b.priority || 99));
        
        renderTaxes();
        console.log("✅ Loaded", taxesList.length, "taxes");
    } catch (error) {
        console.error("❌ Error loading taxes:", error);
        $('#taxContainer').html('<div class="text-danger">Failed to load taxes</div>');
    }
}

function renderTaxes() {
    const $container = $('#taxContainer').empty();
    
    if (taxesList.length === 0) {
        $container.html('<div class="col-12 text-center text-muted py-3">No active taxes configured</div>');
        return;
    }
    
    taxesList.forEach((tax, index) => {
        const col = `
            <div class="col-md-6">
                <div class="tax-row" data-tax-id="${tax.id}" data-rate="${tax.taxRate || 0}">
                    <div class="form-check">
                        <input class="form-check-input tax-checkbox" type="checkbox" id="tax_${index}" data-tax-id="${tax.id}">
                    </div>
                    <div class="tax-info">
                        <div class="tax-name">${tax.taxName}</div>
                        <small class="text-muted">${tax.taxJurisdiction || ''}</small>
                    </div>
                    <span class="tax-rate">${tax.taxRate}%</span>
                    <span class="tax-amount" id="taxAmount_${index}">PKR 0.00</span>
                </div>
            </div>
        `;
        $container.append(col);
    });
}

// ============================================
// 🔥 LOAD TERMS & UNDERTAKING
// ============================================
async function loadTermsAndUndertaking() {
    try {
        const terms = await FirebaseDB.getList('systemSettings/termsAndConditions');
        tcData = terms.find(t => t.status === 'Active') || terms[0];
        
        if (tcData) {
            $('#tcContentDisplay').html(tcData.content || '<p class="text-muted">No content available</p>');
        } else {
            $('#tcContentDisplay').html('<p class="text-muted">No Terms & Conditions configured</p>');
        }
        
        const undertakings = await FirebaseDB.getList('systemSettings/undertakings');
        undertakingData = undertakings.find(u => u.status === 'Active') || undertakings[0];
        
        if (undertakingData) {
            $('#undertakingContentDisplay').html(undertakingData.content || '<p class="text-muted">No content available</p>');
        } else {
            $('#undertakingContentDisplay').html('<p class="text-muted">No Undertaking configured</p>');
            $('#undertakingSection').hide();
        }
        
        console.log("✅ Loaded T&C and Undertaking");
    } catch (error) {
        console.error("❌ Error loading T&C:", error);
    }
}

// ============================================
// 🔥 EVENT HANDLERS (FIXED - NO RECURSIVE CALL)
// ============================================
function setupEventHandlers() {
    console.log("🔧 Setting up event handlers...");
    
    // Customer Type Change
    $('#customerType').on('change', function() {
        const type = $(this).val();
        if (type === 'Account') {
            $('#accountNumberWrapper').removeClass('d-none');
            $('#creditOption').removeClass('d-none');
        } else {
            $('#accountNumberWrapper').addClass('d-none');
            $('#creditOption').addClass('d-none');
            $('#payCash').prop('checked', true);
            clearCustomerInfo();
        }
    });
    
    // Account Number Fetch
    let accountTimeout;
    $('#accountNumber').on('input', function() {
        clearTimeout(accountTimeout);
        const accNo = $(this).val().trim();
        if (accNo.length >= 5) {
            accountTimeout = setTimeout(() => fetchCustomerByAccount(accNo), 500);
        }
    });
    
    // Clear Customer
    $('#btnClearCustomer').on('click', clearCustomerInfo);
    
    // Country Change → Load Cities
    $(document).on('change', '#consigneeCountry', function() {
        const countryName = $(this).val();
        const country = countriesData.find(c => c.name === countryName);
        const $citySelect = $('#consigneeCity');
        $citySelect.empty();
        
        if (country && country.cities && country.cities.length > 0) {
            $citySelect.append('<option value="" disabled selected>Select City</option>');
            country.cities.forEach(city => {
                $citySelect.append(`<option value="${city}">${city}</option>`);
            });
            console.log("✅ Loaded", country.cities.length, "cities for", countryName);
        } else {
            $citySelect.append('<option value="" disabled selected>No cities available</option>');
        }
    });
    
    // Weight/Dimension Changes → Recalculate
    $(document).on('input', '#weight, #length, #width, #height', function() {
        calculateWeights();
    });
    
    // Shipment Charges Change → Recalculate Total
    $(document).on('input', '#shipmentCharges', function() {
        calculateTotal();
    });
    
    // Charge Checkbox → Enable Input
    $(document).on('change', '.charge-checkbox', function() {
        const $row = $(this).closest('.charge-row');
        const $input = $row.find('.charge-amount');
        
        if ($(this).is(':checked')) {
            $row.addClass('active');
            $input.prop('disabled', false);
        } else {
            $row.removeClass('active');
            $input.prop('disabled', true);
            $input.val($row.data('default'));
        }
        calculateTotal();
    });
    
    // Charge Amount Change → Recalculate
    $(document).on('input', '.charge-amount', calculateTotal);
    
    // Tax Checkbox → Recalculate
    $(document).on('change', '.tax-checkbox', function() {
        const $row = $(this).closest('.tax-row');
        if ($(this).is(':checked')) {
            $row.addClass('active');
        } else {
            $row.removeClass('active');
        }
        calculateTotal();
    });
    
    // Add Item Button
    $('#btnAddItem').on('click', addItemRow);
    
    // Remove Item Button
    $(document).on('click', '.btn-remove-row', function() {
        if ($('#itemsTableBody tr').length > 1) {
            $(this).closest('tr').remove();
            renumberItems();
            calculateItemsSubtotal();
        } else {
            showErrorModal('At least one item row is required');
        }
    });
    
    // Item Quantity/Value Change → Recalculate
    $(document).on('input', '.item-quantity, .item-unit-value', function() {
        const $row = $(this).closest('tr');
        const qty = parseFloat($row.find('.item-quantity').val()) || 0;
        const unitVal = parseFloat($row.find('.item-unit-value').val()) || 0;
        const subTotal = qty * unitVal;
        $row.find('.item-subtotal').val(subTotal.toFixed(2));
        calculateItemsSubtotal();
    });
    
    // 🔥 FORM SUBMISSION - CRITICAL FIX
    $(document).on('submit', '#newBookingForm', function(e) {
        e.preventDefault();  // Prevent default form submission
        e.stopPropagation(); // Stop event bubbling
        console.log("🚀 Form submit intercepted");
        handleFormSubmit(false);
        return false; // Extra safety
    });
    
    // Save Draft
    $('#btnSaveDraft').on('click', function(e) {
        e.preventDefault();
        handleFormSubmit(true);
    });
    
    // Success Modal Buttons
    $('#btnNewBooking').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('bookingSuccessModal')).hide();
        setTimeout(() => location.reload(), 300);
    });
    
    $('#btnPrintBooking').on('click', printBooking);
    
    $('#btnViewList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('bookingSuccessModal')).hide();
        loadView('admindashboard');
    });
    
    // CNIC Formatting
    $('#shipperCnic').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
        if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
        if (value.length > 15) value = value.slice(0, 15);
        $(this).val(value);
    });
    
    // Confirmation Modal Buttons
    $('#btnCancelConfirm').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('bookingConfirmModal')).hide();
        console.log("❌ Booking cancelled by user");
    });
    
    $('#bookingConfirmModal').on('hidden.bs.modal', function() {
        if (window.pendingBookingData) {
            console.log("🧹 Cleared pending booking data");
            window.pendingBookingData = null;
        }
    });
    
    $('#btnConfirmSave').on('click', confirmAndSaveBooking);
    
    console.log("✅ All event handlers bound successfully");
}

// ============================================
// 🔥 FETCH CUSTOMER BY ACCOUNT NUMBER
// ============================================
async function fetchCustomerByAccount(accNo) {
    try {
        const customers = await FirebaseDB.getList('customers');
        const customer = customers.find(c => c.accountNumber === accNo && c.status === 'Active');
        
        if (customer) {
            $('#shipperName').val(customer.customerName || '');
            $('#shipperCompany').val(customer.businessName || '');
            $('#shipperCity').val(customer.city || '');
            $('#shipperState').val(customer.state || '');
            $('#shipperCountry').val(customer.country || 'Pakistan');
            $('#shipperPostalCode').val(customer.postalCode || '');
            $('#shipperCnic').val(customer.cnicNumber || '');
            $('#shipperNtn').val(customer.ntnNumber || '');
            $('#shipperEmail').val(customer.email || '');
            $('#shipperContact').val(customer.contactNumber ? customer.contactNumber.replace('+92', '') : '');
            
            $('#displayCustomerName').text(customer.customerName);
            $('#displayCustomerDetails').text(`${customer.accountNumber} | ${customer.customerType} | ${customer.province || ''} | ${customer.contactNumber || ''}`);
            $('#customerInfoDisplay').removeClass('d-none');
            
            console.log("✅ Customer fetched:", customer.customerName);
        } else {
            showErrorModal(`Account number "${accNo}" not found. Please check and try again.`);
            $('#accountNumber').focus();
        }
    } catch (error) {
        console.error("❌ Error fetching customer:", error);
        showErrorModal('Failed to fetch customer details');
    }
}

function clearCustomerInfo() {
    $('#shipperName, #shipperCompany, #shipperCity, #shipperState, #shipperPostalCode, #shipperCnic, #shipperNtn, #shipperEmail, #shipperContact').val('');
    $('#shipperCountry').val('Pakistan');
    $('#accountNumber').val('');
    $('#customerInfoDisplay').addClass('d-none');
}

// ============================================
// 🔥 WEIGHT CALCULATIONS
// ============================================
function calculateWeights() {
    const weight = parseFloat($('#weight').val()) || 0;
    const length = parseFloat($('#length').val()) || 0;
    const width = parseFloat($('#width').val()) || 0;
    const height = parseFloat($('#height').val()) || 0;
    
    let volumetric = 0;
    if (length > 0 && width > 0 && height > 0) {
        volumetric = (length * width * height) / 5000;
    }
    
    const chargeable = Math.max(weight, volumetric);
    
    $('#volumetricWeight').val(volumetric > 0 ? volumetric.toFixed(2) : '0.00');
    $('#chargeableWeight').val(chargeable > 0 ? chargeable.toFixed(2) : '0.00');
}

// ============================================
// 🔥 ITEMS TABLE
// ============================================
function addItemRow() {
    itemRowCount++;
    
    const row = `
        <tr>
            <td class="text-center item-sno">${itemRowCount}</td>
            <td><input type="text" class="form-control item-name" placeholder="Item name"></td>
            <td><input type="text" class="form-control item-hscode" placeholder="HS Code"></td>
            <td><input type="text" class="form-control item-origin bg-light" value="Pakistan" readonly></td>
            <td><input type="number" class="form-control item-quantity" min="1" value="1"></td>
            <td><input type="number" class="form-control item-unit-value" min="0" step="0.01" value="0"></td>
            <td><input type="text" class="form-control item-subtotal bg-light" value="0.00" readonly></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-danger btn-remove-row">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `;
    $('#itemsTableBody').append(row);
}

function renumberItems() {
    $('#itemsTableBody tr').each(function(index) {
        $(this).find('.item-sno').text(index + 1);
    });
    itemRowCount = $('#itemsTableBody tr').length;
}

function calculateItemsSubtotal() {
    let total = 0;
    $('#itemsTableBody tr').each(function() {
        const sub = parseFloat($(this).find('.item-subtotal').val()) || 0;
        total += sub;
    });
    $('#itemsSubtotal').text(total.toFixed(2));
}

// ============================================
// 🔥 TOTAL CALCULATION
// ============================================
function calculateTotal() {
    const baseCharges = parseFloat($('#shipmentCharges').val()) || 0;
    
    let additionalCharges = 0;
    $('.charge-checkbox:checked').each(function() {
        const amount = parseFloat($(this).closest('.charge-row').find('.charge-amount').val()) || 0;
        additionalCharges += amount;
    });
    
    const subtotal = baseCharges + additionalCharges;
    
    let totalTax = 0;
    let taxBreakdown = [];
    $('.tax-checkbox:checked').each(function() {
        const $row = $(this).closest('.tax-row');
        const rate = parseFloat($row.data('rate')) || 0;
        const taxAmount = subtotal * (rate / 100);
        totalTax += taxAmount;
        
        const taxName = $row.find('.tax-name').text();
        taxBreakdown.push({ name: taxName, rate: rate, amount: taxAmount });
        
        const displayIndex = $(this).attr('id').split('_')[1];
        $(`#taxAmount_${displayIndex}`).text('PKR ' + taxAmount.toFixed(2));
    });
    
    $('.tax-checkbox:not(:checked)').each(function() {
        const displayIndex = $(this).attr('id').split('_')[1];
        $(`#taxAmount_${displayIndex}`).text('PKR 0.00');
    });
    
    const grandTotal = subtotal + totalTax;
    
    $('#summaryBase').text('PKR ' + baseCharges.toFixed(2));
    $('#summaryCharges').text('PKR ' + additionalCharges.toFixed(2));
    $('#summarySubtotal').text('PKR ' + subtotal.toFixed(2));
    $('#summaryTax').text('PKR ' + totalTax.toFixed(2));
    $('#summaryGrandTotal').text('PKR ' + grandTotal.toFixed(2));
    
    window.bookingCalculation = {
        baseCharges, additionalCharges, subtotal, totalTax, grandTotal, taxBreakdown
    };
}

// ============================================
// 🔥 FORM SUBMISSION (SHOW CONFIRMATION)
// ============================================
async function handleFormSubmit(isDraft = false) {
    console.log("🔍 handleFormSubmit called, isDraft:", isDraft);
    
    // Validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
        console.error("❌ Validation failed:", validationErrors);
        showErrorModal('<strong>Please fix the following errors:</strong><br><br>' + validationErrors.join('<br>'));
        return;
    }
    
    console.log("✅ Validation passed, preparing confirmation...");
    
    try {
        // Collect items
        const items = [];
        $('#itemsTableBody tr').each(function() {
            items.push({
                sno: $(this).find('.item-sno').text(),
                name: $(this).find('.item-name').val() || '-',
                hsCode: $(this).find('.item-hscode').val() || '-',
                origin: $(this).find('.item-origin').val() || 'Pakistan',
                quantity: parseFloat($(this).find('.item-quantity').val()) || 0,
                unitValue: parseFloat($(this).find('.item-unit-value').val()) || 0,
                subtotal: parseFloat($(this).find('.item-subtotal').val()) || 0
            });
        });
        
        // Collect charges
        const charges = [];
        $('.charge-checkbox:checked').each(function() {
            const $row = $(this).closest('.charge-row');
            charges.push({
                chargeId: $(this).data('charge-id'),
                chargeName: $row.find('.charge-name').text(),
                amount: parseFloat($row.find('.charge-amount').val()) || 0
            });
        });
        
        const consigneeCountryName = $('#consigneeCountry').val() || '';
        
        // Build booking data
        window.pendingBookingData = {
            awbNumber: $('#awbNumber').val(),
            piNumber: $('#piNumber').val(),
            bookingDate: $('#bookingDate').val(),
            serviceType: $('#serviceType').val(),
            customerType: $('#customerType').val(),
            accountNumber: $('#accountNumber').val(),
            
            shipper: {
                name: $('#shipperName').val(),
                company: $('#shipperCompany').val(),
                city: $('#shipperCity').val(),
                state: $('#shipperState').val(),
                country: $('#shipperCountry').val(),
                postalCode: $('#shipperPostalCode').val(),
                cnic: $('#shipperCnic').val(),
                ntn: $('#shipperNtn').val(),
                email: $('#shipperEmail').val(),
                contact: '+92' + $('#shipperContact').val()
            },
            
            shipment: {
                pieces: parseInt($('#pieces').val()) || 1,
                weight: parseFloat($('#weight').val()) || 0,
                dimensions: {
                    length: parseFloat($('#length').val()) || 0,
                    width: parseFloat($('#width').val()) || 0,
                    height: parseFloat($('#height').val()) || 0
                },
                volumetricWeight: parseFloat($('#volumetricWeight').val()) || 0,
                chargeableWeight: parseFloat($('#chargeableWeight').val()) || 0,
                shipmentType: $('#shipmentType').val(),
                contents: $('#contents').val()
            },
            
            paymentMode: $('input[name="paymentMode"]:checked').val(),
            shipmentCharges: parseFloat($('#shipmentCharges').val()) || 0,
            additionalCharges: charges,
            taxes: window.bookingCalculation ? window.bookingCalculation.taxBreakdown || [] : [],
            subtotal: window.bookingCalculation ? window.bookingCalculation.subtotal || 0 : 0,
            taxAmount: window.bookingCalculation ? window.bookingCalculation.totalTax || 0 : 0,
            grandTotal: window.bookingCalculation ? window.bookingCalculation.grandTotal || 0 : 0,
            
            consignee: {
                destination: $('#destination').val(),
                name: $('#consigneeName').val(),
                company: $('#consigneeCompany').val(),
                address: $('#consigneeAddress').val(),
                country: consigneeCountryName,
                city: $('#consigneeCity').val(),
                state: $('#consigneeState').val(),
                postalCode: $('#consigneePostalCode').val(),
                email: $('#consigneeEmail').val(),
                contact: $('#consigneeContact').val(),
                taxDetails: $('#consigneeTax').val()
            },
            
            optionalServices: {
                reference: $('#shipmentReference').val(),
                declaredValue: parseFloat($('#declaredValue').val()) || 0,
                insurance: parseFloat($('#insuranceAmount').val()) || 0,
                thirdPartyNo: $('#thirdPartyNo').val(),
                itemsDescription: $('#itemsDescription').val()
            },
            
            items: items,
            itemsSubtotalUSD: parseFloat($('#itemsSubtotal').text()) || 0,
            
            tcAccepted: $('#acceptTC').is(':checked'),
            tcVersion: tcData ? tcData.version : '',
            undertakingAccepted: $('#acceptUndertaking').is(':checked'),
            undertakingCode: undertakingData ? undertakingData.code : '',
            
            status: isDraft ? 'Draft' : 'Booked',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        // Populate and show confirmation modal
        populateConfirmationModal(window.pendingBookingData);
        new bootstrap.Modal(document.getElementById('bookingConfirmModal')).show();
        
    } catch (error) {
        console.error("❌ Error preparing confirmation:", error);
        showErrorModal('Failed to prepare booking: ' + error.message);
    }
}

// ============================================
// 🔥 POPULATE CONFIRMATION MODAL
// ============================================
function populateConfirmationModal(data) {
    console.log("📋 Populating confirmation modal...");
    
    $('#confirmAWB').text(data.awbNumber);
    $('#confirmPI').text(data.piNumber);
    $('#confirmDate').text(data.bookingDate);
    $('#confirmService').text(data.serviceType);
    
    $('#confirmShipperName').text(data.shipper.name || '-');
    $('#confirmShipperCompany').text(data.shipper.company || '-');
    $('#confirmShipperCity').text(data.shipper.city || '-');
    $('#confirmShipperCountry').text(data.shipper.country || '-');
    $('#confirmShipperContact').text(data.shipper.contact || '-');
    $('#confirmShipperCnic').text(data.shipper.cnic || '-');
    
    $('#confirmConsigneeName').text(data.consignee.name || '-');
    $('#confirmConsigneeCompany').text(data.consignee.company || '-');
    $('#confirmDestination').text(data.consignee.destination || '-');
    $('#confirmConsigneeCity').text(data.consignee.city || '-');
    $('#confirmConsigneeCountry').text(data.consignee.country || '-');
    $('#confirmConsigneeContact').text(data.consignee.contact || '-');
    $('#confirmConsigneeAddress').text(data.consignee.address || '-');
    
    $('#confirmPieces').text(data.shipment.pieces);
    $('#confirmWeight').text(data.shipment.weight + ' KG');
    $('#confirmDimensions').text(`${data.shipment.dimensions.length} × ${data.shipment.dimensions.width} × ${data.shipment.dimensions.height} CM`);
    $('#confirmVolumetric').text(data.shipment.volumetricWeight + ' KG');
    $('#confirmChargeable').text(data.shipment.chargeableWeight + ' KG');
    $('#confirmShipmentType').text(data.shipment.shipmentType);
    
    $('#confirmItemCount').text(data.items.length);
    const $itemsBody = $('#confirmItemsBody').empty();
    data.items.forEach(item => {
        $itemsBody.append(`
            <tr>
                <td>${item.sno}</td>
                <td>${item.name}</td>
                <td>${item.hsCode}</td>
                <td>${item.quantity}</td>
                <td>${item.unitValue.toFixed(2)}</td>
                <td>${item.subtotal.toFixed(2)}</td>
            </tr>
        `);
    });
    $('#confirmItemsSubtotal').text(data.itemsSubtotalUSD.toFixed(2));
    
    $('#confirmBaseCharges').text('PKR ' + data.shipmentCharges.toFixed(2));
    
    const $additionalCharges = $('#confirmAdditionalCharges').empty();
    if (data.additionalCharges.length > 0) {
        data.additionalCharges.forEach(charge => {
            $additionalCharges.append(`
                <div class="confirm-charge-row">
                    <span>${charge.chargeName}:</span>
                    <span>PKR ${charge.amount.toFixed(2)}</span>
                </div>
            `);
        });
    }
    
    $('#confirmSubtotal').text('PKR ' + data.subtotal.toFixed(2));
    
    const $taxes = $('#confirmTaxes').empty();
    if (data.taxes.length > 0) {
        data.taxes.forEach(tax => {
            $taxes.append(`
                <div class="confirm-charge-row">
                    <span>${tax.name} (${tax.rate}%):</span>
                    <span>PKR ${tax.amount.toFixed(2)}</span>
                </div>
            `);
        });
    }
    
    $('#confirmGrandTotal').text('PKR ' + data.grandTotal.toFixed(2));
    $('#confirmPaymentMode').text(data.paymentMode);
    
    console.log("✅ Confirmation modal populated");
}

// ============================================
// 🔥 ACTUAL SAVE (after confirmation)
// ============================================
async function confirmAndSaveBooking() {
    const $btn = $('#btnConfirmSave');
    const $btnText = $btn.find('.btn-text');
    const $btnLoader = $btn.find('.btn-loader');
    
    $btn.prop('disabled', true);
    $btnText.addClass('d-none');
    $btnLoader.removeClass('d-none');
    
    try {
        const adminUser = FirebaseAuth.getCurrentUser();
        if (!adminUser) throw new Error('Admin session expired. Please login again.');
        
        window.pendingBookingData.createdBy = adminUser.uid;
        window.pendingBookingData.createdByEmail = adminUser.email;
        
        console.log("💾 Saving booking to Firebase...");
        console.log("AWB:", window.pendingBookingData.awbNumber);
        console.log("PI:", window.pendingBookingData.piNumber);
        
        await FirebaseDB.push('shipments', window.pendingBookingData);
        console.log("✅ Booking saved successfully");
        
        try {
            await FirebaseDB.commitAWBNumber();
            await FirebaseDB.commitPINumber();
            console.log("✅ AWB and PI counters committed");
        } catch (commitError) {
            console.error("⚠️ Warning: Could not commit counters:", commitError);
        }
        
        window.currentBooking = window.pendingBookingData;
        
        bootstrap.Modal.getInstance(document.getElementById('bookingConfirmModal')).hide();
        
        $('#successAWB').text(window.pendingBookingData.awbNumber);
        $('#successPI').text(window.pendingBookingData.piNumber);
        $('#successTotal').text('PKR ' + window.pendingBookingData.grandTotal.toFixed(2));
        
        new bootstrap.Modal(document.getElementById('bookingSuccessModal')).show();
        
        window.pendingBookingData = null;
        
    } catch (error) {
        console.error("❌ Error saving booking:", error);
        showErrorModal('Failed to save booking: ' + (error.message || 'Unknown error'));
    } finally {
        $btn.prop('disabled', false);
        $btnText.removeClass('d-none');
        $btnLoader.addClass('d-none');
    }
}

// ============================================
// 🔥 VALIDATION (IMPROVED)
// ============================================
function validateForm() {
    const errors = [];
    
    // Booking Info
    if (!$('#bookingDate').val()) errors.push('📅 Booking Date is required');
    
    // Customer
    if (!$('#customerType').val()) errors.push('👤 Customer Type is required');
    if ($('#customerType').val() === 'Account' && !$('#accountNumber').val()) {
        errors.push('🔢 Account Number is required for Account customers');
    }
    
    // Shipper
    if (!$('#shipperName').val().trim()) errors.push('👤 Shipper Name is required');
    if (!$('#shipperCity').val().trim()) errors.push('🏙️ Shipper City is required');
    if (!$('#shipperContact').val().trim()) errors.push('📞 Shipper Contact is required');
    
    // Shipment
    if (!$('#pieces').val() || parseInt($('#pieces').val()) < 1) errors.push('📦 Pieces must be at least 1');
    if (!$('#weight').val() || parseFloat($('#weight').val()) <= 0) errors.push('⚖️ Weight is required and must be greater than 0');
    
    // Charges
    if ($('#shipmentCharges').val() === '' || parseFloat($('#shipmentCharges').val()) < 0) {
        errors.push('💰 Shipment Charges is required');
    }
    
    // Consignee
    if (!$('#destination').val().trim()) errors.push('📍 Destination is required');
    if (!$('#consigneeName').val().trim()) errors.push('👤 Consignee Name is required');
    if (!$('#consigneeAddress').val().trim()) errors.push('🏠 Consignee Address is required');
    if (!$('#consigneeCountry').val()) errors.push('🌍 Consignee Country is required');
    if (!$('#consigneeCity').val()) errors.push('🏙️ Consignee City is required');
    if (!$('#consigneeContact').val().trim()) errors.push('📞 Consignee Contact is required');
    
    // Legal
    if (!$('#acceptTC').is(':checked')) errors.push('✅ You must accept Terms & Conditions');
    if ($('#undertakingSection').is(':visible') && !$('#acceptUndertaking').is(':checked')) {
        errors.push('✅ You must accept the Undertaking');
    }
    
    return errors;
}

// ============================================
// 🔥 PRINT BOOKING
// ============================================
// ============================================
// 🔥 PRINT BOOKING (TWO PAGES: AWB + PI)
// ============================================
// ============================================
// 🔥 PRINT BOOKING (A4 OPTIMIZED - 2 PAGES)
// ============================================



// ============================================
// 🔥 PRINT BOOKING (WITH RELIABLE BARCODE GENERATION)
// ============================================
function printBooking() {
    if (!window.currentBooking) {
        showErrorModal('No booking data available for printing');
        return;
    }
    
    const b = window.currentBooking;
    const printContent = buildBookingPrintContent(b);
    
    const printWindow = window.open('', '', 'width=900,height=1100');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // 🔥 Generate barcodes with reliable retry logic
    generateBarcodesInPrintWindow(printWindow, b);
}

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



function buildBookingPrintContent() {
    if (!window.currentBooking) {
        showErrorModal('No booking data available for printing');
        return;
    }
    
    const b = window.currentBooking;
    const items = b.items || [];
    
    const printContent = `
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
                <div class="field"><span class="label">Name:</span> <span class="value">${b.shipper.name}</span></div>
                <div class="field"><span class="label">Company:</span> <span class="value">${b.shipper.company || '-'}</span></div>
                <div class="field"><span class="label">Contact:</span> <span class="value">${b.shipper.contact}</span></div>
                <div class="field"><span class="label">City:</span> <span class="value">${b.shipper.city}</span></div>
                <div class="field"><span class="label">Country:</span> <span class="value">${b.shipper.country}</span></div>
                <div class="field"><span class="label">CNIC:</span> <span class="value">${b.shipper.cnic || '-'}</span></div>
                ${b.accountNumber ? `<div class="field"><span class="label">Account #:</span> <span class="value">${b.accountNumber}</span></div>` : ''}
            </div>
            <div class="col-box">
                <div class="col-title">Consignee (Receiver)</div>
                <div class="field"><span class="label">Name:</span> <span class="value">${b.consignee.name}</span></div>
                <div class="field"><span class="label">Company:</span> <span class="value">${b.consignee.company || '-'}</span></div>
                <div class="field"><span class="label">Contact:</span> <span class="value">${b.consignee.contact}</span></div>
                <div class="field"><span class="label">Destination:</span> <span class="value">${b.consignee.destination}</span></div>
                <div class="field"><span class="label">City:</span> <span class="value">${b.consignee.city}</span></div>
                <div class="field"><span class="label">Country:</span> <span class="value">${b.consignee.country}</span></div>
                <div class="field"><span class="label">Address:</span> <span class="value">${b.consignee.address}</span></div>
            </div>
        </div>
        
        <!-- Shipment Details -->
        <div class="info-row">
            <div class="info-cell">
                <div class="info-label">Pieces</div>
                <div class="info-value">${b.shipment.pieces}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Actual Weight</div>
                <div class="info-value">${b.shipment.weight} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Chargeable Weight</div>
                <div class="info-value">${b.shipment.chargeableWeight} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Shipment Type</div>
                <div class="info-value">${b.shipment.shipmentType}</div>
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
                <div class="field"><span class="label">Name:</span> <span class="value">${b.shipper.name}</span></div>
                <div class="field"><span class="label">Company:</span> <span class="value">${b.shipper.company || '-'}</span></div>
                <div class="field"><span class="label">Contact:</span> <span class="value">${b.shipper.contact}</span></div>
                <div class="field"><span class="label">City:</span> <span class="value">${b.shipper.city}</span></div>
                <div class="field"><span class="label">Country:</span> <span class="value">${b.shipper.country}</span></div>
            </div>
            <div class="col-box">
                <div class="col-title">Consignee</div>
                <div class="field"><span class="label">Name:</span> <span class="value">${b.consignee.name}</span></div>
                <div class="field"><span class="label">Company:</span> <span class="value">${b.consignee.company || '-'}</span></div>
                <div class="field"><span class="label">Contact:</span> <span class="value">${b.consignee.contact}</span></div>
                <div class="field"><span class="label">Destination:</span> <span class="value">${b.consignee.destination}</span></div>
                <div class="field"><span class="label">Country:</span> <span class="value">${b.consignee.country}</span></div>
            </div>
        </div>
        
        <!-- Shipment Info (Weight Only) -->
        <div class="info-row">
            <div class="info-cell">
                <div class="info-label">Pieces</div>
                <div class="info-value">${b.shipment.pieces}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Actual Weight</div>
                <div class="info-value">${b.shipment.weight} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Chargeable Weight</div>
                <div class="info-value">${b.shipment.chargeableWeight} KG</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Shipment Type</div>
                <div class="info-value">${b.shipment.shipmentType}</div>
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
    
    const printWindow = window.open('', '', 'width=900,height=1100');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
}



// ============================================
// 🔥 HELPERS
// ============================================
function showErrorModal(message) {
    $('#bookingErrorMessage').html(message);
    new bootstrap.Modal(document.getElementById('bookingErrorModal')).show();
}