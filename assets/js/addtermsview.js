// assets/js/addtermsview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// 🔥 Global Quill editor instance
let quillEditor = null;

window.initAddTermsView = function() {
    console.log("🚀 [addtermsview.js] initAddTermsView() executed successfully!");

    // 🔥 CRITICAL: Check if Quill is loaded
    if (typeof Quill === 'undefined') {
        console.error("❌ Quill.js is not loaded! Check head.php for Quill CDN links.");
        showErrorModal('Rich text editor failed to load. Please refresh the page.');
        return;
    }

    console.log("✅ Quill.js detected, version:", Quill.version);

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    $('#effectiveFrom').val(today);

    // 🔥 Initialize Quill editor with error handling
    try {
        initQuillEditor();
        console.log("✅ Quill editor initialized successfully");
    } catch (error) {
        console.error("❌ Failed to initialize Quill editor:", error);
        showErrorModal('Failed to initialize text editor: ' + error.message);
        return;
    }

    // Load dropdowns
    loadCarriers();
    loadExistingVersions();

    // Setup event handlers
    setupAutoGenerateVersion();
    setupPreview();
    setupFullscreen();
    setupFormSubmission();
};

// ============================================
// 🔥 INITIALIZE QUILL EDITOR (WITH ERROR HANDLING)
// ============================================
function initQuillEditor() {
    const editorContainer = document.querySelector('#termsEditor');
    
    if (!editorContainer) {
        throw new Error('Editor container #termsEditor not found in DOM');
    }

    // Clear any existing content
    editorContainer.innerHTML = '';

    // Initialize Quill with comprehensive toolbar
    quillEditor = new Quill('#termsEditor', {
        theme: 'snow',
        placeholder: 'Start writing your Terms & Conditions here...\n\nExample:\n1. Liability Limit\nThe carrier shall not be liable for any loss or damage exceeding PKR 50,000 per shipment.\n\n2. Prohibited Items\nThe following items are strictly prohibited...',
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

    // 🔥 Add event listener to track changes
    quillEditor.on('text-change', function(delta, oldDelta, source) {
        console.log('📝 Editor content changed');
    });

    // 🔥 Set initial content (optional - you can add default T&C template here)
    // quillEditor.root.innerHTML = '<h2>Default Template</h2><p>Start editing...</p>';
}

// ============================================
// 🔥 LOAD CARRIERS FOR DROPDOWN
// ============================================
async function loadCarriers() {
    try {
        const carriers = await FirebaseDB.getList('carriers');
        const $select = $('#carrierSpecific');
        $select.empty().append('<option value="">All Carriers (No restriction)</option>');
        
        carriers.filter(c => c.status === 'Active').forEach(c => {
            $select.append(`<option value="${c.id}">${c.carrierName} (${c.carrierCode})</option>`);
        });
        console.log("✅ Loaded", carriers.length, "carriers");
    } catch (error) {
        console.error("❌ Error loading carriers:", error);
    }
}

// ============================================
// 🔥 LOAD EXISTING VERSIONS
// ============================================
async function loadExistingVersions() {
    try {
        const terms = await FirebaseDB.getList('systemSettings/termsAndConditions');
        const $select = $('#supersedesVersion');
        $select.empty().append('<option value="">None (New T&C)</option>');
        
        terms.forEach(t => {
            $select.append(`<option value="${t.id}">${t.title} (${t.version})</option>`);
        });
        console.log("✅ Loaded", terms.length, "existing T&C versions");
    } catch (error) {
        console.error("❌ Error loading versions:", error);
    }
}

// ============================================
// 🔥 AUTO-GENERATE VERSION
// ============================================
function setupAutoGenerateVersion() {
    $('#termsTitle').on('blur', function() {
        const currentVersion = $('#termsVersion').val().trim();
        if (!currentVersion || currentVersion.startsWith('v')) {
            const version = 'v' + (Math.floor(Math.random() * 9) + 1) + '.0';
            $('#termsVersion').val(version);
        }
    });
}

// ============================================
// 🔥 PREVIEW FUNCTIONALITY
// ============================================
function setupPreview() {
    $('#btnPreviewTerms').on('click', function() {
        if (!quillEditor) {
            showErrorModal('Editor not initialized');
            return;
        }

        const title = $('#termsTitle').val() || 'Untitled Terms';
        const version = $('#termsVersion').val() || 'v1.0';
        const content = quillEditor.root.innerHTML;
        const customHeader = $('#customHeader').val();
        const customFooter = $('#customFooter').val();

        $('#previewTitle').text(title);
        $('#previewVersion').text(`Version: ${version}`);
        $('#previewContent').html(content);
        $('#previewCustomHeader').text(customHeader).toggle(!!customHeader);
        $('#previewCustomFooter').text(customFooter).toggle(!!customFooter);

        new bootstrap.Modal(document.getElementById('termsPreviewModal')).show();
    });

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
}

// ============================================
// 🔥 FULLSCREEN EDITOR (FIXED)
// ============================================
function setupFullscreen() {
    $('#btnFullscreenEditor').on('click', function() {
        const $page = $('.addterms-page');
        const $icon = $(this).find('i');
        
        $page.toggleClass('editor-fullscreen');
        
        if ($page.hasClass('editor-fullscreen')) {
            $icon.removeClass('bi-arrows-fullscreen').addClass('bi-arrows-angle-contract');
            $(this).find('.btn-text').text(' Exit Fullscreen');
        } else {
            $icon.removeClass('bi-arrows-angle-contract').addClass('bi-arrows-fullscreen');
            $(this).find('.btn-text').text(' Fullscreen');
        }
    });
}

// ============================================
// 🔥 FORM SUBMISSION
// ============================================
function setupFormSubmission() {
    // Save as Draft button
    $('#btnSaveDraft').on('click', function() {
        $('#termsStatus').val('Draft');
        $('#addTermsForm').trigger('submit');
    });

    // Main form submission
    $('#addTermsForm').on('submit', async function(e) {
        e.preventDefault();
        
        if (!quillEditor) {
            showErrorModal('Editor not initialized. Please refresh the page.');
            return;
        }

        const $btn = $('#btnSaveTerms');
        const $btnText = $btn.find('.btn-text');
        const $btnLoader = $btn.find('.btn-loader');

        // 🔥 Validation
        const title = $('#termsTitle').val().trim();
        const version = $('#termsVersion').val().trim();
        const category = $('#termsCategory').val();
        const effectiveFrom = $('#effectiveFrom').val();
        const content = quillEditor.getText().trim();

        console.log("🔍 Validation check:", { title, version, category, effectiveFrom, contentLength: content.length });

        if (!title) { showErrorModal('Title is required'); $('#termsTitle').focus(); return; }
        if (!version) { showErrorModal('Version is required'); $('#termsVersion').focus(); return; }
        if (!category) { showErrorModal('Category is required'); $('#termsCategory').focus(); return; }
        if (!effectiveFrom) { showErrorModal('Effective From date is required'); $('#effectiveFrom').focus(); return; }
        if (!content) { showErrorModal('T&C content cannot be empty. Please write some content in the editor.'); return; }

        $btn.prop('disabled', true);
        $btnText.addClass('d-none');
        $btnLoader.removeClass('d-none');

        try {
            console.log("💾 Saving T&C to Firebase...");

            // Collect checkbox arrays
            const shipmentTypes = $('.apply-shipment:checked').map((_, el) => el.value).get();
            const directions = $('.apply-direction:checked').map((_, el) => el.value).get();
            const customerTypes = $('.apply-customer:checked').map((_, el) => el.value).get();
            const carrierIds = $('#carrierSpecific').val() || [];

            const termsData = {
                title: title,
                version: version,
                status: $('#termsStatus').val(),
                category: category,
                priority: parseInt($('#termsPriority').val()) || 10,
                language: $('#termsLanguage').val(),
                shortDescription: $('#termsShortDesc').val().trim(),
                
                content: quillEditor.root.innerHTML,
                contentText: content,
                
                applicableShipmentTypes: shipmentTypes,
                applicableDirections: directions,
                applicableCustomerTypes: customerTypes,
                applicableCarrierIds: carrierIds.filter(c => c !== ''),
                minWeightThreshold: parseFloat($('#minWeightThreshold').val()) || 0,
                minDeclaredValue: parseFloat($('#minDeclaredValue').val()) || 0,
                
                effectiveFrom: effectiveFrom,
                effectiveTo: $('#effectiveTo').val() || null,
                supersedesVersion: $('#supersedesVersion').val() || null,
                
                approvalStatus: $('#approvalStatus').val(),
                approvedBy: $('#approvedBy').val().trim(),
                legalReference: $('#legalReference').val().trim(),
                
                showOnBooking: $('#showOnBooking').is(':checked'),
                printOnReceipt: $('#printOnReceipt').is(':checked'),
                printOnInvoice: $('#printOnInvoice').is(':checked'),
                showOnWebsite: $('#showOnWebsite').is(':checked'),
                customHeader: $('#customHeader').val().trim(),
                customFooter: $('#customFooter').val().trim(),
                
                internalNotes: $('#internalNotes').val().trim(),
                
                createdAt: new Date().toISOString(),
                createdBy: window.sessionData ? window.sessionData.userId : 'unknown',
                lastUpdated: new Date().toISOString()
            };

            const termsId = await FirebaseDB.push('systemSettings/termsAndConditions', termsData);
            console.log("✅ T&C saved with ID:", termsId);

            // Auto-archive superseded version
            if (termsData.supersedesVersion) {
                await FirebaseDB.update(`systemSettings/termsAndConditions/${termsData.supersedesVersion}`, {
                    status: 'Archived',
                    supersededBy: termsId,
                    lastUpdated: new Date().toISOString()
                });
            }

            const statusText = termsData.status === 'Draft' ? 'saved as draft' : 'saved and activated';
            $('#successMessage').text(`T&C has been ${statusText} successfully.`);
            $('#successTermsTitle').text(`Title: ${title} (${version})`);
            new bootstrap.Modal(document.getElementById('termsSuccessModal')).show();

        } catch (error) {
            console.error("❌ Error saving T&C:", error);
            showErrorModal(error.message || 'Failed to save T&C.');
        } finally {
            $btn.prop('disabled', false);
            $btnText.removeClass('d-none');
            $btnLoader.addClass('d-none');
        }
    });

    $('#btnAddAnotherTerms').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('termsSuccessModal')).hide();
        resetForm();
    });

    $('#btnViewTermsList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('termsSuccessModal')).hide();
        loadView('terms');
    });
}

function showErrorModal(message) {
    $('#termsErrorMessage').text(message);
    new bootstrap.Modal(document.getElementById('termsErrorModal')).show();
}

function resetForm() {
    $('#addTermsForm')[0].reset();
    
    if (quillEditor) {
        quillEditor.setText('');
    }
    
    const today = new Date().toISOString().split('T')[0];
    $('#effectiveFrom').val(today);
    $('#termsStatus').val('Draft');
    $('#termsPriority').val('10');
    $('#termsLanguage').val('English');
    $('#approvalStatus').val('Pending');
    
    $('.apply-shipment, .apply-direction, .apply-customer').prop('checked', true);
    $('#applyCargo').prop('checked', false);
    $('#showOnBooking, #printOnReceipt, #printOnInvoice').prop('checked', true);
    $('#showOnWebsite').prop('checked', false);
    
    $('#termsVersion').val('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}