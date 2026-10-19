/**
 * Gera a migration de conteúdo inicial a partir de src/content.
 * Uso: npm run content:sql
 * É idempotente (upserts com IDs determinísticos) e pode ser reaplicada.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ACHIEVEMENTS, ARRANGEMENTS, PATHS, REPERTOIRE, SKILLS, allStandaloneExercises } from "../src/content";
import { applyLyrics, parseVoice, partRange } from "../src/lib/music/notation";

const OUT = join(import.meta.dirname, "..", "supabase", "migrations", "20261018000500_content.sql");

const q = (v: string | null | undefined) => (v === null || v === undefined ? "null" : `'${v.replace(/'/g, "''")}'`);
const j = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;
const arr = (v: string[]) => (v.length ? `array[${v.map(q).join(", ")}]::text[]` : "'{}'::text[]");
const id = (ns: string) => `md5(${q(ns)})::uuid`;

const lines: string[] = [];
const out = (s = "") => lines.push(s);

out("-- =============================================================================");
out("-- Vozes em Harmonia — conteúdo inicial (GERADO por scripts/generate-content-sql.ts)");
out("-- Não edite à mão: altere src/content e rode `npm run content:sql`.");
out("-- =============================================================================");
out();

out("-- Habilidades");
for (const [i, s] of SKILLS.entries()) {
  out(
    `insert into public.skills (slug, name, category, description, criteria, auto_max_level, sort) values (${q(s.slug)}, ${q(s.name)}, ${q(s.category)}, ${q(s.description)}, ${j(s.criteria)}, ${s.autoMaxLevel}, ${i})` +
      ` on conflict (slug) do update set name = excluded.name, category = excluded.category, description = excluded.description, criteria = excluded.criteria, auto_max_level = excluded.auto_max_level, sort = excluded.sort;`,
  );
}
out();

out("-- Conquistas");
for (const [i, a] of ACHIEVEMENTS.entries()) {
  out(
    `insert into public.achievements (slug, title, description, icon, points, sort) values (${q(a.slug)}, ${q(a.title)}, ${q(a.description)}, ${q(a.icon)}, ${a.points}, ${i})` +
      ` on conflict (slug) do update set title = excluded.title, description = excluded.description, icon = excluded.icon, points = excluded.points, sort = excluded.sort;`,
  );
}
out();

for (const [pi, p] of PATHS.entries()) {
  out(`-- Trilha ${p.code} — ${p.title}`);
  out(
    `insert into public.learning_paths (id, slug, code, title, subtitle, description, icon, sort) values (${id(`path:${p.slug}`)}, ${q(p.slug)}, ${q(p.code)}, ${q(p.title)}, ${q(p.subtitle)}, ${q(p.description)}, ${q(p.icon)}, ${pi})` +
      ` on conflict (slug) do update set code = excluded.code, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, icon = excluded.icon, sort = excluded.sort;`,
  );
  for (const [li, l] of p.lessons.entries()) {
    out(
      `insert into public.lessons (id, path_id, slug, title, summary, sort, level, estimated_minutes, content, pass_threshold) values (${id(`lesson:${l.slug}`)}, (select id from public.learning_paths where slug = ${q(p.slug)}), ${q(l.slug)}, ${q(l.title)}, ${q(l.summary)}, ${li}, ${l.level}, ${l.minutes}, ${j(l.content)}, ${(l.passThreshold ?? 0.7).toFixed(2)})` +
        ` on conflict (slug) do update set path_id = excluded.path_id, title = excluded.title, summary = excluded.summary, sort = excluded.sort, level = excluded.level, estimated_minutes = excluded.estimated_minutes, content = excluded.content, pass_threshold = excluded.pass_threshold;`,
    );
    out(`delete from public.lesson_skills where lesson_id = (select id from public.lessons where slug = ${q(l.slug)});`);
    for (const s of l.skills) {
      out(`insert into public.lesson_skills (lesson_id, skill_slug) select id, ${q(s)} from public.lessons where slug = ${q(l.slug)} on conflict do nothing;`);
    }
    for (const [ei, e] of l.exercises.entries()) {
      out(
        `insert into public.exercises (id, slug, lesson_id, title, instructions, type, config, skill_slug, purpose, difficulty, sort) values (${id(`exercise:${e.slug}`)}, ${q(e.slug)}, (select id from public.lessons where slug = ${q(l.slug)}), ${q(e.title)}, ${q(e.instructions)}, ${q(e.type)}, ${j(e.config)}, ${q(e.skill)}, ${q(e.purpose)}, ${e.difficulty ?? l.level}, ${ei})` +
          ` on conflict (slug) do update set lesson_id = excluded.lesson_id, title = excluded.title, instructions = excluded.instructions, type = excluded.type, config = excluded.config, skill_slug = excluded.skill_slug, purpose = excluded.purpose, difficulty = excluded.difficulty, sort = excluded.sort;`,
      );
    }
  }
  out();
}

out("-- Laboratório, treinadores e avaliação inicial");
for (const [i, e] of allStandaloneExercises().entries()) {
  out(
    `insert into public.exercises (id, slug, title, instructions, type, config, skill_slug, purpose, difficulty, sort) values (${id(`exercise:${e.slug}`)}, ${q(e.slug)}, ${q(e.title)}, ${q(e.instructions)}, ${q(e.type)}, ${j(e.config)}, ${q(e.skill)}, ${q(e.purpose)}, ${e.difficulty ?? 1}, ${i})` +
      ` on conflict (slug) do update set title = excluded.title, instructions = excluded.instructions, type = excluded.type, config = excluded.config, skill_slug = excluded.skill_slug, purpose = excluded.purpose, sort = excluded.sort;`,
  );
}
out();

out("-- Repertório de treino (material da plataforma)");
for (const r of REPERTOIRE) {
  out(
    `insert into public.repertoire (id, title, composer, lyricist, source, copyright_info, license_status, original_key, group_key, tempo_bpm, time_signature, lyrics, chords, difficulty, categories, formation, voices_required, director_notes, status) values (` +
      `${id(`repertoire:${r.key}`)}, ${q(r.title)}, ${q(r.composer)}, ${q(r.lyricist)}, ${q(r.source)}, ${q(r.copyright)}, ${q(r.license)}, ${q(r.originalKey)}, ${q(r.groupKey)}, ${r.tempo}, ${q(r.timeSignature)}, ${q(r.lyrics)}, ${q(r.chords)}, ${r.difficulty}, ${arr(r.categories)}, ${q(r.formation)}, ${r.voicesRequired}, ${q(r.notes)}, 'em_estudo')` +
      ` on conflict (id) do update set title = excluded.title, composer = excluded.composer, lyricist = excluded.lyricist, source = excluded.source, copyright_info = excluded.copyright_info, license_status = excluded.license_status, original_key = excluded.original_key, tempo_bpm = excluded.tempo_bpm, time_signature = excluded.time_signature, lyrics = excluded.lyrics, chords = excluded.chords, difficulty = excluded.difficulty, categories = excluded.categories, formation = excluded.formation, voices_required = excluded.voices_required, director_notes = excluded.director_notes;`,
  );
}
out();

out("-- Arranjos e vozes");
for (const a of ARRANGEMENTS) {
  out(
    `insert into public.arrangements (id, repertoire_id, slug, title, formation, key_name, tempo_bpm, beats_per_measure, harmony_level, description, study_tips, source) values (` +
      `${id(`arrangement:${a.slug}`)}, ${id(`repertoire:${a.repertoire}`)}, ${q(a.slug)}, ${q(a.title)}, ${q(a.formation)}, ${q(a.keyName)}, ${a.tempo}, ${a.beatsPerMeasure}, ${a.harmonyLevel}, ${q(a.description)}, ${q(a.studyTips)}, 'plataforma')` +
      ` on conflict (slug) do update set repertoire_id = excluded.repertoire_id, title = excluded.title, formation = excluded.formation, key_name = excluded.key_name, tempo_bpm = excluded.tempo_bpm, beats_per_measure = excluded.beats_per_measure, harmony_level = excluded.harmony_level, description = excluded.description, study_tips = excluded.study_tips;`,
  );
  for (const [pi, part] of a.parts.entries()) {
    let notes = parseVoice(part.notes);
    if (part.lyrics) notes = applyLyrics(notes, part.lyrics);
    const range = partRange(notes);
    const voices = part.voices.length ? `array[${part.voices.map(q).join(", ")}]::public.voice_classification[]` : "'{}'";
    out(
      `insert into public.vocal_parts (id, arrangement_id, name, short_name, sort, range_low_midi, range_high_midi, notes, suggested_voices) values (` +
        `${id(`part:${a.slug}:${pi}`)}, ${id(`arrangement:${a.slug}`)}, ${q(part.name)}, ${q(part.short)}, ${pi}, ${range?.[0] ?? "null"}, ${range?.[1] ?? "null"}, ${j(notes)}, ${voices})` +
        ` on conflict (id) do update set name = excluded.name, short_name = excluded.short_name, sort = excluded.sort, range_low_midi = excluded.range_low_midi, range_high_midi = excluded.range_high_midi, notes = excluded.notes, suggested_voices = excluded.suggested_voices;`,
    );
  }
}
out();

writeFileSync(OUT, lines.join("\n") + "\n");
console.log(`✓ ${OUT} (${lines.length} linhas)`);
