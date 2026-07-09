// assets/js/admin.js

// 1. Imports
import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

// 🔥 Expose to window so non-module scripts can use them
window.FirebaseDB = FirebaseDB;
window.FirebaseAuth = FirebaseAuth;

// 2. Firebase auth check
function checkFirebaseAuthOnLoad() {
    console.log("🚀 [Admin.js] Services Started & Connected.");
    FirebaseAuth.onAuthChange((user) => {
        if (user) console.log("✅ User logged in:", user.email);
        else console.log("⚠️ No user authenticated.");
    });
}
checkFirebaseAuthOnLoad();

// Ensure showErrorModal exists
if (typeof showErrorModal !== 'function') {
    window.showErrorModal = (msg) => alert(msg);
}

// 3. Session helper functions (FIXED: Removed duplication, kept robust global versions)
window.getSession = function(key) {
    const val = sessionStorage.getItem(key);
    try { return JSON.parse(val); } catch(e) { return val; }
};

window.setSession = function(key, value) {
    sessionStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
};

window.clearSession = function() {
    sessionStorage.clear();
    localStorage.clear();
    if (window.sessionData) window.sessionData = null;
    if (window.currentUser) window.currentUser = null;
    console.log("🧹 All client-side storage cleared");
};

// 4. Utility helper functions
function toggleButtonLoading($btn, isLoading) {
    if (isLoading) {
        $btn.data('original-text', $btn.html());
        $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Processing...');
    } else {
        $btn.prop('disabled', false).html($btn.data('original-text'));
    }
}

function showContentLoader(viewName) {
    $("#dynamicContent").html(`
        <div class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3">Loading <strong>${viewName}</strong>...</p>
        </div>
    `);
}

function showContentError(message) {
    $("#dynamicContent").html(`<div class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i> ${message}</div>`);
}

function showAccessDenied(viewName) {
    $("#dynamicContent").html(`<div class="alert alert-warning"><i class="bi bi-shield-lock me-2"></i> You do not have permission to access <strong>${viewName}</strong>.</div>`);
}

// 5. CURRENT_USER_TYPE
const DEV_DEFAULT_USER_TYPE = "SuperAdmin"; // Fallback for dev
const CURRENT_USER_TYPE = window.getSession("userType") || (window.sessionData ? window.sessionData.userType : null) || sessionStorage.getItem('userType') || DEV_DEFAULT_USER_TYPE;
console.log("✅ FINAL CURRENT_USER_TYPE:", CURRENT_USER_TYPE);

