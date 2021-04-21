import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { Request, Response } from "express";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { validate } from "class-validator";

const app = express();

app.use(express.json());

// CREATE
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  try {
      const user = User.create({ name, email, role });

      const errors = await validate(user)

      if(errors.length > 0) throw errors

    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// READ
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find({relations: ['posts']});

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
// UPDATE
app.put("/users/:uuid", async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { name, email, role } = req.body;
  try {
    const user = await User.findOneOrFail({ uuid });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// DELETE
app.delete("/users/:uuid", async (req: Request, res: Response) => {
  const { uuid } = req.params;

  try {
    const user = await User.findOneOrFail({ uuid });

    await user.remove();

    return res.status(204).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// FIND
// DELETE
app.get("/users/:uuid", async (req: Request, res: Response) => {
  const { uuid } = req.params;

  try {
    const user = await User.findOneOrFail({ uuid });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Something went wrong" });
  }
});

// CREATE A POST
app.post("/posts", async (req: Request, res: Response) => {
  const { title, content, userUuid } = req.body;

  try {
    const user = await User.findOneOrFail({ uuid: userUuid });
    const post = await new Post({ title, content, user });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});
// READ POSTS
app.get("/posts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({relations: ['user']});

   return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Something went wrong" });
  }
});

createConnection()
  .then(async () => {
    app.listen(5000, () => console.log("server up on port 5000"));
  })
  .catch((error) => console.log(error));
