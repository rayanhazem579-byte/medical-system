<!DOCTYPE html>
<html dir="{{ str_contains(request()->header('Accept-Language', 'ar'), 'ar') ? 'rtl' : 'ltr' }}">
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9; }
        .header { text-align: center; margin-bottom: 20px; }
        .content { margin-bottom: 20px; }
        .credentials { background-color: #fff; padding: 15px; border-radius: 8px; border-left: 5px solid #0ea5e9; margin: 15px 0; }
        .footer { font-size: 12px; color: #777; text-align: center; }
        .bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="color: #0ea5e9;">مستشفى الشفاء التخصصي</h2>
            <h3>بيانات الحساب الجديد</h3>
        </div>
        <div class="content">
            <p>مرحباً <span class="bold">{{ $name }}</span>،</p>
            <p>تم إنشاء حساب لك في نظام المستشفى بنجاح. يرجى استخدام البيانات التالية للدخول:</p>
            
            <div class="credentials">
                <p>اسم المستخدم: <span class="bold">@ {{$username}}</span></p>
                <p>كلمة المرور: <span class="bold">{{ $password }}</span></p>
            </div>

            <p>يرجى تغيير كلمة المرور فور تسجيل الدخول الأول بكلمة سر أكثر أماناً.</p>
            <hr>
            <p>Welcome <span class="bold">{{ $name }}</span>,</p>
            <p>Your hospital system account has been created. Use the following credentials to login:</p>
            
            <div class="credentials">
                <p>Username: <span class="bold">@ {{$username}}</span></p>
                <p>Password: <span class="bold">{{ $password }}</span></p>
            </div>
            <p>For security, please change your password after the first login.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Al-Shifa Specialized Hospital | All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
