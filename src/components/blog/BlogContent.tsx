import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function BlogContent({ content }: { content: string }) {
  return (
    <div className="blog-content text-slate-700 leading-relaxed">
      <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
        h1: ({ children }) => <h2>{children}</h2>,
        a: ({ href, children }) => href?.startsWith("/") && !href.startsWith("//")
          ? <Link href={href}>{children}</Link>
          : <a href={href} rel="noopener noreferrer">{children}</a>,
        table: ({ children }) => <div className="overflow-x-auto my-6"><table>{children}</table></div>,
      }}>{content}</Markdown>
    </div>
  );
}
