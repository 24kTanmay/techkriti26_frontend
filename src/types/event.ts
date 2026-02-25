/* ─── Shared Event Types ─── */

export interface Contact {
    name: string
    number: string
}

export interface TabConfig {
    id: string
    label: string
}

export interface MetaItem {
    label: string
    value: string
}

export interface DownloadConfig {
    title: string
    subtitle: string
}

export interface EventDetailData {
    /** Page title displayed in the header (e.g. "IARC", "SKYSPARKS") */
    title: string
    /** Breadcrumb trail (e.g. "Technical / Robogames / ID-01") */
    breadcrumb: string
    /** Unique canvas ID for the star background */
    canvasId: string
    /** Tab definitions */
    tabs: TabConfig[]
    /** Contact persons */
    contacts: Contact[]
    /** Overview content */
    overview: {
        paragraphs: string[]
        /** Optional highlighted text within paragraphs (rendered as <span class="pane-highlight-{theme}">) */
        highlight?: string
        meta: MetaItem[]
    }
    /** Second tab content (Problem Statement / Rules) */
    secondTab?: {
        description: string
        download?: DownloadConfig
    }
    /** Optional: custom ambient gradient for terminal theme */
    ambientGradient?: string
    /** Optional: image background gradient for terminal theme (no image URL) */
    imageFallbackGradient?: string
    /** Optional: image URL to display */
    image?: string
}

/* ─── Category Grid Types ─── */

export interface GridEventCardData {
    title: string
    desc: string
    image: string
    number: string
    href: string
}

export interface CategoryGridData {
    /** Page title (e.g. "Robogames", "Takeoff") */
    title: string
    /** Hero description */
    description: string
    /** Breadcrumb segments (e.g. ["Competitions", "Technical", "Robogames"]) */
    breadcrumbs: { label: string; href?: string }[]
    /** Unique canvas ID */
    canvasId: string
    /** Event cards to display */
    events: GridEventCardData[]
    /** CTA button text on cards (e.g. "Enter Arena", "Enter Hangar") */
    ctaText?: string
    /** Optional ambient gradient override */
    ambientGradient?: string
}
