import axios from "axios";
import { load } from "cheerio";
import { ok } from "neverthrow";

type Data = {
  title: string;
  href: string;
  date: string;
  isNew: boolean;
  timestamp: number;
};

const parseData = (data: Data[]) =>
  // biome-ignore lint/complexity/noForEach: one liner
  data.forEach(async (article) => {
    const page = await axios.get(article.href);

    const $ = load(page.data);
    const body = $("div.tdb-block-inner").find("p");

    console.log(`${body.text()} \n`);

    return ok({
      completed: true,
    });
  });

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
    const timestamp = Date.parse(date!);
    const isNew = Date.now() <= timestamp;

    data.push({
      title,
      href,
      date: date!,
      isNew,
      timestamp,
    });
  });

  console.log(data);

  parseData(data);
})("https://comixnow.com/category/dc-weekly/");
