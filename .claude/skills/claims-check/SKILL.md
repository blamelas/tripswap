---
name: claims-check
description: Scans user-facing copy for unsupported health claims, misleading price language and missing €0* disclaimers.
---

# /claims-check

Use before any release and after any copy change in `src/views` or `src/components`.

## Steps

1. Search for banned wording in `src/`:
   ```bash
   grep -rniE "grátis|gratuito|desconto|promoção|oferta|preço anterior|tarifa atual|cura|detox|perder peso|emagrec|previne|doença|esperança de vida|emissões|CO2|carbono" src/
   ```
2. For every match, confirm it appears only inside an explicit disclaimer (for example,
   "não é um desconto").
3. Verify the following are present in the UI:
   - the €0* explanation in `src/views/Discover.tsx`, `DestinationDetail` and the footer;
   - "objetivo ilustrativo de planeamento" in the destination detail;
   - the sentence that one-time savings are not recurring, in the receipt.
4. Verify no copy contains: "devias", "tens de", "culpa", "má escolha".
5. Verify every number shown as a month estimate comes from `calculatePlan` or
   `monthsToTarget`, never from a literal.

## Output

Three lists: violations, risky-but-acceptable, and approved. Include file:line for
every finding.
