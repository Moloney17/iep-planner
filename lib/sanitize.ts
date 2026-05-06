// Input sanitization for student data before it reaches Claude or the database

const MAX_LENGTHS: Record<string, number> = {
  name: 100,
  strengths: 2000,
  concerns: 2000,
  familyPriorities: 2000,
  currentServices: 2000,
  environmentalFactors: 2000,
  cognitive: 3000,
  communication: 3000,
  socialEmotional: 3000,
  adaptive: 3000,
  physical: 3000,
  parentName: 100,
  parentEmail: 200,
  parentPhone: 30,
};

// Remove HTML tags, script injection attempts, and prompt injection patterns
function sanitizeString(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') return '';

  let clean = input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove common prompt injection patterns
    .replace(/\bignore\s+(previous|all|above)\s+(instructions?|prompts?|context)\b/gi, '')
    .replace(/\bsystem\s*prompt\b/gi, '')
    .replace(/\bjailbreak\b/gi, '')
    .replace(/\bDAN\b/g, '')
    // Remove null bytes and control characters (except newlines and tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize excessive whitespace
    .replace(/[ \t]+/g, ' ')
    .trim();

  // Enforce max length
  if (maxLength && clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }

  return clean;
}

export function sanitizeStudentData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = { ...data };

  // Sanitize top-level string fields
  const stringFields = ['name', 'strengths', 'concerns', 'familyPriorities', 'currentServices', 'environmentalFactors', 'parentName', 'parentEmail', 'parentPhone'];
  stringFields.forEach(field => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeString(sanitized[field] as string, MAX_LENGTHS[field]);
    }
  });

  // Sanitize present levels
  if (sanitized.presentLevels && typeof sanitized.presentLevels === 'object') {
    const pl = sanitized.presentLevels as Record<string, string>;
    sanitized.presentLevels = {
      cognitive: sanitizeString(pl.cognitive || '', MAX_LENGTHS.cognitive),
      communication: sanitizeString(pl.communication || '', MAX_LENGTHS.communication),
      socialEmotional: sanitizeString(pl.socialEmotional || '', MAX_LENGTHS.socialEmotional),
      adaptive: sanitizeString(pl.adaptive || '', MAX_LENGTHS.adaptive),
      physical: sanitizeString(pl.physical || '', MAX_LENGTHS.physical),
    };
  }

  return sanitized;
}

export function sanitizeProgressNote(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    currentPerformance: sanitizeString(data.currentPerformance as string, 500),
    notes: sanitizeString((data.notes as string) || '', 500),
    goalStatement: sanitizeString(data.goalStatement as string, 1000),
    goalDomain: sanitizeString(data.goalDomain as string, 100),
  };
}
