const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.Checkout = async (req, res) => {
  const { courseId, courseTitle, coursePrice } = req.body;


  try {
    console.log('Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: courseTitle, 
            },
            unit_amount: Math.round(coursePrice * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });

    console.log('Stripe session created successfully:', session.id);
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
  }

};



