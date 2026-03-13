import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rhzlqfmzguglcqsemwmg.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4G6G538cvhgEzfnd-6kPhA_li71tNhl'
const supabase = createClient(supabaseUrl, supabaseKey)

function buildEmailHtml(type: 'shipped' | 'problem' | 'lost', order: Record<string, unknown>, isFr: boolean): string {
  const firstName = order.first_name as string
  const lastName = order.last_name as string
  const orderNumber = order.order_number as string
  const address = order.address as string
  const city = order.city as string
  const province = order.province as string
  const postalCode = order.postal_code as string
  const country = order.country as string
  const finalTotal = order.final_total as number

  let title = ''
  let message = ''
  let headerBg = ''
  let statusColor = ''
  let statusText = ''
  let extraContent = ''

  if (type === 'shipped') {
    title = isFr ? 'Votre commande a ete expediee' : 'Your order has been shipped'
    message = isFr
      ? `Bonjour <strong>${firstName}</strong>, votre commande <strong>#${orderNumber}</strong> a ete remise a Postes Canada et est en route vers vous.`
      : `Hi <strong>${firstName}</strong>, your order <strong>#${orderNumber}</strong> has been handed to Canada Post and is on its way to you.`
    headerBg = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
    statusColor = '#1e40af'
    statusText = isFr ? 'Expediee' : 'Shipped'

    const orderDate = new Date(order.order_date as string)
    const estimatedStart = new Date(orderDate)
    estimatedStart.setDate(estimatedStart.getDate() + 2)
    const estimatedEnd = new Date(orderDate)
    estimatedEnd.setDate(estimatedEnd.getDate() + 3)
    const months = isFr
      ? ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const estimatedDelivery = isFr
      ? `${estimatedStart.getDate()}-${estimatedEnd.getDate()} ${months[estimatedStart.getMonth()]}`
      : `${months[estimatedStart.getMonth()]} ${estimatedStart.getDate()}-${estimatedEnd.getDate()}`

    extraContent = `
      <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-top: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #888;">${isFr ? 'Transporteur' : 'Carrier'}</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #1a1a1a;">Canada Post</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #888;">${isFr ? 'Livraison estimee' : 'Estimated Delivery'}</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #16a34a;">${estimatedDelivery}</td>
          </tr>
        </table>
      </div>
    `
  } else if (type === 'problem') {
    title = isFr ? 'Probleme avec votre livraison' : 'Delivery Problem'
    message = isFr
      ? `Bonjour <strong>${firstName}</strong>, nous avons ete informes d\'un probleme avec la livraison de votre commande <strong>#${orderNumber}</strong>. Votre colis semble avoir ete perdu en cours de route par Postes Canada. Nous suivons la situation de pres et vous tiendrons informe dans les prochaines heures.`
      : `Hi <strong>${firstName}</strong>, we have been notified of an issue with the delivery of your order <strong>#${orderNumber}</strong>. Your package appears to have been lost in transit by Canada Post. We are closely monitoring the situation and will keep you updated within the next few hours.`
    headerBg = 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)'
    statusColor = '#c2410c'
    statusText = isFr ? 'Probleme de livraison' : 'Delivery Issue'
    extraContent = `
      <div style="background: #fff7ed; border-left: 4px solid #ea580c; border-radius: 0 12px 12px 0; padding: 16px 20px; margin-top: 20px;">
        <p style="margin: 0; color: #9a3412; font-size: 14px; font-weight: 600;">${isFr ? 'Que se passe-t-il ?' : 'What happened?'}</p>
        <p style="margin: 8px 0 0; color: #9a3412; font-size: 14px;">
          ${isFr ? 'Postes Canada nous a signale que votre colis a ete perdu durant le transit. Notre equipe est en contact avec le transporteur pour tenter de localiser votre colis.' : 'Canada Post has reported that your package was lost during transit. Our team is in contact with the carrier to try to locate your package.'}
        </p>
      </div>
    `
  } else {
    title = isFr ? 'Commande perdue - Remboursement integral' : 'Package Lost - Full Refund'
    message = isFr
      ? `Bonjour <strong>${firstName}</strong>, nous sommes desoles de vous informer que votre commande <strong>#${orderNumber}</strong> a ete officiellement declaree perdue par Postes Canada. Nous procedons a un remboursement integral de votre commande.`
      : `Hi <strong>${firstName}</strong>, we are sorry to inform you that your order <strong>#${orderNumber}</strong> has been officially declared lost by Canada Post. We are processing a full refund for your order.`
    headerBg = 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)'
    statusColor = '#991b1b'
    statusText = isFr ? 'Colis perdu' : 'Package Lost'
    extraContent = `
      <div style="background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 0 12px 12px 0; padding: 16px 20px; margin-top: 20px;">
        <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">${isFr ? 'Remboursement' : 'Refund Details'}</p>
        <p style="margin: 8px 0 0; color: #991b1b; font-size: 14px;">
          ${isFr ? `Vous recevrez un remboursement de <strong>$${finalTotal.toFixed(2)}</strong> par Interac e-Transfer a votre adresse email dans un delai de 1 jour ouvrable. Aucune action de votre part n\'est requise.` : `You will receive a refund of <strong>$${finalTotal.toFixed(2)}</strong> via Interac e-Transfer to your email address within 1 business day. No action is required on your part.`}
        </p>
      </div>
      <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-top: 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #888;">${isFr ? 'Montant rembourse' : 'Refund Amount'}</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #16a34a; font-size: 18px;">$${finalTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #888;">${isFr ? 'Methode' : 'Method'}</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #1a1a1a;">Interac e-Transfer</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #888;">${isFr ? 'Delai' : 'Timeline'}</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #1a1a1a;">${isFr ? '1 jour ouvrable' : '1 business day'}</td>
          </tr>
        </table>
      </div>
    `
  }

  return `
  <!DOCTYPE html>
  <html lang="${isFr ? 'fr' : 'en'}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: ${headerBg}; border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 24px; letter-spacing: -0.5px;">Purrball</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">${isFr ? 'Jouets et fournitures premium pour chats' : 'Premium Cat Toys & Supplies'}</p>
      </div>

      <!-- Main Content -->
      <div style="background: #fff; padding: 32px; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5;">

        <!-- Status Badge -->
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; background: ${statusColor}; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">${statusText}</span>
        </div>

        <h2 style="text-align: center; color: #1a1a1a; font-size: 22px; margin: 0 0 8px;">${title}</h2>
        <p style="text-align: center; color: #666; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
          ${message}
        </p>

        <!-- Order Info -->
        <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #888;">${isFr ? 'Numero de commande' : 'Order Number'}</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #1a1a1a;">#${orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #888;">Total</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #1a1a1a;">$${finalTotal.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- Shipping Address -->
        <div style="background: #fafafa; border-radius: 12px; padding: 20px;">
          <h3 style="font-size: 14px; color: #888; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">${isFr ? 'Adresse de livraison' : 'Shipping Address'}</h3>
          <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.6;">
            ${firstName} ${lastName}<br>
            ${address}<br>
            ${city}, ${province} ${postalCode}<br>
            ${country}
          </p>
        </div>

        ${extraContent}

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
}

