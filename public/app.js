const TAX_RATE = 0.16;
const STORAGE_KEY = "la_birria_orders";
const USER_STORAGE_KEY = "la_birria_user";
const AUTH_STORAGE_KEY = "la_birria_auth";
const MENU_STORAGE_KEY = "la_birria_menu";

const defaultAuth = {
  admin: { username: "admin", password: "admin123" },
  cashiers: [{ id: "cashier-1", name: "Main Cashier", pin: "1234", active: true }],
};

const defaultMenuItems = [
  {
    id: "beef-tacos",
    name: "Beef Tacos",
    category: "Signatures",
    description: "Soft tortilla, slow-cooked birria beef, onion, cilantro, consomé dip.",
    price: 900,
    available: true,
  },
  {
    id: "chicken-tacos",
    name: "Chicken Tacos",
    category: "Signatures",
    description: "Grilled chicken, smoky adobo, pickled onion, fresh salsa verde.",
    price: 850,
    available: true,
  },
  {
    id: "beef-nachos",
    name: "Beef Nachos",
    category: "Signatures",
    description: "Crispy tortilla chips, birria beef, queso, pico de gallo, crema.",
    price: 800,
    available: true,
  },
  {
    id: "chicken-nachos",
    name: "Chicken Nachos",
    category: "Signatures",
    description: "Loaded nachos with chicken, jalapeño crema, salsa roja and lime.",
    price: 850,
    available: true,
  },
  {
    id: "family-platter",
    name: "Birria Family Platter",
    category: "Combos",
    description: "12 mini tacos, two consomé bowls, loaded fries and house slaw.",
    price: 3200,
    available: true,
  },
  {
    id: "duo-combo",
    name: "Taco Duo Combo",
    category: "Combos",
    description: "Any two tacos with fries and a bottled drink.",
    price: 1450,
    available: true,
  },
  {
    id: "mango-mojito",
    name: "Mango Mojito",
    category: "Drinks",
    description: "Fresh mango, mint, lime and soda.",
    price: 550,
    available: true,
  },
  {
    id: "very-berry-mojito",
    name: "Very Berry Mojito",
    category: "Drinks",
    description: "Berry blend, mint leaves and crushed ice.",
    price: 550,
    available: true,
  },
  {
    id: "classic-lemonade",
    name: "Classic Lemonade",
    category: "Drinks",
    description: "Cold squeezed lemons with cane sugar syrup.",
    price: 500,
    available: true,
  },
  {
    id: "bottled-water",
    name: "Bottled Water",
    category: "Drinks",
    description: "Still water served chilled.",
    price: 150,
    available: true,
  },
  {
    id: "cheese-quesabirria",
    name: "Cheese Quesabirria",
    category: "Specials",
    description: "Crisp-seared tortilla packed with melty cheese and birria.",
    price: 1100,
    available: true,
  },
  {
    id: "consome-refill",
    name: "Consomé Refill",
    category: "Specials",
    description: "Extra rich birria broth cup.",
    price: 220,
    available: true,
  },
];

const cart = [];
let activeCategory = "All";
let searchText = "";
let orderHistory = [];
let currentUser = null;
let authStore = { ...defaultAuth };
let menuCatalog = [];
let editMenuItemId = null;
let editCashierId = null;
let activeAdminTab = "sales";

