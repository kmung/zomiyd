// TODO: define the robots.txt file

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      disallow: "/private/",
    },
  };
}
