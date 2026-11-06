# Lam Trà Design System

**Lam Trà** is a Vietnamese tea brand from Tân Cương, Thái Nguyên. This system powers its online store — a mobile-first, Vietnamese-only shop that replaces hand-run sales on Facebook, TikTok and the physical shop.

Tagline: **"Lam Trà – Trọn vị trà Việt, trọn tấm lòng trao gửi."** (The full taste of Vietnamese tea, given with heart.)

## Product context
- **Range:** green teas Móc Câu, Đinh, Nõn Tôm, premium Đinh Thượng Hạng and lotus-scented Đinh Sen; jasmine tea (trà lài); red and green lotus oolong; tea bags; matcha powder; green-tea peanut candy; curated sets for daily drinking and gifting.
- **Variants:** most products come in 150g / 300g / 500g and two grades (Hạng 1, Hạng 2). Price changes with both.
- **Customer flow:** visit → browse → choose size + grade → cart → details → pay via **VietQR** (or COD) → notifications at each stage: *Đã đặt hàng → Đã xác nhận → Đang giao → Hoàn thành*.
- **Shop side:** owner confirms and fulfils manually; admin panel for products, inventory, orders, promotions.
- **Other features:** search, discount codes and campaigns, wishlist, reviews, sign-up/login, Zalo chat, Facebook + TikTok links.
- **Audience:** men and women 28–40 in Vietnam, middle to upper-middle income; buying for daily drinking or as gifts; mostly on phones.

### Products / surfaces
1. **Storefront** (mobile-first web) — `ui_kits/storefront/`
2. **Admin panel** (desktop web) — `ui_kits/admin/`

## Sources
- GitHub: **https://github.com/dothanhhxx/LamTraE-Com** (branch `main`). At the time of building (19 Oct 2026) it contained only `.gitattributes` — no code, tokens or assets. Explore it again as it grows; once real UI code lands, the UI kits should be re-synced against it.
- Uploaded logo: `uploads/lam-tra-logo.svg` (lotus-leaf "L" emblem + "LAM TRÀ / TEA & BEYOND" wordmark, gold `#BC9A6C` and cream `#FDEDD8` on forest green `#24341F`). Copied and re-cut into `assets/logo/`.
- The written brief. The palette was first explored away from the logo, then — per user feedback — synced back to the logo green/gold/cream (see Visual Foundations).

Because no UI source existed, every component and screen here is an original design built from the brief.

---

## CONTENT FUNDAMENTALS

**Language:** Vietnamese only, with full diacritics everywhere (never strip tones, even in codes or URLs shown to users — use `LAMTRA10`-style codes for things that must be ASCII).