const refs = {
  authScreen: document.getElementById("authScreen"),
  appShell: document.getElementById("appShell"),
  roleSelect: document.getElementById("roleSelect"),
  adminUsernameWrap: document.getElementById("adminUsernameWrap"),
  adminPasswordWrap: document.getElementById("adminPasswordWrap"),
  cashierPinWrap: document.getElementById("cashierPinWrap"),
  loginUsername: document.getElementById("loginUsername"),
  loginPassword: document.getElementById("loginPassword"),
  cashierPin: document.getElementById("cashierPin"),
  loginBtn: document.getElementById("loginBtn"),
  authError: document.getElementById("authError"),
  userRoleBadge: document.getElementById("userRoleBadge"),
  logoutBtn: document.getElementById("logoutBtn"),
  liveClock: document.getElementById("liveClock"),
  layoutGrid: document.getElementById("layoutGrid"),
  menuPanel: document.querySelector(".menu-panel"),
  cartPanel: document.querySelector(".cart-panel"),
  categoryTabs: document.getElementById("categoryTabs"),
  menuGrid: document.getElementById("menuGrid"),
  menuSearch: document.getElementById("menuSearch"),
  cartLines: document.getElementById("cartLines"),
  subtotalValue: document.getElementById("subtotalValue"),
  taxValue: document.getElementById("taxValue"),
  totalValue: document.getElementById("totalValue"),
  amountReceived: document.getElementById("amountReceived"),
  changeDue: document.getElementById("changeDue"),
  paymentMethod: document.getElementById("paymentMethod"),
  mpesaRow: document.getElementById("mpesaRow"),
  mpesaPhone: document.getElementById("mpesaPhone"),
  mpesaCode: document.getElementById("mpesaCode"),
  customerName: document.getElementById("customerName"),
  orderNotes: document.getElementById("orderNotes"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  adminPanel: document.getElementById("adminPanel"),
  clearOrdersBtn: document.getElementById("clearOrdersBtn"),
  exportSalesBtn: document.getElementById("exportSalesBtn"),
  ordersCount: document.getElementById("ordersCount"),
  salesDoneValue: document.getElementById("salesDoneValue"),
  cashValue: document.getElementById("cashValue"),
  cardValue: document.getElementById("cardValue"),
  mpesaValue: document.getElementById("mpesaValue"),
  averageSaleValue: document.getElementById("averageSaleValue"),
  topItemValue: document.getElementById("topItemValue"),
  topCashierValue: document.getElementById("topCashierValue"),
  lastSaleValue: document.getElementById("lastSaleValue"),
  salesSearchInput: document.getElementById("salesSearchInput"),
  salesPeriodFilter: document.getElementById("salesPeriodFilter"),
  salesPaymentFilter: document.getElementById("salesPaymentFilter"),
  salesCashierFilter: document.getElementById("salesCashierFilter"),
  ordersList: document.getElementById("ordersList"),
  adminTabs: Array.from(document.querySelectorAll("[data-admin-tab]")),
  salesTab: document.getElementById("salesTab"),
  menuTab: document.getElementById("menuTab"),
  settingsTab: document.getElementById("settingsTab"),
  menuNameInput: document.getElementById("menuNameInput"),
  menuCategoryInput: document.getElementById("menuCategoryInput"),
  menuDescriptionInput: document.getElementById("menuDescriptionInput"),
  menuPriceInput: document.getElementById("menuPriceInput"),
  menuAvailableInput: document.getElementById("menuAvailableInput"),
  saveMenuBtn: document.getElementById("saveMenuBtn"),
  cancelMenuEditBtn: document.getElementById("cancelMenuEditBtn"),
  menuMessage: document.getElementById("menuMessage"),
  menuManageList: document.getElementById("menuManageList"),
  currentAdminPassword: document.getElementById("currentAdminPassword"),
  newAdminPassword: document.getElementById("newAdminPassword"),
  confirmAdminPassword: document.getElementById("confirmAdminPassword"),
  changeAdminPasswordBtn: document.getElementById("changeAdminPasswordBtn"),
  newCashierName: document.getElementById("newCashierName"),
  newCashierPin: document.getElementById("newCashierPin"),
  addCashierBtn: document.getElementById("addCashierBtn"),
  cancelCashierEditBtn: document.getElementById("cancelCashierEditBtn"),
  cashiersList: document.getElementById("cashiersList"),
  settingsMessage: document.getElementById("settingsMessage"),
  printReceipt: document.getElementById("printReceipt"),
  menuCardTemplate: document.getElementById("menuCardTemplate"),
  cartLineTemplate: document.getElementById("cartLineTemplate"),
  cashRow: document.getElementById("cashRow"),
};

function formatKes(value) {
  return `KES ${Math.round(value).toLocaleString("en-KE")}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeCashier(cashier, index) {
  return {
    id: cashier?.id || `cashier-${Date.now()}-${index}`,
    name: cashier?.name || `Cashier ${index + 1}`,
    pin: String(cashier?.pin || ""),
    active: cashier?.active !== false,
  };
}

function normalizeMenuItem(item, index) {
  return {
    id: item?.id || `menu-item-${Date.now()}-${index}`,
    name: item?.name || `Menu Item ${index + 1}`,
    category: item?.category || "General",
    description: item?.description || "",
    price: Number(item?.price) || 0,
    available: item?.available !== false,
  };
}

function nowTime() {
  return new Date().toLocaleTimeString("en-KE", {
    hour12: false,
  });
}

function saveOrders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orderHistory));
}

function loadOrders() {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) {
    orderHistory = [];
    return;
  }

  try {
    const parsed = JSON.parse(value);
    orderHistory = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    orderHistory = [];
  }
}

function saveAuth() {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore));
}

function loadAuth() {
  const value = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!value) {
    authStore = JSON.parse(JSON.stringify(defaultAuth));
    return;
  }

  try {
    const parsed = JSON.parse(value);
    const hasAdmin = parsed?.admin?.username && parsed?.admin?.password;
    const hasCashiers = Array.isArray(parsed?.cashiers) && parsed.cashiers.length;
    if (hasAdmin && hasCashiers) {
      authStore = {
        admin: parsed.admin,
        cashiers: parsed.cashiers.map(normalizeCashier),
      };
      return;
    }
    authStore = JSON.parse(JSON.stringify(defaultAuth));
  } catch (error) {
    authStore = JSON.parse(JSON.stringify(defaultAuth));
  }
}

function saveMenu() {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuCatalog));
}

function loadMenu() {
  const value = localStorage.getItem(MENU_STORAGE_KEY);
  if (!value) {
    menuCatalog = defaultMenuItems.map(normalizeMenuItem);
    return;
  }

  try {
    const parsed = JSON.parse(value);
    menuCatalog = Array.isArray(parsed) && parsed.length ? parsed.map(normalizeMenuItem) : defaultMenuItems.map(normalizeMenuItem);
  } catch (error) {
    menuCatalog = defaultMenuItems.map(normalizeMenuItem);
  }
}

function saveSession() {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
}

function loadSession() {
  const value = localStorage.getItem(USER_STORAGE_KEY);
  if (!value) {
    return;
  }

  try {
    const parsed = JSON.parse(value);
    if (parsed && (parsed.role === "admin" || parsed.role === "cashier")) {
      currentUser = parsed;
    }
  } catch (error) {
    currentUser = null;
  }
}

function isPinValid(pin) {
  return /^\d{4,6}$/.test(pin);
}

function getCategories() {
  return ["All", ...new Set(menuCatalog.map((item) => item.category).filter(Boolean))];
}

function getNextOrderId() {
  if (!orderHistory.length) {
    return 1001;
  }

  return Math.max(...orderHistory.map((order) => Number(order.id) || 1000)) + 1;
}

function applyRoleUi() {
  if (!currentUser) {
    refs.authScreen.classList.remove("hidden");
    refs.appShell.classList.add("hidden");
    return;
  }

  refs.authScreen.classList.add("hidden");
  refs.appShell.classList.remove("hidden");

  const roleLabel = currentUser.role === "admin" ? "Admin" : "Cashier";
  refs.userRoleBadge.textContent = `${roleLabel}: ${currentUser.name}`;

  const isAdmin = currentUser.role === "admin";
  refs.adminPanel.classList.toggle("hidden", !isAdmin);
  refs.layoutGrid.classList.toggle("cashier-mode", !isAdmin);
  refs.layoutGrid.classList.toggle("admin-mode", isAdmin);
  refs.menuPanel.classList.toggle("hidden", isAdmin);
  refs.cartPanel.classList.toggle("hidden", isAdmin);

  if (isAdmin) {
    setActiveAdminTab(activeAdminTab);
  }
}

function updateLoginModeUi() {
  const role = refs.roleSelect.value;
  const isAdmin = role === "admin";
  refs.adminUsernameWrap.classList.toggle("hidden", !isAdmin);
  refs.adminPasswordWrap.classList.toggle("hidden", !isAdmin);
  refs.cashierPinWrap.classList.toggle("hidden", isAdmin);
}

function login() {
  const role = refs.roleSelect.value;
  if (role === "admin") {
    const username = refs.loginUsername.value.trim();
    const password = refs.loginPassword.value.trim();
    if (username !== authStore.admin.username || password !== authStore.admin.password) {
      refs.authError.textContent = "Invalid admin credentials.";
      return;
    }

    refs.authError.textContent = "";
    currentUser = { role: "admin", name: username };
    saveSession();
    applyRoleUi();
    renderAdminPanel();
    return;
  }

  const pin = refs.cashierPin.value.trim();
  const cashier = authStore.cashiers.find((entry) => entry.pin === pin && entry.active !== false);
  if (!cashier) {
    refs.authError.textContent = "Invalid or inactive cashier PIN.";
    return;
  }

  refs.authError.textContent = "";
  currentUser = { role: "cashier", name: cashier.name, cashierId: cashier.id };
  saveSession();
  applyRoleUi();
  renderAdminPanel();
}

function logout() {
  currentUser = null;
  refs.loginPassword.value = "";
  refs.cashierPin.value = "";
  localStorage.removeItem(USER_STORAGE_KEY);
  applyRoleUi();
}

function renderCategoryTabs() {
  refs.categoryTabs.innerHTML = "";
  const categories = getCategories();
  if (!categories.includes(activeCategory)) {
    activeCategory = "All";
  }

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `tab-btn ${category === activeCategory ? "active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderCategoryTabs();
      renderMenu();
    });
    refs.categoryTabs.appendChild(button);
  });
}

