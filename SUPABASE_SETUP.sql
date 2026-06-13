-- =============================================
-- DESNY STORE — SUPABASE SETUP
-- Paste this entire file into Supabase SQL Editor and click Run
-- =============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (true);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (true);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  delivery_location TEXT,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city_state TEXT,
  landmark TEXT,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'Pending',
  paystack_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (true);

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.messages;

CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Admins can update messages" ON public.messages FOR UPDATE USING (true);

-- 5. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admins table" ON public.admins;
DROP POLICY IF EXISTS "Allow insert for setup" ON public.admins;

CREATE POLICY "Admins can view admins table" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Allow insert for setup" ON public.admins FOR INSERT WITH CHECK (true);

-- 6. STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- =============================================
-- DONE! Now follow these steps:
-- =============================================
-- 
-- STEP 1: Disable Email Confirmation (IMPORTANT!)
--   → Go to Supabase Dashboard
--   → Authentication → Settings (or "Email" tab)  
--   → Turn OFF "Enable email confirmations"
--   → Save
--
-- STEP 2: Create your admin user
--   → Authentication → Users → Add User → Create New User
--   → Email: divineoseghale75@protonmail.com
--   → Password: 123456
--   → Click Create
--
-- STEP 3: Copy the UUID shown next to the user
--   → Then run this in SQL Editor (replace UUID):
--
-- INSERT INTO public.admins (id, email)
-- VALUES ('PASTE-UUID-HERE', 'divineoseghale75@protonmail.com')
-- ON CONFLICT (id) DO NOTHING;
--
-- STEP 4: Update your .env.local with the REAL anon key
--   → Supabase Dashboard → Settings → API
--   → Copy "anon public" key (starts with eyJ...)
--   → Replace NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
-- =============================================
