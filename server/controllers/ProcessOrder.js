const PDFDocument = require("pdfkit");
const mailSender = require("../utils/mailSender");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.handleSuccessfulPayment = async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id in request body' });
  }

  try {
    console.log('Retrieving session with ID:', session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items']
    });
    
    console.log('Retrieved session:', session);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.customer_details) {
      return res.status(400).json({ error: 'Customer details not found in session' });
    }

    const customerEmail = session.customer_details.email;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email not found in session' });
    }

    console.log('Customer email:', customerEmail);

    // Create order data
    const orderData = {
      orderId: session.payment_intent,
      total: session.amount_total / 100, // Convert from cents to dollars
      courseTitle: session.line_items.data[0].description,
      description: "Course purchase",
    };

    // Generate PDF
    const pdfBuffer = await generatePDF(orderData);

    // Send email
    await mailSender(
      customerEmail, 
      "Order Confirmation",
      "<p>Thank you for your purchase. Please find your invoice attached.</p>",
      [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ]
    );

    res.status(200).json({
      message: "Payment successful and invoice sent",
      orderId: orderData.orderId,
    });
  } catch (error) {
    console.error("Error processing successful payment:", error);
    res.status(500).json({ error: "Failed to process payment", details: error.message });
  }
};


function generatePDF(orderData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (buffer) => buffers.push(buffer));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Add course title and description to PDF
    doc.fontSize(18).text(`Invoice for Order #${orderData.orderId}`, 100, 80);
    doc.fontSize(14).text(`Course Title: ${orderData.courseTitle}`, 100, 120);
    doc.fontSize(14).text(`Description: ${orderData.description}`, 100, 140);
    doc.fontSize(14).text(`Total Amount: $${orderData.total}`, 100, 160);
    // Add more invoice details here

    doc.end();
  });
}
