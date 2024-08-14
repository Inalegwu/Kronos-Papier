import axios from "axios";
import { load } from "cheerio";

type Data = {
  title: string;
  href: string;
};

(async (url: string) => {
  const data: Data[] = [];
  const page = await axios.get(url);

  const $ = load(page.data);

  const posts = $("div.tdb_module_loop").find("a");

  posts.each((id, el) => {
    const href = $(el).attr("href");
    const title = $(el).text();

    // console.log({ href, title });

    if (href === "" || title === "" || href === undefined) return;

    if (title.split(":").length < 2) return;

    const date = title.match(/\b((\w{3,9})\s+\d{1,2},\s+\d{4})\b/)?.[0];

    console.log({ date });

    data.push({
      title,
      href,
    });
  });

  console.log(data);
})("https://comixnow.com/category/dc-weekly/");
