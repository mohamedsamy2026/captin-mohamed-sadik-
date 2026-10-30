# إعداد Supabase ولوحة التحكم (خطوة بخطوة)

## 1) إنشاء المشروع
1. ادخل https://supabase.com ← New project ← اختار اسم وكلمة سر لقاعدة البيانات واحفظها.
2. استنى لحد ما المشروع يجهز.

## 2) المفاتيح ← ملف `.env`
1. في Supabase: **Project Settings ← API**.
2. انسخ **Project URL** و **anon public key**.
3. انسخ الملف `.env.example` باسم `.env` (في نفس مكانه برا فولدر src) وحط القيم:
```
VITE_SUPABASE_URL=...الصق الـ Project URL هنا
VITE_SUPABASE_ANON_KEY=...الصق الـ anon public key هنا
```
> الـ anon key آمن يتحط في الفرونت. **ماتنسخش أبدًا الـ service_role key.**

## 3) إنشاء الجداول والتخزين
1. Supabase ← **SQL Editor ← New query**.
2. افتح `supabase/schema.sql`، انسخ **كل** محتواه، الصقه ودوس **Run**.
   (بيعمل الجداول + الصلاحيات + مخزن الملفات `media`، وآمن لو شغّلته تاني.)

## 4) إنشاء حساب الأدمن
1. Supabase ← **Authentication ← Users ← Add user ← Create new user** (إيميل + كلمة سر، فعّل Auto Confirm).
2. افتح `supabase/add-admin.sql`، غيّر `PUT-ADMIN-EMAIL-HERE` للإيميل ده، انسخه في SQL Editor ودوس **Run**. لازم يظهر صف واحد في النتيجة.
3. مهم للأمان: **Authentication ← Sign In / Providers ← Email** ← اقفل **Allow new users to sign up**.

## 5) التشغيل
```bash
npm install
npm run dev
```
- الموقع: http://localhost:5173
- لوحة التحكم: http://localhost:5173/admin

## 6) الاستيراد (مرة واحدة)
1. حط الفيديوهات الأصلية في `public/videos/` بنفس الأسماء (`video-1.mp4` ... `video-11.mp4`).
2. ادخل `/admin` ← هيظهرلك قسم **استيراد المحتوى الحالي** ← **ابدأ الاستيراد**.
3. استنى لحد ما يخلص (سيب الصفحة مفتوحة). لو في ملف فشل هيطلعلك اسمه، صلّحه واضغط تاني (اللي اترفع مش بيتكرر).
4. بعد النجاح الزر بيختفي. وتقدر تمسح `public/videos` و `public/posters` وصور `public/images/photos` و `public/images/certificates` من المشروع لأنها بقت على Supabase (سيب `public/images/brand`).

## 7) النشر على Vercel
ضيف نفس المتغيرين (`VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`) في **Project Settings ← Environment Variables** وأعد النشر.

## ملاحظات
- الضغط بيحصل في المتصفح: الصور (WebP) والفيديو (MP4 حوالي 720p). الأفضل Chrome أو Edge.
- أي حذف من لوحة التحكم **نهائي** من قاعدة البيانات ومن مخزن الملفات.
- الحدود (عدد الفيديوهات، أقصى مدة، جودة الضغط) في `src/lib/config.js`.
- الرقم في واتساب لو كتبته بصفر (01...) بيتحوّل تلقائيًا لصيغة مصر الدولية.
