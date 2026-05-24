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
            'about.lead': 'AllerCheck is a smart system powered by machine learning for food safety. It helps you verify if products are safe for you based on your specific allergies, using a real and verified database.',
            'about.how': 'How it Works',
            'about.li1': 'Profile: Simply select your allergens. Your preferences are stored securely on your device.',
            'about.li2': 'Check: Search for any product or paste the list of ingredients.',
            'about.li3': 'Analysis: Our system quickly analyzes the product using advanced technology to check against your allergen list.',
            'about.li4': 'Result: You get an instant and clear answer: whether the product is safe or if you should avoid it.',
            'about.model': 'Advanced Analysis Technology',
            'about.modelIntro': 'We use a smart, hybrid approach to ensure your safety:',
            'about.ds1': 'Verified Database: We hold a large library of over 4,500 real food products.',
            'about.ds2': 'Smart Analysis: Our machine learning model is trained on hundreds of items to recognize ingredients accurately.',
            'about.ds3': 'Continuous Accuracy: The system uses smart algorithms to ensure high precision in every check.',
            'about.modelTech': 'The system is designed to be intelligent and self-improving, ensuring that you receive reliable and safe information every time you use it.',
            'about.features': 'Why AllerCheck?',
            'about.f1': 'Real Intelligence — Uses genuine machine learning, not simulations, for accurate results.',
            'about.f2': 'Fast Performance — Combines a massive product database with smart analysis for instant results.',
            'about.f3': 'Multi-Language Support — Accurately understands and processes product names in both Arabic and English.',
            'about.f4': 'Detailed Ingredient Scanning — Easily detects hidden allergens even in complex ingredient lists.',
            'about.f5': 'Private & Secure — Your personal profile and allergy data are kept strictly on your own device.',
            'about.f6': 'History & Tracking — Keeps a record of your past checks for your future reference.',
            'about.f7': 'Useful Statistics — Provides insights into your allergen triggers and consumption patterns.',
            'about.f8': 'Save Favorites — Easily keep track of your safe and favorite products.',
            'about.f9': 'Full Data Integrity — All analytics and metrics are strictly aligned with real database records, ensuring zero simulated data.',
            'about.privacy': 'Data & Privacy',
            'about.privacyText': 'We care about your privacy. Your personal information and allergen list are saved only on your device, and no personal data is stored on our servers.',
            'about.setup': 'Built with Care',
            'about.s1': 'Safety First: Designed to provide quick and reliable allergy information.',
            'about.s2': 'User-Centric: Simple interface tailored to your daily needs.',
            'about.s3': 'Constantly Improving: Our algorithms are regularly updated to stay accurate.',
            'about.s4': 'Always Available: Reliable performance for your peace of mind.',
            'about.s5': 'Stay Safe: AllerCheck is your personal food safety companion.',
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
            'result.ingredientVerdict': 'ML model classification: {status}',
            'result.addFavorite': 'Add to favorites',
            'result.warnIcon': 'WARNING',
            'result.warnTitle': 'WARNING',
            'result.warnOne': 'Product «{product}» contains traces of «{a}»',
            'result.warnMany': 'Product «{product}» contains traces of {n} allergens',
            'result.foundTitle': 'Found allergens:',
            'result.avoid': 'Please avoid consuming this product',
            'result.unknownIcon': '?',
            'result.unknownTitle': 'NOT FOUND',
            'result.unknownMsg': 'We could not find or recognize «{product}» in our database or analysis.',
            'result.unknownNote': 'Try another product name or paste the ingredients list.',
            'result.errorTitle': 'Connection error',
            'api.analysisFailed': 'Analysis failed',
            'api.noServer': 'Cannot connect to the server.',
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
            'about.lead': 'AllerCheck هو نظام ذكي يعتمد على تقنية تعلم الآلة لضمان سلامة طعامك. نساعدك في التحقق مما إذا كانت المنتجات آمنة لك بناءً على حساسيتك الغذائية، باستخدام قاعدة بيانات موثوقة ومفحوصة.',
            'about.how': 'كيف يعمل النظام؟',
            'about.li1': 'الملف الشخصي: حدد مسببات الحساسية لديك، وسنقوم بحفظ تفضيلاتك بأمان على جهازك.',
            'about.li2': 'الفحص: يمكنك البحث عن اسم أي منتج أو لصق قائمة المكونات.',
            'about.li3': 'التحليل: يقوم نظامنا بتحليل المنتج بذكاء لمطابقة مكوناته مع قائمة حساسيتك.',
            'about.li4': 'النتيجة: تحصل فوراً على إجابة واضحة: هل المنتج آمن لك أم يجب تجنبه؟',
            'about.model': 'تقنية تحليل متطورة',
            'about.modelIntro': 'نستخدم نهجاً هجيناً وذكياً لضمان سلامتك:',
            'about.ds1': 'قاعدة بيانات موثوقة: تحتوي على أكثر من 4,500 منتج غذائي حقيقي.',
            'about.ds2': 'تحليل ذكي: نموذج تعلم الآلة الخاص بنا مدرب على مئات الأصناف للتعرف على المكونات بدقة.',
            'about.ds3': 'دقة مستمرة: يستخدم النظام خوارزميات ذكية لضمان أعلى مستويات الدقة في كل فحص.',
            'about.modelTech': 'النظام مصمم ليكون ذكياً ويطور نفسه باستمرار، ليضمن لك الحصول على معلومات موثوقة وآمنة في كل مرة تستخدم فيها التطبيق.',
            'about.features': 'لماذا AllerCheck؟',
            'about.f1': 'ذكاء حقيقي — نستخدم تقنيات تعلم الآلة المتقدمة لنتائج دقيقة وموثوقة.',
            'about.f2': 'أداء سريع — يجمع بين ضخامة قاعدة البيانات والتحليل الذكي ليعطيك النتيجة في لحظات.',
            'about.f3': 'دعم اللغات — يفهم المنتج باللغتين العربية والإنجليزية بدقة عالية.',
            'about.f4': 'كشف المكونات المخفية — يساعدك في اكتشاف المكونات التي قد تسبب الحساسية حتى في القوائم المعقدة.',
            'about.f5': 'خصوصية وأمان — معلوماتك الشخصية وقائمة حساسيتك تظل محفوظة فقط على جهازك الخاص.',
            'about.f6': 'سجل الفحص — نحتفظ بسجل لعمليات بحثك لتعود إليها وقتما تشاء.',
            'about.f7': 'إحصائيات مفيدة — توفر لك نظرة عامة على نشاطك وتنبيهاتك.',
            'about.f8': 'حفظ المفضلة — يمكنك حفظ منتجاتك الآمنة للوصول إليها بسرعة لاحقاً.',
            'about.f9': 'بيانات موثوقة — كل المعلومات تعتمد على بيانات حقيقية لتضمن راحة بالك.',
            'about.privacy': 'خصوصيتك تهمنا',
            'about.privacyText': 'نحن نهتم بخصوصيتك؛ بياناتك الشخصية وقائمة الحساسية تُحفظ محلياً على جهازك فقط، ولا يتم تخزين أي بيانات شخصية على خوادمنا.',
            'about.setup': 'صُمم لأجل سلامتك',
            'about.s1': 'الأمان أولاً: هدفنا هو تزويدك بمعلومات سريعة وموثوقة.',
            'about.s2': 'سهولة الاستخدام: واجهة بسيطة ومريحة لتناسب احتياجاتك اليومية.',
            'about.s3': 'تطور مستمر: خوارزمياتنا تُحدث باستمرار لضمان أدق النتائج.',
            'about.s4': 'متاح دائماً: أداء سريع ومستقر لراحتك.',
            'about.s5': 'حافظ على سلامتك: AllerCheck هو رفيقك الشخصي للأمان الغذائي.'
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