import re

with open('src/i18n/translations.ts', 'r') as f:
    content = f.read()

# Replace English support block
en_old = '"support": {\n      "helpMessage": "How can I help you?"\n    }'
en_new = '''"support": {
      "helpMessage": "How can I help you?",
      "title": "Customer Support",
      "whatsapp": "WhatsApp Support",
      "issueTitle": "Issue Title",
      "describeIssue": "Describe your issue...",
      "attachImage": "Attach Image",
      "sendToWhatsapp": "Send to WhatsApp",
      "call": "Call",
      "email": "Email",
      "contactDeveloper": "Contact Developer",
      "noTitle": "No Title",
      "attachedText": "_(User has attached a screenshot. Please share the image here in the chat)_"
    }'''

bn_old = '"support": {\n      "helpMessage": "আপনাকে কীভাবে সাহায্য করতে পারি?"\n    }'
bn_new = '''"support": {
      "helpMessage": "আপনাকে কীভাবে সাহায্য করতে পারি?",
      "title": "কাস্টমার সাপোর্ট",
      "whatsapp": "হোয়াটসঅ্যাপ সাপোর্ট",
      "issueTitle": "সমস্যার শিরোনাম",
      "describeIssue": "আপনার সমস্যার বিবরণ দিন...",
      "attachImage": "ছবি যুক্ত করুন",
      "sendToWhatsapp": "হোয়াটসঅ্যাপে পাঠান",
      "call": "কল করুন",
      "email": "ইমেইল",
      "contactDeveloper": "ডেভেলপারের সাথে যোগাযোগ করুন",
      "noTitle": "শিরোনাম নেই",
      "attachedText": "_(ব্যবহারকারী একটি ছবি যুক্ত করেছেন। অনুগ্রহ করে চ্যাটে ছবিটি শেয়ার করুন)_"
    }'''

ar_old = '"support": {\n      "helpMessage": "كيف يمكنني مساعدتك؟"\n    }'
ar_new = '''"support": {
      "helpMessage": "كيف يمكنني مساعدتك؟",
      "title": "دعم العملاء",
      "whatsapp": "دعم واتساب",
      "issueTitle": "عنوان المشكلة",
      "describeIssue": "صف مشكلتك...",
      "attachImage": "إرفاق صورة",
      "sendToWhatsapp": "إرسال إلى واتساب",
      "call": "اتصال",
      "email": "بريد إلكتروني",
      "contactDeveloper": "اتصل بالمطور",
      "noTitle": "بلا عنوان",
      "attachedText": "_(أرفق المستخدم لقطة شاشة. يرجى مشاركة الصورة هنا في الدردشة)_"
    }'''

hi_old = '"support": {\n      "helpMessage": "मैं आपकी कैसे मदद कर सकता हूँ?"\n    }'
hi_new = '''"support": {
      "helpMessage": "मैं आपकी कैसे मदद कर सकता हूँ?",
      "title": "ग्राहक सहायता",
      "whatsapp": "व्हाट्सएप सपोर्ट",
      "issueTitle": "समस्या का शीर्षक",
      "describeIssue": "अपनी समस्या का वर्णन करें...",
      "attachImage": "छवि संलग्न करें",
      "sendToWhatsapp": "व्हाट्सएप पर भेजें",
      "call": "कॉल करें",
      "email": "ईमेल",
      "contactDeveloper": "डेवलपर से संपर्क करें",
      "noTitle": "कोई शीर्षक नहीं",
      "attachedText": "_(उपयोगकर्ता ने एक स्क्रीनशॉट संलग्न किया है। कृपया यहां चैट में छवि साझा करें)_"
    }'''

content = content.replace(en_old, en_new)
content = content.replace(bn_old, bn_new)
content = content.replace(ar_old, ar_new)
content = content.replace(hi_old, hi_new)

with open('src/i18n/translations.ts', 'w') as f:
    f.write(content)

