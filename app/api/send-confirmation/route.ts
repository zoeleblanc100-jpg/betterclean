import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderNumber, email, firstName, lastName, items, total, tax, finalTotal, address, city, province, postalCode, country, orderDate, locale } = body

    const isFr = locale === 'fr'

    const estimatedStart = new Date(orderDate)
    estimatedStart.setDate(estimatedStart.getDate() + 2)
    const estimatedEnd = new Date(orderDate)
    estimatedEnd.setDate(estimatedEnd.getDate() + 3)
    const months = isFr
      ? ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const estimatedDelivery = isFr
      ? `${estimatedStart.getDate()}-${estimatedEnd.getDate()} ${months[estimatedStart.getMonth()]} ${estimatedStart.getFullYear()}`
      : `${months[estimatedStart.getMonth()]} ${estimatedStart.getDate()}-${estimatedEnd.getDate()}, ${estimatedStart.getFullYear()}`

    const dateLocale = isFr ? 'fr-CA' : 'en-CA'
    const orderDateFormatted = new Date(orderDate).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })

    const itemsHtml = items.map((item: { name: string; quantity: number; price: number; image?: string }) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${item.image ? `<td style="padding-right: 12px; vertical-align: middle;"><img src="${item.image}" alt="${item.name}" width="50" height="50" style="border-radius: 8px; display: block; object-fit: cover;" /></td>` : ''}
              <td style="vertical-align: middle;">
                <p style="margin: 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">${item.name}</p>
                <p style="margin: 2px 0 0; color: #888; font-size: 13px;">${isFr ? 'Qte' : 'Qty'}: ${item.quantity}</p>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 600; color: #1a1a1a; vertical-align: middle;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('')

    const html = `
    <!DOCTYPE html>
    <html lang="${isFr ? 'fr' : 'en'}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 24px; letter-spacing: -0.5px;">Purrball</h1>
          <p style="margin: 8px 0 0; color: #ccc; font-size: 14px;">${isFr ? 'Jouets et fournitures premium pour chats' : 'Premium Cat Toys & Supplies'}</p>
        </div>

        <!-- Main Content -->
        <div style="background: #fff; padding: 32px; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5;">

          <h2 style="text-align: center; color: #1a1a1a; font-size: 22px; margin: 0 0 8px;">${isFr ? 'Commande confirmee' : 'Order Confirmed'}</h2>
          <p style="text-align: center; color: #666; font-size: 14px; margin: 0 0 24px;">
            ${isFr ? `Merci, <strong>${firstName}</strong> ! Votre commande a bien ete recue.` : `Thank you, <strong>${firstName}</strong>! Your order has been received.`}
          </p>

          <!-- Order Info Box -->
          <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #888;">${isFr ? 'Numero de commande' : 'Order Number'}</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #1a1a1a;">#${orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #888;">Date</td>
                <td style="padding: 4px 0; text-align: right; color: #1a1a1a;">${orderDateFormatted}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #888;">${isFr ? 'Livraison estimee' : 'Estimated Delivery'}</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #16a34a;">${estimatedDelivery}</td>
              </tr>
            </table>
          </div>

          <!-- Items -->
          <h3 style="font-size: 16px; color: #1a1a1a; margin: 0 0 12px;">${isFr ? 'Articles commandes' : 'Items Ordered'}</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
            ${itemsHtml}
          </table>

          <!-- Totals -->
          <div style="margin-top: 20px; padding-top: 16px; border-top: 2px solid #f0f0f0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #888;">${isFr ? 'Sous-total' : 'Subtotal'}</td>
                <td style="padding: 4px 0; text-align: right; color: #1a1a1a;">$${total.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #888;">${isFr ? 'Taxes' : 'Tax'}</td>
                <td style="padding: 4px 0; text-align: right; color: #1a1a1a;">$${tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #888;">${isFr ? 'Livraison' : 'Shipping'}</td>
                <td style="padding: 4px 0; text-align: right; color: #16a34a; font-weight: 600;">${isFr ? 'GRATUIT' : 'FREE'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0 4px; font-size: 16px; font-weight: 700; color: #1a1a1a;">Total</td>
                <td style="padding: 12px 0 4px; text-align: right; font-size: 18px; font-weight: 700; color: #1a1a1a;">$${finalTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- Shipping Address -->
          <div style="margin-top: 24px; background: #fafafa; border-radius: 12px; padding: 20px;">
            <h3 style="font-size: 14px; color: #888; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">${isFr ? 'Adresse de livraison' : 'Shipping Address'}</h3>
            <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.6;">
              ${firstName} ${lastName}<br>
              ${address}<br>
              ${city}, ${province} ${postalCode}<br>
              ${country}
            </p>
          </div>

          <!-- Track Order Button -->
          <div style="text-align: center; margin-top: 28px;">
            <a href="https://bettercleans.ca/suivi" style="display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px;">
              ${isFr ? 'Suivre ma commande' : 'Track Your Order'}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #fafafa; border-radius: 0 0 16px 16px; padding: 24px 32px; border: 1px solid #e5e5e5; border-top: none; text-align: center;">
          <p style="margin: 0 0 8px; color: #888; font-size: 13px;">
            ${isFr ? 'Des questions ? Repondez a cet email ou contactez-nous sur notre site.' : 'Questions? Reply to this email or chat with us on our website.'}
          </p>
          <p style="margin: 0; color: #aaa; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Purrball &mdash; Vancouver, BC, Canada
          </p>
        </div>

      </div>
    </body>
    </html>
    `

    if (!resend) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const subject = isFr
      ? `Commande confirmee - Purrball #${orderNumber}`
      : `Order Confirmed - Purrball #${orderNumber}`

    const { data, error } = await resend.emails.send({
      from: 'Purrball <noreply@bettercleans.ca>',
      to: [email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (e) {
    console.error('Email send error:', e)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
