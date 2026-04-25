package com.sunline.sunline_backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class EmailService {

    private final WebClient webClient;

    @Value("${brevo.api.key}")
    private String apiKey;

    public EmailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.brevo.com/v3")
                .build();
    }

    public void sendEmail(String to, String subject, String html) {
        try {
            Map<String, Object> body = Map.of(
                    "sender", Map.of("name", "Sunline Restaurant", "email", "djaya21000@gmail.com"),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "htmlContent", html
            );

            webClient.post()
                    .uri("/smtp/email")
                    .header("api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("Email sent to {} via Brevo API", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Reset Your Sunline Password";
        String html = """
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:40px 0;">
                        <table width="520" cellpadding="0" cellspacing="0"
                               style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                          <tr>
                            <td style="background:#1a1a1a;padding:28px 40px;text-align:center;">
                              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:1px;">SUNLINE</h1>
                              <p style="margin:4px 0 0;color:#aaaaaa;font-size:12px;">Restaurant Platform</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:40px;">
                              <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:20px;">Password Reset Request</h2>
                              <p style="margin:0 0 24px;color:#555555;font-size:14px;line-height:1.6;">
                                We received a request to reset the password for your Sunline account.
                                Click the button below to choose a new password.
                              </p>
                              <table cellpadding="0" cellspacing="0" width="100%%">
                                <tr>
                                  <td align="center" style="padding:8px 0 32px;">
                                    <a href="%s"
                                       style="display:inline-block;padding:14px 36px;background:#c8a96e;color:#ffffff;
                                              text-decoration:none;border-radius:6px;font-size:15px;font-weight:bold;
                                              letter-spacing:0.5px;">
                                      Reset Password
                                    </a>
                                  </td>
                                </tr>
                              </table>
                              <p style="margin:0 0 8px;color:#888888;font-size:12px;line-height:1.6;">
                                This link expires in <strong>5 minutes</strong>.
                                If you did not request a password reset, you can safely ignore this email.
                              </p>
                              <p style="margin:0;color:#bbbbbb;font-size:11px;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="%s" style="color:#c8a96e;word-break:break-all;">%s</a>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background:#f9f9f9;padding:16px 40px;text-align:center;
                                        border-top:1px solid #eeeeee;">
                              <p style="margin:0;color:#aaaaaa;font-size:11px;">
                                &copy; 2025 Sunline Restaurant. All rights reserved.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(resetLink, resetLink, resetLink);

        sendEmail(to, subject, html);
    }
}
