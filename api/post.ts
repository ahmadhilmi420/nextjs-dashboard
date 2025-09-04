import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);

export default async (req: Request, ctx: any) => {
  // get and validate the `postId` query parameter
  const postIdParam = new URL(req.url).searchParams.get("postId");
  if (postIdParam === null) return new Response("Bad request", { status: 400 });
  const postId = parseInt(postIdParam, 10);
  if (isNaN(postId)) return new Response("Bad request", { status: 400 });

  // query and validate the post
  const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  if (!post) return new Response("Not found", { status: 404 });

  // return the post as JSON
  return new Response(JSON.stringify(post), {
    headers: { "content-type": "application/json" },
  });
};

export const config = {
  runtime: "edge",
  regions: ["iad1"], // specify the region nearest your Neon DB
};
