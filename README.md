# Contact 360 Profile Card for Dynamics 365

A rich, visual contact profile card designed to be embedded directly inside Microsoft Dynamics 365 Sales forms. It gives sales reps and account managers a **single-glance view** of everything they need to know about a contact — right on the record.

## What It Does

When you open a Contact record in Dynamics 365, this card appears and automatically displays:

- **Contact photo & name** — with the ability to upload or change the photo directly from the card.
- **Key details** — email, phone, address, Customer ID, loyalty tier, and segment.
- **NPS & CSAT scores** — quick satisfaction indicators shown as header badges.
- **Relationship Health** — powered by Dynamics 365 Sales Insights, showing the current health status (Good / Fair / Poor), trend direction (Improving / Steady / Declining), and the next and last scheduled interactions.
- **Lifetime Value** — the total monetary value of the customer relationship.
- **Propensity to Purchase** — a score indicating how likely the contact is to buy.
- **Engagement Score** — how actively engaged the contact is with your organization.

### Visual Highlights

- **Loyalty tier badges** — Diamond, Gold, and Silver tiers each have their own animated shimmer effect.
- **Color customization** — a built-in color picker lets you personalize the card's background and text colors.
- **Inline editing** — click on any editable field to update it directly, without leaving the card. Changes save back to Dynamics 365 instantly.
- **Progress bars** — engagement and propensity scores are displayed with color-coded bars for quick visual assessment.

## How to Use It

1. **Upload as a Web Resource** — in your Dynamics 365 environment, go to **Settings → Customizations → Web Resources** and create a new HTML web resource using the `c-360.html` file.
2. **Add to the Contact Form** — open the Contact main form in the form editor, add a **Web Resource** control, and point it to the web resource you just created.
3. **Publish** — save and publish the form. The card will appear automatically whenever someone opens a Contact record.

No additional servers, databases, or installations are required. Everything runs inside Dynamics 365 using the built-in Web API.

## Requirements

- Microsoft Dynamics 365 Sales (online)
- The custom fields referenced in the card (e.g., Lifetime Value, Engagement Score, Propensity to Purchase, Loyalty Tier, Segment) must exist on the Contact entity in your environment
- For Relationship Health data, **Sales Insights** must be enabled in your Dynamics 365 environment
