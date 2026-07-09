// assets/js/undertakingview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// 🔥 Global Quill instance for edit modal
let editQuillEditor = null;

window.initUndertakingView = function() {
    console.log("🚀 [undertakingview.js] initUndertakingView() executed successfully!");
    
    window.allUndertakings = [];
    window.filteredUndertakings = [];
    window.currentPage = 1;
    window.itemsPerPage = 50;

    setupFilters();
    setupPagination();
    setupEditModal();
    loadUndertakings();
};

async function loadUndertakings() {
    try {
        const undertakings = await FirebaseDB.getList('systemSettings/undertakings');
        window.allUndertakings = Array.isArray(undertakings) ? undertakings : [];
        
        // Sort by priority then by effective date
        window.allUndertakings.sort((a, b) => {
            if ((a.priority || 99) !== (b.priority || 99)) {
                return (a.priority || 99) - (b.priority || 99);
            }
            return (b.effectiveFrom || '').localeCompare(a.effectiveFrom || '');
        });
        
        updateStats();
        applyFilters();
    } catch (error) {
        console.error("❌ Error loading undertakings:", error);
        showEditErrorModal('Failed to load undertakings: ' + error.message);
    }
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    
    $('#statTotal').text(window.allUndertakings.length);
    
    $('#statActive').text(window.allUndertakings.filter(u => 
        u.status === 'Active' && 
        (!u.effectiveFrom || u.effectiveFrom <= today) &&
        (!u.effectiveTo || u.effectiveTo >= today)
    ).length);
    
    $('#statMandatory').text(window.allUndertakings.filter(u => u.isMandatory === true).length);
    $('#statDraft').text(window.allUndertakings.filter(u => u.status === 'Draft').length);
}

function setupFilters() {
    $('#searchInput').on('input', debounce(applyFilters, 300));
    $('#filterStatus, #filterType, #filterCategory, #filterApproval').on('change', applyFilters);
    $('#btnClearFilters').on('click', function() {
        $('#searchInput, #filterStatus, #filterType, #filterCategory, #filterApproval').val('');
        applyFilters();
    });
}

function applyFilters() {
    const search = $('#searchInput').val().toLowerCase().trim();
    const status = $('#filterStatus').val();
    const type = $('#filterType').val();
    const category = $('#filterCategory').val();
    const approval = $('#filterApproval').val();

    window.filteredUndertakings = window.allUndertakings.filter(u => {
        if (search && !((u.title || '').toLowerCase().includes(search) || (u.code || '').toLowerCase().includes(search))) return false;
        if (status && u.status !== status) return false;
        if (type && u.type !== type) return false;
        if (category && u.category !== category) return false;
        if (approval && u.approvalStatus !== approval) return false;
        return true;
    });

    window.currentPage = 1;
    renderTable();
    renderPagination();
}

