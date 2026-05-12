(function () {
    'use strict';

    var STORAGE_KEY = 'allerCheck_lang';

    var STRINGS = {
        en: {
            'meta.home': 'Home - AllerCheck',
            'meta.check': 'Check Product - AllerCheck',
            'meta.profile': 'Profile - AllerCheck',
            'meta.history': 'Scan History - AllerCheck',
            'meta.dashboard': 'Dashboard - AllerCheck',
            'meta.about': 'About - AllerCheck',
            'nav.home': 'Home',
            'nav.check': 'Check Product',
            'nav.profile': 'Profile',
            'nav.history': 'History',
            'nav.dashboard': 'Dashboard',
            'nav.about': 'About',
            'lang.switchEn': 'English',
            'lang.switchAr': 'Arabic',
            'index.hero': 'Check Your Food Safely',
            'index.subtitle': 'AllerCheck helps you verify if products are safe for your allergies',
            'index.cta': 'Check a Product',
            'index.f1t': 'Quick Scan',
            'index.f1d': 'Enter product name and get instant allergy check',
            'index.f2t': 'Your Profile',
            'index.f2d': 'Save your allergens and access from any device',
            'index.f3t': 'Safe or Warning',
            'index.f3d': 'Clear results: safe to consume or avoid',
            'index.f4t': 'Scan History',
            'index.f4d': 'View and export your past product checks',
            'index.f5t': 'Dashboard',
            'index.f5d': 'Statistics and allergen frequency analysis',
            'index.f6t': 'Favorites',
            'index.f6d': 'Save safe products for quick reference',
            'check.panelSafe': 'SAFE TO CONSUME',
            'check.placeholderProduct': 'Enter product name…',
            'check.btnCheck': 'Check',
            'check.optionalLabel': 'Optional: paste ingredients list for better accuracy',
            'check.ingredientPlaceholder': 'e.g. wheat flour, milk, eggs, butter…',
            'check.panelAllergies': 'YOUR ALLERGIES',
            'check.yourName': 'Your name',
            'check.namePlaceholder': 'Enter your name',
            'profile.title': 'YOUR PROFILE',
            'profile.desc': 'Manage your personal info and allergens. Data is saved locally in your browser.',
            'profile.subAllergens': 'Select your allergens',
            'profile.goCheck': 'Go to Check',
            'history.title': 'SCAN HISTORY',
            'history.desc': 'Your recent product checks. Data is stored locally in your browser.',
            'history.export': 'Export Report',
            'history.clear': 'Clear History',
            'history.empty': 'No scan history yet. Check a product to get started.',
            'dashboard.title': 'STATISTICS DASHBOARD',
            'dashboard.desc': 'Overview of your allergen check activity and system status.',
            'dashboard.freq': 'Allergen frequency (in warnings)',
            'dashboard.favs': 'Saved favorites',
            'dashboard.emptyFavs': 'No favorites yet. Add safe products from check results.',
            'dashboard.totalScans': 'Total scans',
            'dashboard.safeProducts': 'Safe products',
            'dashboard.warnings': 'Warnings',
            'dashboard.favorites': 'Favorites',
            'dashboard.notRecognized': 'Not recognized',
            'dashboard.productsDb': 'Products in DB',
            'dashboard.modelLoaded': 'AI model loaded',
            'dashboard.yes': 'Yes',
            'dashboard.no': 'No',
            'dashboard.noAllergenData': 'No allergen data yet.',
            'dashboard.times': 'time(s)',
            'dashboard.remove': 'Remove',
            'about.title': 'About AllerCheck',
            'about.lead': 'AllerCheck is a real AI-powered food allergen analysis system. It helps people with food allergies verify if products are safe to consume—using a trained machine learning model and a comprehensive dataset, with no simulation or mock data.',
            'about.how': 'How it works',
            'about.li1': 'Profile: add your allergens on the Profile page. Data is stored locally in your browser.',
            'about.li2': 'Check: enter a product name (and optionally paste the ingredients list) on the Check page.',
            'about.li3': 'Analysis: the system uses the database and AI model to detect allergens in the product.',
            'about.li4': 'Result: you get a clear result—safe to consume or warning with the detected allergens.',
            'about.model': 'AI model',
            'about.modelIntro': 'The allergen detection model is built from scratch and trained on a real dataset in the dataset/ folder:',
            'about.ds3': 'Allergen_Status_of_Food_Products.csv — product allergen status data',
            'about.modelTech': 'The model uses TF-IDF (1–2 grams) and a Random Forest binary classifier on Allergen_Status_of_Food_Products.csv, plus the same hybrid rules as the notebook (major-allergen keywords, safe-base bias correction, 40% threshold). Train with: python train_model.py.',
            'about.features': 'Features',
            'about.f1': 'Real AI analysis — trained model, no simulation',
            'about.f2': 'Database lookup — fast matching from dataset',
            'about.f3': 'Ingredient text input — paste full ingredients for better accuracy',
            'about.f4': 'Product suggestions — auto-suggestions from real database',
            'about.f5': 'Profile persistence — your allergens saved in browser',
            'about.f6': 'Scan history — view and export past checks',
            'about.f7': 'Statistics dashboard — allergen frequency and usage stats',
            'about.f8': 'Favorites — save safe products for quick reference',
            'about.f9': 'Export report — download JSON report of profile, history, favorites',
            'about.privacy': 'Data & privacy',
            'about.privacyText': 'Your profile data (name and selected allergens) is stored only in your browser (localStorage). Product analysis is performed on the server using the dataset and AI model. No personal data is sent or stored on the server.',
            'about.setup': 'Setup',
            'about.s1': 'Install dependencies: pip install -r requirements.txt',
            'about.s2': 'Train the model: python train_model.py',
            'about.s3': 'Initialize database: python init_db.py',
            'about.s4': 'Run server: python app.py',
            'about.s5': 'Open http://localhost:5000',
            'allergen.Peanuts': 'Peanuts',
            'allergen.Milk': 'Milk',
            'allergen.Eggs': 'Eggs',
            'allergen.Fish': 'Fish',
            'allergen.Nuts': 'Nuts',
            'allergen.Wheat': 'Wheat',
            'allergen.Soy': 'Soy',
            'allergen.Sesame': 'Sesame',
            'toast.enterName': 'Please enter your name',
            'toast.enterProduct': 'Please enter product name',
            'toast.selectAllergen': 'Please select at least one allergen',
            'toast.enterNameFirst': 'Please enter your name first',
            'toast.favoriteAdded': 'Added to favorites',
            'loading.analyzing': 'Analyzing ingredients…',
            'result.safeIcon': 'SAFE',
            'result.safeTitle': 'SAFE TO CONSUME',
            'result.safeMsg': 'Ingredients checked—no known traces of your allergens found in «{product}»',
            'result.safeNote': 'You can safely consume this product',
            'result.ingredientVerdict': 'Ingredient model: {status}',
            'result.addFavorite': 'Add to favorites',
            'result.warnIcon': 'WARNING',
            'result.warnTitle': 'WARNING',
            'result.warnOne': 'Product «{product}» contains traces of «{a}»',
            'result.warnMany': 'Product «{product}» contains traces of {n} allergens',
            'result.foundTitle': 'Found allergens:',
            'result.avoid': 'Please avoid consuming this product',
            'result.unknownIcon': '?',
            'result.unknownTitle': 'NOT FOUND',
            'result.unknownMsg': 'We could not find or recognize «{product}» in our database or analysis. No safety verdict is shown.',
            'result.unknownNote': 'Try another product name, paste the ingredients list, or check the label manually.',
            'result.errorTitle': 'Connection error',
            'api.analysisFailed': 'Analysis failed',
            'api.noServer': 'Cannot connect to the server. Please ensure the server is running (python app.py).',
            'api.productRequired': 'Product name required',
            'api.allergensRequired': 'Allergens required',
            'api.requestFailed': 'Request failed',
            'history.statusSafe': 'SAFE',
            'history.statusWarn': 'WARNING',
            'history.statusUnknown': 'NOT FOUND',
            'history.confirmClear': 'Clear all scan history?'
        },
        ar: {
            'meta.home': 'الرئيسية - AllerCheck',
            'meta.check': 'فحص المنتج - AllerCheck',
            'meta.profile': 'الملف الشخصي - AllerCheck',
            'meta.history': 'سجل الفحص - AllerCheck',
            'meta.dashboard': 'لوحة الإحصائيات - AllerCheck',
            'meta.about': 'حول التطبيق - AllerCheck',
            'nav.home': 'الرئيسية',
            'nav.check': 'فحص منتج',
            'nav.profile': 'الملف الشخصي',
            'nav.history': 'السجل',
            'nav.dashboard': 'لوحة الإحصائيات',
            'nav.about': 'حول التطبيق',
            'lang.switchEn': 'الإنجليزية',
            'lang.switchAr': 'العربية',
            'index.hero': 'افحص طعامك بأمان',
            'index.subtitle': 'يساعدك AllerCheck على التحقق مما إذا كانت المنتجات آمنة لحساسيتك الغذائية',
            'index.cta': 'فحص منتج',
            'index.f1t': 'فحص سريع',
            'index.f1d': 'أدخل اسم المنتج واحصل على فحص فوري للحساسية',
            'index.f2t': 'ملفك الشخصي',
            'index.f2d': 'احفظ مسببات الحساسية لديك واستخدمها من أي جهاز',
            'index.f3t': 'آمن أو تحذير',
            'index.f3d': 'نتائج واضحة: آمن للاستهلاك أو يُنصح بتجنبه',
            'index.f4t': 'سجل الفحص',
            'index.f4d': 'اعرض وصدّر عمليات الفحص السابقة',
            'index.f5t': 'لوحة الإحصائيات',
            'index.f5d': 'إحصائيات وتحليل تكرار مسببات الحساسية',
            'index.f6t': 'المفضلة',
            'index.f6d': 'احفظ المنتجات الآمنة للرجوع السريع',
            'check.panelSafe': 'آمن للاستهلاك',
            'check.placeholderProduct': 'أدخل اسم المنتج…',
            'check.btnCheck': 'فحص',
            'check.optionalLabel': 'اختياري: الصق قائمة المكونات لدقة أعلى',
            'check.ingredientPlaceholder': 'مثال: دقيق قمح، حليب، بيض، زبدة…',
            'check.panelAllergies': 'حساسيتك',
            'check.yourName': 'اسمك',
            'check.namePlaceholder': 'أدخل اسمك',
            'profile.title': 'ملفك الشخصي',
            'profile.desc': 'أدر معلوماتك ومسببات الحساسية. تُحفظ البيانات محلياً في المتصفح.',
            'profile.subAllergens': 'اختر مسببات الحساسية لديك',
            'profile.goCheck': 'الانتقال إلى الفحص',
            'history.title': 'سجل الفحص',
            'history.desc': 'آخر عمليات فحص المنتجات. تُخزن البيانات محلياً في المتصفح.',
            'history.export': 'تصدير التقرير',
            'history.clear': 'مسح السجل',
            'history.empty': 'لا يوجد سجل فحص بعد. افحص منتجاً للبدء.',
            'dashboard.title': 'لوحة الإحصائيات',
            'dashboard.desc': 'نظرة عامة على نشاط فحص الحساسية وحالة النظام.',
            'dashboard.freq': 'تكرار مسببات الحساسية (في التحذيرات)',
            'dashboard.favs': 'المفضلة المحفوظة',
            'dashboard.emptyFavs': 'لا توجد مفضلة بعد. أضف منتجات آمنة من نتائج الفحص.',
            'dashboard.totalScans': 'إجمالي الفحوصات',
            'dashboard.safeProducts': 'منتجات آمنة',
            'dashboard.warnings': 'تحذيرات',
            'dashboard.favorites': 'المفضلة',
            'dashboard.notRecognized': 'غير معروف',
            'dashboard.productsDb': 'منتجات في القاعدة',
            'dashboard.modelLoaded': 'نموذج الذكاء محمّل',
            'dashboard.yes': 'نعم',
            'dashboard.no': 'لا',
            'dashboard.noAllergenData': 'لا توجد بيانات مسببات حساسية بعد.',
            'dashboard.times': 'مرة/مرات',
            'dashboard.remove': 'إزالة',
            'about.title': 'حول AllerCheck',
            'about.lead': 'AllerCheck نظام حقيقي لتحليل مسببات الحساسية الغذائية بالذكاء الاصطناعي. يساعد ذوو الحساسية الغذائية على التحقق من أمان المنتجات—باستخدام نموذج تعلم آلي مدرّب ومجموعة بيانات شاملة، دون محاكاة أو بيانات وهمية.',
            'about.how': 'كيف يعمل',
            'about.li1': 'الملف الشخصي: أضف مسببات الحساسية في صفحة الملف الشخصي. تُخزن البيانات محلياً في المتصفح.',
            'about.li2': 'الفحص: أدخل اسم المنتج (ويمكنك لصق قائمة المكونات) في صفحة الفحص.',
            'about.li3': 'التحليل: يستخدم النظام القاعدة ونموذج الذكاء للكشف عن مسببات الحساسية في المنتج.',
            'about.li4': 'النتيجة: تحصل على نتيجة واضحة—آمن للاستهلاك أو تحذير مع المسببات المكتشفة.',
            'about.model': 'نموذج الذكاء الاصطناعي',
            'about.modelIntro': 'نُبنى نموذج الكشف عن مسببات الحساسية من الصفر ويُدرَّب على مجموعة بيانات حقيقية في مجلد dataset/:',
            'about.ds3': 'Allergen_Status_of_Food_Products.csv — بيانات حالة الحساسية للمنتجات',
            'about.modelTech': 'يستخدم النموذج TF-IDF (مفردات وثنائيات) وغابة عشوائية (تصنيف ثنائي) على Allergen_Status_of_Food_Products.csv، مع نفس المنطق الهجين في الدفتر (كلمات مسببات رئيسية، تصحيح انحياز، عتبة 40%). التدريب: python train_model.py.',
            'about.features': 'الميزات',
            'about.f1': 'تحليل ذكاء حقيقي — نموذج مدرّب، دون محاكاة',
            'about.f2': 'بحث في القاعدة — مطابقة سريعة من مجموعة البيانات',
            'about.f3': 'إدخال نص المكونات — الصق المكونات كاملة لدقة أعلى',
            'about.f4': 'اقتراحات منتجات — اقتراحات تلقائية من القاعدة الحقيقية',
            'about.f5': 'استمرارية الملف — مسببات الحساسية محفوظة في المتصفح',
            'about.f6': 'سجل الفحص — عرض وتصدير الفحوصات السابقة',
            'about.f7': 'لوحة إحصائيات — تكرار مسببات الحساسية وإحصائيات الاستخدام',
            'about.f8': 'المفضلة — احفظ المنتجات الآمنة للرجوع السريع',
            'about.f9': 'تصدير تقرير — تنزيل تقرير JSON للملف والسجل والمفضلة',
            'about.privacy': 'البيانات والخصوصية',
            'about.privacyText': 'بيانات ملفك (الاسم ومسببات الحساسية المختارة) تُخزن فقط في متصفحك (localStorage). يُنفَّذ تحليل المنتج على الخادم باستخدام مجموعة البيانات ونموذج الذكاء. لا تُرسل أو تُخزن بيانات شخصية على الخادم.',
            'about.setup': 'الإعداد',
            'about.s1': 'تثبيت المتطلبات: pip install -r requirements.txt',
            'about.s2': 'تدريب النموذج: python train_model.py',
            'about.s3': 'تهيئة القاعدة: python init_db.py',
            'about.s4': 'تشغيل الخادم: python app.py',
            'about.s5': 'افتح http://localhost:5000',
            'allergen.Peanuts': 'فول سوداني',
            'allergen.Milk': 'حليب',
            'allergen.Eggs': 'بيض',
            'allergen.Fish': 'سمك',
            'allergen.Nuts': 'مكسرات',
            'allergen.Wheat': 'قمح',
            'allergen.Soy': 'صويا',
            'allergen.Sesame': 'سمسم',
            'toast.enterName': 'يرجى إدخال اسمك',
            'toast.enterProduct': 'يرجى إدخال اسم المنتج',
            'toast.selectAllergen': 'يرجى اختيار مسبب حساسية واحد على الأقل',
            'toast.enterNameFirst': 'يرجى إدخال اسمك أولاً',
            'toast.favoriteAdded': 'أُضيفت إلى المفضلة',
            'loading.analyzing': 'جارٍ تحليل المكونات…',
            'result.safeIcon': 'آمن',
            'result.safeTitle': 'آمن للاستهلاك',
            'result.safeMsg': 'تم فحص المكونات—لم يُعثر على آثار معروفة لمسببات حساسيتك في «{product}»',
            'result.safeNote': 'يمكنك استهلاك هذا المنتج بأمان',
            'result.ingredientVerdict': 'تصنيف المكونات (النموذج): {status}',
            'result.addFavorite': 'إضافة إلى المفضلة',
            'result.warnIcon': 'تحذير',
            'result.warnTitle': 'تحذير',
            'result.warnOne': 'المنتج «{product}» يحتوي على آثار «{a}»',
            'result.warnMany': 'المنتج «{product}» يحتوي على آثار {n} مسببات حساسية',
            'result.foundTitle': 'المسببات الموجودة:',
            'result.avoid': 'يرجى تجنب استهلاك هذا المنتج',
            'result.unknownIcon': '؟',
            'result.unknownTitle': 'غير موجود',
            'result.unknownMsg': 'لم نتمكن من العثور على المنتج «{product}» أو التعرف عليه في القاعدة أو التحليل. لا يُعرض حكم بالأمان أو الخطر.',
            'result.unknownNote': 'جرّب اسماً آخر للمنتج، أو الصق قائمة المكونات، أو راجع التسمية يدوياً.',
            'result.errorTitle': 'خطأ في الاتصال',
            'api.analysisFailed': 'فشل التحليل',
            'api.noServer': 'تعذر الاتصال بالخادم. تأكد من تشغيل الخادم (python app.py).',
            'api.productRequired': 'اسم المنتج مطلوب',
            'api.allergensRequired': 'مسببات الحساسية مطلوبة',
            'api.requestFailed': 'فشل الطلب',
            'history.statusSafe': 'آمن',
            'history.statusWarn': 'تحذير',
            'history.statusUnknown': 'غير موجود',
            'history.confirmClear': 'مسح كل سجل الفحص؟'
        }
    };

    function getLang() {
        var s = localStorage.getItem(STORAGE_KEY);
        if (s === 'ar' || s === 'en') return s;
        if (typeof navigator !== 'undefined' && navigator.language && String(navigator.language).toLowerCase().indexOf('ar') === 0) {
            return 'ar';
        }
        return 'en';
    }

    function setLang(lang) {
        if (lang !== 'ar' && lang !== 'en') return;
        localStorage.setItem(STORAGE_KEY, lang);
        applyDocumentLang(lang);
    }

    function t(key, vars) {
        var lang = getLang();
        var raw = (STRINGS[lang] && STRINGS[lang][key]) || (STRINGS.en && STRINGS.en[key]) || key;
        if (vars && typeof vars === 'object') {
            Object.keys(vars).forEach(function (k) {
                raw = raw.split('{' + k + '}').join(String(vars[k]));
            });
        }
        return raw;
    }

    function allergenLabel(enKey) {
        var k = 'allergen.' + enKey;
        var raw = t(k);
        if (raw === k) return enKey;
        return raw;
    }

    function applyDocumentLang(lang) {
        var html = document.documentElement;
        html.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        if (document.body) document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }

    function applyPageTranslations() {
        var lang = getLang();
        applyDocumentLang(lang);

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (!key) return;
            el.textContent = t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (key) el.setAttribute('placeholder', t(key));
        });

        document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-title');
            if (key) el.setAttribute('title', t(key));
        });

        document.querySelectorAll('[data-i18n-allergen]').forEach(function (el) {
            var ak = el.getAttribute('data-i18n-allergen');
            if (ak) {
                var span = el.tagName === 'SPAN' ? el : el.querySelector('span');
                if (span) span.textContent = allergenLabel(ak);
            }
        });

        var metaTitle = document.querySelector('meta[name="i18n-title-key"]');
        if (metaTitle) {
            var tk = metaTitle.getAttribute('content');
            if (tk) document.title = t(tk);
        }

        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            var l = btn.getAttribute('data-set-lang');
            if (l) {
                btn.classList.toggle('lang-btn-active', l === lang);
                btn.setAttribute('aria-pressed', l === lang ? 'true' : 'false');
            }
        });
    }

    function bindLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var l = btn.getAttribute('data-set-lang');
                if (!l || l === getLang()) return;
                localStorage.setItem(STORAGE_KEY, l);
                window.location.reload();
            });
        });
    }

    function initI18n() {
        applyPageTranslations();
        bindLanguageSwitcher();
    }

    window.AllerCheckI18n = {
        getLang: getLang,
        setLang: setLang,
        t: t,
        allergenLabel: allergenLabel,
        applyPageTranslations: applyPageTranslations,
        initI18n: initI18n,
        STRINGS: STRINGS
    };

    window.getLang = getLang;
    window.t = t;
    window.allergenLabel = allergenLabel;
})();
