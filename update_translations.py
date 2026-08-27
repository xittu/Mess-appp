import re

with open('src/i18n/translations.ts', 'r') as f:
    content = f.read()

# Add to English
content = content.replace(
    '"en": {\n    "currency": "$",',
    '"en": {\n    "currency": "$",\n    "loading": {\n      "network": "Connecting to Mess Network..."\n    },'
)

# Add to Bengali
content = content.replace(
    '"bn": {\n    "currency": "৳",',
    '"bn": {\n    "currency": "৳",\n    "loading": {\n      "network": "মেস নেটওয়ার্ক সংযোগ হচ্ছে..."\n    },'
)

# Add to Arabic
content = content.replace(
    '"ar": {\n    "currency": "ر.س",',
    '"ar": {\n    "currency": "ر.س",\n    "loading": {\n      "network": "جارٍ الاتصال بشبكة السكن..."\n    },'
)

# Add to Hindi
content = content.replace(
    '"hi": {\n    "currency": "₹",',
    '"hi": {\n    "currency": "₹",\n    "loading": {\n      "network": "मेस नेटवर्क से कनेक्ट हो रहा है..."\n    },'
)

with open('src/i18n/translations.ts', 'w') as f:
    f.write(content)

