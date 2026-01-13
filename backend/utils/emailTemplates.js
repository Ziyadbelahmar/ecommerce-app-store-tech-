const orderConfirmationEmail = (order, user) => {
  const productsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #2a2a2a;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="${item.image || 'https://via.placeholder.com/80'}" 
               alt="${item.name}" 
               style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; background: #1a1a1a;">
          <div>
            <h4 style="margin: 0 0 5px 0; color: #fff; font-size: 16px;">${item.name}</h4>
            <p style="margin: 5px 0 0 0; color: #c4ff0d; font-size: 14px; font-weight: 600;">
              Quantity: ${item.quantity}
            </p>
          </div>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #2a2a2a; text-align: right;">
        <p style="margin: 0; color: #fff; font-size: 18px; font-weight: 700;">
          $${(item.price * item.quantity).toFixed(2)}
        </p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">
          $${item.price.toFixed(2)} each
        </p>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0a0a0a;">
        <tr>
          <td style="padding: 40px 20px;">
            
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%); border: 2px solid #c4ff0d; border-radius: 16px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #c4ff0d 0%, #9fff00 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #000; font-size: 32px; font-weight: 900;">
                    🎉 ORDER CONFIRMED!
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #000; font-size: 16px; font-weight: 600;">
                    Thank you for your purchase, ${user.name}!
                  </p>
                </td>
              </tr>

              <!-- Order Info -->
              <tr>
                <td style="padding: 30px;">
                  <div style="background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                    <h2 style="margin: 0 0 15px 0; color: #c4ff0d; font-size: 18px; font-weight: 800;">
                      ORDER DETAILS
                    </h2>
                    <table style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Number:</td>
                        <td style="padding: 8px 0; color: #fff; font-size: 14px; font-weight: 700; text-align: right;">
                          #${order.orderNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Date:</td>
                        <td style="padding: 8px 0; color: #fff; font-size: 14px; font-weight: 700; text-align: right;">
                          ${new Date(order.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Payment Status:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="background: #c4ff0d; color: #000; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 800;">
                            ${order.paymentStatus.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Products -->
                  <h2 style="margin: 0 0 20px 0; color: #fff; font-size: 20px; font-weight: 800;">
                    YOUR ITEMS
                  </h2>
                  <table style="width: 100%; background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden;">
                    ${productsHTML}
                  </table>

                  <!-- Totals -->
                  <div style="background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-top: 20px;">
                    <table style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 15px;">Subtotal:</td>
                        <td style="padding: 8px 0; color: #fff; font-size: 15px; font-weight: 600; text-align: right;">
                          $${order.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 15px;">Shipping:</td>
                        <td style="padding: 8px 0; color: #fff; font-size: 15px; font-weight: 600; text-align: right;">
                          $${order.shippingCost.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 15px;">Tax:</td>
                        <td style="padding: 8px 0; color: #fff; font-size: 15px; font-weight: 600; text-align: right;">
                          $${order.tax.toFixed(2)}
                        </td>
                      </tr>
                      <tr style="border-top: 2px solid #c4ff0d;">
                        <td style="padding: 15px 0 0 0; color: #c4ff0d; font-size: 18px; font-weight: 800;">TOTAL:</td>
                        <td style="padding: 15px 0 0 0; color: #c4ff0d; font-size: 24px; font-weight: 900; text-align: right;">
                          $${order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Shipping Address -->
                  <div style="background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-top: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #c4ff0d; font-size: 16px; font-weight: 800;">
                      📦 SHIPPING ADDRESS
                    </h3>
                    <p style="margin: 0; color: #fff; font-size: 14px; line-height: 1.6;">
                      ${order.shippingAddress.fullName}<br>
                      ${order.shippingAddress.addressLine1}<br>
                      ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
                      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                      ${order.shippingAddress.country}<br>
                      Phone: ${order.shippingAddress.phone}
                    </p>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" 
                       style="display: inline-block; background: #c4ff0d; color: #000; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 800;">
                      VIEW ORDER DETAILS
                    </a>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                    Questions? Contact us at 
                    <a href="mailto:support@techstore.com" style="color: #c4ff0d; text-decoration: none;">support@techstore.com</a>
                  </p>
                  <p style="margin: 0; color: #666; font-size: 12px;">
                    © 2026 TechStore. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};

module.exports = {
  orderConfirmationEmail
};
