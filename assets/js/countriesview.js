// assets/js/countriesview.js - COUNTRIES MANAGEMENT
import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

// Global state
let allCountries = [];
let filteredCountries = [];
let currentPage = 1;
let itemsPerPage = 25;
let currentCountryId = null;
let currentCountryData = null;
let cityToDelete = null;

window.initCountriesView = function() {
    console.log("🚀 [countriesview.js] initCountriesView() executed successfully!");
    
    setupFilters();
    setupPagination();
    setupModals();
    loadCountries();
};

// ============================================
// 🔥 LOAD COUNTRIES
// ============================================
async function loadCountries() {
    try {
        console.log("📥 Fetching countries from Firebase...");
        const countries = await FirebaseDB.getList('countries');
        allCountries = Array.isArray(countries) ? countries : [];
        
        // Sort alphabetically
        allCountries.sort((a, b) => a.name.localeCompare(b.name));
        
        console.log("✅ Loaded", allCountries.length, "countries");
        
        updateStats();
        applyFilters();
    } catch (error) {
        console.error("❌ Error loading countries:", error);
        showErrorModal('Failed to load countries: ' + error.message);
    }
}

// ============================================
// 🔥 STATS
// ============================================
function updateStats() {
    const totalCountries = allCountries.length;
    const totalCities = allCountries.reduce((sum, c) => sum + (c.cities?.length || 0), 0);
    const avgCities = totalCountries > 0 ? (totalCities / totalCountries).toFixed(1) : 0;
    
    $('#statTotal').text(totalCountries);
    $('#statCities').text(totalCities);
    $('#statAvg').text(avgCities);
}

// ============================================
// 🔥 FILTERS
// ============================================
function setupFilters() {
    $('#searchInput').on('input', debounce(applyFilters, 300));
    $('#filterCities, #sortBy').on('change', applyFilters);
    
    $('#btnClearFilters').on('click', function() {
        $('#searchInput, #filterCities').val('');
        $('#sortBy').val('name-asc');
        applyFilters();
    });
}

function applyFilters() {
    const search = $('#searchInput').val().toLowerCase().trim();
    const citiesFilter = $('#filterCities').val();
    const sortBy = $('#sortBy').val();

    filteredCountries = allCountries.filter(c => {
        // Search
        if (search) {
            const searchFields = [c.name, c.code].map(f => (f || '').toLowerCase());
            if (!searchFields.some(f => f.includes(search))) return false;
        }

        // Cities filter
        if (citiesFilter) {
            const citiesCount = c.cities?.length || 0;
            if (citiesFilter === '0' && citiesCount !== 0) return false;
            if (citiesFilter === '1-5' && (citiesCount < 1 || citiesCount > 5)) return false;
            if (citiesFilter === '6-10' && (citiesCount < 6 || citiesCount > 10)) return false;
            if (citiesFilter === '10+' && citiesCount <= 10) return false;
        }

        return true;
    });

    // Sort
    filteredCountries.sort((a, b) => {
        switch (sortBy) {
            case 'name-asc': return a.name.localeCompare(b.name);
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'cities-asc': return (a.cities?.length || 0) - (b.cities?.length || 0);
            case 'cities-desc': return (b.cities?.length || 0) - (a.cities?.length || 0);
            case 'code-asc': return (a.code || '').localeCompare(b.code || '');
            default: return 0;
        }
    });

    currentPage = 1;
    renderTable();
    renderPagination();
}

