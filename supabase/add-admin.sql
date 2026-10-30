-- ============================================================
-- add-admin.sql  |  بعد ما تعمل المستخدم من:
-- Supabase > Authentication > Users > Add user (Email + Password)
-- غيّر الإيميل تحت للإيميل بتاعه واعمل Run.
-- ============================================================
insert into public.admins (user_id)
select id from auth.users where email = 'mohamedragaa427@gmail.com'
on conflict do nothing;

-- للتأكد: لازم يرجّع صف واحد
select a.user_id, u.email
from public.admins a join auth.users u on u.id = a.user_id;
