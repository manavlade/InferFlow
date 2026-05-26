import re

PII_PATTERNS = [
    # Email
    (re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'), '[EMAIL]'),

    # Phone numbers (Indian + International)
    (re.compile(r'(\+91[\-\s]?)?[6-9]\d{9}'), '[PHONE]'),
    (re.compile(r'\+?1?\s?(\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4})'), '[PHONE]'),

    # Credit/Debit card numbers
    (re.compile(r'\b(?:\d[ -]?){13,16}\b'), '[CARD_NUMBER]'),

    # Aadhaar (Indian ID - 12 digits)
    (re.compile(r'\b\d{4}\s\d{4}\s\d{4}\b'), '[AADHAAR]'),

    # PAN card (Indian)
    (re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'), '[PAN]'),

    # SSN (US)
    (re.compile(r'\b\d{3}-\d{2}-\d{4}\b'), '[SSN]'),

    # IP Address
    (re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b'), '[IP_ADDRESS]'),

    # URLs with credentials (http://user:pass@)
    (re.compile(r'https?://[^:]+:[^@]+@[^\s]+'), '[URL_WITH_CREDENTIALS]'),

    # Passwords in common patterns
    (re.compile(r'(?i)(password|passwd|pwd|secret|api_key|apikey|token)\s*[:=]\s*\S+'), '[REDACTED_CREDENTIAL]'),
]


def redact_pii(text: str) -> str:
    """Redact PII from a string."""
    if not text:
        return text

    for pattern, replacement in PII_PATTERNS:
        text = pattern.sub(replacement, text)

    return text


def redact_messages(messages: list) -> list:
    """Redact PII from a list of message dicts."""
    redacted = []
    for msg in messages:
        redacted.append({
            **msg,
            "content": redact_pii(msg["content"])
        })
    return redacted