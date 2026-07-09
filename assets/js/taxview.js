// assets/js/taxview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

window.initTaxView = function() {
    console.log("🚀 [taxview.js] initTaxView() executed successfully!");
    
    window.allTaxes = [];
    window.filteredTaxes = [];
    window.currentPage = 1;
    window.itemsPerPage = 50;

    setupFilters();
    setupPagination();
    setupEditModal();
    loadTaxes();
};

async function loadTaxes() {
    try {
        const taxes = await FirebaseDB.getList('systemSettings/taxRates');
        window.allTaxes = Array.isArray(taxes) ? taxes : [];
        
        // Sort by priority then by effective date
        window.allTaxes.sort((a, b) => {
            if ((a.priority || 99) !== (b.priority || 99)) {
                return (a.priority || 99) - (b.priority || 99);
            }
            return (b.effectiveFrom || '').localeCompare(a.effectiveFrom || '');
        });
        
        updateStats();
        applyFilters();
    } catch (error) {
        console.error("❌ Error loading taxes:", error);
        showEditErrorModal('Failed to load taxes: ' + error.message);
    }
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    
    $('#statTotal').text(window.allTaxes.length);
    $('#statActive').text(window.allTaxes.filter(t => 
        t.status === 'Active' && 
        (!t.effectiveFrom || t.effectiveFrom <= today) &&
        (!t.effectiveTo || t.effectiveTo >= today)
    ).length);
    
    // Count GST (Federal) - applies to provinces except Sindh
    $('#statGST').text(window.allTaxes.filter(t => {
        const provs = t.applicableProvinces || [];
        return provs.length > 0 && !provs.includes('Sindh') && provs.some(p => p !== 'Sindh');
    }).length);
    
    // Count SST (Sindh) - applies only to Sindh
    $('#statSST').text(window.allTaxes.filter(t => {
        const provs = t.applicableProvinces || [];
        return provs.length === 1 && provs[0] === 'Sindh';
    }).length);
}

function setupFilters() {
    $('#searchInput').on('input', debounce(applyFilters, 300));
    $('#filterStatus, #filterAuthority, #filterJurisdiction, #filterProvince').on('change', applyFilters);
    $('#btnClearFilters').on('click', function() {
        $('#searchInput, #filterStatus, #filterAuthority, #filterJurisdiction, #filterProvince').val('');
        applyFilters();
    });
}

function applyFilters() {
    const search = $('#searchInput').val().toLowerCase().trim();
    const status = $('#filterStatus').val();
    const authority = $('#filterAuthority').val();
    const jurisdiction = $('#filterJurisdiction').val();
    const province = $('#filterProvince').val();

    window.filteredTaxes = window.allTaxes.filter(t => {
        if (search && !((t.taxName || '').toLowerCase().includes(search) || (t.taxCode || '').toLowerCase().includes(search))) return false;
        if (status && t.status !== status) return false;
        if (authority && t.taxAuthority !== authority) return false;
        if (jurisdiction && t.taxJurisdiction !== jurisdiction) return false;
        if (province && !(t.applicableProvinces || []).includes(province)) return false;
        return true;
    });

    window.currentPage = 1;
    renderTable();
    renderPagination();
}

