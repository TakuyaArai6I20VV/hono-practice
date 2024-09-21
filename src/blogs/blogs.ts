import { Hono } from "hono"

const app = new Hono();

let blogPosts = [
  { id: 1, title: "Hello World", body: "Hello World!" },
  { id: 2, title: "Hello Hono", body: "Hello Hono!" },
  { id: 3, title: "Hello Deno", body: "Hello Deno!" },
  { id: 4, title: "Hello TypeScript", body: "Hello TypeScript!" },
];

app.get("/", (c) => {
  return c.json({ posts: blogPosts });
});

app.get("/:id", (c) => {
  const id = c.req.param("id");
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (post) {
    return c.json(post);
  } else {
    return c.json({ error: "Post not found" }, 404);
  }
});

app.post("/", async (c) => {
  const { title, body } = await c.req.json<{ title: string; body: string }>();
  const newPost = { id: blogPosts.length + 1, title, body };
  blogPosts = [...blogPosts, newPost];
  return c.json(newPost, 201);
});

app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const index = blogPosts.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return c.json({ error: "Post not found" }, 404);
  }

  const { title, body } = await c.req.json<{ title: string; body: string }>();
  blogPosts[index] = { ...blogPosts[index], title, body };

  return c.json(blogPosts[index]);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const index = blogPosts.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return c.json({ error: "Post not found" }, 404);
  }

  blogPosts = blogPosts.filter((p) => p.id !== parseInt(id));

  return c.json({ message: "Post deleted" });
});

export default app;
