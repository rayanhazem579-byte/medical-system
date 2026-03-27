<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    /**
     * Get system settings.
     */
    public function index()
    {
        $this->ensureTableExists();
        $settings = DB::table('system_settings')->first();

        $defaultTemplate = "مرحباً، هذا بريد إلكتروني من {hospital_name}\n\nعزيزي {name}،\nلقد تم إنشاء حسابك بنجاح في نظام المستشفى.\n\nبيانات التعريف:\nالدور الوظيفي: {role}\nالايميل: {email}\nكلمة المرور المؤقتة: {password}\n\nتنبيه أمني هام:\nيرجى تغيير كلمة المرور بعد تسجيل الدخول لأول مرة فوراً لضمان أمان حسابك الشخصي.\n\nيرجى الرد على هذا البريد الإلكتروني أو التواصل مع {support_contact} للتأكد من استلامك لهذه البيانات.\n\nمع تحيات إدارة تقنية المعلومات،\n{hospital_name}.";

        $default = [
            'hospital_name_ar' => 'مستشفى ريان',
            'hospital_name_en' => 'Ryan Hospital',
            'hospital_email' => 'ryanhazem27@gmail.com',
            'hospital_phone' => '+249 123 456 789',
            'company_email' => 'admin@alshifa-company.com',
            'smtp_host' => '',
            'smtp_port' => '',
            'smtp_user' => '',
            'smtp_pass' => '',
            'sender_name' => 'Ryan Hospital',
            'theme_color' => '#0ea5e9',
            'font_style' => 'Cairo',
            'currency_ar' => 'ج.م',
            'currency_en' => 'EGP',
            'logo_url' => '/hospital_logo.png',
            'display_mode' => 'light',
            'support_email' => 'ryanhazem27@gmail.com',
            'hr_email' => 'hr@alshifa.com',
            'accounts_email' => 'accounts@alshifa.com',
            'whatsapp' => '',
            'facebook' => '',
            'twitter' => '',
            'welcome_email_template' => $defaultTemplate
        ];

        if (!$settings) {
            DB::table('system_settings')->insert($default);
            return response()->json($default);
        }

        // Merge DB data with defaults for any null values
        $settingsArr = (array) $settings;
        foreach ($default as $key => $value) {
            if (!isset($settingsArr[$key]) || is_null($settingsArr[$key]) || $settingsArr[$key] === '') {
                $settingsArr[$key] = $value;
            }
        }

        return response()->json($settingsArr);
    }

    /**
     * Update system settings.
     */
    public function update(Request $request)
    {
        $this->ensureTableExists();
        
        $data = $request->validate([
            'hospital_name_ar' => 'required|string',
            'hospital_name_en' => 'required|string',
            'hospital_email' => 'nullable|email',
            'hospital_phone' => 'nullable|string',
            'company_email' => 'nullable|email',
            'company_password' => 'nullable|string',
            'smtp_host' => 'nullable|string',
            'smtp_port' => 'nullable|string',
            'smtp_user' => 'nullable|string',
            'smtp_pass' => 'nullable|string',
            'smtp_encryption' => 'nullable|string',
            'sender_name' => 'nullable|string',
            'theme_color' => 'nullable|string',
            'font_style' => 'nullable|string',
            'currency_ar' => 'nullable|string',
            'currency_en' => 'nullable|string',
            'display_mode' => 'nullable|string',
            'logo_url' => 'nullable|string',
            'support_email' => 'nullable|email',
            'hr_email' => 'nullable|email',
            'accounts_email' => 'nullable|email',
            'whatsapp' => 'nullable|string',
            'facebook' => 'nullable|string',
            'twitter' => 'nullable|string',
            'welcome_email_template' => 'nullable|string',
        ]);

        // Ensure at least one record exists to update, or insert it.
        // We use ID 1 as the singleton record.
        DB::table('system_settings')->updateOrInsert(['id' => 1], $data);

        return response()->json([
            'success' => true, 
            'message' => 'Settings updated successfully',
            'data' => DB::table('system_settings')->where('id', 1)->first()
        ]);
    }

    /**
     * Upload hospital logo.
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $image = $request->file('logo');
            $name = 'hospital_logo_' . time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/uploads/logos');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $image->move($destinationPath, $name);
            $logoUrl = '/uploads/logos/' . $name;

            // Update database
            $this->ensureTableExists();
            DB::table('system_settings')->updateOrInsert(['id' => 1], ['logo_url' => $logoUrl]);

            return response()->json([
                'success' => true,
                'logo_url' => $logoUrl
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    /**
     * Helper to configure mail dynamically from DB settings.
     */
    public static function configureMail()
    {
        if (!Schema::hasTable('system_settings')) {
            return;
        }

        $settings = DB::table('system_settings')->first();
        if ($settings && !empty($settings->smtp_host)) {
            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.host' => $settings->smtp_host,
                'mail.mailers.smtp.port' => $settings->smtp_port,
                'mail.mailers.smtp.encryption' => $settings->smtp_encryption ?? (($settings->smtp_port == '465') ? 'ssl' : 'tls'),
                'mail.mailers.smtp.username' => $settings->smtp_user,
                'mail.mailers.smtp.password' => $settings->smtp_pass,
                'mail.from.address' => $settings->hospital_email,
                'mail.from.name' => $settings->sender_name,
            ]);
        }
    }

    /**
     * Test SMTP configuration.
     */
    public function testEmail(Request $request)
    {
        $this->ensureTableExists();
        $this->configureMail();

        try {
            \Illuminate\Support\Facades\Mail::raw('This is a test email from Al-Shifa Hospital System.', function($m) use ($request) {
                $m->to($request->email)->subject('Test Email / تجربة البريد');
            });
            return response()->json(['success' => true, 'message' => 'تم إرسال بريد التجربة بنجاح / Test email sent!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function ensureTableExists()
    {
        if (!Schema::hasTable('system_settings')) {
            Schema::create('system_settings', function (Blueprint $table) {
                $table->id();
                $table->string('hospital_name_ar')->nullable();
                $table->string('hospital_name_en')->nullable();
                $table->string('hospital_email')->nullable();
                $table->string('hospital_phone')->nullable();
                $table->string('company_email')->nullable();
                $table->string('company_password')->nullable();
                $table->string('theme_color')->nullable();
                $table->string('font_style')->nullable();
                $table->string('currency_ar')->nullable();
                $table->string('currency_en')->nullable();
                $table->string('logo_url')->nullable();
                $table->text('welcome_email_template')->nullable();
                $table->timestamps();
            });
        }

        // Lazy-add columns
        $cols = ['company_password', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_encryption', 'sender_name', 'display_mode', 'support_email', 'hr_email', 'accounts_email', 'whatsapp', 'facebook', 'twitter', 'welcome_email_template'];
        foreach ($cols as $col) {
            if (!Schema::hasColumn('system_settings', $col)) {
                Schema::table('system_settings', function (Blueprint $table) use ($col) {
                    if ($col === 'welcome_email_template') {
                        $table->text($col)->nullable();
                    } else {
                        $table->string($col)->nullable();
                    }
                });
            }
        }
    }
}
