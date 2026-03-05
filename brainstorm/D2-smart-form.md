# D2 — Smart Consultation Form
## Deep Dive & Implementation Blueprint

> **Current state:** Single-page static form (7 fields, no logic, no steps)
> **Target state:** Multi-step wizard with conditional branching, urgency scoring, dynamic WhatsApp summary, and bilingual support

---

## 1. The Problem With The Current Form

The existing form collects the same 7 fields from everyone:
- A CEO needing corporate restructuring gets the same form as a parent in a custody battle
- No way to assess urgency — a criminal defense emergency looks identical to a general inquiry
- The lawyer receives vague submissions with no context — wastes 20+ minutes per lead just gathering basics
- No feedback to the user about what happens next or how urgent their case is

**Goal:** The form should do the lawyer's intake job — gather the right information per case type, qualify the lead, and deliver a pre-structured summary to the firm via WhatsApp + email.

---

## 2. Architecture — 4-Step Wizard

Replace the single form with a **4-step wizard**. Each step slides in/out with a CSS transition. Progress bar at top.

```
┌─────────────────────────────────────────────────────────┐
│  ████████████░░░░░░░░░░░░░░░░░░░░  Step 1 of 4          │
│                                                          │
│  Step 1: Who are you?          (Client Type)             │
│  Step 2: What do you need?     (Practice Area + Sub)     │
│  Step 3: Tell us more          (Dynamic fields per area) │
│  Step 4: How to reach you?     (Contact + Urgency)       │
│                                 ↓                        │
│              [ Auto-generated WhatsApp summary ]         │
└─────────────────────────────────────────────────────────┘
```

**No backend required.** 100% HTML/CSS/JS.
Data goes to:
- `mailto:` with pre-filled subject/body (fallback)
- `wa.me/9660556623555?text=` with a structured Arabic summary (primary)

---

## 3. Step-by-Step Flow Design

### STEP 1 — Client Type (من أنت؟)

Two big card options. Click to select and auto-advance to step 2.

```
┌─────────────────────────────────────────────────────────┐
│                    من أنت؟ / Who Are You?                │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐       │
│  │        👤           │  │        🏢            │       │
│  │   فرد / شخصي        │  │   شركة / مؤسسة      │       │
│  │  Individual / Personal│ │  Business / Company  │      │
│  └─────────────────────┘  └─────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

**Effect of selection:**
- `individual` → Step 3 shows personal case fields (NID, family info, etc.)
- `business` → Step 3 shows company fields (CR number, company name, sector)

---

### STEP 2 — Practice Area + Sub-issue (ما طبيعة قضيتك؟)

After client type is chosen, show the 4 practice areas as cards + a sub-issue dropdown that appears AFTER area is selected.

```
┌─────────────────────────────────────────────────────────┐
│              ما طبيعة قضيتك؟ / What's Your Matter?       │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ ⚖️       │  │ 👨‍👩‍👧      │  │ 🛡️       │  │ 💰       ││
│  │ أعمال   │  │ أسرة    │  │ جنائي   │  │ تعويضات ││
│  │ Corporate│  │ Family  │  │Criminal  │  │ Injury   ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│                                                          │
│  [ ─────────── حدد نوع المسألة بدقة ─────────── ▼ ]    │
│  (dropdown appears after area card is clicked)           │
└─────────────────────────────────────────────────────────┘
```

**Sub-issue dropdowns per area:**

| Area | Arabic sub-issues | English |
|------|-------------------|---------|
| **Corporate** | تأسيس شركة، عقود تجارية، نزاعات شركاء، إفلاس وإعادة هيكلة، ملكية فكرية، عمالة وموارد بشرية | Company formation, Commercial contracts, Partner disputes, Bankruptcy & restructuring, IP, Employment |
| **Family** | طلاق وخلع، حضانة الأطفال، النفقة والمؤخر، الميراث والوصايا، عقد زواج، إثبات نسب | Divorce, Child custody, Alimony, Inheritance & wills, Marriage contract, Paternity |
| **Criminal** | دفاع جنائي، قضايا مالية واحتيال، قضايا مخدرات، جرائم إلكترونية، قضايا عمالية، استئناف حكم | Criminal defense, Financial fraud, Drug cases, Cybercrime, Labor crimes, Appeal |
| **Personal Injury** | حوادث مرورية، إهمال طبي، إصابات عمل، خسائر مالية، تعويض من جهة حكومية | Traffic accidents, Medical negligence, Workplace injury, Financial loss, Gov. compensation |

---

### STEP 3 — Dynamic Fields (التفاصيل)

This is the core of the smart form. Fields shown depend on:
`clientType` + `practiceArea` + `subIssue`

#### 3A — Individual + Family Law

```
Fields shown:
  - نوع الإجراء المطلوب: [ استشارة فقط | تمثيل قانوني كامل ]
  - هل يوجد حكم سابق؟ (Yes/No toggle)
    → Yes: رقم القضية / المحكمة
  - المنطقة الجغرافية للقضية: [ الرياض | القصيم | أخرى ]
  - عدد الأطفال المعنيين (إن وجد): [number input]
  - هل الطرف الآخر ممثَّل قانونياً؟ (Yes / No / Unknown)
  - تفاصيل إضافية: [textarea - 300 chars max]
