import { createContext, memo, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
//1)create new Context
const PostBlog = createContext();

function PostContext({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
      onAddPost: handleAddPost,
    };
  }, [searchQuery, searchedPosts]);
  return (
    //2)provide value to child components
    <PostBlog.Provider value={value}>{children}</PostBlog.Provider>
  );
}

function usePosts() {
  const context = useContext(PostBlog);
  if (context === undefined) {
    throw new Error("usePost being used outside the PostProvider");
  }
  return context;
}

export { PostContext, usePosts };