function renderTable() {
    const start = (window.currentPage - 1) * window.itemsPerPage;
    const end = start + window.itemsPerPage;
    const pageData = window.filteredUndertakings.slice(start, end);
    const today = new Date().toISOString().split('T')[0];

    $('#showingFrom').text(window.filteredUndertakings.length > 0 ? start + 1 : 0);
    $('#showingTo').text(Math.min(end, window.filteredUndertakings.length));
    $('#showingTotal').text(window.filteredUndertakings.length);

    const $tbody = $('#undertakingTableBody').empty();

    if (pageData.length === 0) {
        $tbody.html(`<tr><td colspan="9" class="text-center py-5"><i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i><p class="mt-3 text-muted">No undertakings found</p></td></tr>`);
        return;
    }

    pageData.forEach(u => {
        // Title & Version
        const titleHtml = `
            <div class="title-version">
                <span class="title-main">${u.title || '-'}</span>
                <span class="title-version-tag">${u.code || ''} • ${u.version || 'v1.0'}</span>
            </div>
        `;

        // Type Badge
        const typeClass = `type-${(u.type || 'customer').toLowerCase().replace(/[^a-z]/g, '-')}`;
        let typeIcon = 'bi-person';
        if (u.type === 'Staff') typeIcon = 'bi-person-badge';
        else if (u.type === 'Customs') typeIcon = 'bi-shield-check';
        else if (u.type === 'High-Value') typeIcon = 'bi-cash-stack';
        else if (u.type === 'Fragile') typeIcon = 'bi-droplet';
        else if (u.type === 'Dangerous-Goods') typeIcon = 'bi-exclamation-triangle';
        else if (u.type === 'Carrier-Specific') typeIcon = 'bi-truck';
        
        const typeBadge = `<span class="type-badge ${typeClass}"><i class="bi ${typeIcon}"></i> ${u.type || 'Customer'}</span>`;

        // Category Badge
        const categoryBadge = `<span class="category-badge">${u.category || 'General'}</span>`;

        // Acceptance Badge
        let acceptanceBadge = '';
        const accType = u.acceptanceType || 'Checkbox';
        let accIcon = 'bi-check-square';
        if (accType === 'Digital-Signature') accIcon = 'bi-signature';
        else if (accType === 'Physical-Signature') accIcon = 'bi-pen';
        else if (accType === 'OTP-Verification') accIcon = 'bi-shield-lock';
        
        const accClass = `acceptance-${accType.toLowerCase().replace(/[^a-z]/g, '-')}`;
        acceptanceBadge = `<span class="acceptance-badge ${accClass}"><i class="bi ${accIcon}"></i> ${accType}</span>`;

        // Mandatory Badge
        const mandatoryBadge = u.isMandatory 
            ? '<span class="mandatory-badge mandatory-yes"><i class="bi bi-shield-lock-fill"></i> Mandatory</span>'
            : '<span class="mandatory-badge mandatory-no">Optional</span>';

        // Date Status
        let dateStatusBadge = '';
        let dateMain = u.effectiveFrom || '-';
        let dateRange = '';
        
        if (u.status === 'Archived' || u.status === 'Inactive') {
            dateStatusBadge = '<span class="date-status-badge expired">Inactive</span>';
        } else if (u.status === 'Draft') {
            dateStatusBadge = '<span class="date-status-badge upcoming">Draft</span>';
        } else if (!u.effectiveFrom) {
            dateStatusBadge = '<span class="date-status-badge ongoing">Ongoing</span>';
        } else if (u.effectiveFrom > today) {
            dateStatusBadge = '<span class="date-status-badge upcoming">Upcoming</span>';
        } else if (u.effectiveTo && u.effectiveTo < today) {
            dateStatusBadge = '<span class="date-status-badge expired">Expired</span>';
        } else {
            dateStatusBadge = '<span class="date-status-badge active-now">Currently Active</span>';
        }
        
        dateRange = u.effectiveTo ? `Until: ${u.effectiveTo}` : 'Ongoing';

        // Approval Badge
        let approvalBadge = '';
        const approval = u.approvalStatus || 'Pending';
        if (approval === 'Approved') {
            approvalBadge = `<span class="approval-badge approval-approved"><i class="bi bi-check-circle-fill"></i> Approved</span>`;
        } else if (approval === 'Rejected') {
            approvalBadge = `<span class="approval-badge approval-rejected"><i class="bi bi-x-circle-fill"></i> Rejected</span>`;
        } else {
            approvalBadge = `<span class="approval-badge approval-pending"><i class="bi bi-clock-fill"></i> Pending</span>`;
        }

        // Status Badge
        let statusBadge = '';
        const status = u.status || 'Draft';
        if (status === 'Active') statusBadge = '<span class="badge-status badge-active"><i class="bi bi-check-circle"></i> Active</span>';
        else if (status === 'Draft') statusBadge = '<span class="badge-status badge-draft"><i class="bi bi-pencil"></i> Draft</span>';
        else if (status === 'Archived') statusBadge = '<span class="badge-status badge-archived"><i class="bi bi-archive"></i> Archived</span>';
        else statusBadge = '<span class="badge-status badge-inactive"><i class="bi bi-x-circle"></i> Inactive</span>';

        const row = `
            <tr>
                <td class="ps-4"><strong>${u.code || '-'}</strong><br>${mandatoryBadge}</td>
                <td>${titleHtml}</td>
                <td>${typeBadge}</td>
                <td>${categoryBadge}</td>
                <td>${acceptanceBadge}</td>
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
                        <button class="btn-action btn-preview" onclick="previewUndertaking('${u.id}')" title="Preview"><i class="bi bi-eye"></i></button>
                        <button class="btn-action btn-edit" onclick="editUndertaking('${u.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
                        ${u.status !== 'Archived' ? `<button class="btn-action btn-archive" onclick="archiveUndertaking('${u.id}')" title="Archive"><i class="bi bi-archive"></i></button>` : ''}
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
    const totalPages = Math.ceil(window.filteredUndertakings.length / window.itemsPerPage);
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
window.previewUndertaking = async function(id) {
    try {
        const u = await FirebaseDB.get(`systemSettings/undertakings/${id}`);
        if (!u) return showEditErrorModal('Undertaking not found');

        $('#previewTitle').text(u.title || 'Untitled');
        $('#previewVersion').text(`Version: ${u.version || 'v1.0'} | Type: ${u.type || 'Customer'} | Code: ${u.code || '-'}`);
        $('#previewDeclaration').text(u.declarationText || 'No declaration text provided');
        $('#previewContent').html(u.content || '<p class="text-muted">No content</p>');
        $('#previewAcceptanceLabel').text(u.acceptanceLabel || 'I have read and accept');

        new bootstrap.Modal(document.getElementById('undertakingPreviewModal')).show();
    } catch (err) {
        showEditErrorModal('Error loading undertaking: ' + err.message);
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
                .declaration { background: #fef3c7; padding: 1rem; margin: 1rem 0; border-left: 4px solid #f59e0b; font-style: italic; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                .signature-line { margin-top: 3rem; border-top: 2px solid #000; width: 300px; padding-top: 0.5rem; }
            </style>
        </head>
        <body>
            <h1>${$('#previewTitle').text()}</h1>
            <p><strong>${$('#previewVersion').text()}</strong></p>
            <hr>
            <div class="declaration">${$('#previewDeclaration').text()}</div>
            <hr>
            ${$('#previewContent').html()}
            <div class="signature-line">
                <p>Signature: _________________________</p>
                <p>Name: _________________________</p>
                <p>Date: _________________________</p>
                <p>CNIC: _________________________</p>
            </div>
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
window.archiveUndertaking = async function(id) {
    if (!confirm('Are you sure you want to archive this undertaking? It will no longer be available for new bookings.')) {
        return;
    }

    try {
        await FirebaseDB.update(`systemSettings/undertakings/${id}`, {
            status: 'Archived',
            lastUpdated: new Date().toISOString()
        });
        
        alert('Undertaking has been archived successfully.');
        await loadUndertakings();
    } catch (err) {
        showEditErrorModal('Failed to archive: ' + err.message);
    }
};

// ============================================
// 🔥 EDIT MODAL LOGIC
// ============================================
function setupEditModal() {
    $('#btnSaveUndertakingEdit').on('click', saveUndertakingEdit);
    $('#btnCloseEditSuccess').on('click', () => bootstrap.Modal.getInstance(document.getElementById('undertakingEditSuccessModal')).hide());
}

window.editUndertaking = async function(id) {
    try {
        const u = await FirebaseDB.get(`systemSettings/undertakings/${id}`);
        if (!u) return showEditErrorModal('Undertaking not found');

        $('#editUndertakingId').val(id);
        $('#editUndertakingTitle').val(u.title);
        $('#editUndertakingCode').val(u.code);
        $('#editUndertakingVersion').val(u.version);
        $('#editUndertakingStatus').val(u.status);
        $('#editUndertakingType').val(u.type);
        $('#editUndertakingCategory').val(u.category);
        $('#editUndertakingPriority').val(u.priority || 10);
        $('#editUndertakingLanguage').val(u.language || 'English');
        $('#editUndertakingShortDesc').val(u.shortDescription);
        $('#editIsMandatory').prop('checked', u.isMandatory || false);
        $('#editDeclarationText').val(u.declarationText);

        // Acceptance
        $('#editAcceptanceType').val(u.acceptanceType || 'Checkbox');
        $('#editAcceptanceLabel').val(u.acceptanceLabel || '');
        $('#editSignaturePlaceholder').val(u.signaturePlaceholder || '');
        $('#editRequiresSignature').prop('checked', u.requiresSignature !== false);

        // Applicability Checkboxes
        $('.edit-apply-shipment').prop('checked', false);
        (u.applicableShipmentTypes || []).forEach(v => $(`.edit-apply-shipment[value="${v}"]`).prop('checked', true));
        
        $('.edit-apply-direction').prop('checked', false);
        (u.applicableDirections || []).forEach(v => $(`.edit-apply-direction[value="${v}"]`).prop('checked', true));
        
        $('.edit-apply-customer').prop('checked', false);
        (u.applicableCustomerTypes || []).forEach(v => $(`.edit-apply-customer[value="${v}"]`).prop('checked', true));

        // Date & Approval
        $('#editEffectiveFrom').val(u.effectiveFrom);
        $('#editEffectiveTo').val(u.effectiveTo || '');
        $('#editApprovalStatus').val(u.approvalStatus || 'Pending');
        $('#editApprovedBy').val(u.approvedBy);
        $('#editLegalReference').val(u.legalReference);

        // Display switches
        $('#editShowBooking').prop('checked', u.showOnBooking !== false);
        $('#editPrintReceipt').prop('checked', u.printOnReceipt !== false);
        $('#editPrintInvoice').prop('checked', u.printOnInvoice !== false);
        $('#editRequireAck').prop('checked', u.requireAcknowledgment !== false);

        // Notes
        $('#editInternalNotes').val(u.internalNotes);

        // 🔥 Show modal first, then initialize Quill
        const modal = new bootstrap.Modal(document.getElementById('editUndertakingModal'));
        modal.show();

        // Wait for modal to be fully shown before initializing Quill
        document.getElementById('editUndertakingModal').addEventListener('shown.bs.modal', function handler() {
            initEditQuillEditor(u.content || '');
            this.removeEventListener('shown.bs.modal', handler);
        }, { once: true });

    } catch (err) {
        showEditErrorModal('Error loading undertaking: ' + err.message);
    }
};

function initEditQuillEditor(content) {
    const editorContainer = document.querySelector('#editUndertakingEditor');
    if (!editorContainer) {
        console.error('❌ Edit editor container not found');
        return;
    }

    if (editQuillEditor) {
        editQuillEditor = null;
    }
    editorContainer.innerHTML = '';

    if (typeof Quill === 'undefined') {
        console.error('❌ Quill.js not loaded');
        return;
    }

    editQuillEditor = new Quill('#editUndertakingEditor', {
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

    if (content) {
        editQuillEditor.root.innerHTML = content;
    }

    console.log('✅ Edit Quill editor initialized');
}

async function saveUndertakingEdit() {
    const id = $('#editUndertakingId').val();
    const title = $('#editUndertakingTitle').val().trim();
    const declaration = $('#editDeclarationText').val().trim();
    const effectiveFrom = $('#editEffectiveFrom').val();

    if (!title) return showEditErrorModal('Title is required');
    if (!declaration) return showEditErrorModal('Declaration Text is required');
    if (!effectiveFrom) return showEditErrorModal('Effective From date is required');
    
    if (!editQuillEditor) return showEditErrorModal('Editor not initialized');
    
    const content = editQuillEditor.getText().trim();
    if (!content) return showEditErrorModal('Undertaking content cannot be empty');

    const $btn = $('#btnSaveUndertakingEdit');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');

    try {
        const shipmentTypes = $('.edit-apply-shipment:checked').map((_, el) => el.value).get();
        const directions = $('.edit-apply-direction:checked').map((_, el) => el.value).get();
        const customerTypes = $('.edit-apply-customer:checked').map((_, el) => el.value).get();

        const updateData = {
            title: title,
            status: $('#editUndertakingStatus').val(),
            type: $('#editUndertakingType').val(),
            category: $('#editUndertakingCategory').val(),
            priority: parseInt($('#editUndertakingPriority').val()) || 10,
            language: $('#editUndertakingLanguage').val(),
            shortDescription: $('#editUndertakingShortDesc').val().trim(),
            isMandatory: $('#editIsMandatory').is(':checked'),
            
            declarationText: declaration,
            content: editQuillEditor.root.innerHTML,
            contentText: content,
            
            acceptanceType: $('#editAcceptanceType').val(),
            acceptanceLabel: $('#editAcceptanceLabel').val().trim(),
            signaturePlaceholder: $('#editSignaturePlaceholder').val().trim(),
            requiresSignature: $('#editRequiresSignature').is(':checked'),
            
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
            requireAcknowledgment: $('#editRequireAck').is(':checked'),
            
            internalNotes: $('#editInternalNotes').val().trim(),
            lastUpdated: new Date().toISOString()
        };

        await FirebaseDB.update(`systemSettings/undertakings/${id}`, updateData);
        
        bootstrap.Modal.getInstance(document.getElementById('editUndertakingModal')).hide();
        new bootstrap.Modal(document.getElementById('undertakingEditSuccessModal')).show();
        
        await loadUndertakings();
    } catch (err) {
        showEditErrorModal('Failed to update: ' + err.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

function showEditErrorModal(msg) {
    $('#undertakingEditErrorMessage').text(msg);
    new bootstrap.Modal(document.getElementById('undertakingEditErrorModal')).show();
}

function debounce(func, wait) {
    let t; return function(...args) { clearTimeout(t); t = setTimeout(() => func(...args), wait); };
}