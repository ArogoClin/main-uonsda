export function normalizeMissionExperience(input) {
  if (input === null || input === undefined || input === '') {
    return { count: 0, isFirstTime: true };
  }

  const cleaned = input
    . toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '');

  const textPatterns = {
    none: ['none', 'no', 'zero', 'first time', 'firsttime', 'never', '0'],
    one: ['one', '1', 'once'],
    moreThanOne: ['more than 1', 'more than one', 'morethan1', 'multiple', 'several', 'many', '2+', 'more'],
  };

  if (textPatterns.none.some((pattern) => cleaned.includes(pattern))) {
    return { count: 0, isFirstTime: true };
  }

  if (textPatterns.one.some((pattern) => cleaned === pattern)) {
    return { count: 1, isFirstTime: false };
  }

  if (textPatterns.moreThanOne.some((pattern) => cleaned. includes(pattern))) {
    return { count: 2, isFirstTime: false };
  }

  const numberMatch = cleaned.match(/\d+/);
  if (numberMatch) {
    const count = parseInt(numberMatch[0], 10);
    return {
      count: isNaN(count) ? 0 : count,
      isFirstTime: count === 0,
    };
  }

  console.log(`⚠️ Mission experience: "${input}" → first time`);
  return { count: 0, isFirstTime: true };
}

export async function detectMissionExperience(email, currentMissionId, prisma) {
  const previousMissions = await prisma.missionRegistration.count({
    where: {
      email: email. toLowerCase(). trim(),
      missionId: { not: currentMissionId },
    },
  });

  return {
    count: previousMissions,
    isFirstTime: previousMissions === 0,
  };
}

export function mergeMissionExperience(userInput, autoDetected) {
  if (userInput !== null && userInput !== undefined && userInput !== '') {
    const normalized = normalizeMissionExperience(userInput);
    return { ...normalized, source: 'user_input' };
  }

  return { ... autoDetected, source: 'auto_detected' };
}

export function getMissionExperienceDisplay(count) {
  if (count === 0) return 'First Time';
  if (count === 1) return '1 Mission';
  return `${count} Missions`;
}