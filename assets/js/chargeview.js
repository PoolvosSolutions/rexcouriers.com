// assets/js/chargeview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

window.initChargeView = function() {
    console.log("🚀 [chargeview.js] initChargeView() executed successfully!");
    
    window.allCharges = [];
    window.filteredCharges = [];
    window.currentPage = 1;
    window.itemsPerPage = 50;

    setupFilters();
    setupPagination();
    setupEditModal();
    loadCharges();
};

async function loadCharges() {
    try {
        // 🔥 Note the path: systemSettings/chargeRules
        const charges = await FirebaseDB.getList('systemSettings/chargeRules');
        window.allCharges = Array.isArray(charges) ? charges : [];
        
        // Sort by sortOrder
        window.allCharges.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
        
        updateStats();
        applyFilters();
    } catch (error) {
        console.error("❌ Error loading charges:", error);
        showEditErrorModal('Failed to load charges: ' + error.message);
    }
}

function updateStats() {
    $('#statTotal').text(window.allCharges.length);
    $('#statActive').text(window.allCharges.filter(c => c.status === 'Active').length);
    $('#statMandatory').text(window.allCharges.filter(c => c.nature === 'Mandatory').length);
    $('#statOptional').text(window.allCharges.filter(c => c.nature === 'Optional').length);
}

function setupFilters() {
    $('#searchInput').on('input', debounce(applyFilters, 300));
    $('#filterStatus, #filterCategory, #filterNature, #filterCalcType').on('change', applyFilters);
    $('#btnClearFilters').on('click', function() {
        $('#searchInput, #filterStatus, #filterCategory, #filterNature, #filterCalcType').val('');
        applyFilters();
    });
}

function applyFilters() {
    const search = $('#searchInput').val().toLowerCase().trim();
    const status = $('#filterStatus').val();
    const category = $('#filterCategory').val();
    const nature = $('#filterNature').val();
    const calcType = $('#filterCalcType').val();

    window.filteredCharges = window.allCharges.filter(c => {
        if (search && !((c.chargeName || '').toLowerCase().includes(search) || (c.chargeCode || '').toLowerCase().includes(search))) return false;
        if (status && c.status !== status) return false;
        if (category && c.category !== category) return false;
        if (nature && c.nature !== nature) return false;
        if (calcType && c.calculationType !== calcType) return false;
        return true;
    });

    window.currentPage = 1;
    renderTable();
    renderPagination();
}

