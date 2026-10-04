import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const data = req.body || {};

    const clientIp =
      data.ip ||
      (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : '') ||
      req.socket?.remoteAddress ||
      'Unknown IP';

    const city = data.city || 'Unknown City';
    const region = data.region || 'Unknown Region';
    const country = data.country || 'Unknown Country';
    const postal = data.postal ? ` (Postal: ${data.postal})` : '';
    const isp = data.isp || data.org || 'Unknown Provider';
    const device = data.device || 'Unknown Device';
    const os = data.os || 'Unknown OS';
    const browser = data.browser || 'Unknown Browser';
    const referrer = data.referrer || 'Direct / Typed Link';
    const pageUrl = data.pageUrl || 'https://aegis-sheild-zjyg.vercel.app/';
    const timestamp = data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const screen = data.screen || 'N/A';
    const mapsLink =
      data.latitude && data.longitude
        ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city}, ${region}, ${country}`)}`;

    const emailUser = process.env.EMAIL_USER || 'jairajjuly@gmail.com';
    const emailPass = (process.env.EMAIL_PASS || 'fassnyzqzrhmkrqk').replace(/\s+/g, '');
    const targetEmail = 'jairajjuly@gmail.com';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f9fafb; margin: 0; padding: 24px 12px; }
        .wrapper { max-width: 620px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .header { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 28px 24px; text-align: center; border-bottom: 1px solid #374151; }
        .header h1 { margin: 0; font-size: 22px; color: #facc15; font-weight: 800; letter-spacing: 0.5px; }
        .header p { margin: 8px 0 0 0; font-size: 13px; color: #94a3b8; }
        .body-card { padding: 24px; }
        .summary-pill { display: inline-flex; align-items: center; background-color: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); color: #fde047; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; }
        .info-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
        .info-row { background: #1f2937; border-radius: 10px; }
        .info-cell-label { padding: 14px 16px; width: 38%; font-size: 13px; color: #9ca3af; font-weight: 600; border-top-left-radius: 10px; border-bottom-left-radius: 10px; vertical-align: top; }
        .info-cell-val { padding: 14px 16px; font-size: 14px; color: #ffffff; font-weight: 600; border-top-right-radius: 10px; border-bottom-right-radius: 10px; }
        .highlight { color: #38bdf8; font-family: monospace; }
        .location-badge { color: #4ade80; font-weight: 700; }
        .btn-maps { display: inline-block; margin-top: 6px; font-size: 11px; color: #38bdf8; text-decoration: underline; }
        .footer { padding: 16px 24px; text-align: center; font-size: 11px; color: #6b7280; background: #030712; border-top: 1px solid #1f2937; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>🛡️ Aegis Shield — Live Visitor Notification</h1>
          <p>Real-time detection of a new visitor visiting your web link</p>
        </div>
        <div class="body-card">
          <div style="text-align: center;">
            <div class="summary-pill">⚡ New Visitor Detected</div>
          </div>

          <table class="info-table">
            <tr class="info-row">
              <td class="info-cell-label">📍 Geographic Location</td>
              <td class="info-cell-val">
                <span class="location-badge">${city}, ${region}, ${country}${postal}</span>
                <br />
                <a href="${mapsLink}" target="_blank" class="btn-maps">🗺️ View Location on Google Maps &rarr;</a>
              </td>
            </tr>

            <tr class="info-row">
              <td class="info-cell-label">🌐 IP & Provider</td>
              <td class="info-cell-val">
                <span class="highlight">${clientIp}</span>
                <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">ISP: <strong>${isp}</strong></div>
              </td>
            </tr>

            <tr class="info-row">
              <td class="info-cell-label">📱 Device & OS</td>
              <td class="info-cell-val">
                ${device} &bull; <strong>${os}</strong>
                <div style="font-size: 11px; color: #9ca3af; margin-top: 3px;">Screen: ${screen}</div>
              </td>
            </tr>

            <tr class="info-row">
              <td class="info-cell-label">💻 Browser</td>
              <td class="info-cell-val">
                ${browser}
              </td>
            </tr>

            <tr class="info-row">
              <td class="info-cell-label">🔗 Referral Source</td>
              <td class="info-cell-val">
                <span style="color: #cbd5e1;">${referrer}</span>
              </td>
            </tr>

            <tr class="info-row">
              <td class="info-cell-label">⏰ Timestamp & Page</td>
              <td class="info-cell-val">
                <div>${timestamp}</div>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 4px; word-break: break-all;">
                  🔗 <a href="${pageUrl}" style="color: #60a5fa; text-decoration: none;">${pageUrl}</a>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer">
          Automated Visitor Dispatch &bull; Aegis Shield Platform &bull; Sent to <strong>${targetEmail}</strong>
        </div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: `"Aegis Shield Alerts" <${emailUser}>`,
      to: targetEmail,
      subject: `🚨 Live Visitor: ${city}, ${country} | ${device} (${os})`,
      text: `New visitor alert on Aegis Shield!\n\nLocation: ${city}, ${region}, ${country}\nIP: ${clientIp} (${isp})\nDevice: ${device} - ${os}\nBrowser: ${browser}\nReferrer: ${referrer}\nTime: ${timestamp}\nPage: ${pageUrl}`,
      html: htmlContent,
    });

    res.status(200).json({ success: true, message: 'Visitor alert dispatched' });
  } catch (error) {
    console.error('Visitor notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
