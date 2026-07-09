// assets/js/termsview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// 🔥 Global Quill instance for edit modal
let editQuillEditor = null;

window.initTermsView = function() {
    console.log("🚀 [termsview.js] initTermsView() executed successfully!");
    
    window.allTerms = [];
    window.filteredTerms = [];
    window.currentPage = 1;
    window.itemsPerPage = 50;

    setupFilters();
    setupPagination();
    setupEditModal();
    loadTerms();
};

async function loadTerms() {
    try {
        const terms = await FirebaseDB.getList('systemSettings/termsAndConditions');
        window.allTerms = Array.isArray(terms) ? terms : [];
        
        // Sort by priority then by effective date
        window.allTerms.sort((a, b) => {
            if ((a.priority || 99) !== (b.priority || 99)) {
                return (a.priority || 99) - (b.priority || 99);
            }
            return (b.effectiveFrom || '').localeCompare(a.effectiveFrom || '');
        });
        
        updateStats();
        applyFilters();
    } catch (error) {
        console.error("❌ Error loading T&C:", error);
        showEditErrorModal('Failed to load T&C: ' + error.message);
    }
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    
    $('#statTotal').text(window.allTerms.length);
    
    // Active = status Active AND within date range
    $('#statActive').text(window.allTerms.filter(t => 
        t.status === 'Active' && 
        (!t.effectiveFrom || t.effectiveFrom <= today) &&
        (!t.effectiveTo || t.effectiveTo >= today)
    ).length);
    
    $('#statDraft').text(window.allTerms.filter(t => t.status === 'Draft').length);
    $('#statArchived').text(window.allTerms.filter(t => t.status === 'Archived').length);
}

function setupFilters() {
    $('#searchInput').on('input', debounce(applyFilters, 300));
    $('#filterStatus, #filterCategory, #filterLanguage, #filterApproval').on('change', applyFilters);
    $('#btnClearFilters').on('click', function() {
        $('#searchInput, #filterStatus, #filterCategory, #filterLanguage, #filterApproval').val('');
        applyFilters();
    });
}

function applyFilters() {
    const search = $('#searchInput').val().toLowerCase().trim();
    const status = $('#filterStatus').val();
    const category = $('#filterCategory').val();
    const language = $('#filterLanguage').val();
    const approval = $('#filterApproval').val();

    window.filteredTerms = window.allTerms.filter(t => {
        if (search && !((t.title || '').toLowerCase().includes(search) || (t.version || '').toLowerCase().includes(search))) return false;
        if (status && t.status !== status) return false;
        if (category && t.category !== category) return false;
        if (language && t.language !== language) return false;
        if (approval && t.approvalStatus !== approval) return false;
        return true;
    });

    window.currentPage = 1;
    renderTable();
    renderPagination();
}

