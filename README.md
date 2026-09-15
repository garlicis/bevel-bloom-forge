# Bloom & Bevel Forge

Project: Full-Stack E-Commerce Store & Admin Dashboard for "Bevel & Bloom"

1. Project Overview & Brand Identity Build a fully functional, responsive e-commerce web application for a premium DTC (Direct-to-Consumer) brand named "Bevel & Bloom".

Niche: High-end, precision-forged stainless steel beauty tools imported from Sialkot.

Product Scope: Manicure/pedicure kits, eyelash extension tweezers, professional barber shears, and podiatry nippers. (Strict rule: NO kitchenware, NO flatware, NO crockery).

Vibe & Aesthetic: Minimalist, modern luxury, clean clinical beauty, spa-like but highly professional. Think brands like Tweezerman, Glossier, or high-end salon suppliers.

2. Design System & UI/UX

Frameworks: React, Vite, Tailwind CSS, Shadcn UI.

Color Palette: "Matte Luxury." Primary background: crisp white or off-white (slate-50). Accents: Soft blush/nude pinks (bloom), contrasting with sharp matte black or deep charcoal (bevel) for text and buttons.

Typography: Sleek, modern sans-serif (e.g., Inter or elegant geometric fonts). Clean lines, lots of whitespace.

Components: Use high-quality Shadcn UI components (cards for products, sheet/drawer for the cart, toast notifications for adding to cart/saving products).

3. Frontend Store Requirements (Customer Facing)

Navigation Bar: Logo (Bevel & Bloom) on the left, Links (Shop All, Manicure/Pedicure, Lash & Brow, Pro Shears) in center, Cart icon (with badge counter) on the right.

Hero Section: Split design or full-width banner. Headline: "Precision Forged. Beautifully Honed." Subtext: "Professional-grade stainless steel tools for salons, studios, and self-care." CTA: "Shop the Collection".

Shop/Product Grid: A clean grid layout displaying products. Each card should have an image placeholder, product title, category, and price, with a subtle hover effect and a quick "Add to Cart" button.

Product Categories to Filter: "Lash & Brow", "Nail & Cuticle", "Barber & Hair", "Complete Kits".

Cart Experience: A slide-out cart drawer (Sheet) showing added items, quantity adjustments, total calculation, and a "Checkout" button.

4. Backend & Admin Dashboard (CRITICAL REQUIREMENT) I need to be able to add, edit, and manage products without touching the code.

Integrate a database solution (like Supabase) OR build a robust state management system using local storage for the prototype so that products persist.

Create a hidden or protected route /admin.

Admin Dashboard Features:

A "Product List" table showing current inventory with Edit/Delete buttons.

An "Add New Product" form with the following fields:

Product Name (Text)

Description (Textarea)

Category (Dropdown: Lash & Brow, Nail & Cuticle, Barber & Hair, Kits)

Price (Number, USD)

Cost/Margin tracking (Optional internal field)

Image URL (Text input for image links or an upload component).

"Save Product" button.

When a new product is saved via this Admin page, it must immediately appear dynamically on the frontend Shop Grid.

5. Initial Mock Data (Seed the database with these examples) To make the UI look complete immediately, populate the store with these initial mock products:

"Pro-Grip Fiber Tip Lash Tweezers" - Lash & Brow - $24.00

"Heavy-Duty Podiatry Nipper" - Nail & Cuticle - $28.00

"12-Piece Leather Travel Grooming Kit" - Kits - $45.00

"6-inch Convex Edge Barber Shear" - Barber & Hair - $65.00

Please generate the complete UI, the routing, the interactive cart, and the functional Admin product-addition system. Make the design look expensive and trustworthy.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bevel-bloom-forge.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/423f3c53-eff0-4fee-bb95-e4043af7284e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
