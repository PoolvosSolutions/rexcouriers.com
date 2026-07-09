<?php
// includes/view/public/header.php
// 🔥 Public Header - REX Couriers
?>

<!-- ============================================ -->
<!-- 🔥 HEADER SECTION                            -->
<!-- ============================================ -->
<header class="rex-header">
    <div class="header-container">
        
        <!-- LEFT: LOGO -->
        <div class="header-left">
            <a href="home.php" class="logo-link">
                <div class="logo-box">
                    <div class="logo-icon">
                        <i class="bi bi-box-seam-fill"></i>
                    </div>
                    <div class="logo-text">
                        <span class="logo-main">REX</span>
                        <span class="logo-sub">WORLDWIDE COURIER</span>
                    </div>
                </div>
            </a>
        </div>
        
        <!-- CENTER: TRACKING SEARCH BAR -->
        <div class="header-center">
            <div class="tracking-wrapper">
                <div class="tracking-label">
                    <i class="bi bi-geo-alt-fill"></i>
                    <span>Track Your Shipment</span>
                </div>
                <div class="tracking-bar">
                    <div class="tracking-input-wrapper">
                        <i class="bi bi-search tracking-icon"></i>
                        <input 
                            type="text" 
                            id="trackingInput" 
                            class="tracking-input" 
                            placeholder="Enter AWB or PI Number (e.g., 07081001)"
                            autocomplete="off"
                            maxlength="20"
                        >
                    </div>
                    <button type="button" class="tracking-btn" id="btnTrackShipment">
                        <span class="btn-text"><i class="bi bi-arrow-right-circle-fill"></i> Track</span>
                        <span class="btn-loader d-none">
                            <span class="spinner-border spinner-border-sm"></span>
                        </span>
                    </button>
                </div>
                <div class="tracking-hint">
                    <i class="bi bi-info-circle"></i>
                    Enter your Air Waybill (AWB) or Proforma Invoice (PI) number
                </div>
            </div>
        </div>
        
        <!-- RIGHT: USER PROFILE -->
        <div class="header-right">
            <?php if (!empty($userId) && $userStatus === 'Active'): ?>
                <!-- LOGGED IN USER -->
                <div class="user-profile-dropdown">
                    <button class="user-profile-btn" id="userProfileBtn">
                        <div class="user-avatar">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="user-info">
                            <span class="user-name"><?php echo htmlspecialchars($fullName); ?></span>
                            <span class="user-role"><?php echo htmlspecialchars($userType); ?></span>
                        </div>
                        <i class="bi bi-chevron-down dropdown-arrow"></i>
                    </button>
                    <div class="user-dropdown-menu" id="userDropdownMenu">
                        <div class="dropdown-header">
                            <div class="dropdown-avatar">
                                <i class="bi bi-person-circle"></i>
                            </div>
                            <div class="dropdown-info">
                                <strong><?php echo htmlspecialchars($fullName); ?></strong>
                                <small><?php echo htmlspecialchars($email); ?></small>
                                <span class="dropdown-role-badge"><?php echo htmlspecialchars($userType); ?></span>
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="home.php" class="dropdown-item" onclick="loadView('admindashboard'); return false;">
                            <i class="bi bi-speedometer2"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="home.php" class="dropdown-item" onclick="loadView('trackshipment'); return false;">
                            <i class="bi bi-geo-alt"></i>
                            <span>Track Shipments</span>
                        </a>
                        <?php if (in_array($userType, ['Admin', 'SuperAdmin', 'Office'])): ?>
                        <a href="home.php" class="dropdown-item" onclick="loadView('newbooking'); return false;">
                            <i class="bi bi-plus-circle"></i>
                            <span>New Booking</span>
                        </a>
                        <?php endif; ?>
                        <div class="dropdown-divider"></div>
                        <a href="home.php?signout=1" class="dropdown-item dropdown-logout">
                            <i class="bi bi-box-arrow-right"></i>
                            <span>Logout</span>
                        </a>
                    </div>
                </div>
            <?php else: ?>
                <!-- NOT LOGGED IN -->
                <a href="login.php" class="login-btn">
                    <i class="bi bi-person-circle"></i>
                    <span>Login</span>
                </a>
            <?php endif; ?>
        </div>
        
        <!-- MOBILE MENU TOGGLE -->
        <button class="mobile-menu-toggle" id="mobileMenuToggle">
            <i class="bi bi-list"></i>
        </button>
        
    </div>
    
    <!-- MOBILE TRACKING BAR (shown on small screens) -->
    <div class="mobile-tracking-bar d-lg-none">
        <div class="tracking-bar">
            <div class="tracking-input-wrapper">
                <i class="bi bi-search tracking-icon"></i>
                <input 
                    type="text" 
                    id="mobileTrackingInput" 
                    class="tracking-input" 
                    placeholder="Enter AWB or PI Number"
                    autocomplete="off"
                    maxlength="20"
                >
            </div>
            <button type="button" class="tracking-btn mobile-track-btn">
                <i class="bi bi-arrow-right-circle-fill"></i>
            </button>
        </div>
    </div>