**Voice:** a knowledgeable tea-shop host — warm, calm, precise. It explains the tea (where it grows, how it's processed, how it tastes, how to brew) rather than shouting about deals. Think handwritten shop card, not marketplace banner.

**Address:** the customer is **"bạn"**; the brand speaks as **"Lam Trà"** or **"chúng tôi"**. Reviews use real-sounding names with honorifics ("Chị Hạnh", "Anh Tuấn"). Avoid "quý khách" except in formal order/legal messages.

**Casing:** sentence case for everything — buttons, headings, nav ("Thêm vào giỏ", "Trà bán chạy"). Uppercase only for the small tracked eyebrow ("TÂN CƯƠNG · THÁI NGUYÊN") and product flags never in caps. No title Case.

**Sentences:** short, concrete, sensory. Name the place, the process, the taste:
- "Búp chè được hái vào sáng sớm, sao tay trên chảo gang, cho nước xanh vàng sánh, hương cốm non và hậu ngọt sâu."
- "Mỗi cân trà cần hơn nghìn bông sen."

**Buttons are verbs:** "Thêm vào giỏ", "Đặt hàng", "Tôi đã chuyển khoản", "Xem tất cả", "Nhắn Zalo", "Viết đánh giá".

**Status/system copy:** plain and reassuring, says what happens next — "Lam Trà sẽ xác nhận và nhắn tin qua Zalo trong vòng 30 phút." Errors say what to do: "Mã không hợp lệ hoặc đã hết hạn".

**Numbers:** prices as `185.000₫` (dot thousands, ₫ suffix, no space); weights `150g`; times `14:20 · 18/10`; dates `dd/mm/yyyy`. Middle dot `·` separates metadata.

**Promotions:** stated once, quietly — "Gói quà kèm thiệp miễn phí cho đơn từ 500.000₫". No "SALE SỐC!!!", no countdown flashing, no exclamation stacks.

**Emoji:** none in UI. Line icons only.

## VISUAL FOUNDATIONS

**Mood:** elegant, rustic, warm, refined — a quiet traditional tea room rendered with modern clarity. Photography leads; UI recedes.

**Color (default theme "Rêu").** Synced with the logo. Primary is **rêu** moss green `#34472B` (hover `#2A3A23`), built from the logo green `#24341F`, which is also the dark band / sidebar / footer colour. Accent is **kim** gold: the exact logo gold `#BC9A6C` for ratings, badges and fine details, darkened to `#94723F` where it carries white text (accent buttons). Pages sit on cream paper (`#F7F0E3` page, `#FCF8F1` card, `#EEE4D2` sunken) tuned toward the logo cream `#FDEDD8`, which is the text colour on dark green. Supporting naturals: matcha `#6B7A4B`, lotus `#A8625D`. Text is warm charcoal (`#23201A` strong, `#39332A` body, `#74684F` muted), never pure black. Semantic colours are earthy and desaturated.
Three alternates ship via `[data-theme]`: **Chàm** (indigo `#2E3F66` + oolong amber), **Đất** (terracotta `#8A4B2E` + olive) and **Sen** (jade `#2F5D50` + lotus pink).

**Type.** One family: **Roboto** (fallback **Arial**) for everything — full Vietnamese diacritic support, familiar and highly legible on phones. Hierarchy comes from size and weight, not font contrast: headings and product names Roboto Medium 500 with -.01em tracking; body 400; prices and key emphasis 500/700. Never use 600 (Roboto has no 600; it renders as bold). Mobile scale: display 38, h1 30, h2 24, h3 19, h4 16, body 15, small 13, caption 12, eyebrow 11 uppercase with .16em tracking. Headings keep line-height ≥1.2 so stacked marks (Ể, Ỗ, Ặ) never touch. Prices are tabular. The tagline's second clause is set in logo gold rather than italic. Because the face is neutral, warmth comes from colour, cream paper, photography and generous spacing.

**Spacing & layout.** 4px base. 20px mobile gutter, 40px desktop; section rhythm 48px mobile / 80px desktop. Mobile: sticky 56px header (frosted paper), 64px bottom tab bar, floating "Chat Zalo" pill above it. Product grids are 2 columns on mobile (gap 28 vertical / 16 horizontal). Generous whitespace; one idea per section.

**Backgrounds.** Flat paper colour. No gradients except the dark protection gradient over hero photos (transparent → dark green 78% from the bottom) so text stays legible. Full-bleed photography for hero and story sections; one dark-green band per page at most (gifts). No textures or patterns yet — if added, a very faint paper fibre would fit.

**Imagery.** Warm, natural light, slightly muted; wood, linen, clay teaware, tea fields, hands. Never white-cutout marketplace shots. Until the shoot happens, `ProductImage` shows tonal placeholders keyed by tea family (green, lotus, jasmine, amber, matcha, indigo).

**Corner radii.** Restrained: 2px badges/checkbox, 4px buttons/inputs, 6px photos/cards, 10px dialogs, 14px bottom sheet top. Fully round only for chips (Tag), icon buttons, the Zalo pill.

**Cards.** Product cards have **no box** — the photo (6px radius) is the container; text sits below on the page. Content cards (order summary, promo) are `--surface-card` with a 1px `--border-hairline` and no shadow.

**Borders.** 1px hairlines `#DED3BF` for dividers and cards; `#C4B69D` for inputs/steppers; selected options get a 1.5px ink border. Lists are separated by hairlines, not zebra stripes.

**Shadows.** Warm-tinted and low. Most surfaces are flat. `--shadow-sm` for the QR card, `--shadow-md` for floating pills/tooltips, `--shadow-lg` for dialogs and toasts.

**Transparency & blur.** Only the sticky header (94% paper + blur) and `IconButton variant="surface"` over photos (88% paper + blur). Scrim is dark green at 50%.

**Motion.** Fades and short rises (4–8px), `cubic-bezier(.2,.7,.2,1)`, 120/200/360ms. Product photo scales 1% on hover. Bottom sheets slide up. No bounce, no parallax, no auto-carousels, nothing flashing.

**Hover / press.** Hover: filled buttons darken one step (`--primary-hover`); outline/ghost get a `--bg-sunken` fill; text links and product names underline (1px, 3px offset). Press: 1px translate down. Focus: 3px green ring at 28%.

## ICONOGRAPHY

- **Set:** [Lucide](https://lucide.dev) v0.460.0 outline icons (ISC), **1.5px stroke**, round caps/joins, 24px grid. The repo had no icon set, so Lucide was chosen to match the light, calligraphic line of the logo. **This is a substitution — swap if the brand adopts its own set.**
- **Files:** 52 SVGs copied into `assets/icons/`; the same paths are embedded in `components/core/icon-paths.js` and rendered by the `Icon` component.
- **Sizes:** 16 inline with small text, 18–20 in buttons/forms, 22 in header and tab bar. Filled variants only for active heart and rating stars.
- **No emoji, no unicode pictographs** as icons. The middle dot `·` and `₫` are typographic, not icons.
- **Brand marks:** Facebook uses Lucide's glyph; TikTok and Zalo have no Lucide glyph and are shown as text links / a "Chat Zalo" pill with `message-circle`. Add official brand SVGs if required.

## Logo
`assets/logo/`:
- `lam-tra-logo.svg` — full mark, gold + cream, transparent (use on indigo or logo green)
- `lam-tra-logo-on-green.svg` — original artwork with green background
- `lam-tra-emblem.svg` — emblem only (header, favicon, seals)

**Original colours only** (gold `#BC9A6C` + cream `#FDEDD8`). Never recolour, never make one-colour versions, never redraw. Place on logo green `#24341F` or dark Rêu grounds; on light paper, set the emblem inside a logo-green tile.

---

## Index

**Root:** `styles.css` (imports only) · `readme.md` · `SKILL.md` · `thumbnail.html` · `github.md`

**Tokens** (`tokens/`): `fonts.css` (self-hosted @font-face, Vietnamese subsets) · `colors.css` (base + semantic + `cham` / `dat` / `sen` themes) · `typography.css` · `spacing.css` (space, radii, shadows, motion, layout) · `base.css` (element defaults)

**Fonts** (`fonts/`): Roboto 400 / 500 / 700 + italic 400 — self-hosted from Google Fonts, Vietnamese subsets included. Arial is the system fallback.

**Guidelines** (`guidelines/`): specimen cards for colours, palette explorations, type, spacing, radii, elevation, borders, motion, logo, emblem, tagline, photo placeholders, iconography.

### Components
- `components/core/` — **Icon**, **Button**, **IconButton**, **Badge**, **Tag**
- `components/forms/` — **Input**, **Select**, **Checkbox**, **Radio**, **Switch**, **QuantityStepper**, **OptionPicker**
- `components/commerce/` — **ProductCard**, **ProductImage**, **Price** (`formatVND` is a module export only — not on the window namespace), **Rating**, **OrderTracker**
- `components/feedback/` — **Toast**, **Dialog** (center + sheet), **Tooltip**
- `components/navigation/` — **Tabs**

Each has `.jsx`, `.d.ts`, `.prompt.md`; each folder has a `*.card.html`.

**Intentional additions** (beyond a generic set, because the brief needs them): OptionPicker (size/grade), QuantityStepper, ProductImage (photo placeholder), Price, Rating, OrderTracker (4 notification stages).

### UI kits
- `ui_kits/storefront/` — Home, Listing, Product, Cart, Checkout, VietQR payment, Orders + notifications (390px)
- `ui_kits/admin/` — Orders, Products & inventory, Promotions (1280px)
