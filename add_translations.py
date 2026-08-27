import re

with open('src/i18n/translations.ts', 'r') as f:
    content = f.read()

# Add to English
content = content.replace(
    '"en": {\n    "currency": "$",',
    '"en": {\n    "currency": "$",\n    "support": {\n      "helpMessage": "How can I help you?"\n    },'
)

# Add to Bengali
content = content.replace(
    '"bn": {\n    "currency": "৳",',
    '"bn": {\n    "currency": "৳",\n    "support": {\n      "helpMessage": "আপনাকে কীভাবে সাহায্য করতে পারি?"\n    },'
)

# Add to Arabic
content = content.replace(
    '"ar": {\n    "currency": "ر.س",',
    '"ar": {\n    "currency": "ر.س",\n    "support": {\n      "helpMessage": "كيف يمكنني مساعدتك؟"\n    },'
)

# Add to Hindi
content = content.replace(
    '"hi": {\n    "currency": "₹",',
    '"hi": {\n    "currency": "₹",\n    "support": {\n      "helpMessage": "मैं आपकी कैसे मदद कर सकता हूँ?"\n    },'
)

with open('src/i18n/translations.ts', 'w') as f:
    f.write(content)

