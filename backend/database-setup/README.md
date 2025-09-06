# Manual Database Setup for cPanel Deployment

This folder contains SQL scripts to manually set up your Sheria Smart database on cPanel shared hosting, bypassing Prisma CLI memory limitations.

## 📋 Prerequisites

1. **MySQL Database Created** in cPanel
2. **Database User** with full permissions
3. **phpMyAdmin Access** through cPanel

## 🗄️ Database Setup Steps

### Step 1: Access phpMyAdmin
1. Login to your cPanel
2. Go to "phpMyAdmin" 
3. Select your database: `robertki_sheria`

### Step 2: Run SQL Scripts in Order
**IMPORTANT:** Run these scripts in the exact order shown:

#### 1. Initial Tables (01_init.sql)
- Creates: `users`, `accounts`, `chat_sessions`, `messages` tables
- **Status**: ⏳ Run first

#### 2. Document Requests (02_document_requests.sql) 
- Creates: `document_requests` table
- **Status**: ⏳ Run second

#### 3. Expand Document Types (03_expand_document_types.sql)
- Updates: Document types enum with all supported documents
- **Status**: ⏳ Run third

#### 4. Email Retry Fields (04_email_retry_fields.sql)
- Adds: Email retry functionality columns
- **Status**: ⏳ Run fourth

#### 5. Rate Limiting (05_rate_limits.sql)
- Creates: `rate_limits`, `rate_limit_configs` tables  
- **Status**: ⏳ Run fifth

#### 6. Admin Setup (06_admin_setup.sql)
- Sets up: Admin user and default rate limits
- **Status**: ⏳ Run last (after first login)

## 🔧 How to Run Each Script

1. **Open phpMyAdmin** → Select your database
2. **Click "SQL" tab**
3. **Copy the entire content** of the SQL file
4. **Paste into the SQL query box**
5. **Click "Go" to execute**
6. **Verify success** - check for green success message

## ⚠️ Important Notes

### Admin User Setup
- **First login required**: Admin script only works AFTER you log in via Google OAuth
- **Email**: `swe.robertkibet@gmail.com` will become admin
- **Process**: 
  1. Deploy backend application
  2. Login once via Google OAuth (creates user record)
  3. Run `06_admin_setup.sql`

### Error Handling
- If you get an error, **stop** and fix it before continuing
- **Double-check** you're running scripts in the correct order
- **Backup** your database before making changes

## 🧪 Verification

After running all scripts, verify your setup:

```sql
-- Check all tables were created
SHOW TABLES;

-- Check admin user (after first login)
SELECT email, name, isAdmin FROM users WHERE email = 'swe.robertkibet@gmail.com';

-- Check rate limit configs
SELECT * FROM rate_limit_configs;
```

Expected tables:
- ✅ `users`
- ✅ `accounts` 
- ✅ `chat_sessions`
- ✅ `messages`
- ✅ `document_requests`
- ✅ `rate_limits`
- ✅ `rate_limit_configs`

## 🚀 Next Steps

Once database setup is complete:
1. **Start your backend** application in cPanel
2. **Skip any Prisma CLI commands** (db:generate, db:deploy)
3. **Run only**: `start` script
4. **Test the application**

Your database is now ready for production use!