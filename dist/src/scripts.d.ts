/**
 * Analytics and Third-Party Script Components for TanStack Start
 *
 * Provides components for integrating analytics and other third-party scripts.
 * Uses safe external script loading patterns - no inline scripts.
 */
import React from 'react';
export type AnalyticsConfig = {
    /**
     * Analytics provider type
     */
    provider: 'plausible' | 'google-analytics' | 'custom';
    /**
     * Provider-specific configuration
     */
    config: {
        /**
         * Site domain for Plausible
         */
        domain?: string;
        /**
         * Measurement ID for Google Analytics
         */
        measurementId?: string;
        /**
         * Custom script URL
         */
        src?: string;
        /**
         * Enable in development
         * @default false
         */
        enableDev?: boolean;
    };
};
/**
 * Analytics script component for various providers
 * Uses external script loading only - no inline scripts for security.
 *
 * @example
 * ```tsx
 * // In __root.tsx
 * <AnalyticsScript
 *   provider="plausible"
 *   config={{ domain: 'example.com' }}
 * />
 * ```
 */
export declare function AnalyticsScript(props: AnalyticsConfig): React.ReactElement | null;
/**
 * Initialize Google Analytics after the script loads.
 * Call this in a useEffect in your root component.
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   initGoogleAnalytics('G-XXXXXXXXXX');
 * }, []);
 * ```
 */
export declare function initGoogleAnalytics(measurementId: string): void;
/**
 * Initialize Microsoft Clarity after loading.
 * Call this in a useEffect in your root component.
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   initClarity('your-project-id');
 * }, []);
 * ```
 */
export declare function initClarity(projectId: string): void;
/**
 * Cloudflare Turnstile script component
 */
export type TurnstileConfig = {
    /**
     * Site key for Turnstile
     */
    siteKey: string;
    /**
     * Callback function name when challenge is solved
     */
    callback?: string;
};
export declare function TurnstileScript(_props: TurnstileConfig): React.ReactElement;
/**
 * Google AdSense meta tag component
 */
export type AdsenseConfig = {
    /**
     * AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
     */
    publisherId: string;
};
export declare function AdsenseMeta(props: AdsenseConfig): React.ReactElement;
/**
 * Axiom Web Vitals script component
 */
export type AxiomConfig = {
    /**
     * Axiom dataset token
     */
    token: string;
};
export declare function AxiomScript(props: AxiomConfig): React.ReactElement;
/**
 * CSP (Content Security Policy) meta component
 */
export type CSPConfig = {
    /**
     * CSP directives
     */
    directives: Record<string, string[]>;
};
export declare function ContentSecurityPolicy(props: CSPConfig): React.ReactElement;
//# sourceMappingURL=scripts.d.ts.map