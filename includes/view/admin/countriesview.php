<?php
// includes/view/admin/countriesview.php
// 🔥 Countries Management - Rexcouris
?>

<div class="container-fluid py-4 countries-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-globe-americas text-danger me-2"></i>Countries Management</h3>
            <p class="text-muted mb-0 small">Manage countries and their cities for shipping destinations</p>
        </div>
        <button type="button" class="btn btn-rex-primary" id="btnAddCountry">
            <i class="bi bi-plus-circle me-1"></i> Add Country
        </button>
    </div>

    <!-- STATS CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-globe"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total Countries</div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-card stat-cities">
                <div class="stat-icon"><i class="bi bi-buildings"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statCities">0</div>
                    <div class="stat-label">Total Cities</div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-card stat-avg">
                <div class="stat-icon"><i class="bi bi-graph-up"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statAvg">0</div>
                    <div class="stat-label">Avg Cities/Country</div>
                </div>
            </div>
        </div>
    </div>

    <!-- FILTERS & SEARCH -->
    <div class="filter-card mb-4">
        <div class="filter-header">
            <h6 class="mb-0"><i class="bi bi-funnel me-2"></i>Search & Filter</h6>
            <button type="button" class="btn btn-sm btn-outline-secondary" id="btnClearFilters">
                <i class="bi bi-x-circle me-1"></i> Clear
            </button>
        </div>
        <div class="filter-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchInput" 
                               placeholder="Search by country name or code...">
                    </div>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filterCities">
                        <option value="">All Countries</option>
                        <option value="0">No Cities</option>
                        <option value="1-5">1-5 Cities</option>
                        <option value="6-10">6-10 Cities</option>
                        <option value="10+">10+ Cities</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="sortBy">
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="cities-asc">Cities (Low-High)</option>
                        <option value="cities-desc">Cities (High-Low)</option>
                        <option value="code-asc">Code (A-Z)</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGINATION TOP -->
    <div class="pagination-controls mb-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="showing-info">
                Showing <span id="showingFrom">0</span> to <span id="showingTo">0</span> of 
                <span id="showingTotal">0</span> countries
            </div>
            <div class="items-per-page">
                <label>Items per page:</label>
                <select class="form-select form-select-sm" id="itemsPerPage">
                    <option value="25" selected>25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
        </div>
    </div>

    <!-- DATA TABLE -->
    <div class="table-card">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead>
                    <tr>
                        <th class="ps-4" width="5%">#</th>
                        <th width="35%">Country Name</th>
                        <th width="15%">Phone Code</th>
                        <th width="15%">Cities Count</th>
                        <th width="20%">Sample Cities</th>
                        <th class="text-center pe-4" width="10%">Actions</th>
                    </tr>
                </thead>
                <tbody id="countriesTableBody">
                    <tr>
                        <td colspan="6" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading countries...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- PAGINATION BOTTOM -->
    <div class="pagination-controls mt-3">
        <nav aria-label="Countries pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer"></ul>
        </nav>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 EDIT COUNTRY MODAL                        -->
<!-- ============================================ -->
<div class="modal fade" id="editCountryModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">
                    <i class="bi bi-pencil-square me-2"></i>
                    Edit Country: <span id="editCountryName">-</span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="editCountryId">
                
                <!-- Country Info -->
                <div class="edit-section">
                    <h6 class="section-title"><i class="bi bi-info-circle me-2"></i>Country Information</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Country Name</label>
                            <input type="text" class="form-control" id="editName" readonly>
                            <small class="text-muted">Country name cannot be changed</small>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Phone Code <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text">+</span>
                                <input type="text" class="form-control" id="editCode" placeholder="e.g., 92">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cities Management -->
                <div class="edit-section">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="section-title mb-0"><i class="bi bi-buildings me-2"></i>Cities (<span id="citiesCount">0</span>)</h6>
                        <button type="button" class="btn btn-sm btn-success" id="btnAddCity">
                            <i class="bi bi-plus-circle me-1"></i> Add City
                        </button>
                    </div>

                    <!-- Add City Form -->
                    <div class="add-city-form d-none" id="addCityForm">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" id="newCityName" 
                                   placeholder="Enter city name (e.g., Karachi)">
                            <button type="button" class="btn btn-success" id="btnConfirmAddCity">
                                <i class="bi bi-plus-lg"></i> Add
                            </button>
                            <button type="button" class="btn btn-outline-secondary" id="btnCancelAddCity">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Cities List -->
                    <div class="cities-list" id="citiesList">
                        <!-- Cities will be populated dynamically -->
                    </div>

                    <!-- Empty State -->
                    <div class="empty-cities d-none" id="emptyCities">
                        <i class="bi bi-buildings"></i>
                        <h6>No Cities Added</h6>
                        <p>Click "Add City" to add cities for this country</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-primary" id="btnSaveCountry">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Changes</span>
                    <span class="btn-loader d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span> Saving...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 ADD COUNTRY MODAL                         -->
<!-- ============================================ -->
<div class="modal fade" id="addCountryModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title">
                    <i class="bi bi-plus-circle me-2"></i>Add New Country
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Country Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="addName" placeholder="e.g., Pakistan">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Phone Code <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text">+</span>
                            <input type="text" class="form-control" id="addCode" placeholder="e.g., 92">
                        </div>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Cities (comma-separated)</label>
                        <textarea class="form-control" id="addCities" rows="3" 
                                  placeholder="e.g., Karachi, Lahore, Islamabad, Rawalpindi"></textarea>
                        <small class="text-muted">Enter city names separated by commas</small>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-success" id="btnConfirmAddCountry">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Add Country</span>
                    <span class="btn-loader d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span> Adding...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 DELETE CONFIRMATION MODAL                 -->
<!-- ============================================ -->
<div class="modal fade" id="deleteCityModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-4">
                <div class="delete-icon-wrapper mb-3">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h4 class="fw-bold mb-2">Delete City?</h4>
                <p class="text-muted mb-1">Are you sure you want to delete this city?</p>
                <p class="fw-semibold text-danger mb-4" id="deleteCityName">-</p>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmDeleteCity">
                        <i class="bi bi-trash me-1"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS & ERROR MODALS -->
<div class="modal fade" id="countrySuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2" id="successTitle">Success!</h3>
                <p class="text-muted mb-4" id="successMessage">-</p>
                <button type="button" class="btn btn-rex-primary" id="btnCloseSuccess">
                    <i class="bi bi-check-circle me-1"></i> OK
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="countryErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="countryErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>
