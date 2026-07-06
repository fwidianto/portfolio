# Professional Experience Logo Replacement Handoff

Status: Implementation handoff  
Last updated: 6 Jul 2026

This note supports the next Codex run for replacing the Professional Experience section logos with the real uploaded logo files.

## Uploaded logo files to use

The user provided two logo images in the ChatGPT conversation:

1. **Nobi logo**
   - Uploaded filename: `1000089760.png`
   - Intended repo target: `Assets/logo-nobi.png`
   - Usage: PT Nobi Putra Angkasa experience card

2. **Combined Traktor Nusantara + Astra logo**
   - Uploaded filename: `1000089761.png`
   - Intended repo target: `Assets/logo-traknus-astra-combined.png`
   - Usage: both PT Traktor Nusantara experience cards

## Important design decision

The Traktor Nusantara and Astra logos are now combined into one image. The Professional Experience markup should no longer show `logo-traktor-nusantara.png` and `logo-astra.png` as two separate images for the Traktor Nusantara cards.

Instead, use one combined image:

```html
<img
  class="experience-logo experience-logo--traknus-astra"
  src="Assets/logo-traknus-astra-combined.png"
  alt="PT Traktor Nusantara and Astra logos"
>
```

## Cibuni rule

PT Cibuni Teknik Sejahtera should continue to use the `CTS` initials badge only. Do not add a Cibuni logo.

## Nobi rule

Use the real uploaded Nobi logo as:

```html
<img
  class="experience-logo experience-logo--nobi"
  src="Assets/logo-nobi.png"
  alt="PT Nobi Putra Angkasa logo"
>
```

## Visual adjustment notes

After replacing the assets:

- Make the Nobi logo large enough to be readable inside the logo panel.
- The combined Traktor Nusantara + Astra logo is tall, so size it carefully.
- Avoid cropping either logo.
- Use `object-fit: contain`.
- Keep logo panel clean and not overly tall.
- Keep Cibuni `CTS` badge unchanged.

Suggested CSS direction:

```css
.experience-logo--nobi {
  max-width: 128px;
  max-height: 128px;
}

.experience-logo--traknus-astra {
  max-width: 150px;
  max-height: 132px;
}
```

Adjust based on actual visual result.

## Changelog rule

This is a polish pass on the same Professional Experience update. Do not add duplicate changelog noise unless the latest changelog item needs to be updated.

Preferred latest update wording:

`Professional experience visuals refined with real company logos, wider cards, cleaner alignment, and calmer spacing.`
