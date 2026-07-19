# Desny Store — Supabase Edition

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
The `.env.local` file is already included with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://tgfpfwjxtrmrplolfauj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_S6D8_k8drNawmAOYUEmHVA_CuQKkmIU
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
> Replace the Paystack key with your real one when ready.

### 3. Set up Supabase database
- Go to your Supabase dashboard → SQL Editor
- Open and run the entire `SUPABASE_SETUP.sql` file
- This creates all tables, RLS policies, and the storage bucket

### 4. Create your admin account
- Go to Supabase → Authentication → Users → Add User
- Create a user with your admin email + password
- Copy the User UID
- Go to SQL Editor and run:
  ```sql
  INSERT INTO public.admins (id, email)
  VALUES ('YOUR-UUID-HERE', 'your@email.com');
  ```

### 5. Run the app
```bash
npm run dev
```
App runs at: http://localhost:4000

---

## Pages
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/shop` | All products |
| `/product/:id` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout (login required) |
| `/my-orders` | Order history (login required) |
| `/about` | About page |
| `/contact` | Contact + map |
| `/account/signin` | Login |
| `/account/signup` | Register |
| `/admin/dashboard` | Admin panel |
| `/api/admin/setup` | First-time admin setup (visit once) |