function filteredMenu() {
  return menuCatalog.filter((item) => {
    const availabilityMatch = item.available !== false;
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const searchMatch =
      item.name.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText);
    return availabilityMatch && categoryMatch && searchMatch;
  });
}

function renderMenu() {
  refs.menuGrid.innerHTML = "";
  const items = filteredMenu();

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No menu items match your search.";
    refs.menuGrid.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const fragment = refs.menuCardTemplate.content.cloneNode(true);
    fragment.querySelector("h3").textContent = item.name;
    fragment.querySelector(".description").textContent = item.description;
    fragment.querySelector(".price").textContent = formatKes(item.price);
    const addButton = fragment.querySelector(".add-btn");
    addButton.addEventListener("click", () => {
      addToCart(item);
    });
    addButton.disabled = !currentUser;

    refs.menuGrid.appendChild(fragment);
  });
}

function addToCart(item) {
  const existing = cart.find((line) => line.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
      category: item.category,
    });
  }
  renderCart();
}

function updateQty(id, delta) {
  const line = cart.find((entry) => entry.id === id);
  if (!line) {
    return;
  }
  line.qty += delta;
  if (line.qty <= 0) {
    const index = cart.findIndex((entry) => entry.id === id);
    cart.splice(index, 1);
  }
  renderCart();
}

