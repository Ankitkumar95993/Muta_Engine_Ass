

exports.OrderSuccess = async (req, res) => {
    const { courseId, courseTitle, coursePrice, email } = req.query;
  
    // Create order data
    const orderData = {
      orderId: Math.random().toString(36).substr(2, 9), // Generate a random order ID
      total: coursePrice
    };
  
    try {
      // Call the ProcessOrder function
      await ProcessOrder({ body: { orderData, email } }, res);
    } catch (error) {
      console.error('Error processing order:', error);
      return res.status(500).json({ message: "Error processing order" });
    }
  
    // Return success response
    res.status(200).json({ message: "Order processed successfully" });
  };
  