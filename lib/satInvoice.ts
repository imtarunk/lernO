export async function createInvoice(amount: number, memo = "Payment Request") {
  try {
    if (!window.webln) {
      throw new Error(
        "WebLN not available. Please connect a Lightning wallet like Alby."
      );
    }

    // Enable webln if not already enabled
    await window.webln.enable();

    // Generate the invoice
    const response = await window.webln.makeInvoice({
      amount, // amount in sats
      defaultMemo: memo,
    });

    return response.paymentRequest; // BOLT11 invoice
  } catch (err) {
    console.error("Failed to create invoice:", err);
    throw err;
  }
}
