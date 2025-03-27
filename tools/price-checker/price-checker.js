// tools/price-checker/price-checker.js
import { db, collection, getDocs, query, where, orderBy } from '/assets/js/firebase.js';
import { formatDndCurrency, debounce } from '/assets/js/utils.js';

// Global variables
let allItems = [];
let filteredItems = [];
let currentPage = 1;
const itemsPerPage = 12;
let baseTypeOptions = {};
let activeFilters = {
  type: '',
  baseType: '',
  minPrice: '',
  maxPrice: '',
  priceUnit: 'gold',
  rarities: ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact'],
  book: ''
};
let sortOption = 'name';
let searchTerm = '';

document.addEventListener('DOMContentLoaded', async () => {
  // Load banner component
  const bannerPlaceholder = document.getElementById('banner-placeholder');
  
  try {
    const response = await fetch('/components/banner/banner.html');
    if (response.ok) {
      const html = await response.text();
      bannerPlaceholder.innerHTML = html;
      
      // Execute banner script after inserting HTML
      const bannerScript = document.createElement('script');
      bannerScript.type = 'module';
      bannerScript.src = '/components/banner/banner.js';
      document.body.appendChild(bannerScript);
    } else {
      console.error('Failed to load banner component');
    }
  } catch (error) {
    console.error('Error loading banner component:', error);
  }
  
  // Initialize price checker
  initPriceChecker();
});

async function initPriceChecker() {
  // Load items from Firebase
  await loadItems();
  
  // Initialize filters and event listeners
  initFilters();
  initSearch();
  initSorting();
  initPagination();
  initItemModal();
  
  // Set initial display
  applyFiltersAndSort();
}

async function loadItems() {
  try {
    const itemsCollection = collection(db, 'masterItems');
    const itemsSnapshot = await getDocs(itemsCollection);
    
    allItems = itemsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unknown Item',
        type: data.type || 'Unknown',
        baseType: data.baseType || '',
        price: typeof data.price === 'number' ? data.price : 0,
        rarity: data.rarity || 'Common',
        books: Array.isArray(data.books) ? data.books : [],
        url: data.URL || '',
        isCustomized: data.isCustomized || false,
        category: data.category || '',
        itemType: data.itemType || ''
      };
    });
    
    console.log(`Loaded ${allItems.length} items`);
    
    // Hide loading spinner
    document.getElementById('loading-spinner').style.display = 'none';
    
    // Initialize base type options dictionary
    populateBaseTypeOptions();
    
  } catch (error) {
    console.error('Error loading items:', error);
    document.getElementById('loading-spinner').innerHTML = `
      <p>Error loading items. Please try again later.</p>
      <button class="btn" onclick="window.location.reload()">Reload</button>
    `;
  }
}

function populateBaseTypeOptions() {
  // Group base types by item type
  baseTypeOptions = {};
  
  allItems.forEach(item => {
    if (item.type && item.baseType) {
      if (!baseTypeOptions[item.type]) {
        baseTypeOptions[item.type] = new Set();
      }
      
      baseTypeOptions[item.type].add(item.baseType);
    }
  });
  
  console.log('Base type options:', baseTypeOptions);
}

