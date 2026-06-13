-- =============================================
-- SEED: Add your 3 product photos as products
-- Run this AFTER uploading the images to Supabase Storage
-- OR you can add them manually via Admin Panel → Products → Add Product
-- =============================================

-- NOTE: Replace the image URLs below with the actual Supabase Storage URLs
-- after you upload the photos from your phone via the Admin Panel

INSERT INTO public.products (name, description, price, sizes, images, in_stock)
VALUES 
(
  'Two-Tone Face Print Shirt',
  'A bold statement piece featuring an artistic split-face graphic print. Half camel, half white — designed for those who dare to stand out. Premium quality fabric with a relaxed fit.',
  18500,
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY[]::text[],
  true
),
(
  'African Print Oversized Shirt',
  'Inspired by African art and culture. This oversized shirt features vibrant prints of African figures in gold, black and green. Perfect for casual outings or cultural events.',
  22000,
  ARRAY['M', 'L', 'XL', 'XXL'],
  ARRAY[]::text[],
  true
),
(
  'Floral Embroidered Waffle Shirt',
  'Clean white waffle-texture fabric with delicate floral embroidery on the collar and pocket. A timeless piece that blends comfort with elegance. Perfect for any occasion.',
  15000,
  ARRAY['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
  ARRAY[]::text[],
  true
);