function removeLine(id) {
  const index = cart.findIndex((entry) => entry.id === id);
  if (index >= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, line) => sum + line.qty * line.price, 0);
  const total = subtotal;
  const tax = total * (TAX_RATE / (1 + TAX_RATE));

  return {
    subtotal,
    tax,
    total,
  };
}

function renderCart() {
  refs.cartLines.innerHTML = "";

  if (!cart.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No items in cart yet. Add menu items to begin.";
    refs.cartLines.appendChild(empty);
  }

  cart.forEach((line) => {
    const fragment = refs.cartLineTemplate.content.cloneNode(true);
    fragment.querySelector("h4").textContent = line.name;
    fragment.querySelector(".line-meta").textContent = line.category;
    fragment.querySelector(".qty").textContent = line.qty;
    fragment.querySelector(".line-total").textContent = formatKes(line.qty * line.price);

    fragment.querySelector(".minus").addEventListener("click", () => updateQty(line.id, -1));
    fragment.querySelector(".plus").addEventListener("click", () => updateQty(line.id, 1));
    fragment.querySelector(".remove").addEventListener("click", () => removeLine(line.id));

    refs.cartLines.appendChild(fragment);
  });

  const totals = calculateTotals();
  refs.subtotalValue.textContent = formatKes(totals.subtotal);
  refs.taxValue.textContent = formatKes(totals.tax);
  refs.totalValue.textContent = formatKes(totals.total);

  const amountReceived = Number(refs.amountReceived.value || 0);
  const change = Math.max(0, amountReceived - totals.total);
  refs.changeDue.textContent = formatKes(change);
}

function submitOrder() {
  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  if (!cart.length) {
    alert("Add at least one menu item before placing the order.");
    return;
  }

  const paymentMethod = refs.paymentMethod.value;
  const totals = calculateTotals();
  const amountReceived = Number(refs.amountReceived.value || 0);

  if (paymentMethod === "cash" && amountReceived < totals.total) {
    alert("Amount received is less than total.");
    return;
  }

  if (paymentMethod === "mpesa") {
    const phone = refs.mpesaPhone.value.trim();
    const code = refs.mpesaCode.value.trim();
    if (!phone || !code) {
      alert("Enter M-Pesa phone and transaction code.");
      return;
    }
  }

  const order = {
    id: getNextOrderId(),
    createdAt: Date.now(),
    cashier: currentUser.name,
    cashierId: currentUser.cashierId || "admin",
    customerName: refs.customerName.value,
    paymentMethod,
    mpesaPhone: paymentMethod === "mpesa" ? refs.mpesaPhone.value.trim() : "",
    mpesaCode: paymentMethod === "mpesa" ? refs.mpesaCode.value.trim() : "",
    amountReceived,
    changeDue: Math.max(0, amountReceived - totals.total),
    notes: refs.orderNotes.value,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    items: cart.map((line) => ({
      id: line.id,
      name: line.name,
      qty: line.qty,
      price: line.price,
      total: line.qty * line.price,
    })),
  };

  orderHistory.unshift(order);
  saveOrders();
  renderAdminPanel();
  renderPrintReceipt(order);

  alert(`Order #${order.id} saved.`);
  cart.splice(0, cart.length);
  refs.customerName.value = "";
  refs.orderNotes.value = "";
  refs.amountReceived.value = "";
  refs.mpesaPhone.value = "";
  refs.mpesaCode.value = "";
  renderCart();

  setTimeout(() => {
    window.print();
  }, 100);
}

