export default async ({ params, request }) => {
  const url = new URL(request.url)

  return {
    params,
    url: url.host,
    href: url.href,
    search: url.search,
    pathname: url.pathname,
  }
}
