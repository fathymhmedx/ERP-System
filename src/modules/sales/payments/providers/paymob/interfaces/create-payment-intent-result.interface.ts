export interface CreatePaymentIntentResult {
  intentionId: string;
  providerOrderId: string;
  clientSecret: string;
}
