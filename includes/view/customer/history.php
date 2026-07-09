<?php
// includes/views/customer/history.php
// 🔥 Customer History View - Redeemed, Gifted, Received

if (session_status() === PHP_SESSION_NONE) session_start();
$user = $_SESSION['user'] ?? [];
$fullName = $user['fullName'] ?? 'Customer';
?>

<div class="container-fluid py-4 customer-history">
    
    <!-- ============================================ -->
    <!-- 🔥 PAGE HEADER                               -->
    <!-- ============================================ -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="history-header-card p-4 rounded-3 shadow-sm">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h3 class="mb-1 fw-bold text-white">
                            <i class="bi bi-clock-history me-2"></i>My History
                        </h3>
                        <p class="mb-0 text-white-50">
                            Track all your redemptions, gifts, and activity
                        </p>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-light btn-sm" id="btnExportHistory">
                            <i class="bi bi-download me-1"></i> Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 SUMMARY CARDS                             -->
    <!-- ============================================ -->
    <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
            <div class="history-stat-card bg-white rounded-3 p-3 shadow-sm border-0">
                <div class="d-flex align-items-center">
                    <div class="stat-icon bg-success bg-opacity-10 text-success rounded-3 p-3 me-3">
                        <i class="bi bi-check-circle fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small">Redeemed</h6>
                        <h3 class="fw-bold mb-0" id="historyStatRedeemed">
                            <span class="spinner-border spinner-border-sm"></span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="history-stat-card bg-white rounded-3 p-3 shadow-sm border-0">
                <div class="d-flex align-items-center">
                    <div class="stat-icon bg-pink bg-opacity-10 text-pink rounded-3 p-3 me-3">
                        <i class="bi bi-gift fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small">Gifts Sent</h6>
                        <h3 class="fw-bold mb-0" id="historyStatGifted">0</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="history-stat-card bg-white rounded-3 p-3 shadow-sm border-0">
                <div class="d-flex align-items-center">
                    <div class="stat-icon bg-info bg-opacity-10 text-info rounded-3 p-3 me-3">
                        <i class="bi bi-gift-fill fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small">Gifts Received</h6>
                        <h3 class="fw-bold mb-0" id="historyStatReceived">0</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="history-stat-card bg-white rounded-3 p-3 shadow-sm border-0">
                <div class="d-flex align-items-center">
                    <div class="stat-icon bg-warning bg-opacity-10 text-warning rounded-3 p-3 me-3">
                        <i class="bi bi-cash-stack fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small">Total Savings</h6>
                        <h3 class="fw-bold mb-0" id="historyStatSavings">Rs. 0</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 FILTER SECTION                            -->
    <!-- ============================================ -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-3">
                    
                    <!-- Category Tabs -->
                    <div class="history-tabs mb-3">
                        <button class="history-tab active" data-category="all">
                            <i class="bi bi-grid"></i>
                            <span>All Activity</span>
                        </button>
                        <button class="history-tab" data-category="redeemed">
                            <i class="bi bi-check-circle"></i>
                            <span>Redeemed</span>
                        </button>
                        <button class="history-tab" data-category="gifted">
                            <i class="bi bi-gift"></i>
                            <span>Sent Gifts</span>
                        </button>
                        <button class="history-tab" data-category="received">
                            <i class="bi bi-gift-fill"></i>
                            <span>Received</span>
                        </button>
                    </div>

                    <!-- Search & Filters Row -->
                    <div class="row g-2 align-items-center">
                        <div class="col-md-5">
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-search text-muted"></i>
                                </span>
                                <input type="text" class="form-control border-start-0 ps-0" 
                                       id="historySearchInput" placeholder="Search by merchant, coupon, or code...">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="historyDateFilter">
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="historySortFilter">
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="value-high">Value (High to Low)</option>
                                <option value="value-low">Value (Low to High)</option>
                            </select>
                        </div>
                        <div class="col-md-1 text-end">
                            <button type="button" class="btn btn-outline-secondary" id="btnResetHistoryFilters" title="Reset Filters">
                                <i class="bi bi-arrow-counterclockwise"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 HISTORY CONTENT                           -->
    <!-- ============================================ -->
    <div class="row">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0">
                        <i class="bi bi-list-ul me-2 text-primary"></i>
                        <span id="historySectionTitle">All Activity</span>
                    </h5>
                    <span class="badge bg-primary" id="historyCountBadge">0 items</span>
                </div>
                <div class="card-body p-4">
                    
                    <!-- Loading State -->
                    <div id="historyLoading" class="text-center py-5">
                        <div class="history-loader">
                            <div class="loader-spinner"></div>
                            <p class="mt-3 text-muted">Loading your history...</p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div id="historyEmpty" class="text-center py-5 d-none">
                        <div class="empty-state">
                            <i class="bi bi-inbox empty-icon"></i>
                            <h4>No History Yet</h4>
                            <p>Your activity will appear here once you start redeeming or gifting coupons.</p>
                        </div>
                    </div>

                    <!-- No Results State -->
                    <div id="historyNoResults" class="text-center py-5 d-none">
                        <div class="empty-state">
                            <i class="bi bi-search empty-icon"></i>
                            <h4>No Matches Found</h4>
                            <p>Try adjusting your filters or search term.</p>
                        </div>
                    </div>

                    <!-- History List -->
                    <div id="historyList" class="history-list d-none">
                        <!-- Populated by jQuery -->
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<!-- 🔥 History Item Detail Modal -->
<div class="modal fade" id="historyDetailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg customer-modal">
            <div class="modal-header bg-primary text-white border-0">
                <h5 class="modal-title">
                    <i class="bi bi-info-circle me-2"></i>Activity Details
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4" id="historyDetailBody">
                <!-- Populated by jQuery -->
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>