function renderTable() {
    const start = (window.currentPage - 1) * window.itemsPerPage;
    const end = start + window.itemsPerPage;
    const pageData = window.filteredTerms.slice(start, end);
    const today = new Date().toISOString().split('T')[0];

    $('#showingFrom').text(window.filteredTerms.length > 0 ? start + 1 : 0);
    $('#showingTo').text(Math.min(end, window.filteredTerms.length));
    $('#showingTotal').text(window.filteredTerms.length);

    const $tbody = $('#termsTableBody').empty();

    if (pageData.length === 0) {
        $tbody.html(`<tr><td colspan="7" class="text-center py-5"><i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i><p class="mt-3 text-muted">No T&C found</p></td></tr>`);
        return;
    }

    pageData.forEach(t => {
        // Title & Version
        const titleHtml = `
            <div class="title-version">
                <span class="title-main">${t.title || '-'}</span>
                <span class="title-version-tag">${t.version || 'v1.0'}</span>
            </div>
        `;

        // Category Badge
        const catClass = `cat-${(t.category || 'general').toLowerCase().replace(/[^a-z]/g, '-')}`;
        const categoryBadge = `<span class="category-badge ${catClass}">${t.category || 'General'}</span>`;

        // Language Badge
        const languageBadge = `<span class="language-badge">${t.language || 'English'}</span>`;

        // Date Status
        let dateStatusBadge = '';
        let dateMain = t.effectiveFrom || '-';
        let dateRange = '';
        
        if (t.status === 'Archived' || t.status === 'Inactive') {
            dateStatusBadge = '<span class="date-status-badge expired">Inactive</span>';
        } else if (t.status === 'Draft') {
            dateStatusBadge = '<span class="date-status-badge upcoming">Draft</span>';
        } else if (!t.effectiveFrom) {
            dateStatusBadge = '<span class="date-status-badge ongoing">Ongoing</span>';
        } else if (t.effectiveFrom > today) {
            dateStatusBadge = '<span class="date-status-badge upcoming">Upcoming</span>';
        } else if (t.effectiveTo && t.effectiveTo < today) {
            dateStatusBadge = '<span class="date-status-badge expired">Expired</span>';
        } else {
            dateStatusBadge = '<span class="date-status-badge active-now">Currently Active</span>';
        }
        
        dateRange = t.effectiveTo ? `Until: ${t.effectiveTo}` : 'Ongoing';

        // Approval Badge
        let approvalBadge = '';
        const approval = t.approvalStatus || 'Pending';
        if (approval === 'Approved') {
            approvalBadge = `<span class="approval-badge approval-approved"><i class="bi bi-check-circle-fill"></i> Approved</span>`;
        } else if (approval === 'Rejected') {
            approvalBadge = `<span class="approval-badge approval-rejected"><i class="bi bi-x-circle-fill"></i> Rejected</span>`;
        } else {
            approvalBadge = `<span class="approval-badge approval-pending"><i class="bi bi-clock-fill"></i> Pending</span>`;
        }

        // Status Badge
        let statusBadge = '';
        const status = t.status || 'Draft';
        if (status === 'Active') statusBadge = '<span class="badge-status badge-active"><i class="bi bi-check-circle"></i> Active</span>';
        else if (status === 'Draft') statusBadge = '<span class="badge-status badge-draft"><i class="bi bi-pencil"></i> Draft</span>';
        else if (status === 'Archived') statusBadge = '<span class="badge-status badge-archived"><i class="bi bi-archive"></i> Archived</span>';
        else statusBadge = '<span class="badge-status badge-inactive"><i class="bi bi-x-circle"></i> Inactive</span>';

        const row = `
            <tr>
                <td class="ps-4">${titleHtml}</td>
                <td>${categoryBadge}</td>
                <td>${languageBadge}</td>
                <td>
                    <div class="date-status">
                        <span class="date-main">${dateMain}</span>
                        <span class="date-range">${dateRange}</span>
                        ${dateStatusBadge}
                    </div>
                </td>
                <td>${approvalBadge}</td>
                <td>${statusBadge}</td>
                <td class="text-center pe-4">
                    <div class="action-buttons">
                        <button class="btn-action btn-preview" onclick="previewTerms('${t.id}')" title="Preview"><i class="bi bi-eye"></i></button>
                        <button class="btn-action btn-edit" onclick="editTerms('${t.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
                        ${t.status !== 'Archived' ? `<button class="btn-action btn-archive" onclick="archiveTerms('${t.id}')" title="Archive"><i class="bi bi-archive"></i></button>` : ''}
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
    const totalPages = Math.ceil(window.filteredTerms.length / window.itemsPerPage);
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
// 🔥 PREVIEW FUNCTIONALITY
// ============================================
window.previewTerms = async function(id) {
    try {
        const t = await FirebaseDB.get(`systemSettings/termsAndConditions/${id}`);
        if (!t) return showEditErrorModal('T&C not found');

        $('#previewTitle').text(t.title || 'Untitled');
        $('#previewVersion').text(`Version: ${t.version || 'v1.0'} | Category: ${t.category || 'General'}`);
        $('#previewContent').html(t.content || '<p class="text-muted">No content</p>');
        
        if (t.customHeader) {
            $('#previewCustomHeader').text(t.customHeader).show();
        } else {
            $('#previewCustomHeader').hide();
        }
        
        if (t.customFooter) {
            $('#previewCustomFooter').text(t.customFooter).show();
        } else {
            $('#previewCustomFooter').hide();
        }

        new bootstrap.Modal(document.getElementById('termsPreviewModal')).show();
    } catch (err) {
        showEditErrorModal('Error loading T&C: ' + err.message);
    }
};

$('#btnPrintPreview').on('click', function() {
    const printContent = `
        <html>
        <head>
            <title>${$('#previewTitle').text()}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; line-height: 1.6; }
                h1, h2, h3 { color: #1A1A1A; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; }
            </style>
        </head>
        <body>
            <h1>${$('#previewTitle').text()}</h1>
            <p><strong>${$('#previewVersion').text()}</strong></p>
            <hr>
            ${$('#previewCustomHeader').is(':visible') ? `<div style="background: #fef3c7; padding: 1rem; margin: 1rem 0;">${$('#previewCustomHeader').text()}</div>` : ''}
            ${$('#previewContent').html()}
            ${$('#previewCustomFooter').is(':visible') ? `<div style="background: #fef3c7; padding: 1rem; margin: 1rem 0;">${$('#previewCustomFooter').text()}</div>` : ''}
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
});

// ============================================
// 🔥 ARCHIVE FUNCTION
// ============================================
window.archiveTerms = async function(id) {
    if (!confirm('Are you sure you want to archive this T&C? It will no longer be available for new bookings.')) {
        return;
    }

    try {
        await FirebaseDB.update(`systemSettings/termsAndConditions/${id}`, {
            status: 'Archived',
            lastUpdated: new Date().toISOString()
        });
        
        alert('T&C has been archived successfully.');
        await loadTerms();
    } catch (err) {
        showEditErrorModal('Failed to archive: ' + err.message);
    }
};

// ============================================
// 🔥 EDIT MODAL LOGIC
// ============================================
function setupEditModal() {
    $('#btnSaveTermsEdit').on('click', saveTermsEdit);
    $('#btnCloseEditSuccess').on('click', () => bootstrap.Modal.getInstance(document.getElementById('termsEditSuccessModal')).hide());
}

window.editTerms = async function(id) {
    try {
        const t = await FirebaseDB.get(`systemSettings/termsAndConditions/${id}`);
        if (!t) return showEditErrorModal('T&C not found');

        $('#editTermsId').val(id);
        $('#editTermsTitle').val(t.title);
        $('#editTermsVersion').val(t.version);
        $('#editTermsStatus').val(t.status);
        $('#editTermsCategory').val(t.category);
        $('#editTermsPriority').val(t.priority || 10);
        $('#editTermsLanguage').val(t.language || 'English');
        $('#editTermsShortDesc').val(t.shortDescription);
        
        // Applicability Checkboxes
        $('.edit-apply-shipment').prop('checked', false);
        (t.applicableShipmentTypes || []).forEach(v => $(`.edit-apply-shipment[value="${v}"]`).prop('checked', true));
        
        $('.edit-apply-direction').prop('checked', false);
        (t.applicableDirections || []).forEach(v => $(`.edit-apply-direction[value="${v}"]`).prop('checked', true));
        
        $('.edit-apply-customer').prop('checked', false);
        (t.applicableCustomerTypes || []).forEach(v => $(`.edit-apply-customer[value="${v}"]`).prop('checked', true));

        // Date & Approval
        $('#editEffectiveFrom').val(t.effectiveFrom);
        $('#editEffectiveTo').val(t.effectiveTo || '');
        $('#editApprovalStatus').val(t.approvalStatus || 'Pending');
        $('#editApprovedBy').val(t.approvedBy);
        $('#editLegalReference').val(t.legalReference);

        // Display switches
        $('#editShowBooking').prop('checked', t.showOnBooking !== false);
        $('#editPrintReceipt').prop('checked', t.printOnReceipt !== false);
        $('#editPrintInvoice').prop('checked', t.printOnInvoice !== false);
        $('#editShowWebsite').prop('checked', t.showOnWebsite || false);
        $('#editCustomHeader').val(t.customHeader);
        $('#editCustomFooter').val(t.customFooter);

        // Notes
        $('#editInternalNotes').val(t.internalNotes);

        // 🔥 Initialize Quill editor in modal AFTER modal is shown
        const modal = new bootstrap.Modal(document.getElementById('editTermsModal'));
        modal.show();

        // Wait for modal to be fully shown before initializing Quill
        document.getElementById('editTermsModal').addEventListener('shown.bs.modal', function handler() {
            initEditQuillEditor(t.content || '');
            this.removeEventListener('shown.bs.modal', handler);
        }, { once: true });

    } catch (err) {
        showEditErrorModal('Error loading T&C: ' + err.message);
    }
};

function initEditQuillEditor(content) {
    const editorContainer = document.querySelector('#editTermsEditor');
    if (!editorContainer) {
        console.error('❌ Edit editor container not found');
        return;
    }

    // Clear any existing Quill instance
    if (editQuillEditor) {
        editQuillEditor = null;
    }
    editorContainer.innerHTML = '';

    if (typeof Quill === 'undefined') {
        console.error('❌ Quill.js not loaded');
        return;
    }

    editQuillEditor = new Quill('#editTermsEditor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['blockquote', 'code-block'],
                ['link'],
                ['clean']
            ]
        }
    });

    // Set existing content
    if (content) {
        editQuillEditor.root.innerHTML = content;
    }

    console.log('✅ Edit Quill editor initialized');
}