// 6. APP_VIEWS
const APP_VIEWS = {
    // Dashboards
    admindashboard:    { route: "includes/view/admin/dashboard.php",    roles: ["Admin", "SuperAdmin"], init: "initAdminDashboardView" },
    officedashboard:   { route: "includes/view/office/dashboard.php",   roles: ["Office"], init: "initOfficeDashboardView" },
    branchdashboard:   { route: "includes/view/branch/dashboard.php",   roles: ["Branch"], init: "initBranchDashboardView" },
    riderdashboard:    { route: "includes/view/rider/dashboard.php",    roles: ["Rider"], init: "initRiderDashboardView" },
    customerdashboard: { route: "includes/view/customer/dashboard.php", roles: ["Customer"], init: "initCustomerDashboardView" },

    

    // Admin Views
    users:    { route: "includes/view/users/users.php", roles: ["Admin", "SuperAdmin"], init: "initUserView" },
    adduser:    { route: "includes/view/users/adduser.php", roles: ["Admin", "SuperAdmin"], init: "initAddUserView" },

    // 🔥 CUSTOMERS MODULE
    customer:    { route: "includes/view/customer/customerview.php", roles: ["Admin", "SuperAdmin", "Customer"], init: "initCustomerView" },
    addcustomer: { route: "includes/view/customer/addcustomer.php",  roles: ["Admin", "SuperAdmin", "Customer"], init: "initAddCustomerView" }, // 🔥 FIXED init na

    // 🔥 CARRIERS MODULE
    carrier:    { route: "includes/view/carrier/carrierview.php", roles: ["Admin", "SuperAdmin"], init: "initCarrierView" },
    addcarrier: { route: "includes/view/carrier/addcarrier.php",  roles: ["Admin", "SuperAdmin"], init: "initAddCarrierView" },

    // Common Views
    newbooking:    { route: "includes/view/operations/newbooking.php", roles: ["Admin", "Office", "Branch", "Customer", "SuperAdmin"], init: "initNewBookingView" },
    bookinglist: { route: "includes/view/operations/bookinglist.php", roles: ["Admin", "Office", "Branch", "SuperAdmin"], init: "initBookingListView" },
    trackshipment: { route: "includes/view/operations/tracking.php",    roles: ["Admin", "Office", "Branch", "Rider", "Customer", "SuperAdmin"], init: "initTrackingView" },

    billinggeneration: { route: "includes/view/finance/billinggeneration.php", roles: ["Admin", "Office", "SuperAdmin"], init: "initBillingGenerationView" },
    // 🔥 FINANCE MODULE
    billinglist:       { route: "includes/view/finance/billinglist.php",       roles: ["Admin", "Office", "SuperAdmin"], init: "initBillingListView" },
    receivables:       { route: "includes/view/finance/receivables.php",       roles: ["Admin", "Office", "SuperAdmin"], init: "initReceivablesView" },
    payments:          { route: "includes/view/finance/payments.php",          roles: ["Admin", "Office", "SuperAdmin"], init: "initPaymentsView" },

        // 🔥 NEW: MANIFEST & RUN SHEET ROUTES
    manifest:      { route: "includes/view/operations/manifest.php",    roles: ["Admin", "Office", "Branch", "SuperAdmin"], init: "initManifestView" },
    runsheet:      { route: "includes/view/operations/runsheet.php",    roles: ["Admin", "Office", "Branch", "Rider", "SuperAdmin"], init: "initRunSheetView" },

        // 🔥 CHARGES CONFIGURATION MODULE
    charge:    { route: "includes/view/charge/chargeview.php",   roles: ["Admin", "SuperAdmin"], init: "initChargeView" },
    addcharge: { route: "includes/view/charge/addcharge.php",    roles: ["Admin", "SuperAdmin"], init: "initAddChargeView" },

        // 🔥 TAX CONFIGURATION MODULE
    tax:    { route: "includes/view/tax/taxview.php",   roles: ["Admin", "SuperAdmin"], init: "initTaxView" },
    addtax: { route: "includes/view/tax/addtax.php",    roles: ["Admin", "SuperAdmin"], init: "initAddTaxView" },

    terms:          { route: "includes/view/legal/termsview.php",         roles: ["Admin", "SuperAdmin"], init: "initTermsView" },
    addterms:       { route: "includes/view/legal/addtermsview.php",      roles: ["Admin", "SuperAdmin"], init: "initAddTermsView" },
    undertaking:    { route: "includes/view/legal/undertakingview.php",   roles: ["Admin", "SuperAdmin"], init: "initUndertakingView" },
    addundertaking: { route: "includes/view/legal/addundertakingview.php",roles: ["Admin", "SuperAdmin"], init: "initAddUndertakingView" },


    

    adminsettings: { route: "includes/view/admin/settings.php", roles: ["Admin", "SuperAdmin"], init: "initAdminSettingsView" },


};

// 7. View Routing Functions
function viewExists(viewName) { return Object.prototype.hasOwnProperty.call(APP_VIEWS, viewName); }

function canAccessView(viewName) {
    if (!viewExists(viewName)) return false;
    return (APP_VIEWS[viewName].roles || []).includes(CURRENT_USER_TYPE);
}