function getPeriodStart(period) {
  const now = new Date();
  const start = new Date(now);

  if (period === "today") {
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  }

  if (period === "week") {
    const day = start.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  }

  if (period === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  }

  return null;
}

function getSalesFilters() {
  return {
    search: refs.salesSearchInput.value.trim().toLowerCase(),
    payment: refs.salesPaymentFilter.value,
    cashier: refs.salesCashierFilter.value,
    period: refs.salesPeriodFilter.value,
  };
}

function getFilteredOrders() {
  const filters = getSalesFilters();
  const periodStart = getPeriodStart(filters.period);

  return orderHistory.filter((order) => {
    const searchMatch =
      !filters.search ||
      String(order.id).includes(filters.search) ||
      (order.customerName || "").toLowerCase().includes(filters.search) ||
      (order.cashier || "").toLowerCase().includes(filters.search);
    const paymentMatch = filters.payment === "all" || order.paymentMethod === filters.payment;
    const cashierMatch =
      filters.cashier === "all" ||
      order.cashierId === filters.cashier ||
      order.cashier === filters.cashier;
    const periodMatch = periodStart === null || Number(order.createdAt) >= periodStart;

    return searchMatch && paymentMatch && cashierMatch && periodMatch;
  });
}

function updateSalesCashierFilter() {
  const currentValue = refs.salesCashierFilter.value;
  const cashierMap = new Map();

  authStore.cashiers.forEach((cashier) => {
    cashierMap.set(cashier.id, cashier.name);
  });

  orderHistory.forEach((order) => {
    if (order.cashierId && !cashierMap.has(order.cashierId)) {
      cashierMap.set(order.cashierId, order.cashier || order.cashierId);
    }
  });

  refs.salesCashierFilter.innerHTML = '<option value="all">All Cashiers</option>';
  cashierMap.forEach((name, id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    refs.salesCashierFilter.appendChild(option);
  });

  refs.salesCashierFilter.value = cashierMap.has(currentValue) || currentValue === "all" ? currentValue : "all";
}

function printSavedOrder(orderId) {
  const order = orderHistory.find((entry) => entry.id === orderId);
  if (!order) {
    return;
  }

  renderPrintReceipt(order);
  setTimeout(() => {
    window.print();
  }, 100);
}

function removeOrder(orderId) {
  orderHistory = orderHistory.filter((entry) => entry.id !== orderId);
  saveOrders();
  renderAdminPanel();
}

function exportSalesCsv() {
  const orders = getFilteredOrders();
  if (!orders.length) {
    alert("No sales available for export.");
    return;
  }

  const header = ["Order ID", "Date", "Customer", "Cashier", "Payment", "Items", "Subtotal", "Tax", "Total"];
  const rows = orders.map((order) => [
    order.id,
    formatDateTime(order.createdAt),
    order.customerName || "Walk-in Guest",
    order.cashier || "Unknown",
    order.paymentMethod,
    order.items.map((item) => `${item.qty}x ${item.name}`).join(" | "),
    order.subtotal,
    order.tax,
    order.total,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `la-birria-sales-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderAdminPanel() {
  if (!refs.adminPanel) {
    return;
  }

  updateSalesCashierFilter();
  const filteredOrders = getFilteredOrders();
  refs.ordersCount.textContent = String(filteredOrders.length);

  const totals = filteredOrders.reduce(
    (summary, order) => {
      summary.sales += Number(order.total) || 0;
      if (order.paymentMethod === "cash") {
        summary.cash += Number(order.total) || 0;
      }
      if (order.paymentMethod === "card") {
        summary.card += Number(order.total) || 0;
      }
      if (order.paymentMethod === "mpesa") {
        summary.mpesa += Number(order.total) || 0;
      }
      return summary;
    },
    { sales: 0, cash: 0, card: 0, mpesa: 0 },
  );

  const itemsSold = new Map();
  const cashierTotals = new Map();
  filteredOrders.forEach((order) => {
    cashierTotals.set(order.cashier, (cashierTotals.get(order.cashier) || 0) + Number(order.total || 0));
    order.items.forEach((item) => {
      itemsSold.set(item.name, (itemsSold.get(item.name) || 0) + Number(item.qty || 0));
    });
  });

  let topItem = "No sales yet";
  let topItemQty = 0;
  itemsSold.forEach((qty, itemName) => {
    if (qty > topItemQty) {
      topItemQty = qty;
      topItem = `${itemName} (${qty})`;
    }
  });

  let topCashier = "No sales yet";
  let topCashierSales = 0;
  cashierTotals.forEach((value, cashierName) => {
    if (value > topCashierSales) {
      topCashierSales = value;
      topCashier = `${cashierName} (${formatKes(value)})`;
    }
  });

  refs.salesDoneValue.textContent = formatKes(totals.sales);
  refs.cashValue.textContent = formatKes(totals.cash);
  refs.cardValue.textContent = formatKes(totals.card);
  refs.mpesaValue.textContent = formatKes(totals.mpesa);
  refs.averageSaleValue.textContent = filteredOrders.length ? formatKes(totals.sales / filteredOrders.length) : formatKes(0);
  refs.topItemValue.textContent = topItem;
  refs.topCashierValue.textContent = topCashier;
  refs.lastSaleValue.textContent = filteredOrders.length ? formatDateTime(filteredOrders[0].createdAt) : "No sales yet";

  refs.ordersList.innerHTML = "";
  if (!filteredOrders.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No sales match the current filters.";
    refs.ordersList.appendChild(empty);
  } else {
    filteredOrders.slice(0, 50).forEach((order) => {
      const card = document.createElement("article");
      card.className = "ticket";
      card.innerHTML = `
        <div class="ticket-head">
          <span class="ticket-id">#${order.id}</span>
          <span class="ticket-time">${formatDateTime(order.createdAt)}</span>
        </div>
        <strong>${escapeHtml(order.customerName || "Walk-in Guest")}</strong>
        <p class="line-meta">${order.items.length} items • ${order.paymentMethod.toUpperCase()} • Cashier: ${escapeHtml(order.cashier)}</p>
        <div class="ticket-list">${order.items
          .map((item) => `<div>${item.qty} x ${escapeHtml(item.name)} <span>${formatKes(item.total)}</span></div>`)
          .join("")}</div>
        <strong>${formatKes(order.total)}</strong>
        <div class="ticket-actions">
          <button class="reprint-sale-btn">Print Receipt</button>
          <button class="secondary remove-sale-btn">Delete Sale</button>
        </div>
      `;
      card.querySelector(".reprint-sale-btn").addEventListener("click", () => printSavedOrder(order.id));
      card.querySelector(".remove-sale-btn").addEventListener("click", () => {
        if (!confirm(`Delete sale #${order.id}?`)) {
          return;
        }
        removeOrder(order.id);
      });
      refs.ordersList.appendChild(card);
    });
  }

  renderMenuManagement();
  renderCashiers();
}

