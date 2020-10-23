export function sanitizeToTrustedHTML(html: string): TrustedHTML {
    // implementation of sanitization is deliberately ommited to 
    // keep the demo short. One could for example use DomPurify here.
    return html as unknown as TrustedHTML;
}

export function unwrapTrustedHTML(html: TrustedHTML): string {
    return html as unknown as string;
}