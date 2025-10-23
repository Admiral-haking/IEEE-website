# Security Guidelines

این فایل شامل راهنمای امنیتی و بهترین شیوه‌ها برای پروژه انجمن علمی مهندسی کامپیوتر است.

## 🔐 متغیرهای محیطی امنیتی

### فایل `.env.local` ایجاد کنید:

```bash
# کپی کردن فایل نمونه
cp env.example .env.local
```

### متغیرهای ضروری:

```env
# JWT Secret - باید قوی و منحصر به فرد باشد
JWT_SECRET=your-super-secure-jwt-secret-here

# MongoDB Connection String
MONGODB_URI=mongodb://username:password@host:port/database

# Environment
NODE_ENV=production
```

### تولید JWT Secret قوی:

```bash
# در Linux/Mac
openssl rand -base64 32

# یا در Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🛡️ ویژگی‌های امنیتی پیاده‌سازی شده

### 1. احراز هویت و مجوزدهی
- ✅ JWT با انقضای 7 روزه
- ✅ رمزنگاری رمز عبور با bcrypt
- ✅ کوکی‌های HTTP Only و Secure
- ✅ حفاظت CSRF با SameSite

### 2. Rate Limiting
- ✅ محدودیت 5 تلاش ورود در 15 دقیقه
- ✅ محدودیت 100 درخواست API در 15 دقیقه
- ✅ محدودیت 10 آپلود فایل در ساعت

### 3. Headers امنیتی
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Content-Security-Policy
- ✅ Strict-Transport-Security (HTTPS)

### 4. اعتبارسنجی ورودی
- ✅ Zod schema validation
- ✅ Sanitization ورودی‌ها
- ✅ پیشگیری از SQL Injection

## 🚨 چک‌لیست امنیتی

### قبل از deployment:

- [ ] فایل `.env.local` ایجاد شده و متغیرهای حساس تنظیم شده
- [ ] JWT_SECRET قوی و منحصر به فرد تولید شده
- [ ] MONGODB_URI با احراز هویت تنظیم شده
- [ ] فایل `.env.local` در `.gitignore` قرار دارد
- [ ] NODE_ENV=production تنظیم شده
- [ ] HTTPS فعال شده
- [ ] Rate limiting تست شده
- [ ] Headers امنیتی بررسی شده

### در production:

- [ ] فایل‌های log امن نگهداری می‌شوند
- [ ] Backup منظم دیتابیس انجام می‌شود
- [ ] Monitoring و alerting فعال است
- [ ] به‌روزرسانی‌های امنیتی منظم انجام می‌شود

## 🔍 تست امنیتی

### تست Rate Limiting:
```bash
# تست محدودیت ورود
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpassword"}'
done
```

### تست Headers امنیتی:
```bash
curl -I http://localhost:3000
```

## 🚨 گزارش مشکلات امنیتی

اگر مشکل امنیتی پیدا کردید:

1. **فوراً** آن را گزارش دهید
2. جزئیات مشکل را شرح دهید
3. مراحل بازتولید مشکل را ارائه دهید
4. اطلاعات تماس خود را ارائه دهید

## 📚 منابع امنیتی

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🔄 به‌روزرسانی‌های امنیتی

این فایل باید به‌طور منظم بررسی و به‌روزرسانی شود:

- بررسی وابستگی‌ها برای آسیب‌پذیری‌ها
- به‌روزرسانی الگوهای امنیتی
- بررسی تنظیمات production
- تست penetration testing

---

**یادآوری:** امنیت یک فرآیند مداوم است، نه یک بار انجام دادن!
