# 👨‍💼 Admin Product Management Guide

## 🎯 Overview

The Zenach E-Commerce Platform provides a complete admin interface for managing shoes (products). Admins can:

- ✅ **Add** new shoes to the store
- ✅ **Edit** existing shoes (including prices)
- ✅ **Delete** shoes from the store
- ✅ **Search** and filter products
- ✅ **View** all products in a table

---

## 🔐 Admin Login

**Access the admin panel:**
1. Go to `/login`
2. Use admin credentials:
   - **Email:** `admin@zenach.com`
   - **Password:** `admin123`
3. After login, you'll be redirected to the admin dashboard
4. Click "Products" in the sidebar to manage shoes

---

## ➕ Add New Shoes

### Steps:

1. **Navigate to Products Page**
   - Click "Products" in the admin sidebar
   - Or go to `/admin/products`

2. **Click "Add Product" Button**
   - Located in the top-right corner
   - A modal window will open

3. **Fill in Product Details**

| Field | Required | Description |
|-------|----------|-------------|
| Product Name | ✅ Yes | Name of the shoe (e.g., "Zenach Runner") |
| Price | ✅ Yes | Selling price (e.g., 99.99) |
| Category | No | Men, Women, or Kids |
| Stock | ✅ Yes | Available quantity |
| Description | No | Product description |
| Sizes | No | Comma-separated (e.g., "38, 39, 40, 41") |
| Image | No | Upload from computer or provide a URL |

4. **Submit**
   - Click "Add Product"
   - Success message appears
   - New product appears in the table

### Example: Adding a New Shoe

```
Product Name: Zenach Pink Elite
Price: 89.99
Category: Women
Stock: 50
Description: Stylish pink running shoes
Sizes: 36, 37, 38, 39, 40
Image: [Select file from your computer]
```

---

## ✏️ Edit Shoes (Including Prices)

### Steps:

1. **Find the Product**
   - Scroll through the products table
   - Or use the search bar to find it

2. **Click Edit Button**
   - Blue edit icon (✏️) in the Actions column
   - Edit modal opens with current data

3. **Modify Any Field**
   - Update price: Change the price field
   - Update name: Change the name field
   - Update stock: Change the stock field
   - Update any other field

4. **Save Changes**
   - Click "Update Product"
   - Success message appears
   - Table updates immediately

### Example: Changing a Shoe Price

**Before:**
- Zenach Air Max: $129.99

**Edit:**
1. Click edit icon on "Zenach Air Max"
2. Change price from `129.99` to `119.99`
3. Click "Update Product"

**After:**
- Zenach Air Max: $119.99 ✅

---

## 🗑️ Delete Shoes

### Steps:

1. **Find the Product**
   - Locate the shoe in the table

2. **Click Delete Button**
   - Red trash icon (🗑️) in the Actions column

3. **Confirm Deletion**
   - Confirmation dialog appears
   - Click "OK" to confirm
   - Product is removed from the table
   - Success message appears

### ⚠️ Important
- Deletion is immediate
- No undo option
- Confirm before deleting

---

## 🔍 Search and Filter Products

### Search by Name or Category

1. **Use the Search Bar**
   - Located above the products table
   - Type product name or category
   - Results filter automatically

### Examples:
- Type "Air" → Shows all products with "Air" in name
- Type "men" → Shows all men's category products
- Type "women" → Shows all women's products

---

## 📊 Product Table View

The products table shows:

| Column | Description |
|--------|-------------|
| Product | Image + Product Name |
| Category | Men, Women, or Kids |
| Price | Current selling price |
| Stock | Available quantity (red if < 10) |
| Actions | Edit and Delete buttons |

---

## 🎨 Admin Interface Features

### Success Messages
- ✅ Green notification when product added
- ✅ Green notification when product updated
- ✅ Green notification when product deleted
- Auto-dismisses after 3 seconds

### Error Messages
- ❌ Red notification for validation errors
- Shows when required fields are missing

### Modal Windows
- Add Product Modal
- Edit Product Modal
- Both have close button (X)
- Can cancel at any time

---

## 💡 Quick Tips

1. **Price Format:** Use decimal format (e.g., 99.99, not 9999)
2. **Size Format:** Separate sizes with commas (e.g., "38, 39, 40")
3. **Stock Warning:** Stock < 10 shows in red
4. **Image URLs:** Use direct image links (JPG, PNG)
5. **Required Fields:** Name, Price, and Stock are mandatory

---

## 📱 Responsive Design

The admin panel works on:
- ✅ Desktop (recommended)
- ✅ Tablet
- ✅ Mobile (with horizontal scroll for table)

---

## 🔒 Security

- Only admins can access product management
- Admin role required for all CRUD operations
- Protected routes in the application

---

## 🎯 Complete Admin Workflow Example

### Scenario: Add a New Shoe and Set Price

1. Login as admin (`admin@zenach.com` / `admin123`)
2. Navigate to `/admin/products`
3. Click "Add Product"
4. Fill in:
   - Name: "Zenach Sport Elite"
   - Price: "149.99"
   - Category: "men"
   - Stock: "30"
   - Description: "Professional sports shoes"
   - Sizes: "40, 41, 42, 43"
5. Click "Add Product"
6. ✅ Success! Product appears in table

### Scenario: Reduce Price of Existing Shoe

1. Find "Zenach Air Max" in the table
2. Click the blue edit icon
3. Change price from "129.99" to "109.99"
4. Click "Update Product"
5. ✅ Success! Price updated to $109.99

### Scenario: Remove Discontinued Shoe

1. Find the shoe to remove
2. Click the red delete icon
3. Confirm deletion
4. ✅ Success! Product removed

---

## 📋 All Admin Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Add Products | ✅ | `/admin/products` - Add Product button |
| Edit Products | ✅ | `/admin/products` - Edit icon |
| Delete Products | ✅ | `/admin/products` - Delete icon |
| Edit Prices | ✅ | Edit modal - Price field |
| Search Products | ✅ | Search bar above table |
| View All Products | ✅ | Products table |
| View Stock Levels | ✅ | Stock column |
| Success Notifications | ✅ | Top of page |
| Error Handling | ✅ | Validation messages |

---

## 🚀 Ready to Use!

The admin product management system is **fully functional** and ready for:
- Adding new shoes
- Updating prices
- Managing inventory
- Removing products

**Access it at:** `/admin/products` (after admin login)