export async function GET() {
  if (!resend) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  try {
    // Fetch all orders that haven't completed all email stages (stage < 4)
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .lt('email_stage', 4)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: 'No emails to send', sent: 0 })
    }

    let sentCount = 0

    for (const order of orders) {
      const orderDate = new Date(order.order_date)
      const now = new Date()
      const daysSince = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      const currentStage = order.email_stage || 1
      const isFr = order.locale === 'fr'

      // Check if we already sent an email today for this order
      const lastEmailSent = order.last_email_sent ? new Date(order.last_email_sent) : null
      const today = new Date().toDateString()
      const lastEmailToday = lastEmailSent && lastEmailSent.toDateString() === today

      if (lastEmailToday) {
        continue // Skip if we already sent an email today
      }

      let emailType: 'shipped' | 'problem' | 'lost' | null = null
      let newStage = currentStage
      let subject = ''

      // Stage 1 = confirmation sent, check if shipped email needed (1 day)
      if (currentStage === 1 && daysSince >= 1) {
        emailType = 'shipped'
        newStage = 2
        subject = isFr
          ? `Commande expediee - Purrball #${order.order_number}`
          : `Order Shipped - Purrball #${order.order_number}`
      }
      // Stage 2 = shipped sent, check if problem email needed (3 days)
      else if (currentStage === 2 && daysSince >= 3) {
        emailType = 'problem'
        newStage = 3
        subject = isFr
          ? `Probleme de livraison - Purrball #${order.order_number}`
          : `Delivery Problem - Purrball #${order.order_number}`
      }
      // Stage 3 = problem sent, check if lost email needed (4 days)
      else if (currentStage === 3 && daysSince >= 4) {
        emailType = 'lost'
        newStage = 4
        subject = isFr
          ? `Commande perdue - Remboursement - Purrball #${order.order_number}`
          : `Package Lost - Refund - Purrball #${order.order_number}`
      }

      if (emailType) {
        const html = buildEmailHtml(emailType, order, isFr)

        const { error: sendError } = await resend.emails.send({
          from: 'Purrball <noreply@bettercleans.ca>',
          to: [order.email],
          subject,
          html,
        })

        if (sendError) {
          console.error(`Failed to send ${emailType} email for order ${order.order_number}:`, sendError)
          continue
        }

        // Update email_stage and last_email_sent in Supabase
        await supabase
          .from('orders')
          .update({ 
            email_stage: newStage,
            last_email_sent: new Date().toISOString()
          })
          .eq('order_number', order.order_number)

        sentCount++
        console.log(`Sent ${emailType} email for order ${order.order_number} (stage ${currentStage} -> ${newStage})`)
      }
    }

    return NextResponse.json({ message: `Processed ${orders.length} orders, sent ${sentCount} emails`, sent: sentCount })
  } catch (e) {
    console.error('Cron email error:', e)
    return NextResponse.json({ error: 'Failed to process emails' }, { status: 500 })
  }
}
