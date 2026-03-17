# Kardix 🚀

<div align="center">
  <video src="https://private-user-images.githubusercontent.com/265097338/564998474-74dfd0ad-af4c-48e2-baaa-fd53e2b6c7c0.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM3NzAxNjgsIm5iZiI6MTc3Mzc2OTg2OCwicGF0aCI6Ii8yNjUwOTczMzgvNTY0OTk4NDc0LTc0ZGZkMGFkLWFmNGMtNDhlMi1iYWFhLWZkNTNlMmI2YzdjMC5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzE3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxN1QxNzUxMDhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mZWEwMTg2MGExMGNiNzM4NjU4ZTllY2M5Y2E0NDczM2Q1MDJhY2U1MTE4YTM5N2M3NzI4MzgzNDA0M2ZiNDI1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.xC-_KfQauVSoy5ponw4yb32vAsfvnkvQv3DK5akqxDE" width="100%" controls>
    Your browser does not support the video tag.
  </video>
</div>

## 📌 What is Kardix?
Kardix is a modern web application oriented towards efficient inventory management and systematic sales control. It offers an interactive Dashboard that allows users to manage their product catalog, monitor stock in real-time, and execute commercial transactions quickly and securely.

## 🎯 The Problem it Solves
Inventory and sales control is often a tedious process for small and medium-sized businesses, which usually resort to slow tools or manual spreadsheets susceptible to failure. **Kardix** tackles this problem by providing:
- **Total Centralization:** All information about inventories, products, and sales transactions consolidated in a single environment.
- **Efficiency and Speed:** Almost instantaneous synchronization. The advanced use of client-side caching means the application has no wait times during navigation.
- **Transactional Integrity:** When making exchanges or sales, the system executes atomic transactions that prevent data inconsistencies, even under concurrency.
- **User Experience (UI/UX):** A polished and modern user interface, fully optimized for light or dark mode environments, facilitating operability.

## 🛠️ Tech Stack
To ensure scalability, security, and maximum performance, the project uses the following tools:

- **Frontend / Framework:** [Next.js 16](https://nextjs.org/) (App Router) and [React 18](https://react.dev/).
- **Storage and Database:** [Supabase](https://supabase.com/) as a Backend-as-a-Service, operating on PostgreSQL.
- **Caching and State Management:** [SWR](https://swr.vercel.app/) for efficient request management and real-time data invalidation.
- **Styling and Components:** [Tailwind CSS](https://tailwindcss.com/) combined with utilities like `clsx` and `tailwind-merge` for dynamic classes.
- **Iconography:** [Lucide React](https://lucide.dev/).
- **Visual Adaptability:** `next-themes` for seamless support between Light Mode and Dark Mode.



## 🚀 Deployment

Because this system handles sensitive information, **Supabase credentials and API keys must never be committed to the public repository**. 

To deploy this application on a platform like **Vercel** or **Netlify**, you must manually set up your own environment variables:

### 1. Cloning and Installation
```bash
git clone https://github.com/YOUR_USERNAME/kardix.git
cd kardix
npm install
```

### 2. Prepare the Supabase Environment
1. Go to [Supabase](https://supabase.com/) and set up a new project.
2. Go to the **SQL Editor** in your Supabase dashboard. Below are different "queries". We recommend creating a "New Query" in Supabase for each of these blocks and executing them in order:

<details>
<summary><b>Show SQL Scripts (4 Files)</b></summary>
<br>

**1️⃣ Query 1: Base table creation**
```sql
-- 1. Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**2️⃣ Query 2: Sales table modification**
```sql
-- 1. Add column to save the product name in the sale
ALTER TABLE sales ADD COLUMN product_name TEXT;

-- 2. Fill in the names of existing sales
UPDATE sales s SET product_name = p.name FROM products p WHERE s.product_id = p.id;

-- 3. Make the name mandatory for future sales
ALTER TABLE sales ALTER COLUMN product_name SET NOT NULL;

-- 4. Allow deleting products without deleting their sales
ALTER TABLE sales DROP CONSTRAINT IF EXISTS sales_product_id_fkey;
ALTER TABLE sales ADD CONSTRAINT sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
```

**3️⃣ Query 3: Security and user relationship**
```sql
-- 1. Add user_id column to existing tables
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE sales ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Enable RLS (Row Level Security) for data isolation
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- 3. Create Security Policies
-- Policy for Products: Only the owner can view/edit their products
CREATE POLICY "Users can only access their own products" ON public.products
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy for Sales: Only the owner can view their sales
CREATE POLICY "Users can only access their own sales" ON public.sales
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Note: If your tables already had data, you might want to manually assign the user_id of your current user to them.
```

**4️⃣ Query 4: Functions (Transactions) and Indexes**
```sql
-- 1. Function to complete sales safely (Transaction)
-- This function receives the product ID and quantity, and does everything in one step.
CREATE OR REPLACE FUNCTION complete_sale_v2(
  p_product_id UUID,
  p_product_name TEXT,
  p_quantity INTEGER,
  p_unit_price DECIMAL,
  p_total DECIMAL
) RETURNS VOID AS $$
BEGIN
  -- Insert the sale
  INSERT INTO public.sales (user_id, product_id, product_name, quantity, unit_price, total)
  VALUES (auth.uid(), p_product_id, p_product_name, p_quantity, p_unit_price, p_total);

  -- Update the stock
  UPDATE public.products
  SET stock = stock - p_quantity
  WHERE id = p_product_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add indexes for speed (this makes searches fast)
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON sales(sold_at);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
```
</details>

3. Go to **Project Settings** > **API** in your Supabase dashboard. There you will find two critical values: your project URL and the public key (`anon` key).

### 3. Configure your Platform (e.g., Vercel)
1. Import the repository from your GitHub account into [Vercel](https://vercel.com/new).
2. Before starting the first deployment, open the **Environment Variables** options and add the following fields:

   - **`NEXT_PUBLIC_SUPABASE_URL`**: With the value of your URL copied from Supabase.
   - **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: With your public `anon` key.

3. Click **Deploy**. Vercel will read and inject these variables during the build (`Next.js Build`), securely connecting your production environment with the database without exposing it in your repository.

*Development Note: If you test the code on your personal computer, create a hidden `.env.local` file in the root and introduce these same variables there.*

---

<details>
<summary><b>📐 Folder Structure & Core Components</b></summary>
<br>

The core of the application rests in the `src/` directory.

```text
src/
├── app/            # Main views via App Router, globals.css, layout.tsx
├── components/     # Modular fragments, like ProductCard, Sidebar
├── hooks/          # Reactivity abstractions (useProducts, etc.)
├── lib/            # Supabase client instances
└── types/          # Polymorphism and typed interfaces for TS
```

To modify the design scheme (`Dark Theme`/`Light Theme`), you can freely alter the hex codes in the native variables located in `src/app/globals.css`.

</details>
