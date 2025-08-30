import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  console.log('[EMAIL] Starting email send process...')
  console.log('[EMAIL] Environment:', process.env.NODE_ENV)
  console.log('[EMAIL] SMTP Config:', {
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT || '587',
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER ? '***configured***' : 'not configured',
    pass: process.env.SMTP_PASS ? '***configured***' : 'not configured',
    from: process.env.SMTP_FROM || 'noreply@finanzaspareja.com'
  })

  try {
    // Send email in both development and production
    console.log('[EMAIL] Attempting to send email...')
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@finanzaspareja.com',
      to,
      subject,
      html,
    })

    console.log('[EMAIL] Email sent successfully:', info.messageId)
    
    // Also log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`
=== EMAIL VERIFICATION (DEV MODE - BUT SENT) ===
To: ${to}
Subject: ${subject}
MessageId: ${info.messageId}
==================================================
      `)
    }

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('[EMAIL] Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export function generateVerificationEmailHtml(name: string, verificationLink: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Email - Finanzas Pareja</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
            <div style="color: white; font-size: 24px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px;">
              ❤️ Finanzas Pareja
            </div>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 20px;">¡Hola ${name}!</h1>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              ¡Bienvenido/a a Finanzas Pareja! Estamos emocionados de que te unas a nuestra comunidad de parejas que gestionan sus finanzas de manera inteligente.
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Para completar tu registro y verificar tu cuenta, haz clic en el siguiente botón:
            </p>
            
            <!-- Verification Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Verificar mi Email
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
              <a href="${verificationLink}" style="color: #3b82f6; word-break: break-all;">${verificationLink}</a>
            </p>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              Este enlace expira en 24 horas por seguridad. Si no fuiste tú quien creó esta cuenta, puedes ignorar este mensaje.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              © 2025 Finanzas Pareja. Construyendo futuros financieros juntos.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}