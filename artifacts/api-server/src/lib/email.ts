import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGameUpdateEmail(opts: {
  to: string[];
  subject: string;
  headline: string;
  body: string;
  imageUrl?: string | null;
}) {
  if (opts.to.length === 0) return;

  const imageHtml = opts.imageUrl
    ? `<img src="${opts.imageUrl}" alt="Update" style="width:100%;max-width:600px;border-radius:8px;margin:20px 0;" />`
    : "";

  await resend.emails.send({
    from: "ShadowPixel Studios <onboarding@resend.dev>",
    to: opts.to,
    subject: opts.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;color:#f0f0f0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#141414;border-radius:12px;border:1px solid #222;overflow:hidden;">
                  <tr>
                    <td style="background:linear-gradient(135deg,#111,#0a0a0a);padding:40px;text-align:center;border-bottom:2px solid #333;">
                      <div style="font-size:14px;color:#888;text-transform:uppercase;letter-spacing:4px;margin-bottom:8px;">ShadowPixel Studios</div>
                      <div style="font-size:28px;font-weight:900;color:#f0f0f0;letter-spacing:4px;text-transform:uppercase;">${opts.headline}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      ${imageHtml}
                      <p style="margin:0 0 24px;font-size:16px;color:#aaa;line-height:1.7;">${opts.body}</p>
                      <hr style="border:none;border-top:1px solid #222;margin:28px 0;" />
                      <p style="margin:0;font-size:12px;color:#555;text-align:center;">
                        You're receiving this because you subscribed to ShadowPixel Studios updates.<br />
                        Every pixel has a purpose. Every shadow tells a story.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

export async function sendSneakPeekEmail(opts: {
  to: string[];
  title: string;
  description: string;
  imageUrl?: string | null;
}) {
  if (opts.to.length === 0) return;

  const imageHtml = opts.imageUrl
    ? `<img src="${opts.imageUrl}" alt="Sneak Peek" style="width:100%;max-width:600px;border-radius:8px;margin:20px 0;" />`
    : "";

  await resend.emails.send({
    from: "ShadowPixel Studios <onboarding@resend.dev>",
    to: opts.to,
    subject: `🎮 New Sneak Peek: ${opts.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;color:#f0f0f0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#141414;border-radius:12px;border:1px solid #222;overflow:hidden;">
                  <tr>
                    <td style="background:linear-gradient(135deg,#1a0000,#0a0a0a);padding:40px;text-align:center;border-bottom:2px solid #ff3c3c;">
                      <div style="font-size:14px;color:#888;text-transform:uppercase;letter-spacing:4px;margin-bottom:8px;">ShadowPixel Studios</div>
                      <div style="font-size:32px;font-weight:900;color:#f0f0f0;letter-spacing:6px;text-transform:uppercase;">SNEAK PEEK</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 16px;font-size:24px;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">${opts.title}</h2>
                      ${imageHtml}
                      <p style="margin:0 0 24px;font-size:16px;color:#aaa;line-height:1.7;">${opts.description}</p>
                      <hr style="border:none;border-top:1px solid #222;margin:28px 0;" />
                      <p style="margin:0;font-size:12px;color:#555;text-align:center;">
                        You're receiving this because you subscribed to ShadowPixel Studios updates.<br />
                        Every pixel has a purpose. Every shadow tells a story.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
