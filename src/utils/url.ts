export function isAbsoluteUrl(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function combineUrls(baseUrl: string, relativeUrl: string): string {
  return relativeUrl
    ? baseUrl.replace(/\/+$/, "") + "/" + relativeUrl.replace(/^\/+/, "")
    : baseUrl;
}

export function buildFullPath(baseUrl: string, requestedUrl: string) {
  if (baseUrl && !isAbsoluteUrl(requestedUrl)) {
    return combineUrls(baseUrl, requestedUrl);
  }
  return requestedUrl;
}
