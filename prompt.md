me4warak — Prototype Specification & Claude Code Prompt
Arabic-first Egyptian government-service navigator • Hackathon MVP
Copy everything from the “MASTER PROMPT” section below and give it to Claude Code as the initial project brief. The document intentionally describes a frontend-first prototype and explicitly prohibits access to sensitive laptop data.
MASTER PROMPT
You are building a polished hackathon prototype called “me4warak” (مِشوارك / me4warak).
PROJECT IDEA
me4warak helps people in Egypt understand how to complete common government/civil-service tasks. A user chooses a service, selects/uses a location, and gets a clear guide showing:
- where to go
- the nearest relevant office
- what documents are needed
- an interactive checklist
- step-by-step instructions
- opening/closing hours
- estimated waiting time
- fees if known
- community confidence/verification information
The prototype is focused on Alexandria, Egypt, but the data model should be easy to expand to other Egyptian cities later.
IMPORTANT SCOPE
This is a hackathon prototype. Prioritize a beautiful, polished, responsive FRONTEND and a small amount of backend-like functionality only if useful.
Do NOT over-engineer authentication, admin dashboards, complex databases, AI, payments, or real government integrations.
The first prototype should feel complete even with mock/local data.
LANGUAGE AND DIRECTION
- The ENTIRE USER INTERFACE must be Arabic by default.
- Use RTL layout throughout.
- All visible UI labels, buttons, headings, helper text, empty states, errors, tooltips, service names, etc. should be Arabic.
- Use English only inside code, variable names, file names, comments when useful, or technical developer documentation.
- Make the Arabic natural and friendly for Egyptian users. Avoid overly formal bureaucratic wording where a simpler phrase is possible.
- Include a language setting with Arabic as the default. An English toggle may exist if it is easy, but Arabic is the primary/demo language.
- Ensure Arabic text renders correctly and does not break layout.
BRAND
Name: me4warak
Tagline direction: “اعرف هتحتاج إيه، وهتروح فين، وتعمل إيه.”
The visual identity should feel trustworthy, friendly, modern, and Egyptian without looking like an official government website.
Do NOT imply that me4warak is an official government authority.
Use a small disclaimer somewhere appropriate such as:
“منصة إرشادية مستقلة — تأكد من المتطلبات قبل الزيارة.”
TECH STACK
Preferred:
- React
- Vite
- JavaScript or TypeScript (choose whichever makes the project cleanest)
- CSS or a lightweight styling solution
- React Router only if useful
- Leaflet + React-Leaflet for the interactive map
- OpenStreetMap tiles for the prototype
Do not introduce unnecessary libraries. Keep the project easy to run with npm.
MAP
Use Leaflet/React-Leaflet with OpenStreetMap rather than requiring Google Maps for the core prototype.
The map is a major part of the service page.
Map requirements:
- Alexandria-centered initial view.
- Show markers for relevant government-service locations from local mock data.
- Show a user-location marker only if the user explicitly grants browser geolocation permission.
- Never require location permission for the prototype to work.
- Provide a manual area/location selection fallback.
- Clicking a location marker should select that location and update the details panel.
- Highlight the recommended/nearest location.
- Include a “عرض الاتجاهات” / directions button. For the prototype, this can open a normal map/directions URL or be a placeholder action; do not build routing from scratch.
- Map must work without access to any private device information.
- If map tiles fail to load, the rest of the UI should remain usable and show a graceful fallback.
PRIVACY / SECURITY — VERY IMPORTANT
Do NOT access, inspect, read, upload, or transmit any sensitive information from the developer’s laptop or environment.
Specifically:
- Do NOT scan the filesystem.
- Do NOT inspect personal folders.
- Do NOT read browser history, cookies, saved passwords, SSH keys, API keys, environment variables, .env files, credential files, cloud credentials, Git credentials, tokens, or system configuration.
- Do NOT collect device identifiers.
- Do NOT fingerprint the device.
- Do NOT access microphone, camera, contacts, clipboard, or personal files.
- Do NOT send local machine information to any external service.
- Do NOT ask for or hard-code secrets.
- Do NOT expose API keys in source code.
- Do NOT add analytics or tracking unless explicitly requested.
- Browser geolocation may be used ONLY after the browser permission prompt and ONLY to calculate/map the user’s approximate current position for this prototype. Do not store it.
- If location permission is denied, simply use manual area selection.
- Use only synthetic/mock service and location data supplied inside the project.
- Do not scrape or automatically ingest personal or private information.
- If an API key is ever needed, use a clearly documented placeholder/environment variable and do not inspect existing environment variables to find one.
CORE USER FLOW
1. User opens the homepage.
2. User sees “إيه المشوار اللي محتاج تعمله؟”
3. User searches for a service or chooses from service cards/categories.
4. User selects a service.
5. User chooses an area in Alexandria or optionally clicks “استخدم موقعي”.
6. The app finds/recommends the nearest location that offers that service.
7. User lands on the service page:
   - large map
   - vertical navigation on the map side
   - details panel
   - community panel
   - location information
