import { draftMode } from "next/headers";

type News = {
  contents: {
    id: string;
    title: string;
    publishedAt: string;
  }[];
  totalCount: number;
  offset: number;
  limit: number;
}

async function getData({ draftKey }: { draftKey?: string }): Promise<News> {
  const { isEnabled } = await draftMode()

  const url = isEnabled
    ?'https://draft-mode.microcms.io/api/v1/news?draftKey=' + draftKey
    : 'https://draft-mode.microcms.io/api/v1/news';

  const res = await fetch(url, {
    headers: {
      'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '',
    },
  });

  return res.json();
}

const dtf = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    draftKey: string | undefined;
  }>;
}) {
  const draftKey = (await searchParams).draftKey;
  const { contents } = await getData({ draftKey });
  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen">
      <section className="rounded-lg shadow-lg p-4 flex flex-col gap-4 bg-slate-300">
        <h1 className="text-lg font-bold">お知らせ</h1>
        <ul>
          {contents.map((content) => (
            <li key={content.id}>
              <div className="flex justify-between gap-2 items-end">
                <p>{content.title}</p>
                <p className="text-sm text-gray-800">
                  {content.publishedAt
                    ? dtf.format(new Date(content.publishedAt))
                    : 'draft'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
