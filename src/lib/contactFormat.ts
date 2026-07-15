const PHONE_PREFIX = "+56 9";

function formatRutBody(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatRutInput(value: string) {
  const clean = value.toUpperCase().replace(/[^0-9K]/g, "");

  if (clean.length <= 1) {
    return clean;
  }

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  return `${formatRutBody(body)}-${dv}`;
}

export function normalizeRutForStorage(value: string) {
  const formatted = formatRutInput(value);
  return formatted || null;
}

function extractPhoneLocalDigits(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("569")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("56")) {
    digits = digits.slice(2);
    if (digits.startsWith("9")) {
      digits = digits.slice(1);
    }
  } else if (digits.startsWith("9")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 8);
}

export function formatPhoneInput(value: string, { forcePrefix = false }: { forcePrefix?: boolean } = {}) {
  const localDigits = extractPhoneLocalDigits(value);

  if (!localDigits && !forcePrefix) {
    return "";
  }

  if (!localDigits) {
    return PHONE_PREFIX;
  }

  if (localDigits.length <= 4) {
    return `${PHONE_PREFIX} ${localDigits}`;
  }

  return `${PHONE_PREFIX} ${localDigits.slice(0, 4)} ${localDigits.slice(4)}`;
}

export function hasCompletePhone(value: string) {
  return extractPhoneLocalDigits(value).length === 8;
}

export function normalizePhoneForStorage(value: string) {
  const localDigits = extractPhoneLocalDigits(value);

  if (localDigits.length !== 8) {
    return "";
  }

  return `+569${localDigits}`;
}
