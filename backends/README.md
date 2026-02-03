# 🛒 POS System — Modern Laravel API

<div align="left">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel" alt="Laravel" />
  <img src="https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php" alt="PHP" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite" alt="SQLite" />
</div>

A lightweight, high-performance Laravel backend for a Point-of-Sale system. Handles product inventory, real-time carts, order processing, and secure **KHQR Bakong** payments.

---

## ✨ Key Features

- 🔐 **Secure Auth** — Stateful API authentication via Laravel Sanctum.
- 📦 **Inventory** — Full Product CRUD with category and pricing management.
- 🛒 **Cart Engine** — Backend-driven cart logic for cross-device persistence.
- 🧾 **Order Processing** — Automated total calculations and receipt generation.
- 🇰🇭 **KHQR Ready** — Native integration with the Bakong KHQR payment system.
- ⚡ **Optimized** — Built with Service classes for clean, testable business logic.

---

## 🛠️ Tech Stack

- **Core:** [Laravel 12](https://laravel.com)
- **Security:** [Sanctum](https://laravel.com/docs/sanctum) (Bearer Tokens)
- **Payment:** [Bakong KHQR SDK](https://bakong.nbc.org.kh/)
- **Database:** SQLite (Development) / PostgreSQL or MySQL (Production)
- **Tooling:** Composer, Artisan, Vite

---

## 📁 Project Architecture

| Component | Path | Description |
| :--- | :--- | :--- |
| **🌍 Routes** | `routes/api.php` | Main API entry points |
| **🛂 Auth** | `app/Http/Controllers/Api/UserController.php` | Sanctum Login/Registration |
| **💰 Payments** | `app/Http/Controllers/Api/PaymentController.php` | KHQR Generation & Callback |
| **📐 Services** | `app/Services/OrderCalculationService.php` | Pricing & Discount Logic |
| **🗃️ Models** | `app/Models/` | Product, Cart, Order, and User |

---

## ⚙️ Quick Setup (Local)

### 1. Installation
```bash
composer install
npm install
```

### 2. Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Migration
```bash
# For SQLite setup
touch database/database.sqlite
php artisan migrate --seed
```

### 4. Serve the API
```bash
php artisan serve
```

## 🏦 KHQR / Bakong Configuration

To enable the payment gateway, update your `.env` with your merchant credentials:

```env
BAKONG_TOKEN='your_bakong_token'
BAKONG_ACCOUNT_ID='user_name@bank', # Check your user_name@bank under Bakong profile (Mobile App)
BAKONG_MERCHANT_NAME='your_name',
BAKONG_MERCHANT_CITY='your_city',
BAKONG_CURRENCY='KHR', # USD or KHR

# This is optional
store_label='your_store_name', # BoingStore
phone_number='your_phone_number', # 85512345678
bill_number='your_bill_number', # TRX01234567
static=True # Static or Dynamic QR code (default: False)
```

---

## 📝 Roadmap & Next Steps

Stay updated with the upcoming features and technical improvements:

- [ ] **🛡️ Pagination and Filtering** — Implement data pagination and advanced item searching/filtering for product lists.
- [ ] **🛡️ Audit Logging** — Implement activity tracking to monitor administrative changes to products and inventory levels.
- [ ] **✅ Request Validation** — Refactor controller-level validation into dedicated **Laravel Form Request** classes for cleaner code.
- [ ] **📖 API Documentation** — Integrate **Scalar** or **Swagger (OpenAPI)** for interactive and shareable endpoint testing.
- [ ] **🔔 Real-time Notifications** — Implement **WebSockets** (Laravel Reverb) for instant order status and inventory updates.

---

## ⚖️ License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full text.