8. User can switch between “التفاصيل” and “المجتمع” from the vertical sidebar while keeping the map visible.
9. User can use the checklist and browse all service information.
10. User can open the settings gear and change appearance/settings.
DESKTOP LAYOUT
The main service page should be a split-screen layout:
- Map occupies roughly the left 50% of the screen.
- Information panel occupies roughly the right 50%.
- Because the site is Arabic/RTL, make the information panel the RIGHT side and map the LEFT side.
- On smaller screens, stack the map above the information panel or use a polished mobile layout.
VERTICAL MAP SIDEBAR
On the LEFT/map side, overlay a slim vertical navigation bar.
It should contain:
1. 📋 “التفاصيل”
2. 👥 “المجتمع”
3. ℹ️ “المكان”
The active option should be visually obvious.
Clicking “التفاصيل” shows the service guide.
Clicking “المجتمع” shows community contributions.
Clicking “المكان” shows information specifically about the selected office/location.
SETTINGS
Put a small floating gear button ⚙️ in the TOP-LEFT corner of the map.
Clicking it opens a compact settings popover/modal.
At minimum include:
- الوضع: فاتح / داكن
- اللغة: العربية (English can be optional)
- اختيار المنطقة
- a short “عن me4warak” item
Persist light/dark mode locally if desired.
Do not store sensitive information.
HOME PAGE
Create a polished homepage with:
- me4warak logo/wordmark
- Arabic tagline
- short explanation
- prominent search bar
- service categories
- service cards
- optional “الأكثر استخدامًا” section
- optional “مشاوير قريبة منك” / location prompt
Suggested hero:
“إيه المشوار اللي محتاج تعمله؟”
Subtext:
“اعرف المستندات، المكان، الخطوات، والمواعيد قبل ما تنزل.”
SEARCH
Search should filter services instantly by Arabic service name and useful keywords.
Include a friendly empty state when no service matches.
SERVICE CATEGORIES AND SAMPLE SERVICES
Create enough mock services to make the homepage feel substantial. Use realistic categories but clearly treat the data as prototype/mock information.
Categories:
1. الهوية والأوراق الشخصية
- تجديد بطاقة الرقم القومي
- استخراج بطاقة رقم قومي لأول مرة
- بدل فاقد لبطاقة الرقم القومي
- بدل تالف لبطاقة الرقم القومي
- تغيير بيانات بطاقة الرقم القومي
- استخراج شهادة ميلاد مميكنة
- استخراج شهادة وفاة مميكنة
- استخراج قيد فردي
- استخراج قيد عائلي
- استخراج قسيمة زواج
- استخراج قسيمة طلاق
- استخراج صحيفة الحالة الجنائية
2. الأسرة والميلاد
- تسجيل مولود جديد
- استخراج شهادة ميلاد لمولود
- إضافة طفل إلى قيد الأسرة
- تسجيل زواج
- تسجيل طلاق
3. جواز السفر والسفر
- استخراج جواز سفر
- تجديد جواز السفر
- بدل فاقد لجواز السفر
- بدل تالف لجواز السفر
4. المرور والمركبات
- استخراج رخصة قيادة
- تجديد رخصة قيادة
- بدل فاقد لرخصة القيادة
- تجديد رخصة سيارة
- استخراج رخصة سيارة
- نقل ملكية سيارة
5. السكن والعنوان
- تغيير محل الإقامة
- تحديث العنوان في بطاقة الرقم القومي
- إثبات محل إقامة
6. الشهادات والمستندات
- توثيق مستند
- استخراج شهادة/إفادة رسمية
- تصديق مستند
Important: Do not claim that these exact requirements, fees, hours, or locations are currently official facts unless verified externally. For the prototype, mark mock/sample data clearly where appropriate.
SERVICE PAGE — DETAILS PANEL
For a selected service, show:
HEADER
- Service icon
- Service name
- short one-line description
- selected/recommended location
LOCATION CARD
Example structure:
“أقرب مكان مناسب ليك”
“السجل المدني — سموحة”
“يبعد حوالي 2.4 كم”
Button: “عرض الاتجاهات”
HOURS
“مواعيد العمل”
“الأحد — الخميس”
“8:00 ص — 2:00 م”
WAIT TIME
“وقت الانتظار المتوقع”
“45–60 دقيقة”
Status badge:
- هادي
- متوسط
- مزدحم
Add “بناءً على تقارير المجتمع” where applicable.
FEES
“الرسوم المتوقعة”
“XXX جنيه”
If unknown, show “غير محددة في بياناتنا” instead of inventing a number.
DOCUMENT CHECKLIST
Make this interactive.
Example:
☐ بطاقة الرقم القومي الحالية
☐ استمارة الطلب
☐ صور شخصية
☐ وسيلة الدفع المطلوبة
As the user checks items, show progress:
“2 من 4 جاهزين”
When complete:
“🎉 تمام! كده قائمتك مكتملة.”
STEPS
Use numbered step cards/timeline:
1. التوجه إلى المكان المناسب
2. الحصول على رقم انتظار
3. تقديم المستندات
4. دفع الرسوم
5. استكمال الطلب
6. استلام الإيصال/المستند حسب الخدمة
IMPORTANT:
Use service-specific mock steps instead of identical generic steps wherever practical.
OTHER SERVICE INFORMATION
Add small cards/sections for:
- مدة إتمام الخدمة المتوقعة
- هل يلزم الحضور الشخصي؟
- ملاحظات مهمة
- آخر تحديث للمعلومة
- confidence/community status
COMMUNITY STATUS
Show something like:
“🟢 موثّق من المجتمع”
“أكد المعلومة 84 شخص”
“آخر تأكيد منذ 3 أيام”
Potential states:
- 🟢 “موثّق من المجتمع”
- 🟡 “تم الإبلاغ عنه مؤخرًا”
- ⚪ “بيانات أولية”
Do not imply official verification.
LOCATION PANEL
When the user clicks “المكان”:
Show:
- location name
- address
- services available
- opening hours
- estimated wait
- distance from selected/manual location
- community notes
- directions button
- optional accessibility information if included in mock data
COMMUNITY PANEL
This is a key differentiator.
The community page should allow people to help verify/update information without creating accounts.
At the top:
“المجتمع”
“ساعد غيرك يعرف المعلومة الصح قبل ما يروح.”
Show an overall confidence indicator:
“94% من المجتمع أكدوا صحة المعلومات”
“126 تأكيد”
Then show contribution cards.
TYPES OF CONTRIBUTIONS
1. تصحيح مستند
2. تحديث مواعيد
3. تقرير وقت انتظار
4. تصحيح خطوة
5. ملاحظة عن المكان
6. تجربة مفيدة
Example contribution:
Title: “متطلب إضافي”
Text: “طلبوا مني صورة من بطاقة الأب.”
Metadata: “منذ يومين”
Actions:
- “أكدت ده”
- “ده مش اللي حصل معايا”
WAITING-TIME CONTRIBUTION
Give a structured quick input:
“قد إيه استنيت؟”
- أقل من 15 دقيقة
- 15–30 دقيقة
- 30–60 دقيقة
- ساعة–ساعتين
- أكثر من ساعتين
ADD CONTRIBUTION
Prominent button:
“+ أضف مساهمة”
Modal:
“إيه اللي حصل معاك؟”
Options:
- مستند
- مواعيد
- وقت انتظار
- خطوة في الإجراءات
- المكان
- تجربة مفيدة
Then a simple form based on the selected type.
ANONYMOUS CONTRIBUTION MODEL
No accounts or login for the prototype.
For duplicate prevention, if implementing a backend:
- Generate a random anonymous contributor ID in the browser using crypto.randomUUID().
- Store it locally in localStorage.
- The backend should enforce uniqueness for a contributor + contribution target, e.g. unique(correction_id, contributor_id).
- Do NOT attempt to identify the person.
- Do NOT fingerprint the device.
- Do NOT claim this guarantees one human = one vote. It only prevents repeated actions from the same anonymous browser identity under normal use.
- If there is no backend in the first prototype, simulate this behavior locally with localStorage.
COMMUNITY VERIFICATION LOGIC
There should be NO admin approval workflow in the prototype.
The philosophy is community-driven verification:
- A contribution starts as “تم الإبلاغ عنه”.
- Other anonymous users can confirm or dispute it.
- Confirmation counts are shown.
- When enough independent confirmations exist, display a stronger status such as “موثّق من المجتمع”.
- The main service information can reflect community-verified changes in the demo.
- Clearly distinguish “community verified” from “officially verified”.
- Avoid presenting community reports as government-authoritative facts.
For prototype simplicity, use a threshold such as:
0–9: “تم الإبلاغ عنه”
10–49: “مدعوم من المجتمع”
50+: “موثّق من المجتمع”
Make the threshold a configurable constant in code.
IMPORTANT UX DETAIL
The community section should not replace the map.
The map remains visible while the right-side panel changes between:
- التفاصيل
- المجتمع
- المكان
DATA MODEL
Use local JSON/JS mock data for the initial version.
Service:
{
  id,
  nameAr,
  category,
  icon,
  descriptionAr,
  documents: [{ id, nameAr, required }],
  steps: [{ order, titleAr, descriptionAr }],
  estimatedDuration,
  feeLabel,
  notes,
  availableLocationIds
}
Location:
{
  id,
  nameAr,
  addressAr,
  city,
  area,
  lat,
  lng,
  openingHours,
  services,
  estimatedWaitMinutes,
  waitLabel,
  notes
}
CommunityContribution:
{
  id,
  serviceId,
  locationId,
  type,
  titleAr,
  contentAr,
  createdAt,
  confirmations,
  disputes,
  status
}
Keep mock coordinates and data clearly separated in a data/mock folder.
NEAREST LOCATION LOGIC
When a service is selected:
1. Filter locations that offer the selected service.
2. If manual area is selected, prioritize nearby locations in that area.
3. If browser geolocation is granted, calculate distance from the user to each eligible location.
4. Select the nearest eligible location.
5. Highlight it on the map.
6. Let the user click other eligible locations to compare them.
Use a standard geographic distance calculation such as the Haversine formula if needed.
Do not send the coordinates to a server.
DESIGN DIRECTION
Modern Egyptian civic-tech.
Not corporate-government-looking.
Not childish.
Not overly flashy.
Visual direction:
- clean cards
- rounded corners
- subtle shadows
- clear hierarchy
- accessible contrast
- elegant Arabic typography
- generous spacing
- map is visually dominant
- warm but trustworthy accent color
- excellent dark mode
- smooth but restrained transitions
- clear status badges
Do not overuse gradients, glassmorphism, or animations.
RESPONSIVENESS
Desktop is the primary hackathon demo.
Tablet and mobile should still be usable.
On mobile:
- map can occupy the top section
- sidebar can become a horizontal tab bar or floating controls
- details/community panel becomes a bottom/scrolling sheet
- checklist remains easy to tap
ACCESSIBILITY
- keyboard-accessible controls
- visible focus states
- buttons should have clear labels
- don't rely on color alone for statuses
- sufficient text contrast
- map controls should have accessible labels
COMPONENT SUGGESTION
Create reusable components such as:
- Header
- HomeHero
- ServiceSearch
- ServiceCategory
- ServiceCard
- AreaSelector
- MapView
- MapSidebar
- ServiceDetails
- LocationCard
- HoursCard
- WaitTimeCard
- DocumentChecklist
- StepsTimeline
- CommunityPanel
- ContributionCard
- ContributionModal
- ConfidenceBadge
- LocationPanel
- SettingsPopover
- Toast/Notification
Do not create unnecessary components if they make the project harder to understand.
ROUTING
Suggested routes:
/
 /service/:serviceId