// ============================================
// 🔥 RENDER TABLE
// ============================================
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageCountries = filteredCountries.slice(start, end);

    $('#showingFrom').text(filteredCountries.length > 0 ? start + 1 : 0);
    $('#showingTo').text(Math.min(end, filteredCountries.length));
    $('#showingTotal').text(filteredCountries.length);

    const $tbody = $('#countriesTableBody').empty();

    if (pageCountries.length === 0) {
        $tbody.html(`
            <tr>
                <td colspan="6" class="text-center py-5">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i>
                    <p class="mt-3 text-muted">No countries found</p>
                </td>
            </tr>
        `);
        return;
    }

    pageCountries.forEach((c, index) => {
        const citiesCount = c.cities?.length || 0;
        const citiesClass = getCitiesCountClass(citiesCount);
        
        // Sample cities (show first 3)
        const sampleCities = (c.cities || []).slice(0, 3);
        const moreCount = citiesCount - 3;
        
        let sampleHtml = '';
        if (citiesCount === 0) {
            sampleHtml = '<span class="text-muted fst-italic">No cities</span>';
        } else {
            sampleHtml = sampleCities.map(city => 
                `<span class="city-tag">${city}</span>`
            ).join('');
            if (moreCount > 0) {
                sampleHtml += `<span class="city-tag more">+${moreCount} more</span>`;
            }
        }

        const row = `
            <tr>
                <td class="ps-4">${start + index + 1}</td>
                <td>
                    <div class="country-name-cell">
                        <div class="country-flag-icon">
                            <i class="bi bi-globe"></i>
                        </div>
                        <span class="country-name-text">${c.name}</span>
                    </div>
                </td>
                <td>
                    <span class="phone-code-badge">
                        <i class="bi bi-telephone-fill"></i>
                        +${c.code || '-'}
                    </span>
                </td>
                <td>
                    <span class="cities-count-badge ${citiesClass}">
                        <i class="bi bi-buildings"></i>
                        ${citiesCount} ${citiesCount === 1 ? 'City' : 'Cities'}
                    </span>
                </td>
                <td>
                    <div class="sample-cities">
                        ${sampleHtml}
                    </div>
                </td>
                <td class="text-center pe-4">
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editCountry('${c.id}')" title="Edit Country & Cities">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });
}

function getCitiesCountClass(count) {
    if (count === 0) return 'zero';
    if (count <= 5) return 'low';
    if (count <= 10) return 'medium';
    return 'high';
}

// ============================================
// 🔥 PAGINATION
// ============================================
function setupPagination() {
    $('#itemsPerPage').on('change', function() {
        itemsPerPage = parseInt($(this).val());
        currentPage = 1;
        renderTable();
        renderPagination();
    });
}

function renderPagination() {
    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
    const $c = $('#paginationContainer').empty();
    
    if (totalPages <= 1) return;

    $c.append(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}">Prev</a></li>`);
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            $c.append(`<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            $c.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
    }
    
    $c.append(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>`);

    $c.find('.page-link').on('click', function(e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        if (page && page !== currentPage) {
            currentPage = page;
            renderTable();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ============================================
// 🔥 MODALS SETUP
// ============================================
function setupModals() {
    // Add Country button
    $('#btnAddCountry').on('click', function() {
        $('#addName, #addCode, #addCities').val('');
        new bootstrap.Modal(document.getElementById('addCountryModal')).show();
    });
    
    // Confirm Add Country
    $('#btnConfirmAddCountry').on('click', addNewCountry);
    
    // Save Country (Edit)
    $('#btnSaveCountry').on('click', saveCountryEdit);
    
    // Add City button
    $('#btnAddCity').on('click', function() {
        $('#newCityName').val('');
        $('#addCityForm').removeClass('d-none');
        $('#newCityName').focus();
    });
    
    // Confirm Add City
    $('#btnConfirmAddCity').on('click', addCityToList);
    
    // Cancel Add City
    $('#btnCancelAddCity').on('click', function() {
        $('#addCityForm').addClass('d-none');
        $('#newCityName').val('');
    });
    
    // Enter key in city input
    $('#newCityName').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            addCityToList();
        }
    });
    
    // Confirm Delete City
    $('#btnConfirmDeleteCity').on('click', confirmDeleteCity);
    
    // Success modal close
    $('#btnCloseSuccess').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('countrySuccessModal')).hide();
    });
}

