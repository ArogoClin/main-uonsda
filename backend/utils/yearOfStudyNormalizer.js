// ============================================================================
// YEAR OF STUDY NORMALIZER
// Handles year of study (1-7) from various input formats
// ============================================================================

export function normalizeYearOfStudy(input) {
  if (input === null || input === undefined || input === '') {
    return null; // Unknown/Not provided
  }

  const cleaned = input
    . toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '');

  // Handle text variations
  const yearPatterns = {
    1: ['1', 'one', 'first', 'first year', 'year 1', 'year one', 'yr1', 'y1'],
    2: ['2', 'two', 'second', 'second year', 'year 2', 'year two', 'yr2', 'y2'],
    3: ['3', 'three', 'third', 'third year', 'year 3', 'year three', 'yr3', 'y3'],
    4: ['4', 'four', 'fourth', 'fourth year', 'year 4', 'year four', 'yr4', 'y4'],
    5: ['5', 'five', 'fifth', 'fifth year', 'year 5', 'year five', 'yr5', 'y5'],
    6: ['6', 'six', 'sixth', 'sixth year', 'year 6', 'year six', 'yr6', 'y6'],
    7: ['7', 'seven', 'seventh', 'seventh year', 'year 7', 'year seven', 'yr7', 'y7'],
  };

  // Check for "Other" patterns
  const otherPatterns = ['other', 'graduate', 'postgrad', 'alumni', 'completed', 'done', 'finished', 'masters', 'phd'];
  if (otherPatterns.some((pattern) => cleaned.includes(pattern))) {
    return null; // Return null for "Other"
  }

  // Try exact match
  for (const [year, patterns] of Object.entries(yearPatterns)) {
    if (patterns.some((pattern) => cleaned === pattern || cleaned.includes(pattern))) {
      return parseInt(year, 10);
    }
  }

  // Try to extract number
  const numberMatch = cleaned.match(/\d+/);
  if (numberMatch) {
    const year = parseInt(numberMatch[0], 10);
    if (year >= 1 && year <= 7) {
      return year;
    }
  }

  console.log(`⚠️ Year of study: "${input}" → null (Other)`);
  return null; // Default to null for unparseable input
}

export function getYearOfStudyDisplay(year) {
  if (year === null) return 'Other';
  if (year >= 1 && year <= 7) return `Year ${year}`;
  return 'Other';
}

export function validateYearOfStudy(inputs) {
  const results = {
    valid: [],
    warnings: [],
    summary: {
      year1: 0,
      year2: 0,
      year3: 0,
      year4: 0,
      year5: 0,
      year6: 0,
      year7: 0,
      other: 0,
    },
  };

  for (const input of inputs) {
    const normalized = normalizeYearOfStudy(input);
    
    if (normalized === null) {
      results.summary.other++;
    } else {
      results.summary[`year${normalized}`]++;
    }

    results.valid.push({
      original: input,
      normalized,
      display: getYearOfStudyDisplay(normalized),
    });
  }

  return results;
}