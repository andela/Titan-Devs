export default followers =>
  followers.map(f => {
    const { createdAt, updatedAt, followings } = f.get();
    return { ...followings.get(), createdAt, updatedAt };
  });
