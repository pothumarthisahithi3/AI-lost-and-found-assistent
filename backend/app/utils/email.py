import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

logger = logging.getLogger("email_service")

def send_match_notification(recipient_email: str, recipient_name: str, lost_item_name: str, found_item_name: str, found_location: str, confidence_score: float):
    """
    Sends email notification when a high-confidence match is detected.
    Gracefully degrades if SMTP credentials are not configured.
    """
    if not settings.SMTP_HOST or not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.warning(
            f"[EMAIL DISABLED] Would send high-confidence match alert ({confidence_score:.1f}%) "
            f"to {recipient_email} for lost item '{lost_item_name}' matching found item '{found_item_name}'."
        )
        print(
            f"\n--- [EMAIL NOTIFICATION SIMULATION] ---\n"
            f"To: {recipient_email}\n"
            f"Subject: High Confidence Match Found for '{lost_item_name}'!\n"
            f"Hi {recipient_name},\n"
            f"We found a potential match ({confidence_score:.1f}% confidence) for your lost item '{lost_item_name}'.\n"
            f"Matched Found Item: {found_item_name}\n"
            f"Location Found: {found_location}\n"
            f"Please log in to your Lost & Found Dashboard to verify and request collection.\n"
            f"----------------------------------------\n"
        )
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🎯 High Confidence Match Found for '{lost_item_name}'!"
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = recipient_email

        text_content = f"""
        Hello {recipient_name},

        Great news! The AI Lost & Found Assistant has detected a strong match ({confidence_score:.1f}% confidence) for your lost item: '{lost_item_name}'.

        Match Details:
        - Found Item: {found_item_name}
        - Found Location: {found_location}

        Please log in to your dashboard to inspect details, verify ownership, and follow collection steps with the Campus Lost & Found Office.

        Best regards,
        Campus Lost & Found Team
        """

        msg.attach(MIMEText(text_content, "plain"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, recipient_email, msg.as_string())

        logger.info(f"Successfully sent match notification email to {recipient_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
        return False
