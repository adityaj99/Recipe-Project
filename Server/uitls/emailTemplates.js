export const recipeApprovedTemplate = ({
  userName,
  recipeTitle,
  recipeLink,
  appName,
}) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Recipe Approved</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #fdf7f2; color: #333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdf7f2; padding: 30px;">
          <tr>
            <td align="center">
              <table width="600" style="background-color: #fffaf5; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="color: #7a5c44;">🎉 Congratulations, ${userName}!</h2>
                    <p style="font-size: 16px; line-height: 1.6;">
                      Your recipe <strong>"${recipeTitle}"</strong> has been reviewed and approved by our team!
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                      It's now live on the platform and ready to inspire food lovers like you. 💛
                    </p>
                    <div style="margin: 30px 0; text-align: center;">
                      <a href="${recipeLink}" style="background-color: #e7cba9; color: #4e3d2a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                        View Your Recipe
                      </a>
                    </div>
                    <p style="font-size: 14px; color: #666;">Have questions or feedback? Reach out anytime.</p>
                    <p style="font-size: 14px; color: #a38c73; text-align: center; margin-top: 40px;">
                      Bon Appétit!<br>
                      <strong>The ${appName} Team</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f3e6d6; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                    © 2025 ${appName}, All rights reserved.
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

export const recipeRejectedTemplate = ({
  userName,
  recipeTitle,
  appName,
  feedback,
}) => {
  return `
      <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Recipe Rejected</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #fdf7f2; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdf7f2; padding: 30px;">
        <tr>
          <td align="center">
            <table width="600" style="background-color: #fffaf5; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #c14e4e;">😔 We're Sorry, ${userName}</h2>
                  <p style="font-size: 16px; line-height: 1.6;">
                    Your recipe submission <strong>"${recipeTitle}"</strong> was reviewed, but unfortunately, it did not meet the guidelines to be approved at this time.
                  </p>
                  ${
                    feedback
                      ? `<p style="font-size: 16px; line-height: 1.6;"><strong>Reason:</strong> ${feedback}</p>`
                      : ""
                  }
                  <p style="font-size: 16px; line-height: 1.6;">
                    We truly appreciate your effort and creativity. Please review our content guidelines and feel free to resubmit your recipe after making the necessary changes.
                  </p>
                  
                  <p style="font-size: 14px; color: #666;">Need help? Reach out to our support team anytime.</p>
                  <p style="font-size: 14px; color: #a38c73; text-align: center; margin-top: 40px;">
                    Stay inspired and keep cooking!<br>
                    <strong>The ${appName} Team</strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f5ce35; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                  © 2025 ${appName}, All rights reserved.
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
