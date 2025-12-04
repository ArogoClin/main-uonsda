// ============================================================================
// SMART CAMPUS NORMALIZER
// Handles variations in campus names with fuzzy matching
// ============================================================================

const CAMPUS_VARIATIONS = {
  KENYA_SCIENCE: [
    'kenya science',
    'kenya science campus',
    'ks',
    'science',
    'science campus',
    'kenya sci',
  ],
  MEDICAL_SCHOOL: [
    'medical school',
    'medical',
    'knh',
    'kenyatta national hospital',
    'med school',
    'medschool',
    'medicine',
    'kenyatta',
  ],
  MAIN: [
    'main',
    'main campus',
    'uon main',

  ],
  CHIROMO: [
    'chiromo',
    'chiromo campus',
  
  ],
  LOWER_KABETE: [
    'lower kabete',
    'lower',
    'kabete lower',
    'lk',
    'lower kbt',
  ],
  PARKLANDS: [
    'parklands',
    'parklands campus',
    'parkland',
    'pk',
  ],
  UPPER_KABETE: [
    'upper kabete',
    'upper',
    'kabete upper',
    'uk',
    'upper kbt',
    'kabete',
  ],
  PUEA: [
    'puea',
    'p.u.e.a',
    'p u e a',
  ],
  ASSOCIATE: [
    'associate',
    'associates',
    'associate members',
    'associate campus',
  ],
  KIKUYU: [
    'kikuyu',
    'kikuyu campus',
    'kkyu',
  ],
  VISITOR: [
    'visitor',
    'visitors',
    'guest',
    'other',
    'external',
    'outside',
    'non-uon',
    'non uon',
  ],
};

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b. charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function normalizeCampus(input) {
  if (!input) return 'MAIN';

  const cleaned = input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');

  // Exact match
  for (const [campus, variations] of Object.entries(CAMPUS_VARIATIONS)) {
    if (variations.includes(cleaned)) {
      return campus;
    }
  }

  // Partial match
  for (const [campus, variations] of Object.entries(CAMPUS_VARIATIONS)) {
    for (const variation of variations) {
      if (cleaned.includes(variation) || variation.includes(cleaned)) {
        return campus;
      }
    }
  }

  // Fuzzy match
  let bestMatch = 'MAIN';
  let bestDistance = Infinity;

  for (const [campus, variations] of Object.entries(CAMPUS_VARIATIONS)) {
    for (const variation of variations) {
      const distance = levenshteinDistance(cleaned, variation);
      const threshold = Math.max(3, variation.length * 0.3);

      if (distance < threshold && distance < bestDistance) {
        bestDistance = distance;
        bestMatch = campus;
      }
    }
  }

  console.log(`🔍 Campus: "${input}" → "${bestMatch}"`);
  return bestMatch;
}

export function getCampusDisplayName(campusEnum) {
  const displayNames = {
    KENYA_SCIENCE: 'Kenya Science',
    MEDICAL_SCHOOL: 'Medical School',
    MAIN: 'Main Campus',
    CHIROMO: 'Chiromo',
    LOWER_KABETE: 'Lower Kabete',
    PARKLANDS: 'Parklands',
    UPPER_KABETE: 'Upper Kabete',
    PUEA: 'PUEA',
    ASSOCIATE: 'Associate',
    KIKUYU: 'Kikuyu',
    VISITOR: 'Visitor',
  };

  return displayNames[campusEnum] || campusEnum;
}

export function validateCampusNames(campusNames) {
  const results = {
    valid: [],
    warnings: [],
    normalized: {},
  };

  const uniqueNames = [... new Set(campusNames)];

  for (const name of uniqueNames) {
    const normalized = normalizeCampus(name);
    results.normalized[name] = normalized;

    const cleaned = name. toString().trim().toLowerCase();
    const variations = CAMPUS_VARIATIONS[normalized];
    
    if (variations. includes(cleaned)) {
      results. valid.push({ original: name, normalized });
    } else {
      results.warnings.push({
        original: name,
        normalized,
        suggestion: `"${name}" → "${getCampusDisplayName(normalized)}"`,
      });
    }
  }

  return results;
}