// ============================================
// 🔥 ADD NEW COUNTRY
// ============================================
async function addNewCountry() {
    const name = $('#addName').val().trim();
    const code = $('#addCode').val().trim();
    const citiesText = $('#addCities').val().trim();
    
    if (!name) {
        showErrorModal('Country name is required');
        return;
    }
    if (!code) {
        showErrorModal('Phone code is required');
        return;
    }
    
    // Parse cities
    const cities = citiesText 
        ? citiesText.split(',').map(c => c.trim()).filter(c => c.length > 0)
        : [];
    
    const $btn = $('#btnConfirmAddCountry');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');
    
    try {
        const countryData = {
            name: name,
            code: code,
            cities: cities,
            createdAt: new Date().toISOString(),
            createdBy: FirebaseAuth.getCurrentUser()?.email || 'unknown',
            lastUpdated: new Date().toISOString()
        };
        
        await FirebaseDB.push('countries', countryData);
        console.log("✅ Country added successfully");
        
        bootstrap.Modal.getInstance(document.getElementById('addCountryModal')).hide();
        
        $('#successTitle').text('Country Added!');
        $('#successMessage').text(`${name} has been added with ${cities.length} ${cities.length === 1 ? 'city' : 'cities'}.`);
        new bootstrap.Modal(document.getElementById('countrySuccessModal')).show();
        
        await loadCountries();
        
    } catch (error) {
        console.error("❌ Error adding country:", error);
        showErrorModal('Failed to add country: ' + error.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

// ============================================
// 🔥 EDIT COUNTRY
// ============================================
window.editCountry = async function(countryId) {
    try {
        const country = await FirebaseDB.get(`countries/${countryId}`);
        if (!country) return showErrorModal('Country not found');
        
        currentCountryId = countryId;
        currentCountryData = country;
        
        // Populate form
        $('#editCountryId').val(countryId);
        $('#editCountryName').text(country.name);
        $('#editName').val(country.name);
        $('#editCode').val(country.code || '');
        
        // Render cities
        renderCitiesList(country.cities || []);
        
        // Hide add city form
        $('#addCityForm').addClass('d-none');
        
        new bootstrap.Modal(document.getElementById('editCountryModal')).show();
        
    } catch (error) {
        console.error("❌ Error loading country:", error);
        showErrorModal('Failed to load country: ' + error.message);
    }
};

// ============================================
// 🔥 RENDER CITIES LIST
// ============================================
function renderCitiesList(cities) {
    const $list = $('#citiesList').empty();
    $('#citiesCount').text(cities.length);
    
    if (cities.length === 0) {
        $('#emptyCities').removeClass('d-none');
        return;
    }
    
    $('#emptyCities').addClass('d-none');
    
    cities.sort().forEach((city, index) => {
        const cityItem = `
            <div class="city-item" data-city-index="${index}">
                <div class="city-item-info">
                    <div class="city-item-icon">
                        <i class="bi bi-geo-alt-fill"></i>
                    </div>
                    <span class="city-item-name">${city}</span>
                </div>
                <div class="city-item-actions">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteCity('${city}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        $list.append(cityItem);
    });
}

// ============================================
// 🔥 ADD CITY TO LIST (Temporary)
// ============================================
function addCityToList() {
    const cityName = $('#newCityName').val().trim();
    
    if (!cityName) {
        showErrorModal('Please enter a city name');
        return;
    }
    
    // Check if already exists
    if (currentCountryData.cities && currentCountryData.cities.includes(cityName)) {
        showErrorModal(`City "${cityName}" already exists`);
        return;
    }
    
    // Add to temporary data
    if (!currentCountryData.cities) {
        currentCountryData.cities = [];
    }
    currentCountryData.cities.push(cityName);
    
    // Re-render
    renderCitiesList(currentCountryData.cities);
    
    // Clear input
    $('#newCityName').val('').focus();
    
    console.log(`✅ City added: ${cityName}`);
}

// ============================================
// 🔥 DELETE CITY
// ============================================
window.deleteCity = function(cityName) {
    cityToDelete = cityName;
    $('#deleteCityName').text(cityName);
    new bootstrap.Modal(document.getElementById('deleteCityModal')).show();
};

function confirmDeleteCity() {
    if (!cityToDelete) return;
    
    // Remove from temporary data
    if (currentCountryData.cities) {
        currentCountryData.cities = currentCountryData.cities.filter(c => c !== cityToDelete);
    }
    
    // Re-render
    renderCitiesList(currentCountryData.cities);
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('deleteCityModal')).hide();
    
    console.log(`🗑️ City deleted: ${cityToDelete}`);
    cityToDelete = null;
}

// ============================================
// 🔥 SAVE COUNTRY EDIT
// ============================================
async function saveCountryEdit() {
    const code = $('#editCode').val().trim();
    
    if (!code) {
        showErrorModal('Phone code is required');
        return;
    }
    
    const $btn = $('#btnSaveCountry');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');
    
    try {
        const updateData = {
            code: code,
            cities: currentCountryData.cities || [],
            lastUpdated: new Date().toISOString(),
            updatedBy: FirebaseAuth.getCurrentUser()?.email || 'unknown'
        };
        
        await FirebaseDB.update(`countries/${currentCountryId}`, updateData);
        console.log("✅ Country updated successfully");
        
        bootstrap.Modal.getInstance(document.getElementById('editCountryModal')).hide();
        
        $('#successTitle').text('Country Updated!');
        $('#successMessage').text(`${currentCountryData.name} has been updated successfully.`);
        new bootstrap.Modal(document.getElementById('countrySuccessModal')).show();
        
        await loadCountries();
        
    } catch (error) {
        console.error("❌ Error updating country:", error);
        showErrorModal('Failed to update country: ' + error.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

// ============================================
// 🔥 HELPERS
// ============================================
function showErrorModal(message) {
    $('#countryErrorMessage').html(message);
    new bootstrap.Modal(document.getElementById('countryErrorModal')).show();
}

function debounce(func, wait) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => func(...args), wait);
    };
}