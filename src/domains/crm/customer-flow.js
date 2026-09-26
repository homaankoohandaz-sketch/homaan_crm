const RESPONSE_PATTERNS = Object.freeze([
  { status: 'approved', patterns: [/تایید/, /تأیید/, /قبول/, /موافق/, /اوکی/, /بله/] },
  { status: 'rejected', patterns: [/رد/, /نمی.?خواهم/, /مناسب نیست/, /لغو/] },
  { status: 'question', patterns: [/چقدر/, /قیمت/, /سوال/, /اطلاعات/, /بیشتر/, /شرایط/] },
  { status: 'interested', patterns: [/علاقه/, /می.?پسند/, /بازدید/, /تماس/] }
]);

export function createSharePackage({ propertyId = null, advisorId, title = 'پیشنهاد BuildWise', message = '', expiresInHours = 72 } = {}) {
  if (!advisorId) throw new TypeError('advisorId is required');
  const hours = Math.max(1, Math.min(720, Number(expiresInHours) || 72));
  return {
    propertyId: propertyId == null ? null : Number(propertyId),
    advisorId: String(advisorId),
    title: String(title).slice(0, 200),
    message: String(message).slice(0, 4000),
    status: 'sent',
    expiresAt: new Date(Date.now() + hours * 3600000).toISOString()
  };
}

export function interpretCustomerResponse(message = '') {
  const text = String(message).trim();
  if (!text) return { status: 'question', confidence: 0, reason: 'empty_response' };
  for (const rule of RESPONSE_PATTERNS) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return { status: rule.status, confidence: 0.85, reason: 'keyword_match' };
    }
  }
  return { status: 'question', confidence: 0.35, reason: 'needs_review' };
}
