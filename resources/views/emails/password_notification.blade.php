<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #1e293b; background-color: #ffffff; padding: 40px; }
    </style>
</head>
<body>
    <div style="font-size: 16px; white-space: pre-wrap;">
        @php
            $settings = DB::table('system_settings')->first();
            $hospitalName = $settings->hospital_name_ar ?? 'مستشفى الشفاء التخصصي';
            $hospitalEmailContact = $settings->hospital_email ?? 'ryanhazem27@gmail.com';
            
            $content = $customMessage ?? $settings->welcome_email_template ?? null;

            $roleLabels = [
                'doctor' => 'طبيب',
                'nurse' => 'ممرض/ة',
                'receptionist' => 'موظف استقبال',
                'admin' => 'مدير نظام',
                'finance' => 'محاسب',
                'hr' => 'مدير موارد بشرية',
            ];
            $translatedRole = $roleLabels[strtolower($role)] ?? $role;

            if ($content) {
                $placeholders = [
                    '{hospital_name}' => $hospitalName,
                    '{name}' => $name,
                    '{role}' => $translatedRole,
                    '{email}' => $email,
                    '{password}' => $password,
                    '{support_contact}' => $hospitalEmailContact,
                ];
                $content = strtr($content, $placeholders);
                echo $content;
            } else {
        @endphp
        مرحباً، هذا بريد إلكتروني من {{ $hospitalName }}<br><br>
        عزيزي {{ $name }}،<br>
        لقد تم إنشاء حسابك بنجاح في نظام المستشفى.<br><br>
        
        بيانات التعريف:<br>
        الدور الوظيفي: {{ $translatedRole }}<br>
        الايميل: {{ $email }}<br>
        كلمة المرور المؤقتة: {{ $password }}<br><br>

        تنبيه أمني هام: يرجى تغيير كلمة المرور بعد تسجيل الدخول لأول مرة فوراً لضمان أمان حسابك الشخصي.<br><br>
        
        يرجى الرد على البريد الإلكتروني أو التواصل مع {{ $hospitalEmailContact }} للتأكد من استلامك لهذه البيانات.<br><br>
        
        مع تحيات إدارة تقنية المعلومات،<br>
        {{ $hospitalName }}.
        @php
            }
        @endphp
    </div>
</body>
</html>
