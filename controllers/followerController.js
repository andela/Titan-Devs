import models from "../models";

const { User, Follower } = models;

export default class FollowerController {
  static async followUser(req, res) {
    const userId = "f319ac80-6695-4df6-809d-6860b7ce4508";
    const followerId = "6b2024df-cb04-4ced-bf8a-07b42b38127d";
    try {
      const results = await Follower.create({
        userId,
        followerId
      });
      return res.json({ message: "Follow success", data: { ...results } });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "failed" });
    }
  }
}
