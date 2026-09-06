# Kardix 🚀

<div align="center">

**Modern inventory management & point-of-sale system, built for small and medium-sized businesses.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![Status](https://img.shields.io/badge/Source-Private-lightgrey)](#-license)

</div>

<div align="center">
  <img width="1920" height="1440" alt="Image" src="https://github.com/user-attachments/assets/4bc125f9-d3a1-433f-a489-b6d730a023d2" />
</div>

---

## 📌 What is Kardix?

Kardix is a modern web application for efficient inventory management and systematic sales control. It offers an interactive dashboard where users can manage their product catalog, monitor stock in real time, and execute commercial transactions quickly and securely — including barcode scanner support and role-based access control (Admin/User).

Originally built to solve a real operational need, Kardix is now evolving into a full multi-tenant SaaS product.

> 📁 **About this repository** — this repo is a showcase of the project for portfolio purposes. It documents the architecture, feature set, and design decisions behind Kardix. The full source code is kept in a private repository as the product moves toward a commercial SaaS launch.

## 🎯 The Problem it Solves

Inventory and sales control is often a tedious process for small and medium-sized businesses, which usually resort to slow tools or error-prone manual spreadsheets. Kardix tackles this by providing:

- **Total centralization** — inventory, products, and sales transactions consolidated in a single environment.
- **Efficiency and speed** — near-instant UI updates thanks to client-side caching, with no perceptible wait times during navigation.
- **Transactional integrity** — sales are processed as atomic operations, preventing data inconsistencies even under concurrent use.
- **Barcode scanning** — native support for USB/Bluetooth HID barcode scanners, in both product registration and point-of-sale checkout.
- **Role-based access** — an Admin/User role system with password-protected role switching, validated and stored securely server-side.
- **Polished UX** — a clean, modern interface with full light/dark mode support.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/) + TypeScript |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) + `globals.css` design tokens |
| Icons | [Lucide React](https://lucide.dev/) |
| Backend | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage + RPC) |
| Data Fetching | [SWR](https://swr.vercel.app/) (stale-while-revalidate) |
| Utilities | `clsx` + `tailwind-merge` |
| Theming | `next-themes` (Dark/Light mode) |
| Font | Geist (local, `--font-geist-sans`) |

## ✨ Core Features

- 📊 **Dashboard** — real-time KPIs and quick inventory search.
- 📦 **Product management** — full CRUD with barcode field, duplicate detection, and category tagging.
- 🧾 **Point of Sale (POS)** — sales cart, live search by name/category/barcode, and one-click checkout.
- 🔍 **Barcode scanner integration** — plug-and-scan support for any HID-mode USB/Bluetooth scanner, with audio feedback.
- 📉 **Low-stock alerts** — configurable restock threshold with a dedicated view.
- 📅 **Sales calendar** — day/month view of historical sales.
- 🌗 **Theming** — light/dark mode with a customizable accent color.
- 🌐 **i18n** — full English/Spanish language support.
- 🔐 **Role-based access** — Admin/User roles with password-protected switching.
- 📱 **PWA-ready** — installable as a standalone app on desktop and mobile.

## 📐 Architecture Overview

```text
src/
├── app/
│   ├── layout.tsx              # Root layout: Theme, Language, Accent, Notification providers
│   ├── login/page.tsx          # Login (Supabase Auth)
│   └── (dashboard)/
│       ├── dashboard/page.tsx  # KPIs, quick inventory search
│       ├── products/page.tsx   # Product CRUD
│       ├── reports/page.tsx    # POS: sales cart, search, barcode scanner
│       ├── restock/page.tsx    # Low-stock product list
│       ├── calendar/page.tsx   # Sales calendar
│       └── settings/page.tsx   # Profile, language, role, logout
├── components/                 # Sidebar, Notification system, modals, theme controls
├── context/                    # Language (i18n) and User context providers
├── hooks/                      # useAlertThreshold, usePWAInstall, useBarcodeScanner
├── lib/                        # Supabase client
└── types/                      # TypeScript types generated from the database schema
```

### Notable Components

- **`useBarcodeScanner.ts`** — detects HID scanner input (keystrokes under 30ms apart, terminated by Enter) and plays success/error beeps via the Web Audio API, with no external audio files required.
- **`Notification.tsx`** — a global notification system with a dedicated non-stacking mode for barcode scan feedback.
- **`ProductModal.tsx`** — barcode field with live scan support and real-time duplicate validation before submit.
- **`Sidebar.tsx`** — collapsible desktop sidebar and a bottom navigation bar on mobile.

## 🎨 Design Tokens

| Token | Value |
|---|---|
| Sidebar primary | `#8bbdad` (sage green) |
| CTA / active | `#c9ff09` (neon yellow) |
| Danger / action | `#ff4f38` (coral red) |
| Primary text | `#46556a` |
| Secondary text | `#97a6bb` |
| Border / dividers | `#eef1f4` |
| App background | `#f0f1f3` |
| Border radius | `rounded-[8px]` |
| Shadow | `shadow-[0_12px_28px_rgba(32,41,54,0.12)]` |

## 🔐 Security

Kardix follows a defense-in-depth approach at the database and application layers: row-level access control on every table, hashed credentials with no plaintext storage, brute-force protection on sensitive actions, database-level data integrity constraints, and strict isolation of secrets from the client bundle.

## 📦 Barcode Scanner Support

Kardix supports any USB or Bluetooth barcode scanner running in **HID mode** (keyboard emulation) — the default on virtually all commercial scanners. No drivers or SDKs required: the scanner types the code and presses Enter, exactly like a keyboard.

- **Product registration** — the scanner is active automatically while the "Add Product" modal is open.
- **Point of Sale** — a dedicated toggle enables/disables the global scanner listener; manual search always works regardless.
- **Feedback** — a short success/error beep plays on every scan, plus a single non-stacking on-screen notification.

## 🗺️ Roadmap

- [ ] Self-service password recovery (account + admin)
- [ ] Multi-tenant / organization support
- [ ] Usage analytics and reporting exports
- [ ] Public API for third-party integrations

## 📄 License

This project is **proprietary software**. All rights reserved. This repository contains only project documentation for portfolio purposes — the source code is not published and remains private property of the author. No part of this project (concept, design, or code) may be copied, redistributed, or used commercially without explicit written permission.

## 👤 Author

Built and maintained by **Saeldeveloper**. Interested in a live demo or collaboration? Feel free to reach out.