```

#### 3B — Individual + Criminal Defense

```
Fields shown:
  - هل أنت المتهم أم ذوو المتهم؟: [ أنا المتهم | أسعى للمساعدة لشخص آخر ]
  - هل صدر قرار بالاعتقال أو الاحتجاز؟: [ نعم، محتجز حالياً | نعم، قرار اعتقال | لا ]
    → "نعم، محتجز حالياً" → triggers URGENT flag (🔴)
  - المحكمة / الجهة المختصة المتوقعة: [text]
  - هل هناك جلسة قادمة؟ (Yes/No)
    → Yes: تاريخ الجلسة [date picker]
  - تفاصيل مختصرة: [textarea]
```

#### 3C — Business / Corporate

```
Fields shown:
  - اسم الشركة: [text]
  - السجل التجاري (CR): [text - optional]
  - القطاع: [ تقنية | عقارات | تجزئة | مقاولات | رعاية صحية | أخرى ]
  - عدد الموظفين: [ 1-10 | 11-50 | 51-200 | +200 ]
  - هل المسألة عاجلة تجارياً؟: [ نعم، توقف نشاط | نعم، عقد بموعد نهائي | لا، استشارة عامة ]
  - هل هناك خصم / طرف مقابل؟: (Yes/No)
    → Yes: هل ممثَّل قانونياً؟ (Yes/No/Unknown)
  - تفاصيل: [textarea]
```

#### 3D — Personal Injury

```
Fields shown:
  - تاريخ الحادث: [date picker]
  - هل تلقيت علاجاً طبياً؟: (Yes/No)
    → Yes: هل التقرير الطبي متاح؟ (Yes/No)
  - هل أبلغت الجهات المختصة (شرطة / هيئة)؟: (Yes/No)
  - هل رفعت شكوى مسبقاً؟: (Yes/No)
  - مقدار الخسارة المقدر (اختياري): [number - SAR]
  - تفاصيل: [textarea]
