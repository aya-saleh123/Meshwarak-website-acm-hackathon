/**
 * Manual smoke test: drives the running dev server in a real browser, captures
 * console errors and page errors, and writes screenshots to scripts/shots/.
 *
 * Not part of the app build. Run with:  node scripts/smoke.mjs
 * Requires playwright to be installed (npm i --no-save playwright).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://localhost:5173'
const OUT = new URL('./shots/', import.meta.url).pathname.replace(/^\//, '')
mkdirSync(OUT, { recursive: true })

const problems = []

const browser = await chromium.launch()

async function session(name, viewport, steps) {
  const context = await browser.newContext({
    viewport,
    locale: 'ar-EG',
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`[${name}] console.${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => {
    problems.push(`[${name}] pageerror: ${error.message}`)
  })
  page.on('requestfailed', (request) => {
    const url = request.url()
    if (url.includes('tile.openstreetmap.org') || url.includes('fonts.g')) return
    problems.push(`[${name}] requestfailed: ${url} — ${request.failure()?.errorText}`)
  })

  await steps(page, name)
  await context.close()
}

async function shot(page, name) {
  await page.waitForTimeout(450)
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: true })
  console.log(`  · ${name}.png`)
}

/* ---------------------------- desktop, Arabic ----------------------------- */

await session('desktop', { width: 1440, height: 900 }, async (page) => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  console.log('desktop:', await page.title())
  await shot(page, 'desktop-home')

  // horizontal overflow check
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (overflow > 1) problems.push(`[desktop] home horizontal overflow: ${overflow}px`)

  // search from the hero
  await page.getByRole('searchbox').first().fill('رخصة')
  await page.getByRole('button', { name: 'ابحث' }).click()
  await page.waitForURL(/\/services\?q=/)
  await shot(page, 'desktop-search')
  const cards = await page.locator('.service-card').count()
  console.log('  search results for رخصة:', cards)
  if (cards === 0) problems.push('[desktop] search "رخصة" returned 0 cards')

  // no-results state
  await page.getByRole('searchbox').first().fill('zzzzzzz')
  await page.waitForTimeout(400)
  const empty = await page.locator('.empty').count()
  if (empty === 0) problems.push('[desktop] no-results empty state missing')
  await shot(page, 'desktop-no-results')

  // browse all services grouped
  await page.goto(`${BASE}/services`, { waitUntil: 'networkidle' })
  await shot(page, 'desktop-services')
  console.log('  all service cards:', await page.locator('.service-card').count())

  // open the multi-stage service (richest data)
  await page.goto(`${BASE}/services/vehicle_ownership_transfer`, {
    waitUntil: 'networkidle',
  })
  await page.waitForSelector('.leaflet-container', { timeout: 15000 })
  await shot(page, 'desktop-detail')

  // checklist interaction
  const boxes = page.locator('.check-item__button')
  const total = await boxes.count()
  await boxes.nth(0).click()
  await boxes.nth(1).click()
  const progress = await page.locator('.progress__value').first().innerText()
  console.log(`  checklist items: ${total}, after 2 ticks: ${progress.trim()}`)
  if (!progress.includes('2')) problems.push(`[desktop] checklist progress wrong: ${progress}`)
  await shot(page, 'desktop-detail-checked')

  // place tab + district selection
  await page.locator('.map-tabs button', { hasText: 'المكان' }).click()
  await page.waitForTimeout(500)
  await page.locator('.area-btn', { hasText: 'سموحة' }).click()
  await shot(page, 'desktop-place')
  const directions = await page.locator('a', { hasText: 'عرض الاتجاهات' }).first().getAttribute('href')
  console.log('  directions href:', directions)
  if (!directions?.includes('google.com/maps')) {
    problems.push('[desktop] directions link missing')
  }

  // community: empty state -> add contribution -> confirm
  await page.locator('.map-tabs button', { hasText: 'المجتمع' }).click()
  await page.waitForTimeout(300)
  await shot(page, 'desktop-community-empty')
  await page.locator('.panel-section__actions button').first().click()
  await page.waitForSelector('[role="dialog"]')
  await page.locator('#\\:r0, .modal input.input').first().fill('طلبوا صورة إضافية من البطاقة')
  await page.locator('.modal textarea').fill(
    'الموظف طلب صورة زيادة من بطاقة الرقم القومي مع الأصل، خدت معايا واحدة بس فاضطرت أصور تاني.',
  )
  await shot(page, 'desktop-contrib-modal')
  await page.getByRole('button', { name: /انشر المساهمة/ }).click()
  await page.waitForTimeout(400)
  const contribs = await page.locator('.contrib').count()
  console.log('  contributions after submit:', contribs)
  if (contribs !== 1) problems.push(`[desktop] expected 1 contribution, got ${contribs}`)
  await page.locator('.vote-btn[data-vote="confirm"]').first().click()
  await page.waitForTimeout(300)
  await shot(page, 'desktop-community-filled')

  // dark mode
  await page.getByRole('button', { name: 'افتح الإعدادات' }).click()
  await page.getByRole('button', { name: 'داكن' }).click()
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  await shot(page, 'desktop-dark-detail')
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await shot(page, 'desktop-dark-home')

  // back to light + english
  await page.getByRole('button', { name: /settings|الإعدادات|افتح الإعدادات/ }).click()
  await page.getByRole('button', { name: 'فاتح' }).click()
  await page.getByRole('button', { name: 'English' }).click()
  await page.waitForTimeout(400)
  const dir = await page.evaluate(() => document.documentElement.dir)
  console.log('  dir after English:', dir)
  if (dir !== 'ltr') problems.push(`[desktop] expected ltr in English mode, got ${dir}`)
  await shot(page, 'desktop-english')

  // about
  await page.goto(`${BASE}/about`, { waitUntil: 'networkidle' })
  await shot(page, 'desktop-about-en')

  // back to Arabic for the remaining shots
  await page.getByRole('button', { name: 'Open settings' }).click()
  await page.getByRole('button', { name: 'العربية' }).click()
  await page.waitForTimeout(300)
  await page.keyboard.press('Escape')
  await shot(page, 'desktop-about-ar')

  // 404
  await page.goto(`${BASE}/does-not-exist`, { waitUntil: 'networkidle' })
  await shot(page, 'desktop-404')
})

