# Artwork and services verification

The CSS orb artwork and its curved frame are restored to the version preceding the uploaded network image. Services now contains two cards: Staffing and Development. Staffing retains contract staffing, contract-to-hire, and direct placement as options; Development opens a project inquiry with the correct service and email subject.

The production build passes. Chromium checks at 1440px, 768px, and 360px confirm two service cards, both orbs, the preserved frame radius, and no horizontal overflow. Screenshots are saved at `/tmp/hirecraft-services-1440.png`, `/tmp/hirecraft-services-768.png`, and `/tmp/hirecraft-services-360.png`.

The contact form now submits through Web3Forms using the supplied access key. Staffing, development, and career inquiries include the appropriate fields and subject. The old email-draft flow and FAQ instructions are replaced by direct submission, success feedback, and retryable errors.

The production build passes. All 16 browser checks pass across the initial run and targeted rerun: navigation, responsive layout, inquiry payloads, successful reset, duplicate prevention, provider rejection, server errors, invalid JSON, rate limiting, network errors, honeypot behavior, validation, and FAQs. All Web3Forms requests are intercepted with mock responses; no real emails were sent and inbox delivery has not been verified. Other browser engines have not been tested.