function applySidebarByUserType(userType) {
    $(".menu-link").each(function () {
        const viewName = $(this).data("view");
        if (!viewName || !viewExists(viewName)) { $(this).addClass("d-none"); return; }
        $(this).toggleClass("d-none", !(APP_VIEWS[viewName].roles || []).includes(userType));
    });
    $(".menu-group").each(function () {
        $(this).toggleClass("d-none", $(this).find(".submenu .menu-link").not(".d-none").length === 0);
    });
}

function loadView(viewName, updateUrl = true) {
    if (!viewExists(viewName)) { showContentError(`❌ Invalid view: <strong>${viewName}</strong>`); return; }
    if (!canAccessView(viewName)) { showAccessDenied(viewName); return; }

    const viewConfig = APP_VIEWS[viewName];
    showContentLoader(viewName);
    setActiveMenu(viewName);

    $("#dynamicContent").load(viewConfig.route, function (response, status, xhr) {
        if (status === "error") {
            $("#dynamicContent").html(`<div class="alert alert-warning">⚠️ Error loading <strong>${viewName}</strong>. File missing: <code>${viewConfig.route}</code></div>`);
            return;
        }
        if (updateUrl) window.history.pushState({ view: viewName }, "", `${window.location.pathname}?view=${viewName}`);
        if ($(window).width() <= 991) $(".app-wrapper").removeClass("sidebar-open");
        $(document).trigger("contentLoaded", [viewName, viewConfig]);
    });
}
window.loadView = loadView;

function setActiveMenu(viewName) {
    $(".menu-link").removeClass("active");
    const $activeLink = $(`.menu-link[data-view="${viewName}"]`);
    $activeLink.addClass("active");
    $(".submenu").removeClass("open");
    $(".menu-parent").removeClass("open active");
    const $submenu = $activeLink.closest(".submenu");
    if ($submenu.length) {
        $submenu.addClass("open");
        $(`.menu-parent[data-submenu="${$submenu.attr("id")}"]`).addClass("open active");
    }
}

// ============================================
// 🔥 UNIFIED SIGN-OUT FUNCTION
// ============================================
async function performSignOut() {
    const $overlay = $('#signOutOverlay');
    if ($overlay.length) {
        $overlay.css('display', 'flex');
        setTimeout(() => $overlay.addClass('active'), 10);
    }

    try {
        window.clearSession(); // Uses the robust global function
        if (typeof FirebaseAuth !== "undefined" && FirebaseAuth.logout) await FirebaseAuth.logout();
        
        // Redirect to home.php with ?signout=1 to destroy PHP session
        window.location.replace('home.php?signout=1&_=' + Date.now());
    } catch (error) {
        console.error("Sign-out error:", error);
        window.location.replace('home.php?signout=1&_=' + Date.now());
    }
}