</header>

<!-- ============================================ -->
<!-- 🔥 TRACKING SUCCESS MODAL                    -->
<!-- ============================================ -->
<div class="modal fade" id="trackingSuccessModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    Shipment Found
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-0">
                
                <!-- Status Banner -->
                <div class="tracking-status-banner" id="trackingStatusBanner">
                    <div class="status-main">
                        <div class="status-icon" id="statusIcon">
                            <i class="bi bi-box-seam"></i>
                        </div>
                        <div class="status-info">
                            <div class="status-number" id="trackingAWB">-</div>
                            <div class="status-label">Current Status</div>
                            <div class="status-value" id="trackingStatus">-</div>
                        </div>
                    </div>
                    <div class="status-date">
                        <small>Booking Date</small>
                        <strong id="trackingDate">-</strong>
                    </div>
                </div>
                
                <!-- Tracking Timeline -->
                <div class="tracking-timeline-section">
                    <h6 class="timeline-title">
                        <i class="bi bi-clock-history me-1"></i>
                        Shipment Journey
                    </h6>
                    <div class="tracking-timeline" id="trackingTimeline">
                        <!-- Timeline items will be populated dynamically -->
                    </div>
                </div>
                
                <!-- Shipment Details (Customer View Only) -->
                <div class="tracking-details-section">
                    <h6 class="details-title">
                        <i class="bi bi-info-circle me-1"></i>
                        Shipment Details
                    </h6>
                    <div class="details-grid">
                        <div class="detail-card">
                            <div class="detail-icon"><i class="bi bi-person"></i></div>
                            <div class="detail-info">
                                <small>Shipper</small>
                                <strong id="trackingShipper">-</strong>
                            </div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-icon"><i class="bi bi-geo-alt"></i></div>
                            <div class="detail-info">
                                <small>Destination</small>
                                <strong id="trackingDestination">-</strong>
                            </div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-icon"><i class="bi bi-box"></i></div>
                            <div class="detail-info">
                                <small>Pieces</small>
                                <strong id="trackingPieces">-</strong>
                            </div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-icon"><i class="bi bi-speedometer"></i></div>
                            <div class="detail-info">
                                <small>Weight</small>
                                <strong id="trackingWeight">-</strong>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Delivery Information (if delivered) -->
                <div class="tracking-delivery-section d-none" id="deliverySection">
                    <h6 class="details-title">
                        <i class="bi bi-check2-circle me-1"></i>
                        Delivery Information
                    </h6>
                    <div class="delivery-info">
                        <div class="delivery-row">
                            <span class="delivery-label">Delivered To:</span>
                            <span class="delivery-value" id="deliveredTo">-</span>
                        </div>
                        <div class="delivery-row">
                            <span class="delivery-label">Delivery Date:</span>
                            <span class="delivery-value" id="deliveryDate">-</span>
                        </div>
                        <div class="delivery-row">
                            <span class="delivery-label">Delivery Time:</span>
                            <span class="delivery-value" id="deliveryTime">-</span>
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Close
                </button>
                <button type="button" class="btn btn-success" id="btnPrintTracking">
                    <i class="bi bi-printer-fill me-1"></i> Print / Save as PDF
                </button>
                <button type="button" class="btn btn-primary" id="btnTrackAnother">
                    <i class="bi bi-search me-1"></i> Track Another
                </button>
            </div>

        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 TRACKING ERROR MODAL                      -->
<!-- ============================================ -->
<div class="modal fade" id="trackingErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center p-5">
                <div class="error-icon-wrapper">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h4 class="fw-bold mb-3">Shipment Not Found</h4>
                <p class="text-muted mb-4" id="trackingErrorMessage">
                    We couldn't find a shipment with the number you entered. Please check and try again.
                </p>
                <div class="error-tips">
                    <h6 class="fw-bold mb-2"><i class="bi bi-lightbulb me-1"></i> Tips:</h6>
                    <ul class="text-start small text-muted">
                        <li>Check if you entered the correct AWB or PI number</li>
                        <li>AWB format: <code>MMDD####</code> (e.g., 07081001)</li>
                        <li>PI format: <code>YYYYMMDD####</code> (e.g., 202607081001)</li>
                        <li>Make sure there are no extra spaces</li>
                    </ul>
                </div>
                <button type="button" class="btn btn-primary mt-3" id="btnTryAgain">
                    <i class="bi bi-arrow-clockwise me-1"></i> Try Again
                </button>
            </div>
        </div>
    </div>
</div>