```

---

### STEP 4 — Contact + Urgency + Confirmation

```
┌─────────────────────────────────────────────────────────┐
│                  كيف نتواصل معك؟                        │
│                                                          │
│  الاسم الكامل: [________________]                        │
│  رقم الجوال:  [________________]  ← required            │
│  البريد الإلكتروني: [___________]  ← optional           │
│                                                          │
│  ──────────── مستوى الاستعجال ────────────              │
│                                                          │
│  🟢 عادي — رد خلال ٢٤ ساعة                              │
│  🟡 مهم — رد خلال ٤ ساعات                               │
│  🔴 عاجل جداً — أحتاج تواصلاً فورياً                    │
│                                                          │
│  طريقة التواصل: [ واتساب ▼ | هاتف | بريد | حضوري ]     │
│  الفرع المفضل: [ الرياض ▼ | القصيم ]                    │
│                                                          │
│  ✓ أوافق على سياسة الخصوصية والسرية المهنية             │
│                                                          │
│  [ ← السابق ]          [ إرسال الطلب ← ]               │
└─────────────────────────────────────────────────────────┘
```

**Auto-urgency override:** If step 3 detected `محتجز حالياً` or `جلسة خلال 48 ساعة`, pre-select 🔴 urgency and show a banner:
```
⚡ لاحظنا أن قضيتك عاجلة — تم تحديد الأولوية القصوى تلقائياً
```

---

## 4. Urgency Scoring Engine

A simple point system calculated in JS before submission.

| Trigger | Points |
|---------|--------|
| User selects 🔴 urgency | +10 |
| Criminal case + `محتجز حالياً` | +10 |
| Criminal case + `جلسة قادمة` within 7 days | +8 |
| Corporate case + `توقف نشاط` | +7 |
| Corporate case + `عقد بموعد نهائي` within 14 days | +6 |
| Family case + `طلاق` + prior ruling | +4 |
| User selects 🟡 urgency | +5 |
| User selects 🟢 urgency | +0 |

**Score → Response SLA shown to user:**
- 0–4 → 🟢 "سيتواصل معك محامينا خلال ٢٤ ساعة"
- 5–8 → 🟡 "سيتواصل معك محامينا خلال ٤ ساعات"
- 9+  → 🔴 "قضيتك أولوية قصوى — سنتواصل معك خلال ساعة واحدة"

The SLA message is shown in the success screen AND injected into the WhatsApp message.

---

## 5. WhatsApp Summary Generator

On submit, build a structured Arabic string and open `wa.me/9660556623555?text=`.

**Template:**

```
🔴 طلب استشارة — أولوية قصوى      ← or 🟡 / 🟢 based on score

━━━━━━━━━━━━━━━━━━━━━━━━━
👤 الموكّل: [الاسم الكامل]
📱 الجوال: [رقم الجوال]
📧 البريد: [بريد@example.com] (إن وجد)
━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ نوع الموكّل: فرد / شركة
⚖️ مجال القضية: الدفاع الجنائي
📌 نوع المسألة: قضايا مالية واحتيال
━━━━━━━━━━━━━━━━━━━━━━━━━
📋 التفاصيل التي أدخلها الموكّل:
• الوضع: محتجز حالياً
• المحكمة: غير محدد
• جلسة قادمة: نعم، بتاريخ 2025/03/10
• تفاصيل: [ما أدخله المستخدم]
━━━━━━━━━━━━━━━━━━━━━━━━━
📍 الفرع المفضل: الرياض
📞 طريقة التواصل: واتساب
⏱️ الاستعجال: قصوى — يُنتظر رد خلال ساعة واحدة
━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 مصدر الطلب: نموذج الموقع الإلكتروني
🕐 وقت الإرسال: [timestamp]
```

**For English form submissions**, the same template is generated in English.

---

## 6. Technical Implementation Plan

### 6.1 File Structure

No new files needed — all changes go into `contact.html`.

```
contact.html
  ↳ Replace <div id="the-form">...</div> with wizard markup
  ↳ Add <style> block: wizard CSS (steps, progress bar, cards, urgency pills)
  ↳ Add <script> block: wizard JS engine
```

Estimated additions: ~300 lines HTML, ~200 lines CSS, ~350 lines JS.

---

### 6.2 JS Engine Architecture

```javascript
// State object — single source of truth
const state = {
  currentStep: 1,         // 1–4
  clientType: null,       // 'individual' | 'business'
  practiceArea: null,     // 'corporate' | 'family' | 'criminal' | 'injury'
  subIssue: null,
  dynamicFields: {},      // key:value of step 3 answers
  urgencyScore: 0,
  contact: {}             // name, phone, email, method, branch
};

