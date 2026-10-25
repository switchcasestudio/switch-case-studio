/* British spellings the site must never ship (owner, 2026-10-22: "I live in
   America... we write color, not colour"; 2026-10-25: "US spelling ONLY").
   One list for check-us-english.mjs (text) and check-us-images.mjs (OCR).
   Add a word, with its inflections, when a new one slips through. */
export const BRITISH = [
  'colour', 'colours', 'coloured', 'colouring', 'colourway', 'colourways', 'colourful', 'discolour', 'watercolour',
  'favour', 'favours', 'favoured', 'favourite', 'favourites', 'favourable', 'behaviour', 'behaviours', 'behavioural',
  'honour', 'honours', 'honoured', 'labour', 'neighbour', 'neighbours', 'neighbourhood', 'humour', 'flavour', 'flavours',
  'harbour', 'rumour', 'savour', 'vapour', 'odour', 'endeavour', 'armour', 'rigour', 'vigour', 'candour', 'parlour',
  'centre', 'centres', 'centred', 'centring', 'theatre', 'metre', 'metres', 'kilometre', 'kilometres', 'litre', 'litres',
  'fibre', 'calibre', 'sombre', 'spectre', 'lustre', 'meagre', 'manoeuvre',
  'organise', 'organised', 'organising', 'organisation', 'organisations', 'realise', 'realised', 'realising',
  'recognise', 'recognised', 'optimise', 'optimised', 'optimising', 'optimisation', 'customise', 'customised',
  'customisation', 'prioritise', 'prioritised', 'summarise', 'summarised', 'analyse', 'analysed', 'analysing',
  'apologise', 'standardise', 'standardised', 'finalise', 'finalised', 'visualise', 'visualisation', 'personalise',
  'personalised', 'personalisation', 'minimise', 'minimised', 'maximise', 'maximised', 'utilise', 'utilised',
  'specialise', 'specialised', 'emphasise', 'emphasised', 'categorise', 'categorised', 'normalise', 'normalised',
  'normalising', 'initialise', 'initialised', 'initialises', 'centralise', 'centralised', 'monetise', 'monetised',
  'authorise', 'authorised', 'authorisation', 'synchronise', 'synchronised', 'digitise', 'digitised', 'localise',
  'localised', 'localisation', 'capitalise', 'criticise', 'familiarise', 'memorise', 'stabilise', 'sanitise',
  'catalogue', 'catalogues', 'analogue', 'cheque', 'grey', 'greys', 'greyed', 'tonne',
  'travelled', 'travelling', 'traveller', 'travellers', 'cancelled', 'cancelling', 'modelled', 'modelling',
  'labelled', 'labelling', 'levelled', 'levelling', 'signalled', 'signalling', 'fuelled', 'totalled', 'counsellor',
  'marvellous', 'jewellery', 'woollen', 'enrol', 'enrolment', 'fulfil', 'fulfilment', 'instalment', 'skilful',
  'defence', 'offence', 'licence', 'licences', 'pretence', 'practise', 'practised', 'aluminium', 'programme', 'programmes',
  'learnt', 'enquiry', 'enquiries', 'judgement', 'ageing', 'artefact', 'artefacts', 'sceptical', 'mould',
  'plough', 'cosy', 'pyjamas', 'moustache', 'aeroplane', 'speciality', 'tyre', 'tyres', 'kerb', 'storey', 'storeys',
  'whilst', 'amongst', 'towards', 'afterwards', 'fortnight', 'postcode',
];

export const BRITISH_RE = () => new RegExp(`\\b(${BRITISH.join('|')})\\b`, 'gi');
