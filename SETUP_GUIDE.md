# ربط نموذج التواصل بـ Google Sheets — دليل الإعداد
# Connect Contact Form to Google Sheets — Setup Guide

---

## الخطوات / Steps

### 1. أنشئ جدول Google Sheet جديد / Create a new Google Sheet

افتح [Google Sheets](https://sheets.google.com) وأنشئ جدولاً جديداً باسم **"Al Matrood — Consultations"**

في **الصف الأول (Row 1)**، أضف هذه العناوين بالترتيب:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Timestamp | First Name | Last Name | Email | Phone | Contact Method | Practice Area | Meeting Format | Message | Language |

---

### 2. افتح Apps Script / Open Apps Script

من القائمة العلوية: **Extensions → Apps Script**

احذف كل الكود الموجود والصق الكود التالي:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.contactMethod,
      data.practiceArea,
      data.meetingFormat,
      data.message,
      data.language
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### 3. انشر كتطبيق ويب / Deploy as Web App

1. اضغط **Deploy → New deployment**
2. اضغط على أيقونة الترس ⚙️ واختر **Web app**
3. الإعدادات:
   - **Description**: `Contact Form Handler`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. اضغط **Deploy**
5. وافق على الصلاحيات (Authorize access)
6. **انسخ الرابط (URL)** — سيبدو مثل:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

### 4. أضف الرابط في contact.html / Add the URL in contact.html

في ملف `contact.html`، ابحث عن هذا السطر:

```javascript
const GOOGLE_SCRIPT_URL='YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

واستبدله بالرابط الذي نسخته:

```javascript
const GOOGLE_SCRIPT_URL='https://script.google.com/macros/s/AKfycbx.../exec';
```

---

### 5. ارفع الملف وجرّب / Push to GitHub & Test

ارفع ملف `contact.html` المحدث إلى GitHub Pages وجرّب إرسال نموذج تجريبي. يجب أن تظهر البيانات في Google Sheet خلال ثوانٍ.

---

## ملاحظات / Notes

- ✅ **مجاني بالكامل** — لا حدود عملية لعدد الإرسالات
- ✅ **آمن** — البيانات تُحفظ مباشرة في حسابك على Google
- 📧 **إشعارات اختيارية** — يمكنك إضافة إشعار بريدي تلقائي (انظر أدناه)

### إضافة إشعار بريد إلكتروني (اختياري) / Add Email Notification (Optional)

أضف هذا السطر داخل دالة `doPost` بعد `sheet.appendRow(...)`:

```javascript
MailApp.sendEmail({
  to: 'your@email.com',
  subject: '📩 استشارة جديدة — ' + data.firstName + ' ' + data.lastName,
  htmlBody:
    '<h2>طلب استشارة جديد</h2>' +
    '<p><strong>الاسم:</strong> ' + data.firstName + ' ' + data.lastName + '</p>' +
    '<p><strong>الجوال:</strong> ' + data.phone + '</p>' +
    '<p><strong>البريد:</strong> ' + data.email + '</p>' +
    '<p><strong>مجال الخدمة:</strong> ' + data.practiceArea + '</p>' +
    '<p><strong>الرسالة:</strong> ' + data.message + '</p>'
});
```

⚠️ بعد أي تعديل على الكود، يجب عمل **Deploy → New deployment** مرة أخرى.