function setActiveAdminTab(tab) {
  activeAdminTab = tab;
  refs.adminTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTab === tab);
  });

  refs.salesTab.classList.toggle("hidden", tab !== "sales");
  refs.menuTab.classList.toggle("hidden", tab !== "menu");
  refs.settingsTab.classList.toggle("hidden", tab !== "settings");
}

function clearMenuForm() {
  editMenuItemId = null;
  refs.menuNameInput.value = "";
  refs.menuCategoryInput.value = "";
  refs.menuDescriptionInput.value = "";
  refs.menuPriceInput.value = "";
  refs.menuAvailableInput.checked = true;
  refs.saveMenuBtn.textContent = "Add Menu Item";
  refs.cancelMenuEditBtn.classList.add("hidden");
  refs.menuMessage.textContent = "";
}

function clearCashierForm() {
  editCashierId = null;
  refs.newCashierName.value = "";
  refs.newCashierPin.value = "";
  refs.addCashierBtn.textContent = "Add Cashier";
  refs.cancelCashierEditBtn.classList.add("hidden");
}

function renderMenuManagement() {
  refs.menuManageList.innerHTML = "";
  if (!menuCatalog.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No menu items available.";
    refs.menuManageList.appendChild(empty);
    return;
  }

  [...menuCatalog]
    .sort((left, right) => left.category.localeCompare(right.category) || left.name.localeCompare(right.name))
    .forEach((item) => {
    const row = document.createElement("article");
    row.className = "manage-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <p class="line-meta">${escapeHtml(item.category)} • ${formatKes(item.price)}</p>
        <p class="line-meta">${item.available !== false ? "Visible on cashier side" : "Hidden from cashier side"}</p>
      </div>
      <div class="manage-actions">
        <button class="ghost-btn toggle-btn">${item.available !== false ? "Hide" : "Show"}</button>
        <button class="ghost-btn edit-btn">Edit</button>
        <button class="ghost-btn delete-btn">Delete</button>
      </div>
    `;

    row.querySelector(".toggle-btn").addEventListener("click", () => {
      menuCatalog = menuCatalog.map((entry) =>
        entry.id === item.id ? { ...entry, available: entry.available === false } : entry,
      );
      saveMenu();
      renderCategoryTabs();
      renderMenu();
      renderMenuManagement();
    });

    row.querySelector(".edit-btn").addEventListener("click", () => {
      editMenuItemId = item.id;
      refs.menuNameInput.value = item.name;
      refs.menuCategoryInput.value = item.category;
      refs.menuDescriptionInput.value = item.description;
      refs.menuPriceInput.value = item.price;
      refs.menuAvailableInput.checked = item.available !== false;
      refs.saveMenuBtn.textContent = "Update Menu Item";
      refs.cancelMenuEditBtn.classList.remove("hidden");
      setActiveAdminTab("menu");
    });

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (!confirm(`Delete ${item.name}?`)) {
        return;
      }
      menuCatalog = menuCatalog.filter((entry) => entry.id !== item.id);
      saveMenu();
      renderCategoryTabs();
      renderMenu();
      renderMenuManagement();
    });

    refs.menuManageList.appendChild(row);
  });
}

function saveMenuItem() {
  const name = refs.menuNameInput.value.trim();
  const category = refs.menuCategoryInput.value.trim();
  const description = refs.menuDescriptionInput.value.trim();
  const price = Number(refs.menuPriceInput.value);
  const available = refs.menuAvailableInput.checked;

  if (!name || !category || !description || !(price > 0)) {
    refs.menuMessage.textContent = "Menu item fields are required.";
    return;
  }

  refs.menuMessage.textContent = "";

  if (editMenuItemId) {
    menuCatalog = menuCatalog.map((item) =>
      item.id === editMenuItemId ? { ...item, name, category, description, price, available } : item,
    );
  } else {
    const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    menuCatalog.push({ id, name, category, description, price, available });
  }

  saveMenu();
  renderCategoryTabs();
  renderMenu();
  renderMenuManagement();
  clearMenuForm();
}

function renderCashiers() {
  refs.cashiersList.innerHTML = "";
  authStore.cashiers.forEach((cashier) => {
    const cashierOrders = orderHistory.filter(
      (order) => order.cashierId === cashier.id || order.cashier === cashier.name,
    );
    const cashierSales = cashierOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const row = document.createElement("article");
    row.className = "manage-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(cashier.name)}</strong>
        <p class="line-meta">PIN: ${cashier.pin} • ${cashier.active !== false ? "Active" : "Suspended"}</p>
        <p class="line-meta">${cashierOrders.length} sales • ${formatKes(cashierSales)}</p>
      </div>
      <div class="manage-actions">
        <button class="ghost-btn edit-cashier-btn">Edit</button>
        <button class="ghost-btn toggle-cashier-btn">${cashier.active !== false ? "Suspend" : "Activate"}</button>
        <button class="ghost-btn remove-cashier-btn">Remove</button>
      </div>
    `;

    row.querySelector(".edit-cashier-btn").addEventListener("click", () => {
      editCashierId = cashier.id;
      refs.newCashierName.value = cashier.name;
      refs.newCashierPin.value = cashier.pin;
      refs.addCashierBtn.textContent = "Update Cashier";
      refs.cancelCashierEditBtn.classList.remove("hidden");
      refs.settingsMessage.textContent = "Editing cashier details.";
      setActiveAdminTab("settings");
    });

    row.querySelector(".toggle-cashier-btn").addEventListener("click", () => {
      authStore.cashiers = authStore.cashiers.map((entry) =>
        entry.id === cashier.id ? { ...entry, active: entry.active === false } : entry,
      );
      saveAuth();
      if (currentUser?.role === "cashier" && currentUser.cashierId === cashier.id && cashier.active !== false) {
        refs.settingsMessage.textContent = "Cashier suspended and logged out.";
        logout();
      } else {
        refs.settingsMessage.textContent = cashier.active !== false ? "Cashier suspended." : "Cashier activated.";
      }
      renderCashiers();
    });

    row.querySelector(".remove-cashier-btn").addEventListener("click", () => {
      if (authStore.cashiers.length <= 1) {
        refs.settingsMessage.textContent = "At least one cashier is required.";
        return;
      }
      authStore.cashiers = authStore.cashiers.filter((entry) => entry.id !== cashier.id);
      saveAuth();
      renderCashiers();
      refs.settingsMessage.textContent = "Cashier removed.";
    });
    refs.cashiersList.appendChild(row);
  });
}

