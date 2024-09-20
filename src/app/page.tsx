// import Image from "next/image";

import Link from "next/link";
// import { useState } from "react";

const feeds = [
  
]

const data = [
  {
    id: 1,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
  {
    id: 2,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
  {
    id: 3,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
  {
    id: 4,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
  {
    id: 5,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
  {
    id: 6,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
  {
    id: 7,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
  {
    id: 8,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
  {
    id: 9,
    title: "The future of the web is in your hands",
    url: "http://blog.ycombinator.com/the-future-of-the-web-is-in-your-hands/",
    points: 134,
    user: "dhouston"
  },
]

export default function Home() {
  // const [state, setState] = useState(null);

  return (
    <div className="max-w-[60rem] m-auto bg-orange-50 my-2">
      <nav className="bg-orange-500 px-2 flex">
        <span>Hacker News Clone</span>
        <div className="grow"></div>
        <Link href="/login">Login</Link>
      </nav>
      <div className="px-2">
        <ol className="list-inside list-decimal">
          {data.map((item) => (
            <li key={item.id} className="gap-4 list-item list-decimal">
              <a href={item.url} className="inline-flex flex-col">
                <div>
                  <span>{item.title} </span>
                  <span className="hover:underline">({new URL(item.url).hostname})</span> <br />
                </div>
                <small>{item.points} points by {item.user} x minutes/hours ago</small>
              </a>
            </li>
          ))}
        </ol>
        <p className="pt-4">More</p>
      </div>
      <footer className="border-t-2 border-orange-500 px-2 text-center py-4">
        <p>Hacker News Clone, 2024</p>
      </footer>
    </div>
  );
}
