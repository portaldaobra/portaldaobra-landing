import { useEffect } from "react";
import { getSiteSettings } from "@/lib/content";
import type { SettingRow } from "@/lib/cms";

const SEO_KEYS = [
  "seo_default_description",
  "seo_keywords",
  "seo_author",
  "seo_default_robots",
  "seo_default_canonical",
  "seo_canonical_domain",
  "seo_default_share_image",
  "tracking_ga4_id",
  "tracking_gtm_id",
  "tracking_meta_pixel_id",
  "tracking_linkedin_partner_id",
  "tracking_clarity_id",
  "verify_google",
  "verify_bing",
  "verify_pinterest",
  "verify_extra_meta",
  "og_title",
  "og_description",
  "og_image",
  "og_url",
  "twitter_card",
  "twitter_title",
  "twitter_description",
  "twitter_image",
  "custom_script_head",
  "custom_script_body_start",
  "custom_script_body_end",
] as const;

type SettingsMap = Partial<Record<(typeof SEO_KEYS)[number], string>>;

const MARKER = "data-portal-seo";

/** Strip <script>, on*= handlers and javascript: URIs from user-supplied HTML. */
function sanitizeHtml(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

function upsertMeta(attr: "name" | "property", name: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${name}"][${MARKER}]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    el.setAttribute(MARKER, "1");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function appendInlineScript(parent: HTMLElement, code: string, id: string) {
  if (!code) return;
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.setAttribute(MARKER, "1");
  s.text = code;
  parent.appendChild(s);
}

function appendExternalScript(src: string, id: string, async = true) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = async;
  s.setAttribute(MARKER, "1");
  document.head.appendChild(s);
}

function clearManaged() {
  document.head.querySelectorAll(`[${MARKER}]`).forEach((n) => n.remove());
  document.body
    .querySelectorAll(`[${MARKER}]`)
    .forEach((n) => n.remove());
}

function applySettings(s: SettingsMap) {
  clearManaged();

  // ---- Meta defaults ----
  if (s.seo_default_description) upsertMeta("name", "description", s.seo_default_description);
  if (s.seo_keywords) upsertMeta("name", "keywords", s.seo_keywords);
  if (s.seo_author) upsertMeta("name", "author", s.seo_author);
  if (s.seo_default_robots) upsertMeta("name", "robots", s.seo_default_robots);

  // ---- Open Graph / Twitter ----
  if (s.og_title) upsertMeta("property", "og:title", s.og_title);
  if (s.og_description) upsertMeta("property", "og:description", s.og_description);
  if (s.og_url) upsertMeta("property", "og:url", s.og_url);
  const ogImage = s.og_image || s.seo_default_share_image;
  if (ogImage) upsertMeta("property", "og:image", ogImage);

  if (s.twitter_card) upsertMeta("name", "twitter:card", s.twitter_card);
  if (s.twitter_title) upsertMeta("name", "twitter:title", s.twitter_title);
  if (s.twitter_description) upsertMeta("name", "twitter:description", s.twitter_description);
  const twImage = s.twitter_image || s.seo_default_share_image;
  if (twImage) upsertMeta("name", "twitter:image", twImage);

  // ---- Property verifications ----
  if (s.verify_google) upsertMeta("name", "google-site-verification", s.verify_google);
  if (s.verify_bing) upsertMeta("name", "msvalidate.01", s.verify_bing);
  if (s.verify_pinterest) upsertMeta("name", "p:domain_verify", s.verify_pinterest);

  if (s.verify_extra_meta) {
    const safe = sanitizeHtml(s.verify_extra_meta);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = safe;
    wrapper.querySelectorAll("meta").forEach((m) => {
      m.setAttribute(MARKER, "1");
      document.head.appendChild(m);
    });
  }

  // ---- Canonical ----
  if (s.seo_default_canonical) {
    const href = s.seo_default_canonical;
    let link = document.head.querySelector<HTMLLinkElement>(
      `link[rel="canonical"][${MARKER}]`,
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      link.setAttribute(MARKER, "1");
      document.head.appendChild(link);
    }
    link.href = href;
  }

  // ---- GA4 ----
  if (s.tracking_ga4_id && /^G-[A-Z0-9]{6,}$/.test(s.tracking_ga4_id)) {
    appendExternalScript(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(s.tracking_ga4_id)}`,
      "portal-seo-ga4-loader",
    );
    appendInlineScript(
      document.head,
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${s.tracking_ga4_id}');`,
      "portal-seo-ga4-init",
    );
  }

  // ---- GTM ----
  if (s.tracking_gtm_id && /^GTM-[A-Z0-9]{5,}$/.test(s.tracking_gtm_id)) {
    appendInlineScript(
      document.head,
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${s.tracking_gtm_id}');`,
      "portal-seo-gtm",
    );
    if (!document.getElementById("portal-seo-gtm-noscript")) {
      const ns = document.createElement("noscript");
      ns.id = "portal-seo-gtm-noscript";
      ns.setAttribute(MARKER, "1");
      ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(s.tracking_gtm_id)}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.prepend(ns);
    }
  }

  // ---- Meta Pixel ----
  if (s.tracking_meta_pixel_id && /^\d+$/.test(s.tracking_meta_pixel_id)) {
    appendInlineScript(
      document.head,
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.tracking_meta_pixel_id}');fbq('track','PageView');`,
      "portal-seo-meta-pixel",
    );
  }

  // ---- LinkedIn Insight ----
  if (s.tracking_linkedin_partner_id && /^\d+$/.test(s.tracking_linkedin_partner_id)) {
    appendInlineScript(
      document.head,
      `_linkedin_partner_id = "${s.tracking_linkedin_partner_id}";window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`,
      "portal-seo-linkedin",
    );
  }

  // ---- Microsoft Clarity ----
  if (s.tracking_clarity_id && /^[a-zA-Z0-9]+$/.test(s.tracking_clarity_id)) {
    appendInlineScript(
      document.head,
      `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window, document, "clarity", "script", "${s.tracking_clarity_id}");`,
      "portal-seo-clarity",
    );
  }

  // ---- Custom scripts (sanitized) ----
  if (s.custom_script_head) {
    const wrap = document.createElement("div");
    wrap.innerHTML = sanitizeHtml(
      // allow <script> here intentionally — head custom slot
      s.custom_script_head.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, ""),
    );
    wrap.childNodes.forEach((n) => {
      if (n instanceof HTMLElement) n.setAttribute(MARKER, "1");
      document.head.appendChild(n);
    });
  }
  if (s.custom_script_body_start) {
    const wrap = document.createElement("div");
    wrap.innerHTML = s.custom_script_body_start.replace(
      /\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
      "",
    );
    Array.from(wrap.childNodes).forEach((n) => {
      if (n instanceof HTMLElement) n.setAttribute(MARKER, "1");
      document.body.prepend(n);
    });
  }
  if (s.custom_script_body_end) {
    const wrap = document.createElement("div");
    wrap.innerHTML = s.custom_script_body_end.replace(
      /\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
      "",
    );
    Array.from(wrap.childNodes).forEach((n) => {
      if (n instanceof HTMLElement) n.setAttribute(MARKER, "1");
      document.body.appendChild(n);
    });
  }
}

export function SeoInjector() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const rows: SettingRow[] = getSiteSettings();
    const map: SettingsMap = {};
    for (const r of rows) {
      if (r.value) (map as Record<string, string>)[r.key] = r.value as string;
    }
    applySettings(map);
  }, []);

  return null;
}