function renderTable() {
    const start = (window.currentPage - 1) * window.itemsPerPage;
    const end = start + window.itemsPerPage;
    const pageData = window.filteredCharges.slice(start, end);

    $('#showingFrom').text(window.filteredCharges.length > 0 ? start + 1 : 0);
    $('#showingTo').text(Math.min(end, window.filteredCharges.length));
    $('#showingTotal').text(window.filteredCharges.length);

    const $tbody = $('#chargeTableBody').empty();

    if (pageData.length === 0) {
        $tbody.html(`<tr><td colspan="8" class="text-center py-5"><i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i><p class="mt-3 text-muted">No charges found</p></td></tr>`);
        return;
    }

    pageData.forEach(c => {
        // Format Calculation Value
        let calcDisplay = '';
        if (c.calculationType === 'percentage') calcDisplay = `${c.defaultValue}%`;
        else if (c.calculationType === 'per_kg') calcDisplay = `PKR ${c.defaultValue}/kg`;
        else if (c.calculationType === 'per_piece') calcDisplay = `PKR ${c.defaultValue}/pc`;
        else calcDisplay = `PKR ${c.defaultValue}`;

        // Category Badge
        const catClass = `badge-cat-${(c.category || 'standard').toLowerCase().replace(' ', '-')}`;
        
        // Applicability Icons
        const shipAll = (c.applicableShipmentTypes || []).length === 2;
        const dirAll = (c.applicableServiceDirections || []).length === 2;
        const custAll = (c.applicableCustomerTypes || []).length === 2;

        const row = `
            <tr>
                <td class="ps-4"><strong>${c.chargeCode || '-'}</strong></td>
                <td>${c.chargeName || '-'}</td>
                <td><span class="charge-badge ${catClass}">${c.category || 'Standard'}</span></td>
                <td><span class="charge-badge badge-calc">${calcDisplay}</span></td>
                <td>
                    <div class="applicability-icons">
                        <span class="app-icon ${shipAll ? 'active' : ''}" title="Shipment Types"><i class="bi bi-box-seam"></i></span>
                        <span class="app-icon ${dirAll ? 'active' : ''}" title="Directions"><i class="bi bi-globe"></i></span>
                        <span class="app-icon ${custAll ? 'active' : ''}" title="Customers"><i class="bi bi-person"></i></span>
                    </div>
                </td>
                <td><span class="charge-badge badge-nature-${(c.nature || 'optional').toLowerCase()}">${c.nature || 'Optional'}</span></td>
                <td><span class="badge-status ${c.status === 'Active' ? 'badge-active' : 'badge-inactive'}"><i class="bi bi-${c.status === 'Active' ? 'check-circle' : 'x-circle'}"></i> ${c.status}</span></td>
                <td class="text-center pe-4">
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editCharge('${c.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
                    </div>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });
}

function setupPagination() {
    $('#itemsPerPage').on('change', function() {
        window.itemsPerPage = parseInt($(this).val());
        window.currentPage = 1;
        renderTable();
        renderPagination();
    });
}

function renderPagination() {
    const totalPages = Math.ceil(window.filteredCharges.length / window.itemsPerPage);
    const $c = $('#paginationContainer').empty();
    if (totalPages <= 1) return;

    $c.append(`<li class="page-item ${window.currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${window.currentPage - 1}">Prev</a></li>`);
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= window.currentPage - 1 && i <= window.currentPage + 1)) {
            $c.append(`<li class="page-item ${i === window.currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        } else if (i === window.currentPage - 2 || i === window.currentPage + 2) {
            $c.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
    }
    $c.append(`<li class="page-item ${window.currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${window.currentPage + 1}">Next</a></li>`);

    $c.find('.page-link').on('click', function(e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        if (page && page !== window.currentPage) {
            window.currentPage = page;
            renderTable();
            renderPagination();
        }
    });
}

// ============================================
// 🔥 EDIT MODAL LOGIC
// ============================================
function setupEditModal() {
    $('#btnSaveChargeEdit').on('click', saveChargeEdit);
    
    // Handle Calculation Type change in Edit Modal
    $('#editCalculationType').on('change', function() {
        const type = $(this).val();
        const $sym = $('#editCalcSymbol');
        const $mm = $('.edit-min-max-field');
        
        if (type === 'percentage') { $sym.text('%'); $mm.removeClass('d-none'); }
        else if (type === 'per_kg') { $sym.text('PKR/kg'); $mm.addClass('d-none'); }
        else if (type === 'per_piece') { $sym.text('PKR/pc'); $mm.addClass('d-none'); }
        else { $sym.text('PKR'); $mm.addClass('d-none'); }
    });

    $('#btnCloseEditSuccess').on('click', () => bootstrap.Modal.getInstance(document.getElementById('chargeEditSuccessModal')).hide());
}

window.editCharge = async function(id) {
    try {
        const c = await FirebaseDB.get(`systemSettings/chargeRules/${id}`);
        if (!c) return showEditErrorModal('Charge not found');

        $('#editChargeId').val(id);
        $('#editChargeName').val(c.chargeName);
        $('#editChargeCode').val(c.chargeCode);
        $('#editChargeStatus').val(c.status);
        $('#editChargeCategory').val(c.category);
        $('#editChargeNature').val(c.nature);
        $('#editChargeSortOrder').val(c.sortOrder || 10);
        $('#editChargeDescription').val(c.description);
        
        $('#editCalculationType').val(c.calculationType).trigger('change'); // Triggers symbol/minmax update
        $('#editDefaultValue').val(c.defaultValue);
        $('#editMinValue').val(c.minValue || 0);
        $('#editMaxValue').val(c.maxValue || 0);
        $('#editRoundingType').val(c.roundingType || 'none');

        // Applicability Checkboxes
        $('.edit-apply-shipment').prop('checked', false);
        (c.applicableShipmentTypes || []).forEach(v => $(`.edit-apply-shipment[value="${v}"]`).prop('checked', true));
        
        $('.edit-apply-direction').prop('checked', false);
        (c.applicableServiceDirections || []).forEach(v => $(`.edit-apply-direction[value="${v}"]`).prop('checked', true));
        
        $('.edit-apply-customer').prop('checked', false);
        (c.applicableCustomerTypes || []).forEach(v => $(`.edit-apply-customer[value="${v}"]`).prop('checked', true));

        // Switches
        $('#editShowBooking').prop('checked', c.showOnBooking !== false);
        $('#editShowInvoice').prop('checked', c.showOnInvoice !== false);
        $('#editShowReceipt').prop('checked', c.showOnReceipt !== false);
        $('#editIsTaxable').prop('checked', c.isTaxable !== false);

        new bootstrap.Modal(document.getElementById('editChargeModal')).show();
    } catch (err) {
        showEditErrorModal('Error loading charge: ' + err.message);
    }
};

async function saveChargeEdit() {
    const id = $('#editChargeId').val();
    const name = $('#editChargeName').val().trim();
    const calcType = $('#editCalculationType').val();
    const defVal = parseFloat($('#editDefaultValue').val());

    if (!name) return showEditErrorModal('Charge Name is required');
    if (isNaN(defVal) || defVal < 0) return showEditErrorModal('Valid Default Value is required');
    if (calcType === 'percentage' && (defVal < 0 || defVal > 100)) return showEditErrorModal('Percentage must be 0-100');

    const $btn = $('#btnSaveChargeEdit');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');

    try {
        const shipTypes = $('.edit-apply-shipment:checked').map((_, el) => el.value).get();
        const dirTypes = $('.edit-apply-direction:checked').map((_, el) => el.value).get();
        const custTypes = $('.edit-apply-customer:checked').map((_, el) => el.value).get();

        const updateData = {
            chargeName: name,
            status: $('#editChargeStatus').val(),
            category: $('#editChargeCategory').val(),
            nature: $('#editChargeNature').val(),
            sortOrder: parseInt($('#editChargeSortOrder').val()) || 10,
            description: $('#editChargeDescription').val().trim(),
            calculationType: calcType,
            defaultValue: defVal,
            minValue: calcType === 'percentage' ? (parseFloat($('#editMinValue').val()) || 0) : 0,
            maxValue: calcType === 'percentage' ? (parseFloat($('#editMaxValue').val()) || 0) : 0,
            roundingType: $('#editRoundingType').val(),
            applicableShipmentTypes: shipTypes,
            applicableServiceDirections: dirTypes,
            applicableCustomerTypes: custTypes,
            showOnBooking: $('#editShowBooking').is(':checked'),
            showOnInvoice: $('#editShowInvoice').is(':checked'),
            showOnReceipt: $('#editShowReceipt').is(':checked'),
            isTaxable: $('#editIsTaxable').is(':checked'),
            lastUpdated: new Date().toISOString()
        };

        await FirebaseDB.update(`systemSettings/chargeRules/${id}`, updateData);
        
        bootstrap.Modal.getInstance(document.getElementById('editChargeModal')).hide();
        new bootstrap.Modal(document.getElementById('chargeEditSuccessModal')).show();
        
        await loadCharges(); // Refresh table
    } catch (err) {
        showEditErrorModal('Failed to update: ' + err.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

function showEditErrorModal(msg) {
    $('#chargeEditErrorMessage').text(msg);
    new bootstrap.Modal(document.getElementById('chargeEditErrorModal')).show();
}

function debounce(func, wait) {
    let t; return function(...args) { clearTimeout(t); t = setTimeout(() => func(...args), wait); };
}