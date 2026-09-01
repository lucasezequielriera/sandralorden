import PDFDocument from "pdfkit";
import type { MediaKitSettings, MediaKitLocaleBlock } from "@/lib/media-kit-settings";
import { PRESS_ITEMS, MEDIA_LOGOS } from "@/lib/press-items";

type PdfLabels = {
  title: string;
  stats: string;
  clients: string;
  years: string;
  press: string;
  outlets: string;
  bio: string;
  audience: string;
  metrics: string;
  followers: string;
  engagement: string;
  reach: string;
  impressions: string;
  expertise: string;
  pricing: string;
  format: string;
  price: string;
  notes: string;
  collabs: string;
  contact: string;
  onRequest: string;
};

const LABELS: Record<string, PdfLabels> = {
  es: {
    title: "Media Kit — Sandra Lorden",
    stats: "Cifras clave",
    clients: "Clientes",
    years: "Experiencia",
    press: "Prensa",
    outlets: "Medios",
    bio: "Perfil profesional",
    audience: "Audiencia",
    metrics: "Métricas y redes",
    followers: "Seguidores",
    engagement: "Engagement",
    reach: "Visualizaciones/mes",
    impressions: "Visualizaciones de no seguidores",
    expertise: "Expertise",
    pricing: "Tarifas de colaboración",
    format: "Formato",
    price: "Tarifa",
    notes: "Notas",
    collabs: "Formatos de colaboración",
    contact: "Contacto",
    onRequest: "Bajo solicitud",
  },
  en: {
    title: "Media Kit — Sandra Lorden",
    stats: "Key figures",
    clients: "Clients",
    years: "Experience",
    press: "Press",
    outlets: "Outlets",
    bio: "Professional profile",
    audience: "Audience",
    metrics: "Metrics & social",
    followers: "Followers",
    engagement: "Engagement",
    reach: "Views/month",
    impressions: "Non-follower views",
    expertise: "Expertise",
    pricing: "Collaboration rates",
    format: "Format",
    price: "Rate",
    notes: "Notes",
    collabs: "Collaboration formats",
    contact: "Contact",
    onRequest: "On request",
  },
};

function metricOrRequest(value: string, onRequest: string): string {
  return value.trim() ? value.trim() : onRequest;
}

export async function generateMediaKitPdf(
  settings: MediaKitSettings,
  locale: string
): Promise<Buffer> {
  const labels = LABELS[locale === "en" ? "en" : "es"];
  const block: MediaKitLocaleBlock = locale === "en" ? settings.en : settings.es;
  const pressCount = PRESS_ITEMS.length;
  const outletCount = MEDIA_LOGOS.length;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc.fontSize(22).fillColor("#3D2C2C").text(labels.title, { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#8A7A7A").text("Entrenadora Personal & Nutricionista · Madrid");
    doc.moveDown(1);

    doc.fontSize(13).fillColor("#3D2C2C").text(labels.stats);
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor("#5C4F4F");
    doc.text(
      `${labels.clients}: ${settings.stats.clients}  ·  ${labels.years}: ${settings.stats.years}  ·  ${labels.press}: ${pressCount}  ·  ${labels.outlets}: ${outletCount}`
    );
    doc.moveDown(1);

    doc.fontSize(13).fillColor("#3D2C2C").text(labels.metrics);
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor("#5C4F4F");
    const metricLines = [
      `@sandralordenfit — ${labels.followers}: ${metricOrRequest(settings.metrics.igFitFollowers, labels.onRequest)}`,
      `@sandralorden — ${labels.followers}: ${metricOrRequest(settings.metrics.igPersonalFollowers, labels.onRequest)}`,
      `${labels.engagement}: ${metricOrRequest(settings.metrics.igEngagement, labels.onRequest)}`,
    ];
    if (settings.metrics.igReach.trim()) metricLines.push(`${labels.reach}: ${settings.metrics.igReach}`);
    if (settings.metrics.igImpressions.trim()) metricLines.push(`${labels.impressions}: ${settings.metrics.igImpressions}`);
    if (settings.metrics.tiktokFollowers.trim()) metricLines.push(`TikTok: ${settings.metrics.tiktokFollowers}`);
    if (settings.metrics.linkedinFollowers.trim()) metricLines.push(`LinkedIn: ${settings.metrics.linkedinFollowers}`);
    if (settings.metrics.youtubeSubscribers.trim()) metricLines.push(`YouTube: ${settings.metrics.youtubeSubscribers}`);
    metricLines.forEach((line) => doc.text(line));
    doc.moveDown(1);

    doc.fontSize(13).fillColor("#3D2C2C").text(labels.bio);
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor("#5C4F4F").text(block.bioParagraph1, { width: pageWidth });
    doc.moveDown(0.3);
    doc.text(block.bioParagraph2, { width: pageWidth });
    doc.moveDown(1);

    doc.fontSize(13).fillColor("#3D2C2C").text(labels.audience);
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor("#5C4F4F");
    block.audienceBullets.forEach((bullet) => doc.text(`· ${bullet}`, { width: pageWidth }));
    doc.moveDown(1);

    doc.fontSize(13).fillColor("#3D2C2C").text(labels.expertise);
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor("#5C4F4F").text(block.expertiseItems.join(" · "));
    doc.moveDown(1);

    if (settings.showPricing && block.pricingItems.some((p) => p.format.trim())) {
      doc.fontSize(13).fillColor("#3D2C2C").text(labels.pricing);
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#5C4F4F");
      block.pricingItems.forEach((item) => {
        const price = item.price.trim() || labels.onRequest;
        doc.text(`${item.format} — ${labels.price}: ${price}${item.notes.trim() ? ` (${item.notes})` : ""}`, {
          width: pageWidth,
        });
      });
      if (block.pricingNote.trim()) {
        doc.moveDown(0.3);
        doc.fontSize(9).fillColor("#8A7A7A").text(block.pricingNote, { width: pageWidth });
      }
      doc.moveDown(1);
    }

    doc.fontSize(13).fillColor("#3D2C2C").text(labels.collabs);
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor("#5C4F4F");
    block.collabItems.forEach((item) => {
      doc.text(`${item.title}: ${item.description}`, { width: pageWidth });
      doc.moveDown(0.2);
    });
    if (block.collabNote.trim()) {
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#8A7A7A").text(block.collabNote, { width: pageWidth });
    }
    doc.moveDown(1);

    doc.fontSize(13).fillColor("#3D2C2C").text(labels.contact);
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor("#5C4F4F");
    doc.text(settings.contact.email);
    doc.text(settings.contact.phone);
    doc.text(settings.contact.siteUrl);
    doc.text(settings.contact.instagramPro);

    doc.end();
  });
}
