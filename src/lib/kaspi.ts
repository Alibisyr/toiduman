/**
 * Kaspi payment details shown to the customer.
 *
 * For the manual-transfer flow we display this number + a QR, the customer
 * sends the money in Kaspi, and we release the invitation link afterwards.
 *
 * TODO: replace these placeholders with the real Kaspi recipient. When the
 * friend's backend is live, payment confirmation should be verified there
 * (Kaspi Business API / webhook) instead of trusting the "I paid" button.
 */
export const KASPI = {
  number: "+7 700 000 00 00",
  /** Recipient name as shown in Kaspi, so the payer knows it's correct. */
  name: "Аты-жөні",
  /** Optional kaspi.kz/pay/... link. If set, the QR encodes this instead. */
  payUrl: "",
};

/** What the QR code encodes: a Kaspi pay link if provided, else the number. */
export function kaspiQrValue(): string {
  return KASPI.payUrl || KASPI.number.replace(/[^\d+]/g, "");
}