/* ----------------------------- mobile, Arabic ----------------------------- */

await session('mobile', { width: 390, height: 844 }, async (page) => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await shot(page, 'mobile-home')

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (overflow > 1) problems.push(`[mobile] home horizontal overflow: ${overflow}px`)

  await page.getByRole('button', { name: 'افتح القائمة' }).click()
  await shot(page, 'mobile-menu')
  await page.locator('#mobile-menu .mobile-menu__link', { hasText: 'الخدمات' }).click()
  await page.waitForURL(/services/)
  await shot(page, 'mobile-services')

  await page.goto(`${BASE}/services/national_id_renewal`, { waitUntil: 'networkidle' })
  await shot(page, 'mobile-detail')
  const mOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (mOverflow > 1) problems.push(`[mobile] detail horizontal overflow: ${mOverflow}px`)

  await page.locator('.tabbar button', { hasText: 'المكان' }).click()
  await page.waitForSelector('.leaflet-container', { timeout: 15000 })
  await shot(page, 'mobile-place')

  await page.locator('.tabbar button', { hasText: 'المجتمع' }).click()
  await page.waitForTimeout(300)
  await shot(page, 'mobile-community')
})

/* --------------------------------- tablet --------------------------------- */

await session('tablet', { width: 820, height: 1180 }, async (page) => {
  await page.goto(`${BASE}/services`, { waitUntil: 'networkidle' })
  await shot(page, 'tablet-services')
  await page.goto(`${BASE}/services/driving_license_first_time`, {
    waitUntil: 'networkidle',
  })
  await shot(page, 'tablet-detail')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (overflow > 1) problems.push(`[tablet] detail horizontal overflow: ${overflow}px`)
})

await browser.close()

console.log('\n=== problems ===')
if (problems.length === 0) console.log('none')
else problems.forEach((p) => console.log('!', p))
