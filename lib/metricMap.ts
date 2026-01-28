export type MetricType = "sum" | "latest";

export type MetricDefinition = {
  metric: string;
  label: string;
  type: MetricType;
  key: string;
};

export type SourceKey = "instagram" | "facebook" | "meta_ads" | "google_ads";

export const metricMap: Record<SourceKey, MetricDefinition[]> = {
  instagram: [
    { metric: "followers_count", label: "Seguidores", type: "latest", key: "followers" },
    { metric: "account_day_total_interactions", label: "Interações", type: "sum", key: "interactions" },
    { metric: "account_day_reach", label: "Alcance", type: "sum", key: "reach" },
    { metric: "page_posts_impressions", label: "Impressões", type: "sum", key: "impressions" },
    { metric: "account_day_profile_views", label: "Visitas ao perfil", type: "sum", key: "profile_views" },
    { metric: "account_day_profile_links_taps", label: "Cliques no link", type: "sum", key: "link_clicks" },
    { metric: "reels_posts_count", label: "Reels", type: "sum", key: "reels" },
    { metric: "feed_posts_count", label: "Feed", type: "sum", key: "feed_posts" },
    { metric: "total_comments_total", label: "Comentários", type: "sum", key: "comments" },
    { metric: "total_likes_total", label: "Curtidas", type: "sum", key: "likes" },
  ],
  facebook: [
    { metric: "page_follows", label: "Seguidores", type: "latest", key: "followers" },
    { metric: "page_posts_impressions", label: "Impressões", type: "sum", key: "impressions" },
    { metric: "page_posts_impressions_unique", label: "Alcance", type: "sum", key: "reach" },
    { metric: "page_views_total", label: "Visitas", type: "sum", key: "views" },
    { metric: "page_actions_post_reactions_total", label: "Reações", type: "sum", key: "reactions" },
  ],
  meta_ads: [
    { metric: "spend", label: "Spend", type: "sum", key: "spend" },
    { metric: "impressions", label: "Impressões", type: "sum", key: "impressions" },
    { metric: "reach", label: "Alcance", type: "sum", key: "reach" },
    { metric: "clicks", label: "Cliques", type: "sum", key: "clicks" },
    { metric: "link_click", label: "Cliques no link", type: "sum", key: "link_clicks" },
    { metric: "cpc", label: "CPC", type: "latest", key: "cpc" },
    { metric: "cpm", label: "CPM", type: "latest", key: "cpm" },
    { metric: "ctr", label: "CTR", type: "latest", key: "ctr" },
    { metric: "messaging_conversation_started_7d", label: "Conversas", type: "sum", key: "conversations" },
    { metric: "messaging_first_reply", label: "Leads", type: "sum", key: "leads" },
    { metric: "video_view", label: "Views de vídeo", type: "sum", key: "video_views" },
    { metric: "post_engagement", label: "Engajamento", type: "sum", key: "engagements" },
  ],
  google_ads: [
    { metric: "spend", label: "Spend", type: "sum", key: "spend" },
    { metric: "impressions", label: "Impressões", type: "sum", key: "impressions" },
    { metric: "clicks", label: "Cliques", type: "sum", key: "clicks" },
    { metric: "ctr", label: "CTR", type: "latest", key: "ctr" },
    { metric: "cpc", label: "CPC", type: "latest", key: "cpc" },
    { metric: "cpm", label: "CPM", type: "latest", key: "cpm" },
    { metric: "conversions", label: "Conversões", type: "sum", key: "leads" },
  ],
};

export const sourceLabels: Record<SourceKey, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
};
