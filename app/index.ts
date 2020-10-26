// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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