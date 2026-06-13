# 🔧 QUICK FIX STEPS — Read This First!

## Your 3 Problems & How To Fix Them

---

## ❌ Problem 1: Admin login says "Invalid email or password"

**Root Cause:** Your anon key in `.env.local` is wrong AND your admin user may not exist.

### Fix it:

**Step A — Get your REAL anon key:**
1. Go to [supabase.com](https://supabase.com) → your project
2. Click **Settings** (bottom left) → **API**
3. Under "Project API Keys" copy the **anon public** key
4. It starts with `eyJhbGciOiJIUzI1NiI...` (long JWT token)
5. Open `.env.local` and replace `NEXT_PUBLIC_SUPABASE_ANON_KEY` with it
6. **Restart your dev server** (Ctrl+C then `npm run dev`)

**Step B — Disable Email Confirmation:**
1. Supabase → **Authentication** → **Settings** (or Email tab)
2. Turn **OFF** "Enable email confirmations"
3. Save

**Step C — Create your admin user properly:**
1. Supabase → **Authentication** → **Users** → **Add User** → **Create New User**
2. Email: `divineoseghale75@protonmail.com`
3. Password: `123456`
4. Click **Create User**
5. You'll see the user appear — copy their **UID** (looks like `abc123-def456-...`)

**Step D — Add them to admins table:**
1. Supabase → **SQL Editor** → **New Query**
2. Paste and run (replace UUID with the one you copied):
```sql
INSERT INTO public.admins (id, email)
VALUES ('PASTE-UUID-HERE', 'divineoseghale75@protonmail.com')
ON CONFLICT (id) DO NOTHING;
```

---

## ❌ Problem 2: Users signing up don't appear in Supabase

**Root Cause:** Email confirmation is ON — Supabase creates the user but doesn't activate them until they confirm.

### Fix it:
→ Do **Step B** above (disable email confirmation). After that, signups will work immediately.

---

## ❌ Problem 3: Can't access admin panel

**Root Cause:** Steps 1 and 2 above aren't done yet. Fix those first.

---

## ✅ After All Fixes, Test Like This:

1. `npm run dev`
2. Go to `http://localhost:4000/admin/login`
3. Enter `divineoseghale75@protonmail.com` / `123456`
4. You should land on the dashboard

---

## 📸 Uploading Your 3 Product Photos

1. Log into admin panel
2. Go to **Products** → **Add New Product**  
3. Fill in name, price, sizes
4. Click the image upload area → select your photo from your device
5. Submit

Your 3 photos and suggested details:
| Photo | Name | Price | Sizes |
|-------|------|-------|-------|
| Camel/White face shirt | Two-Tone Face Print Shirt | ₦18,500 | S M L XL XXL |
| African print oversized | African Print Oversized Shirt | ₦22,000 | M L XL XXL |
| White floral embroidered | Floral Embroidered Waffle Shirt | ₦15,000 | S M L XL XXL Free Size |