function renderTable() {
    const start = (window.currentPage - 1) * window.itemsPerPage;
    const end = start + window.itemsPerPage;
    const pageData = window.filteredTaxes.slice(start, end);
    const today = new Date().toISOString().split('T')[0];

    $('#showingFrom').text(window.filteredTaxes.length > 0 ? start + 1 : 0);
    $('#showingTo').text(Math.min(end, window.filteredTaxes.length));
    $('#showingTotal').text(window.filteredTaxes.length);

    const $tbody = $('#taxTableBody').empty();

    if (pageData.length === 0) {
        $tbody.html(`<tr><td colspan="9" class="text-center py-5"><i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i><p class="mt-3 text-muted">No taxes found</p></td></tr>`);
        return;
    }

    pageData.forEach(t => {
        // Rate Badge with color coding
        const rate = t.taxRate || 0;
        let rateClass = 'rate-low';
        if (rate >= 15) rateClass = 'rate-high';
        else if (rate >= 10) rateClass = 'rate-medium';
        const rateBadge = `<span class="rate-badge ${rateClass}">${rate}%</span>`;

        // Authority Badge
        const auth = (t.taxAuthority || 'internal').toLowerCase();
        const authBadge = `<span class="authority-badge authority-${auth}">${t.taxAuthority || '-'}</span>`;

        // Province Indicators
        const provinces = t.applicableProvinces || [];
        let provHtml = '<div class="province-indicators">';
        if (provinces.length === 0) {
            provHtml += '<span class="text-muted small">None</span>';
        } else {
            provinces.forEach(p => {
                const cls = p.toLowerCase().replace(/[^a-z]/g, '');
                const short = p.substring(0, 2).toUpperCase();
                provHtml += `<span class="province-dot ${cls}" title="${p}">${short}</span>`;
            });
        }
        provHtml += '</div>';

        // Filer Badges
        const filers = t.applicableFilerStatuses || [];
        let filerHtml = '<div class="filer-badges">';
        if (filers.length === 0) {
            filerHtml += '<span class="text-muted small">None</span>';
        } else {
            filers.forEach(f => {
                let cls = 'filer';
                if (f === 'Non-Filer') cls = 'non-filer';
                else if (f === 'Tax-Exempt') cls = 'exempt';
                filerHtml += `<span class="filer-badge ${cls}">${f}</span>`;
            });
        }
        filerHtml += '</div>';

        // Date Status
        let dateStatusBadge = '';
        let dateMain = t.effectiveFrom || '-';
        let dateRange = '';
        
        if (t.status !== 'Active') {
            dateStatusBadge = '<span class="date-status-badge expired">Inactive</span>';
        } else if (!t.effectiveFrom) {
            dateStatusBadge = '<span class="date-status-badge ongoing">Ongoing</span>';
        } else if (t.effectiveFrom > today) {
            dateStatusBadge = '<span class="date-status-badge upcoming">Upcoming</span>';
        } else if (t.effectiveTo && t.effectiveTo < today) {
            dateStatusBadge = '<span class="date-status-badge expired">Expired</span>';
        } else {
            dateStatusBadge = '<span class="date-status-badge active-now">Currently Active</span>';
        }
        
        if (t.effectiveTo) {
            dateRange = `Until: ${t.effectiveTo}`;
        } else {
            dateRange = 'Ongoing';
        }

        const statusBadge = t.status === 'Active' 
            ? '<span class="badge-status badge-active"><i class="bi bi-check-circle"></i> Active</span>'
            : '<span class="badge-status badge-inactive"><i class="bi bi-x-circle"></i> Inactive</span>';

        const row = `
            <tr>
                <td class="ps-4"><strong>${t.taxCode || '-'}</strong></td>
                <td>${t.taxName || '-'}</td>
                <td>${rateBadge}</td>
                <td>${authBadge}</td>
                <td>${provHtml}</td>
                <td>${filerHtml}</td>
                <td>
                    <div class="date-status">
                        <span class="date-main">${dateMain}</span>
                        <span class="date-range">${dateRange}</span>
                        ${dateStatusBadge}
                    </div>
                </td>
                <td>${statusBadge}</td>
                <td class="text-center pe-4">
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editTax('${t.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
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
    const totalPages = Math.ceil(window.filteredTaxes.length / window.itemsPerPage);
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
    $('#btnSaveTaxEdit').on('click', saveTaxEdit);
    $('#btnCloseEditSuccess').on('click', () => bootstrap.Modal.getInstance(document.getElementById('taxEditSuccessModal')).hide());
}

window.editTax = async function(id) {
    try {
        const t = await FirebaseDB.get(`systemSettings/taxRates/${id}`);
        if (!t) return showEditErrorModal('Tax not found');

        $('#editTaxId').val(id);
        $('#editTaxName').val(t.taxName);
        $('#editTaxCode').val(t.taxCode);
        $('#editTaxStatus').val(t.status);
        $('#editTaxPriority').val(t.priority || 10);
        $('#editTaxAuthority').val(t.taxAuthority);
        $('#editTaxJurisdiction').val(t.taxJurisdiction);
        $('#editNotificationRef').val(t.notificationRef);
        $('#editTaxDescription').val(t.description);
        
        $('#editTaxRate').val(t.taxRate);
        $('#editCalculationBase').val(t.calculationBase);
        $('#editRoundingType').val(t.roundingType || 'none');
        $('#editIsCompoundTax').prop('checked', t.isCompoundTax || false);

        // Province checkboxes
        $('.edit-province-check').prop('checked', false);
        (t.applicableProvinces || []).forEach(p => {
            $(`.edit-province-check[value="${p}"]`).prop('checked', true);
        });

        // Filer checkboxes
        $('.edit-filer-check').prop('checked', false);
        (t.applicableFilerStatuses || []).forEach(f => {
            $(`.edit-filer-check[value="${f}"]`).prop('checked', true);
        });

        // Customer type checkboxes
        $('.edit-cust-check').prop('checked', false);
        (t.applicableCustomerTypes || []).forEach(c => {
            $(`.edit-cust-check[value="${c}"]`).prop('checked', true);
        });

        // Service type checkboxes
        $('.edit-svc-check').prop('checked', false);
        (t.applicableServiceTypes || []).forEach(s => {
            $(`.edit-svc-check[value="${s}"]`).prop('checked', true);
        });

        // Date range
        $('#editEffectiveFrom').val(t.effectiveFrom);
        $('#editEffectiveTo').val(t.effectiveTo || '');

        // Display switches
        $('#editShowBooking').prop('checked', t.showOnBooking !== false);
        $('#editShowInvoice').prop('checked', t.showOnInvoice !== false);
        $('#editShowReceipt').prop('checked', t.showOnReceipt !== false);
        $('#editAutoApply').prop('checked', t.autoApply !== false);

        // Accounting
        $('#editGlAccountCode').val(t.glAccountCode);
        $('#editTaxCategory').val(t.taxCategory);
        $('#editReportingType').val(t.reportingType);

        // Notes
        $('#editInternalNotes').val(t.internalNotes);

        new bootstrap.Modal(document.getElementById('editTaxModal')).show();
    } catch (err) {
        showEditErrorModal('Error loading tax: ' + err.message);
    }
};

async function saveTaxEdit() {
    const id = $('#editTaxId').val();
    const taxName = $('#editTaxName').val().trim();
    const taxRate = parseFloat($('#editTaxRate').val());
    const effectiveFrom = $('#editEffectiveFrom').val();
    const effectiveTo = $('#editEffectiveTo').val();

    if (!taxName) return showEditErrorModal('Tax Name is required');
    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) return showEditErrorModal('Tax Rate must be 0-100');
    if (!effectiveFrom) return showEditErrorModal('Effective From date is required');
    if (effectiveTo && effectiveTo < effectiveFrom) return showEditErrorModal('Effective Until cannot be before Effective From');

    const selectedProvinces = $('.edit-province-check:checked').map((_, el) => el.value).get();
    if (selectedProvinces.length === 0) return showEditErrorModal('Select at least one province');

    const selectedFilers = $('.edit-filer-check:checked').map((_, el) => el.value).get();
    if (selectedFilers.length === 0) return showEditErrorModal('Select at least one filer status');

    const $btn = $('#btnSaveTaxEdit');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');

    try {
        const customerTypes = $('.edit-cust-check:checked').map((_, el) => el.value).get();
        const serviceTypes = $('.edit-svc-check:checked').map((_, el) => el.value).get();

        const updateData = {
            taxName: taxName,
            status: $('#editTaxStatus').val(),
            priority: parseInt($('#editTaxPriority').val()) || 10,
            taxAuthority: $('#editTaxAuthority').val(),
            taxJurisdiction: $('#editTaxJurisdiction').val(),
            notificationRef: $('#editNotificationRef').val().trim(),
            description: $('#editTaxDescription').val().trim(),
            
            taxRate: taxRate,
            calculationBase: $('#editCalculationBase').val(),
            roundingType: $('#editRoundingType').val(),
            isCompoundTax: $('#editIsCompoundTax').is(':checked'),
            
            applicableProvinces: selectedProvinces,
            applicableFilerStatuses: selectedFilers,
            applicableCustomerTypes: customerTypes,
            applicableServiceTypes: serviceTypes,
            
            effectiveFrom: effectiveFrom,
            effectiveTo: effectiveTo || null,
            
            showOnBooking: $('#editShowBooking').is(':checked'),
            showOnInvoice: $('#editShowInvoice').is(':checked'),
            showOnReceipt: $('#editShowReceipt').is(':checked'),
            autoApply: $('#editAutoApply').is(':checked'),
            
            glAccountCode: $('#editGlAccountCode').val().trim(),
            taxCategory: $('#editTaxCategory').val(),
            reportingType: $('#editReportingType').val(),
            
            internalNotes: $('#editInternalNotes').val().trim(),
            lastUpdated: new Date().toISOString()
        };

        await FirebaseDB.update(`systemSettings/taxRates/${id}`, updateData);
        
        bootstrap.Modal.getInstance(document.getElementById('editTaxModal')).hide();
        new bootstrap.Modal(document.getElementById('taxEditSuccessModal')).show();
        
        await loadTaxes();
    } catch (err) {
        showEditErrorModal('Failed to update: ' + err.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

function showEditErrorModal(msg) {
    $('#taxEditErrorMessage').text(msg);
    new bootstrap.Modal(document.getElementById('taxEditErrorModal')).show();
}

function debounce(func, wait) {
    let t; return function(...args) { clearTimeout(t); t = setTimeout(() => func(...args), wait); };
}