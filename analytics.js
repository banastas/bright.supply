/**
 * Privacy-conscious Google Analytics 4 runtime for bright.supply.
 * The Google tag loads automatically on production and stays silent elsewhere.
 */

(() => {
    'use strict';

    const MEASUREMENT_ID = 'G-DP3EWLQT9L';
    const GOOGLE_TAG_ID = 'bright-supply-google-tag';
    const PRODUCTION_HOSTS = new Set(['bright.supply', 'www.bright.supply']);
    const isProduction = PRODUCTION_HOSTS.has(window.location.hostname);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    const api = {
        enabled: isProduction,
        track
    };
    window.brightSupplyAnalytics = api;

    if (!isProduction) return;

    loadGoogleTag();
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, pageViewConfiguration());

    window.addEventListener('appinstalled', () => track('pwa_install'));
    if (displayMode() === 'standalone') track('pwa_launch');

    function loadGoogleTag() {
        if (document.getElementById(GOOGLE_TAG_ID)) return;
        const script = document.createElement('script');
        script.id = GOOGLE_TAG_ID;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
        document.head.appendChild(script);
    }

    function pageViewConfiguration() {
        return {
            ...pageContext(),
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            cookie_expires: 7776000,
            cookie_flags: 'SameSite=Lax;Secure',
            debug_mode: new URLSearchParams(window.location.search).get('analytics_debug') === '1',
            send_page_view: true
        };
    }

    function pageContext() {
        return {
            page_title: document.title,
            page_location: sanitizedUrl(window.location.href),
            page_referrer: sanitizedUrl(document.referrer),
            page_kind: document.body?.dataset.pageKind || 'unknown',
            screen_color: document.body?.dataset.colorSlug || 'unknown',
            content_language: document.documentElement.lang || 'unknown',
            display_mode: displayMode()
        };
    }

    function eventContext() {
        const { page_kind, screen_color, content_language, display_mode } = pageContext();
        return { page_kind, screen_color, content_language, display_mode };
    }

    function sanitizedUrl(value) {
        if (!value) return undefined;
        try {
            const url = new URL(value, window.location.origin);
            return `${url.origin}${url.pathname}`;
        } catch (error) {
            return undefined;
        }
    }

    function displayMode() {
        if (document.fullscreenElement || document.webkitFullscreenElement) return 'fullscreen';
        if (window.navigator.standalone === true || window.matchMedia?.('(display-mode: standalone)').matches) {
            return 'standalone';
        }
        return 'browser';
    }

    function track(name, parameters = {}) {
        if (!isProduction || !/^[a-z][a-z0-9_]{0,39}$/.test(name)) return false;
        const normalized = normalizeParameters({ ...eventContext(), ...parameters });
        window.gtag('event', name, normalized);
        return true;
    }

    function normalizeParameters(parameters) {
        return Object.fromEntries(Object.entries(parameters)
            .filter(([key]) => /^[a-z][a-z0-9_]{0,39}$/.test(key))
            .map(([key, value]) => [key, normalizeValue(value)])
            .filter(([, value]) => value !== undefined)
            .slice(0, 25));
    }

    function normalizeValue(value) {
        if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
        if (typeof value === 'boolean') return value;
        if (typeof value !== 'string') return undefined;
        return value.trim().slice(0, 100) || undefined;
    }

})();