// Functions
function goToStep(n)         // validates current step, advances with slide animation
function renderStep3()       // called after practiceArea + clientType known — injects correct fields
function calculateUrgency()  // runs after step 3 fields — returns score + SLA string
function buildWAMessage()    // assembles the Arabic summary string
function submitForm()        // opens wa.me link + fires mailto fallback
function applyLangToWizard() // syncs data-ar/data-en to current lang
```

---

### 6.3 CSS Architecture

```css
/* Wizard container */
.wizard-wrap { position: relative; overflow: hidden; }

/* Individual steps */
.wizard-step {
  position: absolute; width: 100%;
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s;
}
.wizard-step.active  { transform: translateX(0);    opacity: 1; pointer-events: all; }
.wizard-step.left    { transform: translateX(-100%); opacity: 0; pointer-events: none; }
.wizard-step.right   { transform: translateX(100%);  opacity: 0; pointer-events: none; }

/* RTL: flip slide direction */
[dir="rtl"] .wizard-step.left  { transform: translateX(100%); }
[dir="rtl"] .wizard-step.right { transform: translateX(-100%); }

/* Client type + practice area cards */
.type-card {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.type-card.selected, .type-card:hover {
  border-color: var(--gold);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(201,169,110,0.2);
}

/* Urgency pills */
.urgency-pill { ... }
.urgency-pill[data-level="urgent"].selected   { background: #dc2626; color:#fff; }
.urgency-pill[data-level="important"].selected{ background: #d97706; color:#fff; }
.urgency-pill[data-level="normal"].selected   { background: #16a34a; color:#fff; }

/* Progress bar */
.wizard-progress { height: 3px; background: var(--gold); transition: width 0.4s; }
/* Step 1=25%, 2=50%, 3=75%, 4=100% */
```

---

### 6.4 Validation Per Step

| Step | Validation |
|------|------------|
| 1 | `clientType` must be selected (cards are clickable → auto-advance, so always valid) |
| 2 | `practiceArea` must be selected + `subIssue` must be chosen from dropdown |
| 3 | Textarea `maxlength` enforced. Required fields per area shown with red border on fail. |
| 4 | `name` required, `phone` required (Saudi format: +966 or 05XXXXXXXX), consent checkbox must be checked |

Phone validation regex: `/^(\+9665|05)\d{8}$/`

---

## 7. UX Details & Micro-interactions

### 7.1 Progress Bar
4 dots above the form. Current step dot fills gold. Click on completed dots to go back.

```
● ── ● ── ○ ── ○
1    2    3    4
```

### 7.2 Step Titles + Subtitles
Each step has a title and a reassuring subtitle in Arabic:
- Step 1: "ابدأ من هنا" / "كلما عرفنا أكثر، قدّمنا خدمةً أفضل"
- Step 2: "ما طبيعة مسألتك؟" / "ساعدنا في توجيه طلبك للمحامي المناسب"
- Step 3: "بعض التفاصيل" / "جميع المعلومات تُعامَل بسرية تامة"
- Step 4: "كيف نصل إليك؟" / "سنتواصل معك بطريقتك المفضلة"

### 7.3 Back Button
Every step (except step 1) has a `← السابق` / `← Back` link at bottom left. Clicking goes back without clearing that step's data.

### 7.4 Auto-advance on Card Click
Step 1 and Step 2 (area cards only) auto-advance to next step 0.3s after selection, with a gold checkmark flash on the selected card.

### 7.5 Character Counter on Textareas
```
تفاصيل إضافية
[_______________________________________]
                                  147/300
```

### 7.6 Success Screen (Step 5)

Replaces the form entirely after submit:

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                       ✅                                 │
│            تم إرسال طلبك بنجاح                          │
│                                                          │
│   رقم طلبك: #SAL-2025-4821   ← timestamp-based ID       │
│                                                          │
│   🟢 سيتواصل معك محامينا خلال ٢٤ ساعة                  │
│      على رقم: +966 05X XXX XXXX                          │
│                                                          │
│   في انتظار ذلك، يمكنك:                                 │
│   [ تحضير مستنداتك المتعلقة بالقضية ]                   │
│   [ تصفح خدماتنا القانونية ]                            │
│                                                          │
│   [ فتح المحادثة على واتساب مباشرةً ]  ← CTA button     │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Bilingual Support

All wizard text must use the same `data-ar` / `data-en` pattern already in the site.

Key additions:
- JS dynamically generates step-3 fields — these must be generated with `data-ar` / `data-en` and the existing `applyLang()` must be called after injection.
- WhatsApp message: always in Arabic regardless of UI language (the lawyer reads Arabic).
- Success screen: in the user's current language.
- Dynamically injected `<select>` options: loop through options and set `textContent` from `data-ar`/`data-en` on language switch.

---

## 9. Analytics Events to Fire

Wrap at key moments (if GA4 is later added — just stubs for now):

```javascript
// Step advances
trackEvent('smart_form_step', { step: 2, practiceArea: 'criminal' });

// Sub-issue selected
trackEvent('smart_form_subissue', { area: 'criminal', issue: 'financial_fraud' });

// Urgency selected by user
trackEvent('smart_form_urgency_manual', { level: 'urgent' });

// Urgency auto-detected
trackEvent('smart_form_urgency_auto', { trigger: 'detained', score: 10 });

// Submit
trackEvent('smart_form_submit', { practiceArea, clientType, urgencyScore, branch });

// WhatsApp opened
trackEvent('whatsapp_form_open', { source: 'smart_form_success' });

// Back button used
trackEvent('smart_form_back', { fromStep: 3 });
```

---

## 10. Implementation Checklist

- [ ] Design wizard HTML structure (4 `.wizard-step` divs + progress dots)
- [ ] Write base CSS (step transitions, cards, urgency pills, progress bar)
- [ ] Write `state` object + `goToStep()` + slide animation
- [ ] Step 1: client type cards + auto-advance
- [ ] Step 2: practice area cards + sub-issue dropdown (4 sets)
- [ ] Step 3: `renderStep3()` function — 4 × 2 = 8 field templates (area × clientType)
- [ ] Urgency score engine + auto-detect triggers from step 3 answers
- [ ] Step 4: contact fields + urgency pills + branch + consent
- [ ] Step 4 validation (phone regex, required fields)
- [ ] `buildWAMessage()` — assemble Arabic summary string
- [ ] `submitForm()` — open wa.me + success screen
- [ ] Success screen with request ID + SLA message
- [ ] Bilingual sync: `applyLangToWizard()` + hook into existing `setLang()`
- [ ] RTL slide direction fix (translateX flip for Arabic)
- [ ] Test all 8 conditional paths end-to-end
- [ ] Mobile responsiveness: cards stack vertically on < 480px

---

## 11. Effort Estimate

| Phase | Work |
|-------|------|
| HTML structure + CSS | ~3–4 hours |
| JS engine (steps + state + validation) | ~3–4 hours |
| 8 dynamic field templates + urgency engine | ~2–3 hours |
| WhatsApp message builder + success screen | ~1 hour |
| Bilingual sync + RTL fixes | ~1 hour |
| Testing all paths | ~1–2 hours |
| **Total** | **~11–14 hours** |

---

## 12. Stretch Goals (After Core Is Done)

| Feature | Notes |
|---------|-------|
| **File upload in step 3** | Allow attaching 1–2 documents (PDF/image). Use `<input type="file">` — files can't go via WhatsApp link but can populate an email attachment via FormSubmit.co |
| **Appointment date picker** | Step 4: preferred date/time slot. Simple `<input type="date">` + time `<select>` with office hours enforcement |
| **Duplicate detection** | If same phone number submitted within 24hrs, show "لديك طلب معالجة بالفعل" message |
| **FormSubmit.co integration** | Free form-to-email service. Add `action="https://formsubmit.co/info@almatroodlaw.sa"` — sends email with all fields automatically. Zero backend. |
| **Lead ID tracking** | Store request ID in localStorage, show "طلبك السابق #SAL-XXXX" on next visit |
| **Calendly embed** | After step 4, offer "احجز موعداً مباشرةً" → opens embedded Calendly widget |

---

*Ready to implement. Say "build D2" to start coding.*
