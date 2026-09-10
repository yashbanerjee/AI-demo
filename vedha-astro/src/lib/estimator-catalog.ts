import { ensureDb, pool } from "./db";
import {
  ADDON_GROUPS,
  estimatorAddons as seedAddons,
  estimatorBases as seedBases,
  formatAed,
  recommendedByBase as seedRecommended,
  type AddonGroup,
  type EstimatorAddon,
  type EstimatorBase,
} from "../data/cost-estimator";

export { ADDON_GROUPS, formatAed };
export type { AddonGroup, EstimatorAddon, EstimatorBase };

export const MODULE_TAGS: { id: AddonGroup; label: string }[] = ADDON_GROUPS.filter(
  (group): group is { id: AddonGroup; label: string } =>
    group.id !== "all" && group.id !== "recommended" && group.id !== "popular"
);

export type EstimatorCatalog = {
  bases: EstimatorBase[];
  addons: EstimatorAddon[];
  recommendedByBase: Record<string, string[]>;
};

export type EstimatorBaseInput = EstimatorBase & {
  sortOrder?: number;
  recommendedIds?: string[];
};

export type EstimatorAddonInput = EstimatorAddon & {
  sortOrder?: number;
};

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_GROUPS = new Set(MODULE_TAGS.map((tag) => tag.id));

export function slugifyId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function asInt(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : fallback;
}

function asGroup(value: string): AddonGroup {
  return VALID_GROUPS.has(value as AddonGroup) ? (value as AddonGroup) : "platform";
}

function rowToBase(row: Record<string, unknown>): EstimatorBase {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description ?? ""),
    priceAed: asInt(row.price_aed),
    image: String(row.image ?? ""),
    weeksMin: asInt(row.weeks_min, 2),
    weeksMax: Math.max(asInt(row.weeks_min, 2), asInt(row.weeks_max, 4)),
    sortOrder: asInt(row.sort_order),
  } as EstimatorBase & { sortOrder: number };
}

function rowToAddon(row: Record<string, unknown>): EstimatorAddon {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description ?? ""),
    priceAed: asInt(row.price_aed),
    group: asGroup(String(row.group_id ?? "platform")),
    image: String(row.image ?? ""),
    weeksExtra: asInt(row.weeks_extra),
    popular: Boolean(row.popular),
    sortOrder: asInt(row.sort_order),
  } as EstimatorAddon & { sortOrder: number };
}

