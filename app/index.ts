import {sanitizeToTrustedHTML, unwrapTrustedHTML} from './utils'

function unsafeWriteHtml(html: string) {
    document.body.innerHTML = html;
}

function writeTrustedHtml_variant1(html: TrustedHTML) {
    document.body.innerHTML = html as unknown as string;
}

function writeTrustedHtml_variant2(html: TrustedHTML | string) {
    document.body.innerHTML = html as string;
}

function writeTrustedHtml_variant3(html: string) {
    const trustedHtml: TrustedHTML = sanitizeToTrustedHTML(html);
    document.body.innerHTML = unwrapTrustedHTML(trustedHtml);
}