function initFilters() {
  const filterForm = document.getElementById('filter-form');
  const typeFilter = document.getElementById('type-filter');
  const baseTypeFilter = document.getElementById('base-type-filter');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const priceUnitSelect = document.getElementById('price-unit');
  const rarityCheckboxes = document.querySelectorAll('input[id^="rarity-"]');
  const bookFilter = document.getElementById('book-filter');
  const resetButton = filterForm.querySelector('button[type="reset"]');
  
  // Type filter change event
  typeFilter.addEventListener('change', () => {
    const selectedType = typeFilter.value;
    
    // Reset base type filter
    baseTypeFilter.innerHTML = '<option value="">All Base Types</option>';
    
    if (selectedType && baseTypeOptions[selectedType]) {
      // Enable base type filter
      baseTypeFilter.disabled = false;
      
      // Populate base type options
      const baseTypes = Array.from(baseTypeOptions[selectedType]).sort();
      baseTypes.forEach(baseType => {
        const option = document.createElement('option');
        option.value = baseType;
        option.textContent = baseType;
        baseTypeFilter.appendChild(option);
      });
    } else {
      // Disable base type filter
      baseTypeFilter.disabled = true;
      baseTypeFilter.innerHTML = '<option value="">Select Item Type First</option>';
    }
  });
  
  // Filter form submission
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Update active filters
    activeFilters.type = typeFilter.value;
    activeFilters.baseType = baseTypeFilter.value;
    activeFilters.minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : '';
    activeFilters.maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : '';
    activeFilters.priceUnit = priceUnitSelect.value;
    activeFilters.book = bookFilter.value;
    
    // Update rarities from checkboxes
    activeFilters.rarities = [];
    rarityCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        activeFilters.rarities.push(checkbox.value);
      }
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Apply filters and sort
    applyFiltersAndSort();
  });
  
  // Reset button click
  resetButton.addEventListener('click', () => {
    // Reset all inputs
    filterForm.reset();
    
    // Reset base type filter
    baseTypeFilter.disabled = true;
    baseTypeFilter.innerHTML = '<option value="">Select Item Type First</option>';
    
    // Reset active filters to defaults
    activeFilters = {
      type: '',
      baseType: '',
      minPrice: '',
      maxPrice: '',
      priceUnit: 'gold',
      rarities: ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact'],
      book: ''
    };
    
    // Reset to first page
    currentPage = 1;
    
    // Apply filters and sort
    applyFiltersAndSort();
  });
}

function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  // Debounced search for typing
  const debouncedSearch = debounce(() => {
    searchTerm = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    applyFiltersAndSort();
  }, 300);
  
  searchInput.addEventListener('input', debouncedSearch);
  
  // Search button click
  searchButton.addEventListener('click', () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    applyFiltersAndSort();
  });
  
  // Enter key press in search input
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchTerm = searchInput.value.trim().toLowerCase();
      currentPage = 1;
      applyFiltersAndSort();
    }
  });
}

function initSorting() {
  const sortSelect = document.getElementById('sort-by');
  
  sortSelect.addEventListener('change', () => {
    sortOption = sortSelect.value;
    applyFiltersAndSort();
  });
}

function initPagination() {
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayItems();
      updatePaginationControls();
    }
  });
  
  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayItems();
      updatePaginationControls();
    }
  });
}

function initItemModal() {
  const modal = document.getElementById('item-modal');
  const closeModal = document.querySelector('.close-modal');
  
  // Close modal when clicking the X
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking outside the content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Close modal when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });
}

function applyFiltersAndSort() {
  // Apply filters
  filteredItems = allItems.filter(item => {
    // Search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) {
      return false;
    }
    
    // Type filter
    if (activeFilters.type && item.type !== activeFilters.type) {
      return false;
    }
    
    // Base type filter
    if (activeFilters.baseType && item.baseType !== activeFilters.baseType) {
      return false;
    }
    
    // Rarity filter
    if (!activeFilters.rarities.includes(item.rarity)) {
      return false;
    }
    
    // Book filter
    if (activeFilters.book && (!item.books || !item.books.includes(activeFilters.book))) {
      return false;
    }
    
    // Price filter
    if (activeFilters.minPrice !== '' || activeFilters.maxPrice !== '') {
      // Convert price to the selected unit
      let convertedPrice = item.price;
      
      switch (activeFilters.priceUnit) {
        case 'copper':
          // No conversion needed, price is already in copper
          break;
        case 'silver':
          convertedPrice = item.price / 10;
          break;
        case 'gold':
          convertedPrice = item.price / 100;
          break;
        case 'platinum':
          convertedPrice = item.price / 1000;
          break;
      }
      
      // Check min price
      if (activeFilters.minPrice !== '' && convertedPrice < activeFilters.minPrice) {
        return false;
      }
      
      // Check max price
      if (activeFilters.maxPrice !== '' && convertedPrice > activeFilters.maxPrice) {
        return false;
      }
    }
    
    return true;
  });
  
  // Apply sorting
  sortItems();
  
  // Update results count
  document.getElementById('results-count').textContent = filteredItems.length;
  
  // Reset to first page if necessary
  if (currentPage > Math.ceil(filteredItems.length / itemsPerPage)) {
    currentPage = 1;
  }
  
  // Display items and update pagination
  displayItems();
  updatePaginationControls();
}

