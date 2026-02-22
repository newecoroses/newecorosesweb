# 🛠️ NER Website Admin Panel Setup Guide

## Step 1: Get Your Supabase API Keys

1. Go to: https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/settings/api
2. Copy the **"anon public"** key
3. Open the file: `.env.local` in your project
4. Replace `your_anon_key_here` with the key you copied
5. Save the file

Your `.env.local` should look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://tdttgbmoaskpmmkvjenq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(your key)
```

---

## Step 2: Create Admin User in Supabase

1. Go to: https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/auth/users
2. Click **"Add user"** → **"Create new user"**
3. Enter your email (e.g., `admin@newecoroses.com`)
4. Set a strong password
5. Click **"Create user"**

> This is the email/password you'll use to log into the admin panel.

---

## Step 3: Run the SQL Schema

1. Go to: https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql/new
2. Open the file `supabase_schema.sql` in your project
3. **Copy ALL** the content from that file
4. **Paste** it into the Supabase SQL editor
5. Click **"Run"** (the green button)

> This creates ALL tables and seeds them with your existing data.

---

## Step 4: Start the Development Server

```bash
npm run dev
```

Then open your browser to:
- **Admin Panel:** http://localhost:3000/admin/login
- **Your Website:** http://localhost:3000

---

## What the Admin Panel Controls

| Section | What You Can Do |
|---------|----------------|
| **Products** | Add, edit, delete, hide/show, change collection, tag, stock |
| **Collections** | Add/edit/delete/hide the 8 product categories |
| **Celebrations** | Manage the calendar section (Holi, Eid, etc.) |
| **Relationships** | Manage "Shop By Person" (Him, Her, Wife, etc.) |
| **Testimonials** | Add/edit/delete/hide customer reviews |
| **Banners** | Control hero and CTA banners |
| **Featured Items** | The "Handpicked Perfection" rose section |
| **WhatsApp** | Change phone number and default message |
| **Banned Words** | Filter unwanted words |
| **Site Settings** | Control all text, toggles, delivery info, etc. |

---

## Admin Panel URL

**http://localhost:3000/admin**  
(redirect to login if not authenticated)

---

## 🔒 Security Notes

- Only **authenticated Supabase users** can write/edit data
- The public can only **read** visible data
- Row Level Security (RLS) is enabled on all tables
- To add more admins: create more users in Supabase Auth
