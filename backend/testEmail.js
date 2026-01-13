require('dotenv').config();
const transporter = require('./config/emailConfig');

const testEmail = async () => {
  try {
    console.log('📧 Sending test email...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', process.env.EMAIL_USER);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Envoie à toi-même
      subject: '✅ Test Email - TechStore Configuration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="margin: 0; padding: 0; background: #000; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%); border: 2px solid #c4ff0d; border-radius: 16px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #c4ff0d 0%, #9fff00 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 32px; font-weight: 900;">
                🎉 EMAIL FONCTIONNE !
              </h1>
              <p style="margin: 10px 0 0 0; color: #000; font-size: 16px; font-weight: 600;">
                Configuration réussie !
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px; color: #fff;">
              <h2 style="color: #c4ff0d; margin-top: 0;">✅ Félicitations !</h2>
              <p style="line-height: 1.6; color: #ddd;">
                Ton système d'envoi d'email est correctement configuré et fonctionne parfaitement.
              </p>
              
              <div style="background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #c4ff0d; margin-top: 0; font-size: 16px;">📋 DÉTAILS DE CONFIGURATION</h3>
                <table style="width: 100%; color: #ddd; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Email:</td>
                    <td style="padding: 8px 0; text-align: right;">${process.env.EMAIL_USER}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Host:</td>
                    <td style="padding: 8px 0; text-align: right;">${process.env.EMAIL_HOST}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Port:</td>
                    <td style="padding: 8px 0; text-align: right;">${process.env.EMAIL_PORT}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Date:</td>
                    <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString('fr-FR')}</td>
                  </tr>
                </table>
              </div>

              <p style="color: #c4ff0d; font-weight: 700; margin-top: 30px;">
                🚀 Tu peux maintenant envoyer des emails de confirmation de commande !
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                © 2026 TechStore - Test Email System
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    });

    console.log('\n✅ EMAIL ENVOYÉ AVEC SUCCÈS !');
    console.log('📬 Message ID:', info.messageId);
    console.log('✉️ Vérifie ta boîte de réception:', process.env.EMAIL_USER);
    console.log('\n💡 Si tu ne vois pas l\'email, vérifie tes SPAMS\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR lors de l\'envoi:', error.message);
    console.error('\n🔍 Détails de l\'erreur:');
    console.error(error);
    console.error('\n💡 Vérifications:');
    console.error('1. Le mot de passe d\'application est correct (sans espaces)');
    console.error('2. La validation en 2 étapes est activée sur Gmail');
    console.error('3. Les variables .env sont bien chargées\n');
  }
};

testEmail();
