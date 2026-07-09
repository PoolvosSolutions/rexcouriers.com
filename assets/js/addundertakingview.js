// assets/js/addundertakingview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// 🔥 Global Quill editor instance
let quillEditor = null;

window.initAddUndertakingView = function() {
    console.log("🚀 [addundertakingview.js] initAddUndertakingView() executed successfully!");

    // 🔥 Check if Quill is loaded
    if (typeof Quill === 'undefined') {
        console.error("❌ Quill.js is not loaded! Check head.php for Quill CDN links.");
        showErrorModal('Rich text editor failed to load. Please refresh the page.');
        return;
    }

    console.log("✅ Quill.js detected, version:", Quill.version);

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    $('#effectiveFrom').val(today);

    // Initialize Quill editor
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
    setupAutoGenerateCode();
    setupAutoGenerateVersion();
    setupPreview();
    setupFullscreen();
    setupFormSubmission();
};

// ============================================
// 🔥 INITIALIZE QUILL EDITOR
// ============================================
function initQuillEditor() {
    const editorContainer = document.querySelector('#undertakingEditor');
    
    if (!editorContainer) {
        throw new Error('Editor container #undertakingEditor not found in DOM');
    }

    editorContainer.innerHTML = '';

    quillEditor = new Quill('#undertakingEditor', {
        theme: 'snow',
        placeholder: 'Write the full undertaking content here...\n\nExample sections:\n1. Definitions\n2. Declaration of Contents\n3. Prohibited Items\n4. Liability Clause\n5. Indemnification',
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

    quillEditor.on('text-change', function(delta, oldDelta, source) {
        console.log('📝 Editor content changed');
    });
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
        const undertakings = await FirebaseDB.getList('systemSettings/undertakings');
        const $select = $('#supersedesVersion');
        $select.empty().append('<option value="">None (New Undertaking)</option>');
        
        undertakings.forEach(u => {
            $select.append(`<option value="${u.id}">${u.title} (${u.version})</option>`);
        });
        console.log("✅ Loaded", undertakings.length, "existing undertakings");
    } catch (error) {
        console.error("❌ Error loading versions:", error);
    }
}

// ============================================
// 🔥 AUTO-GENERATE CODE
// ============================================
function setupAutoGenerateCode() {
    $('#undertakingTitle').on('blur', function() {
        const name = $(this).val().trim();
        if (!name) return;
        
        const currentCode = $('#undertakingCode').val().trim();
        if (!currentCode || currentCode.startsWith('UND-')) {
            const words = name.split(' ');
            let code = words.map(w => w.charAt(0).toUpperCase()).join('').substring(0, 4);
            code = 'UND-' + code + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            $('#undertakingCode').val(code);
        }
    });

    $('#undertakingCode').on('input', function() {
        $(this).val($(this).val().toUpperCase());
    });
}

// ============================================
// 🔥 AUTO-GENERATE VERSION
// ============================================
function setupAutoGenerateVersion() {
    $('#undertakingTitle').on('blur', function() {
        const currentVersion = $('#undertakingVersion').val().trim();
        if (!currentVersion || currentVersion.startsWith('v')) {
            const version = 'v' + (Math.floor(Math.random() * 9) + 1) + '.0';
            $('#undertakingVersion').val(version);
        }
    });
}

// ============================================
// 🔥 PREVIEW FUNCTIONALITY
// ============================================
function setupPreview() {
    $('#btnPreviewUndertaking').on('click', function() {
        if (!quillEditor) {
            showErrorModal('Editor not initialized');
            return;
        }

        const title = $('#undertakingTitle').val() || 'Untitled Undertaking';
        const version = $('#undertakingVersion').val() || 'v1.0';
        const declaration = $('#declarationText').val();
        const content = quillEditor.root.innerHTML;
        const acceptanceLabel = $('#acceptanceLabel').val();

        $('#previewTitle').text(title);
        $('#previewVersion').text(`Version: ${version} | Type: ${$('#undertakingType').val() || 'Customer'}`);
        $('#previewDeclaration').text(declaration || 'No declaration text provided');
        $('#previewContent').html(content);
        $('#previewAcceptanceLabel').text(acceptanceLabel);

        new bootstrap.Modal(document.getElementById('undertakingPreviewModal')).show();
    });

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
}

// ============================================
// 🔥 FULLSCREEN EDITOR
// ============================================
function setupFullscreen() {
    $('#btnFullscreenEditor').on('click', function() {
        const $page = $('.addundertaking-page');
        const $icon = $(this).find('i');
        
        $page.toggleClass('editor-fullscreen');
        
        if ($page.hasClass('editor-fullscreen')) {
            $icon.removeClass('bi-arrows-fullscreen').addClass('bi-arrows-angle-contract');
        } else {
            $icon.removeClass('bi-arrows-angle-contract').addClass('bi-arrows-fullscreen');
        }
    });
}

// ============================================
// 🔥 FORM SUBMISSION
// ============================================
function setupFormSubmission() {
    // Save as Draft button
    $('#btnSaveDraft').on('click', function() {
        $('#undertakingStatus').val('Draft');
        $('#addUndertakingForm').trigger('submit');
    });

    // Main form submission
    $('#addUndertakingForm').on('submit', async function(e) {
        e.preventDefault();
        
        if (!quillEditor) {
            showErrorModal('Editor not initialized. Please refresh the page.');
            return;
        }

        const $btn = $('#btnSaveUndertaking');
        const $btnText = $btn.find('.btn-text');
        const $btnLoader = $btn.find('.btn-loader');

        // 🔥 Validation
        const title = $('#undertakingTitle').val().trim();
        const code = $('#undertakingCode').val().trim();
        const version = $('#undertakingVersion').val().trim();
        const type = $('#undertakingType').val();
        const category = $('#undertakingCategory').val();
        const declaration = $('#declarationText').val().trim();
        const effectiveFrom = $('#effectiveFrom').val();
        const content = quillEditor.getText().trim();

        console.log("🔍 Validation check:", { title, code, version, type, category, declaration, effectiveFrom, contentLength: content.length });

        if (!title) { showErrorModal('Title is required'); $('#undertakingTitle').focus(); return; }
        if (!code) { showErrorModal('Code is required'); $('#undertakingCode').focus(); return; }
        if (!version) { showErrorModal('Version is required'); $('#undertakingVersion').focus(); return; }
        if (!type) { showErrorModal('Undertaking Type is required'); $('#undertakingType').focus(); return; }
        if (!category) { showErrorModal('Category is required'); $('#undertakingCategory').focus(); return; }
        if (!declaration) { showErrorModal('Declaration Text is required'); $('#declarationText').focus(); return; }
        if (!effectiveFrom) { showErrorModal('Effective From date is required'); $('#effectiveFrom').focus(); return; }
        if (!content) { showErrorModal('Undertaking content cannot be empty'); return; }

        $btn.prop('disabled', true);
        $btnText.addClass('d-none');
        $btnLoader.removeClass('d-none');

        try {
            console.log("💾 Saving Undertaking to Firebase...");

            // Collect checkbox arrays
            const shipmentTypes = $('.apply-shipment:checked').map((_, el) => el.value).get();
            const directions = $('.apply-direction:checked').map((_, el) => el.value).get();
            const customerTypes = $('.apply-customer:checked').map((_, el) => el.value).get();
            const carrierIds = $('#carrierSpecific').val() || [];
            const acceptanceType = $('.acceptance-type:checked').val();

            const undertakingData = {
                // Basic Info
                title: title,
                code: code,
                version: version,
                status: $('#undertakingStatus').val(),
                type: type,
                category: category,
                priority: parseInt($('#undertakingPriority').val()) || 10,
                language: $('#undertakingLanguage').val(),
                shortDescription: $('#undertakingShortDesc').val().trim(),
                isMandatory: $('#isMandatory').is(':checked'),
                requiresSignature: $('#requiresSignature').is(':checked'),
                
                // Declaration
                declarationText: declaration,
                
                // Content (HTML)
                content: quillEditor.root.innerHTML,
                contentText: content,
                
                // Acceptance
                acceptanceType: acceptanceType,
                acceptanceLabel: $('#acceptanceLabel').val().trim(),
                signaturePlaceholder: $('#signaturePlaceholder').val().trim(),
                
                // Applicability
                applicableShipmentTypes: shipmentTypes,
                applicableDirections: directions,
                applicableCustomerTypes: customerTypes,
                applicableCarrierIds: carrierIds.filter(c => c !== ''),
                minWeightThreshold: parseFloat($('#minWeightThreshold').val()) || 0,
                minDeclaredValue: parseFloat($('#minDeclaredValue').val()) || 0,
                
                // Date & Version
                effectiveFrom: effectiveFrom,
                effectiveTo: $('#effectiveTo').val() || null,
                supersedesVersion: $('#supersedesVersion').val() || null,
                
                // Approval
                approvalStatus: $('#approvalStatus').val(),
                approvedBy: $('#approvedBy').val().trim(),
                legalReference: $('#legalReference').val().trim(),
                
                // Display
                showOnBooking: $('#showOnBooking').is(':checked'),
                printOnReceipt: $('#printOnReceipt').is(':checked'),
                printOnInvoice: $('#printOnInvoice').is(':checked'),
                requireAcknowledgment: $('#requireAcknowledgment').is(':checked'),
                
                // Notes
                internalNotes: $('#internalNotes').val().trim(),
                
                // Metadata
                createdAt: new Date().toISOString(),
                createdBy: window.sessionData ? window.sessionData.userId : 'unknown',
                lastUpdated: new Date().toISOString()
            };

            const undertakingId = await FirebaseDB.push('systemSettings/undertakings', undertakingData);
            console.log("✅ Undertaking saved with ID:", undertakingId);

            // Auto-archive superseded version
            if (undertakingData.supersedesVersion) {
                await FirebaseDB.update(`systemSettings/undertakings/${undertakingData.supersedesVersion}`, {
                    status: 'Archived',
                    supersededBy: undertakingId,
                    lastUpdated: new Date().toISOString()
                });
            }

            const statusText = undertakingData.status === 'Draft' ? 'saved as draft' : 'saved and activated';
            $('#successMessage').text(`Undertaking has been ${statusText} successfully.`);
            $('#successUndertakingTitle').text(`${title} (${version})`);
            new bootstrap.Modal(document.getElementById('undertakingSuccessModal')).show();

        } catch (error) {
            console.error("❌ Error saving undertaking:", error);
            showErrorModal(error.message || 'Failed to save undertaking.');
        } finally {
            $btn.prop('disabled', false);
            $btnText.removeClass('d-none');
            $btnLoader.addClass('d-none');
        }
    });

    $('#btnAddAnotherUndertaking').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('undertakingSuccessModal')).hide();
        resetForm();
    });

    $('#btnViewUndertakingList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('undertakingSuccessModal')).hide();
        loadView('undertaking');
    });
}

function showErrorModal(message) {
    $('#undertakingErrorMessage').text(message);
    new bootstrap.Modal(document.getElementById('undertakingErrorModal')).show();
}

function resetForm() {
    $('#addUndertakingForm')[0].reset();
    
    if (quillEditor) {
        quillEditor.setText('');
    }
    
    const today = new Date().toISOString().split('T')[0];
    $('#effectiveFrom').val(today);
    $('#undertakingStatus').val('Draft');
    $('#undertakingPriority').val('10');
    $('#undertakingLanguage').val('English');
    $('#approvalStatus').val('Pending');
    $('#acceptanceLabel').val('I have read and accept the above undertaking');
    $('#signaturePlaceholder').val('Sign here to acknowledge');
    
    $('.apply-shipment, .apply-direction, .apply-customer').prop('checked', false);
    $('#applyParcel, #applyInternational, #applyCash, #applyAccount').prop('checked', true);
    $('#showOnBooking, #printOnReceipt, #printOnInvoice, #requireAcknowledgment, #requiresSignature').prop('checked', true);
    $('#isMandatory').prop('checked', false);
    
    $('#undertakingCode').val('');
    $('#undertakingVersion').val('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}