function sortItems() {
  switch (sortOption) {
    case 'name':
      filteredItems.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredItems.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price':
      filteredItems.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredItems.sort((a, b) => b.price - a.price);
      break;
    case 'type':
      filteredItems.sort((a, b) => {
        const typeCompare = a.type.localeCompare(b.type);
        return typeCompare !== 0 ? typeCompare : a.name.localeCompare(b.name);
      });
      break;
    case 'rarity':
      const rarityOrder = {
        'Common': 1,
        'Uncommon': 2,
        'Rare': 3,
        'Very Rare': 4,
        'Legendary': 5,
        'Artifact': 6
      };
      
      filteredItems.sort((a, b) => {
        const rarityA = rarityOrder[a.rarity] || 0;
        const rarityB = rarityOrder[b.rarity] || 0;
        const rarityCompare = rarityA - rarityB;
        return rarityCompare !== 0 ? rarityCompare : a.name.localeCompare(b.name);
      });
      break;
  }
}

function displayItems() {
  const itemsContainer = document.getElementById('items-container');
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  const itemsToDisplay = filteredItems.slice(startIndex, endIndex);
  
  // Clear previous items
  itemsContainer.innerHTML = '';
  
  if (filteredItems.length === 0) {
    // No items found
    const noItemsMessage = document.createElement('div');
    noItemsMessage.className = 'no-items-message';
    noItemsMessage.innerHTML = `
      <p>No items found matching your criteria.</p>
      <p>Try adjusting your filters or search term.</p>
    `;
    noItemsMessage.style.gridColumn = '1 / -1';
    noItemsMessage.style.textAlign = 'center';
    noItemsMessage.style.padding = '50px 0';
    itemsContainer.appendChild(noItemsMessage);
    return;
  }
  
  // Get the item card template
  const template = document.getElementById('item-card-template');
  
  // Create and populate item cards
  itemsToDisplay.forEach(item => {
    const cardClone = template.content.cloneNode(true);
    const card = cardClone.querySelector('.item-card');
    
    // Set item ID as data attribute
    card.dataset.itemId = item.id;
    
    // Set item name
    cardClone.querySelector('.item-name').textContent = item.name;
    
    // Set item type
    cardClone.querySelector('.item-type').textContent = `${item.type}${item.baseType ? ` (${item.baseType})` : ''}`;
    
    // Set item price
    cardClone.querySelector('.item-price').textContent = formatDndCurrency(item.price);
    
    // Set item rarity with styling
    const rarityElement = cardClone.querySelector('.item-rarity');
    rarityElement.textContent = item.rarity;
    rarityElement.classList.add(`rarity-${item.rarity.toLowerCase().replace(' ', '-')}`);
    
    // Set source book
    cardClone.querySelector('.source-book').textContent = item.books && item.books.length > 0 
      ? `Source: ${item.books[0]}` 
      : 'Source: Unknown';
    
    // Add click event to open modal
    card.addEventListener('click', () => showItemDetails(item));
    
    // Append the card to the container
    itemsContainer.appendChild(card);
  });
}

function updatePaginationControls() {
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const pageInfo = document.getElementById('page-info');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  
  // Update page info text
  pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  
  // Update button states
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
}

function showItemDetails(item) {
  const modal = document.getElementById('item-modal');
  const modalContent = document.getElementById('modal-content');
  
  // Get the item detail template
  const template = document.getElementById('item-detail-template');
  const detailClone = template.content.cloneNode(true);
  
  // Populate item details
  detailClone.querySelector('.detail-name').textContent = item.name;
  detailClone.querySelector('.detail-type').textContent = `${item.type}${item.baseType ? ` (${item.baseType})` : ''}`;
  
  // Set item price
  detailClone.querySelector('.detail-price').textContent = `Price: ${formatDndCurrency(item.price)}`;
  
  // Set item rarity with styling
  const rarityElement = detailClone.querySelector('.detail-rarity');
  rarityElement.textContent = item.rarity;
  rarityElement.classList.add(`rarity-${item.rarity.toLowerCase().replace(' ', '-')}`);
  
  // Set source book
  detailClone.querySelector('.detail-book').textContent = item.books && item.books.length > 0 
    ? item.books.join(', ') 
    : 'Unknown';
  
  // Clear and append the details
  modalContent.innerHTML = '';
  modalContent.appendChild(detailClone);
  
  // Show the modal
  modal.style.display = 'block';
}