async function ensureEstimatorTables(): Promise<void> {
  await ensureDb();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS estimator_bases (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price_aed INTEGER NOT NULL DEFAULT 0,
      image TEXT NOT NULL DEFAULT '',
      weeks_min INTEGER NOT NULL DEFAULT 2,
      weeks_max INTEGER NOT NULL DEFAULT 4,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS estimator_addons (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price_aed INTEGER NOT NULL DEFAULT 0,
      group_id TEXT NOT NULL DEFAULT 'platform',
      image TEXT NOT NULL DEFAULT '',
      weeks_extra INTEGER NOT NULL DEFAULT 0,
      popular BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS estimator_recommended (
      base_id TEXT NOT NULL REFERENCES estimator_bases(id) ON DELETE CASCADE,
      addon_id TEXT NOT NULL REFERENCES estimator_addons(id) ON DELETE CASCADE,
      PRIMARY KEY (base_id, addon_id)
    );
  `);
}

async function seedIfEmpty(): Promise<void> {
  await ensureEstimatorTables();
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM estimator_bases");
  if ((rows[0]?.n ?? 0) > 0) return;

  for (const [index, base] of seedBases.entries()) {
    await pool.query(
      `INSERT INTO estimator_bases (id, name, description, price_aed, image, weeks_min, weeks_max, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO NOTHING`,
      [base.id, base.name, base.description, base.priceAed, base.image, base.weeksMin, base.weeksMax, index]
    );
  }

  for (const [index, addon] of seedAddons.entries()) {
    await pool.query(
      `INSERT INTO estimator_addons (id, name, description, price_aed, group_id, image, weeks_extra, popular, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO NOTHING`,
      [
        addon.id,
        addon.name,
        addon.description,
        addon.priceAed,
        addon.group,
        addon.image,
        addon.weeksExtra,
        Boolean(addon.popular),
        index,
      ]
    );
  }

  for (const [baseId, addonIds] of Object.entries(seedRecommended)) {
    for (const addonId of addonIds) {
      await pool.query(
        `INSERT INTO estimator_recommended (base_id, addon_id)
         VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [baseId, addonId]
      );
    }
  }
}

export async function getEstimatorCatalog(): Promise<EstimatorCatalog> {
  try {
    await seedIfEmpty();

    const [basesRes, addonsRes, recRes] = await Promise.all([
      pool.query("SELECT * FROM estimator_bases ORDER BY sort_order, name"),
      pool.query("SELECT * FROM estimator_addons ORDER BY sort_order, name"),
      pool.query("SELECT base_id, addon_id FROM estimator_recommended"),
    ]);

    const recommendedByBase: Record<string, string[]> = {};
    for (const row of recRes.rows) {
      const baseId = String(row.base_id);
      (recommendedByBase[baseId] ??= []).push(String(row.addon_id));
    }

    return {
      bases: basesRes.rows.map(rowToBase),
      addons: addonsRes.rows.map(rowToAddon),
      recommendedByBase,
    };
  } catch {
    return {
      bases: seedBases,
      addons: seedAddons,
      recommendedByBase: seedRecommended,
    };
  }
}

export async function getEstimatorBase(id: string): Promise<(EstimatorBase & { sortOrder: number; recommendedIds: string[] }) | null> {
  await seedIfEmpty();
  const { rows } = await pool.query("SELECT * FROM estimator_bases WHERE id = $1", [id]);
  if (!rows[0]) return null;
  const rec = await pool.query("SELECT addon_id FROM estimator_recommended WHERE base_id = $1", [id]);
  return {
    ...rowToBase(rows[0]),
    sortOrder: asInt(rows[0].sort_order),
    recommendedIds: rec.rows.map((r) => String(r.addon_id)),
  };
}

export async function getEstimatorAddon(id: string): Promise<(EstimatorAddon & { sortOrder: number }) | null> {
  await seedIfEmpty();
  const { rows } = await pool.query("SELECT * FROM estimator_addons WHERE id = $1", [id]);
  if (!rows[0]) return null;
  return { ...rowToAddon(rows[0]), sortOrder: asInt(rows[0].sort_order) };
}

export function assertValidId(id: string): string {
  const clean = slugifyId(id);
  if (!clean || !ID_PATTERN.test(clean)) {
    throw new Error("Use a lowercase id with letters, numbers, and hyphens.");
  }
  return clean;
}

export async function createEstimatorBase(input: EstimatorBaseInput): Promise<string> {
  await seedIfEmpty();
  const id = assertValidId(input.id || input.name);
  await pool.query(
    `INSERT INTO estimator_bases (id, name, description, price_aed, image, weeks_min, weeks_max, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      id,
      input.name.trim(),
      input.description.trim(),
      asInt(input.priceAed),
      input.image.trim(),
      asInt(input.weeksMin, 2),
      Math.max(asInt(input.weeksMin, 2), asInt(input.weeksMax, 4)),
      asInt(input.sortOrder, 99),
    ]
  );
  await replaceRecommended(id, input.recommendedIds ?? []);
  return id;
}

export async function updateEstimatorBase(id: string, input: EstimatorBaseInput): Promise<void> {
  await ensureEstimatorTables();
  await pool.query(
    `UPDATE estimator_bases
     SET name=$2, description=$3, price_aed=$4, image=$5, weeks_min=$6, weeks_max=$7, sort_order=$8, updated_at=now()
     WHERE id=$1`,
    [
      id,
      input.name.trim(),
      input.description.trim(),
      asInt(input.priceAed),
      input.image.trim(),
      asInt(input.weeksMin, 2),
      Math.max(asInt(input.weeksMin, 2), asInt(input.weeksMax, 4)),
      asInt(input.sortOrder),
    ]
  );
  await replaceRecommended(id, input.recommendedIds ?? []);
}

export async function deleteEstimatorBase(id: string): Promise<void> {
  await ensureEstimatorTables();
  await pool.query("DELETE FROM estimator_bases WHERE id = $1", [id]);
}

export async function createEstimatorAddon(input: EstimatorAddonInput): Promise<string> {
  await seedIfEmpty();
  const id = assertValidId(input.id || input.name);
  await pool.query(
    `INSERT INTO estimator_addons (id, name, description, price_aed, group_id, image, weeks_extra, popular, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      id,
      input.name.trim(),
      input.description.trim(),
      asInt(input.priceAed),
      asGroup(input.group),
      input.image.trim(),
      asInt(input.weeksExtra),
      Boolean(input.popular),
      asInt(input.sortOrder, 99),
    ]
  );
  return id;
}

export async function updateEstimatorAddon(id: string, input: EstimatorAddonInput): Promise<void> {
  await ensureEstimatorTables();
  await pool.query(
    `UPDATE estimator_addons
     SET name=$2, description=$3, price_aed=$4, group_id=$5, image=$6, weeks_extra=$7, popular=$8, sort_order=$9, updated_at=now()
     WHERE id=$1`,
    [
      id,
      input.name.trim(),
      input.description.trim(),
      asInt(input.priceAed),
      asGroup(input.group),
      input.image.trim(),
      asInt(input.weeksExtra),
      Boolean(input.popular),
      asInt(input.sortOrder),
    ]
  );
}

export async function deleteEstimatorAddon(id: string): Promise<void> {
  await ensureEstimatorTables();
  await pool.query("DELETE FROM estimator_addons WHERE id = $1", [id]);
}

export async function listBasesForAddon(addonId: string): Promise<string[]> {
  await ensureEstimatorTables();
  const { rows } = await pool.query(
    "SELECT base_id FROM estimator_recommended WHERE addon_id = $1",
    [addonId]
  );
  return rows.map((row) => String(row.base_id));
}

export async function setAddonRecommendedBases(addonId: string, baseIds: string[]): Promise<void> {
  await ensureEstimatorTables();
  await pool.query("DELETE FROM estimator_recommended WHERE addon_id = $1", [addonId]);
  const unique = [...new Set(baseIds.filter(Boolean))];
  for (const baseId of unique) {
    await pool.query(
      `INSERT INTO estimator_recommended (base_id, addon_id)
       SELECT $1, $2 WHERE EXISTS (SELECT 1 FROM estimator_bases WHERE id = $1)`,
      [baseId, addonId]
    );
  }
}

async function replaceRecommended(baseId: string, addonIds: string[]): Promise<void> {
  await pool.query("DELETE FROM estimator_recommended WHERE base_id = $1", [baseId]);
  const unique = [...new Set(addonIds.filter(Boolean))];
  for (const addonId of unique) {
    await pool.query(
      `INSERT INTO estimator_recommended (base_id, addon_id)
       SELECT $1, $2 WHERE EXISTS (SELECT 1 FROM estimator_addons WHERE id = $2)`,
      [baseId, addonId]
    );
  }
}