function addCashier() {
  const name = refs.newCashierName.value.trim();
  const pin = refs.newCashierPin.value.trim();

  if (!name || !isPinValid(pin)) {
    refs.settingsMessage.textContent = "Cashier name and valid 4-6 digit PIN are required.";
    return;
  }

  if (authStore.cashiers.some((cashier) => cashier.pin === pin && cashier.id !== editCashierId)) {
    refs.settingsMessage.textContent = "PIN already in use. Choose a different PIN.";
    return;
  }

  if (editCashierId) {
    authStore.cashiers = authStore.cashiers.map((cashier) =>
      cashier.id === editCashierId ? { ...cashier, name, pin } : cashier,
    );
    refs.settingsMessage.textContent = "Cashier updated successfully.";
  } else {
    authStore.cashiers.push({ id: `cashier-${Date.now()}`, name, pin, active: true });
    refs.settingsMessage.textContent = "Cashier added successfully.";
  }

  saveAuth();
  clearCashierForm();
  renderCashiers();
  updateSalesCashierFilter();
}

function changeAdminPassword() {
  const current = refs.currentAdminPassword.value.trim();
  const newPassword = refs.newAdminPassword.value.trim();
  const confirmPassword = refs.confirmAdminPassword.value.trim();

  if (current !== authStore.admin.password) {
    refs.settingsMessage.textContent = "Current admin password is incorrect.";
    return;
  }

  if (!newPassword || newPassword.length < 4) {
    refs.settingsMessage.textContent = "New password must be at least 4 characters.";
    return;
  }

  if (newPassword !== confirmPassword) {
    refs.settingsMessage.textContent = "New password and confirmation do not match.";
    return;
  }

  authStore.admin.password = newPassword;
  saveAuth();
  refs.currentAdminPassword.value = "";
  refs.newAdminPassword.value = "";
  refs.confirmAdminPassword.value = "";
  refs.settingsMessage.textContent = "Admin password updated.";
}