Optional:
 /location/:locationId
The core prototype must work even without complicated routing.
MOCK DATA
Populate the prototype with:
- at least 15–20 services
- several service categories
- at least 6–10 mock government-service locations in Alexandria
- each location should offer multiple services
- enough community contributions to make the community screen look alive
Do not invent sensitive personal information.
All people/contributors must be anonymous labels such as:
“زائر مجهول”
“مستخدم من المجتمع”
No names, emails, phone numbers, IDs, addresses of private individuals, etc.
ERROR / EMPTY STATES
Include polished Arabic states:
- no search results
- no nearby location
- location permission denied
- map unavailable
- no community contributions yet
- service has incomplete information
Example:
“مش لقينا مكان قريب للخدمة دي في المنطقة المختارة. جرّب منطقة تانية.”
SETTINGS
Implement:
- light mode
- dark mode
- Arabic RTL default
- optional English toggle if it can be done cleanly
- manual area preference if useful
Do not add unnecessary settings.
DEMO DETAILS
Make the prototype demo-friendly:
- clicking a service should immediately work
- clicking a map marker should visibly update the selected location
- checklist should visibly update progress
- community confirmations should update counts/status in the UI
- contribution submission should immediately appear in the list in local prototype state
- settings should visibly switch theme
- no dead buttons unless clearly marked as unavailable/future
- no console errors
IMPORTANT: DO NOT BUILD YET
Do not build:
- authentication
- accounts
- password systems
- admin dashboard
- payment processing
- real government APIs
- scraping
- AI assistant
- notifications
- production analytics
- real-time queues
- complex backend infrastructure
These may be future features, but the hackathon prototype should focus on the core flow.
QUALITY BAR
Before finishing:
1. Run the app.
2. Check all main flows.
3. Check RTL alignment.
4. Check Arabic typography.
5. Check light/dark mode.
6. Check desktop and mobile layouts.
7. Check that the map loads.
8. Check that markers are clickable.
9. Check that selecting a service updates the page.
10. Check that checklist state works.
11. Check that community confirmations/contributions work.
12. Check that no sensitive local files, credentials, environment variables, browser data, or device information were accessed.
13. Keep the code clean enough for a student hackathon team to understand and modify.
STARTING TASK
First inspect ONLY the project directory that I explicitly provide to you for this project. Do not scan outside it.
If the project is empty, initialize the React/Vite project.
Then build the homepage and core service page with mock data.
Prioritize the visual prototype and core interaction flow over backend complexity.
The final result should feel like:
“Google Maps-style location discovery + a simple government-service checklist + community verification, designed specifically for Egyptian users.”
The product name is exactly:
me4warak
Recommended prototype screen map
1. الصفحة الرئيسية: شعار me4warak + سؤال “إيه المشوار اللي محتاج تعمله؟” + بحث + تصنيفات + كروت خدمات.
2. اختيار المنطقة: الإسكندرية + اختيار منطقة يدوي أو استخدام الموقع بإذن المتصفح.
3. صفحة الخدمة: خريطة يسارًا + لوحة معلومات يمينًا.
4. شريط رأسي فوق الخريطة: التفاصيل / المجتمع / المكان.
5. الإعدادات: ترس صغير أعلى يسار الخريطة، مع الوضع الفاتح/الداكن والإعدادات الأساسية.
6. المجتمع: مساهمات + تأكيدات/اعتراضات + إضافة مساهمة، بدون حسابات وبدون موافقات إدارية.
Suggested project structure
src/
  components/
    Header/
    ServiceCard/
    ServiceSearch/
    MapView/
    MapSidebar/
    ServiceDetails/
    DocumentChecklist/
    StepsTimeline/
    CommunityPanel/
    ContributionModal/
    SettingsPopover/
  data.json
  style.md
  claude_test.py
  style.md
  pages/
    Home.jsx
    ServicePage.jsx
  utils/
    distance.js
  styles/
    ...
  App.jsx
  main.jsx
Important prototype principle
The app should feel useful even before the community features exist. The primary promise is: الخدمة → المكان → المستندات → الخطوات → الوقت. The community layer is the trust/update layer on top of that core.

make a readme file