// 8. Document Ready
$(document).ready(function() {
    if (typeof updateDateTime === 'function') { updateDateTime(); setInterval(updateDateTime, 1000); }

    applySidebarByUserType(CURRENT_USER_TYPE);

    // ============================================
    // 🔥 SIDEBAR & HAMBURGER TOGGLES (CONSOLIDATED)
    // ============================================
    $(document).on("click", "#hamburgerBtn, #sidebarToggle", function() {
        if ($(window).width() > 991) $(".app-wrapper").toggleClass("sidebar-collapsed");
        else $(".app-wrapper").toggleClass("sidebar-open");
    });

    $(document).on("click", function(e) {
        if ($(window).width() <= 991 && !$(e.target).closest(".app-sidebar, #hamburgerBtn, #sidebarToggle").length) {
            $(".app-wrapper").removeClass("sidebar-open");
        }
    });

    // Sidebar Accordion
    $(document).on("click", ".menu-parent", function (e) {
        e.preventDefault();
        const $currentSubmenu = $("#" + $(this).data("submenu"));
        const isAlreadyOpen = $currentSubmenu.hasClass("open");
        $(".submenu").removeClass("open"); $(".menu-parent").removeClass("open active");
        if (!isAlreadyOpen) { $currentSubmenu.addClass("open"); $(this).addClass("open active"); }
    });

    // Menu Link Click
    $(document).on("click", ".menu-link", function (e) {
        e.preventDefault();
        const viewName = $(this).data("view");
        if (viewName) loadView(viewName);
    });

    // ============================================
    // 🔥 USER DROPDOWNS (CONSOLIDATED)
    // ============================================
    $(document).on("click", "#userMenuBtn, .js-user-menu-toggle", function(e) {
        e.stopPropagation();
        $(this).closest(".nav-right, .customer-user-menu, .navbar-right, .app-header")
               .find("#userDropdown, .js-user-dropdown").toggleClass("show");
    });

    $(document).on("click", function(e) {
        if (!$(e.target).closest("#userMenuBtn, #userDropdown, .js-user-menu-toggle, .js-user-dropdown").length) {
            $("#userDropdown, .js-user-dropdown").removeClass("show");
        }
    });

    // ============================================
    // 🔥 BOTTOM NAV / TAB CLICKS (CONSOLIDATED)
    // ============================================
    // Instead of 5 separate handlers, we use ONE delegated handler for all tab classes!
    $(document).on('click', '.customer-tab, .branch-tab, .merchant-tab, .superadmin-tab, .admin-tab, .bottom-nav-item', function(e) {
        e.preventDefault();
        const view = $(this).data('view');
        if (!view) return;
        
        // Update active states for all tab types
        $('.customer-tab, .branch-tab, .merchant-tab, .superadmin-tab, .admin-tab, .bottom-nav-item').removeClass('active');
        $(this).addClass('active');
        
        loadView(view);
    });

    // ============================================
    // 🔥 SIGN OUT TRIGGERS
    // ============================================
    // 1. Show confirmation modal
    // ============================================
// 🔥 SIGN OUT TRIGGERS
// ============================================
// 1. Show confirmation modal (Added #logoutBtn)
$(document).on("click", "#logoutBtn, .js-signout-btn", function(e) {
    e.preventDefault();
    $(".js-user-dropdown, #userDropdown").removeClass("show"); // Close dropdown first
    
    // If you have a confirmation modal, show it. Otherwise, just call performSignOut() directly.
    const signOutModalElement = document.getElementById('signOutModal');
    if (signOutModalElement) {
        bootstrap.Modal.getOrCreateInstance(signOutModalElement).show();
    } else {
        performSignOut(); // Direct logout if no modal exists
    }
});

    // 2. Execute sign out
    $(document).on("click", "#confirmSignOutBtn, .js-confirm-signout-btn", function(e) {
        e.preventDefault();
        const signOutModalElement = document.getElementById('signOutModal');
        if (signOutModalElement) {
            const inst = bootstrap.Modal.getInstance(signOutModalElement);
            if (inst) inst.hide();
        }
        performSignOut();
    });

    // ============================================
    // 🔥 SMART DEFAULT VIEW LOADING (FIXED DUPLICATION)
    // ============================================
    const urlParams = new URLSearchParams(window.location.search);
    const requestedView = urlParams.get("view");

    const defaultDashboards = {
        'Admin': 'admindashboard', 'Office': 'officedashboard', 'Branch': 'branchdashboard',
        'Rider': 'riderdashboard', 'Customer': 'customerdashboard', 'SuperAdmin': 'admindashboard'
    };

    let viewToLoad = defaultDashboards[CURRENT_USER_TYPE] || 'customerdashboard';
    if (requestedView && viewExists(requestedView) && canAccessView(requestedView)) viewToLoad = requestedView;
    
    console.log("🚀 Loading default view:", viewToLoad);
    loadView(viewToLoad, false);

    // Listen for content loaded to run view initializers
    $(document).on("contentLoaded", function(e, viewName, viewConfig) {
        if (viewConfig.init && typeof window[viewConfig.init] === "function") {
            try { window[viewConfig.init](); } 
            catch (err) { console.error(`Error running initializer ${viewConfig.init}:`, err); }
        }
    });
});