import re

with open('src/components/SupportModal.tsx', 'r') as f:
    content = f.read()

# Add useLanguage import
if 'import { useLanguage }' not in content:
    content = content.replace('import { X, Phone, Mail, Image as ImageIcon, Send, Facebook, MessageCircle, Headset } from "lucide-react";',
                              'import { X, Phone, Mail, Image as ImageIcon, Send, Facebook, MessageCircle, Headset } from "lucide-react";\nimport { useLanguage } from "../contexts/LanguageContext";')

# Add t to component
if 'const { t } = useLanguage();' not in content:
    content = content.replace('const [screenshot, setScreenshot] = useState<File | null>(null);',
                              'const [screenshot, setScreenshot] = useState<File | null>(null);\n  const { t } = useLanguage();')

# Handle WhatsApp text
content = content.replace('let text = `*Support Request: ${title || "No Title"}*\\n\\n${description}`;',
                          'let text = `*Support Request: ${title || t("support.noTitle")}*\\n\\n${description}`;')

content = content.replace('text += `\\n\\n_(User has attached a screenshot. Please share the image here in the chat)_`;',
                          'text += t("support.attachedText");')

# Handle rendering text
content = content.replace('Customer Support              </h3>', '{t("support.title")}              </h3>')
content = content.replace('WhatsApp Support                </p>', '{t("support.whatsapp")}                </p>')
content = content.replace('placeholder="Issue Title"', 'placeholder={t("support.issueTitle")}')
content = content.replace('placeholder="Describe your issue..."', 'placeholder={t("support.describeIssue")}')
content = content.replace('>{screenshot ? screenshot.name : "Attach Image"}<', '>{screenshot ? screenshot.name : t("support.attachImage")}<')
content = content.replace('Send to WhatsApp                </button>', '{t("support.sendToWhatsapp")}                </button>')

# The compact ones
content = content.replace('text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Call</span>', 'text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{t("support.call")}</span>')
content = content.replace('text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Email</span>', 'text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{t("support.email")}</span>')
content = content.replace('text-[#1877F2] dark:text-[#5c9dff]">Contact Developer</span>', 'text-[#1877F2] dark:text-[#5c9dff]">{t("support.contactDeveloper")}</span>')

with open('src/components/SupportModal.tsx', 'w') as f:
    f.write(content)