function renderPrintReceipt(order) {
  refs.printReceipt.innerHTML = `
    <div class="receipt-box">
      <h2>LA BIRRIA</h2>
      <p>Order #${order.id}</p>
      <p>${new Date(order.createdAt).toLocaleString()}</p>
      <hr />
      ${order.items
        .map((item) => `<p>${item.qty} x ${item.name} <span>${formatKes(item.total)}</span></p>`)
        .join("")}
      <hr />
      <p>Subtotal (Tax Included) <span>${formatKes(order.subtotal)}</span></p>
      <p>Tax Included (16%) <span>${formatKes(order.tax)}</span></p>
      <p><strong>Total</strong> <strong>${formatKes(order.total)}</strong></p>
      <p>Payment: ${order.paymentMethod.toUpperCase()}</p>
      ${order.paymentMethod === "mpesa" ? `<p>M-Pesa: ${order.mpesaCode}</p>` : ""}
      <p>Served by: ${order.cashier}</p>
      <p>Thank you!</p>
    </div>
  `;
}

function updateClock() {
  refs.liveClock.textContent = nowTime();
}

function restoreUiBehavior() {
  const method = refs.paymentMethod.value;
  refs.cashRow.style.display = method === "cash" ? "grid" : "none";
  refs.mpesaRow.style.display = method === "mpesa" ? "grid" : "none";
}

refs.menuSearch.addEventListener("input", (event) => {
  searchText = event.target.value.trim().toLowerCase();
  renderMenu();
});

refs.clearCartBtn.addEventListener("click", () => {
  cart.splice(0, cart.length);
  renderCart();
});

refs.roleSelect.addEventListener("change", updateLoginModeUi);
refs.loginBtn.addEventListener("click", login);
refs.logoutBtn.addEventListener("click", logout);
refs.paymentMethod.addEventListener("change", restoreUiBehavior);
refs.amountReceived.addEventListener("input", renderCart);
refs.checkoutBtn.addEventListener("click", submitOrder);
refs.saveMenuBtn.addEventListener("click", saveMenuItem);
refs.cancelMenuEditBtn.addEventListener("click", clearMenuForm);
refs.changeAdminPasswordBtn.addEventListener("click", changeAdminPassword);
refs.addCashierBtn.addEventListener("click", addCashier);
refs.cancelCashierEditBtn.addEventListener("click", clearCashierForm);
refs.exportSalesBtn.addEventListener("click", exportSalesCsv);

[refs.salesSearchInput, refs.salesPeriodFilter, refs.salesPaymentFilter, refs.salesCashierFilter].forEach((element) => {
  element.addEventListener("input", renderAdminPanel);
  element.addEventListener("change", renderAdminPanel);
});

refs.adminTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveAdminTab(button.dataset.adminTab);
  });
});

refs.clearOrdersBtn.addEventListener("click", () => {
  if (!currentUser || currentUser.role !== "admin") {
    return;
  }
  const shouldClear = confirm("Clear all sales records?");
  if (!shouldClear) {
    return;
  }
  orderHistory = [];
  saveOrders();
  renderAdminPanel();
});

setInterval(updateClock, 1000);
loadOrders();
loadAuth();
loadMenu();
loadSession();
updateClock();
updateLoginModeUi();
restoreUiBehavior();
applyRoleUi();
renderCategoryTabs();
renderMenu();
renderCart();
renderAdminPanel();
clearMenuForm();
clearCashierForm();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
