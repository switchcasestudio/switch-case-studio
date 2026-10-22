#!/usr/bin/env node
/* US English check (owner, 2026-10-22: "I live in America... we write
   color, not colour"). Scans the visible text of every built page (scripts,
   styles and tags stripped) and the generated text files for British
   spellings, and fails with file and word when it finds one. Runs on
   postbuild. Code identifiers are not prose: `aria-labelledby` is the HTML
   attribute's real name and is never flagged. Add a word to BRITISH when a
   new one slips through. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BRITISH = [
  'colour', 'colours', 'coloured', 'colouring', 'colourway', 'colourways', 'colourful',
  'favour', 'favourite', 'favourites', 'behaviour', 'behaviours', 'honour', 'labour',
  'neighbour', 'humour', 'flavour', 'harbour', 'rumour', 'savour', 'vapour',
  'centre', 'centres', 'centred', 'theatre', 'metre', 'metres', 'litre', 'fibre', 'calibre',
  'organise', 'organised', 'organising', 'organisation', 'organisations',
  'realise', 'realised', 'recognise', 'recognised', 'optimise', 'optimised', 'optimising', 'optimisation',
  'customise', 'customised', 'customisation', 'prioritise', 'prioritised', 'summarise', 'summarised',
  'analyse', 'analysed', 'analysing', 'apologise', 'standardise', 'standardised', 'finalise', 'finalised',
  'visualise', 'visualisation', 'personalise', 'personalised', 'personalisation', 'minimise', 'maximise',
  'utilise', 'utilised', 'specialise', 'specialised', 'emphasise', 'emphasised', 'categorise', 'categorised',
  'catalogue', 'cheque', 'grey', 'travelled', 'travelling', 'traveller', 'cancelled', 'cancelling',
  'modelled', 'modelling', 'labelled', 'labelling', 'enrol', 'fulfil', 'defence', 'licence', 'licences',
  'practise', 'aluminium', 'programme', 'programmes', 'learnt', 'enquiry', 'enquiries', 'judgement',
  'ageing', 'jewellery', 'tyre', 'kerb', 'storey', 'whilst', 'amongst', 'towards',
];
const RE = new RegExp(`\\b(${BRITISH.join('|')})\\b`, 'gi');
const ROOT = process.argv[2] || 'build';

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(html|txt|xml)$/.test(name)) yield p;
  }
}

const visible = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');

const hits = [];
for (const file of walk(ROOT)) {
  const raw = readFileSync(file, 'utf8');
  const text = file.endsWith('.html') ? visible(raw) : raw;
  for (const m of text.matchAll(RE)) hits.push(`${file}: ${m[0]}`);
}

if (hits.length) {
  console.error(`US English check: ${hits.length} British spelling(s)\n  ${[...new Set(hits)].join('\n  ')}`);
  process.exit(1);
}
console.log('US English check: clean');