async function saveTermsEdit() {
    const id = $('#editTermsId').val();
    const title = $('#editTermsTitle').val().trim();
    const effectiveFrom = $('#editEffectiveFrom').val();

    if (!title) return showEditErrorModal('Title is required');
    if (!effectiveFrom) return showEditErrorModal('Effective From date is required');
    
    if (!editQuillEditor) return showEditErrorModal('Editor not initialized');
    
    const content = editQuillEditor.getText().trim();
    if (!content) return showEditErrorModal('T&C content cannot be empty');

    const $btn = $('#btnSaveTermsEdit');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');

    try {
        const shipmentTypes = $('.edit-apply-shipment:checked').map((_, el) => el.value).get();
        const directions = $('.edit-apply-direction:checked').map((_, el) => el.value).get();
        const customerTypes = $('.edit-apply-customer:checked').map((_, el) => el.value).get();

        const updateData = {
            title: title,
            status: $('#editTermsStatus').val(),
            category: $('#editTermsCategory').val(),
            priority: parseInt($('#editTermsPriority').val()) || 10,
            language: $('#editTermsLanguage').val(),
            shortDescription: $('#editTermsShortDesc').val().trim(),
            
            content: editQuillEditor.root.innerHTML,
            contentText: content,
            
            applicableShipmentTypes: shipmentTypes,
            applicableDirections: directions,
            applicableCustomerTypes: customerTypes,
            
            effectiveFrom: effectiveFrom,
            effectiveTo: $('#editEffectiveTo').val() || null,
            approvalStatus: $('#editApprovalStatus').val(),
            approvedBy: $('#editApprovedBy').val().trim(),
            legalReference: $('#editLegalReference').val().trim(),
            
            showOnBooking: $('#editShowBooking').is(':checked'),
            printOnReceipt: $('#editPrintReceipt').is(':checked'),
            printOnInvoice: $('#editPrintInvoice').is(':checked'),
            showOnWebsite: $('#editShowWebsite').is(':checked'),
            customHeader: $('#editCustomHeader').val().trim(),
            customFooter: $('#editCustomFooter').val().trim(),
            
            internalNotes: $('#editInternalNotes').val().trim(),
            lastUpdated: new Date().toISOString()
        };

        await FirebaseDB.update(`systemSettings/termsAndConditions/${id}`, updateData);
        
        bootstrap.Modal.getInstance(document.getElementById('editTermsModal')).hide();
        new bootstrap.Modal(document.getElementById('termsEditSuccessModal')).show();
        
        await loadTerms();
    } catch (err) {
        showEditErrorModal('Failed to update: ' + err.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

function showEditErrorModal(msg) {
    $('#termsEditErrorMessage').text(msg);
    new bootstrap.Modal(document.getElementById('termsEditErrorModal')).show();
}

function debounce(func, wait) {
    let t; return function(...args) { clearTimeout(t); t = setTimeout(() => func(...args), wait); };
}