const { AuthenticationError, UserInputError} = require("apollo-server")

const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context);

            // Validation
            if (body.trim() === "") {
                throw new UserInputError ("This is an invalid comment", {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                })
            }

            const post = await Post.findById(postId)

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })

                await post.save();

                return post;
            } else throw new UserInputError("Oops, we couldn`t find this post")
        },
        
        async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(comm => comm.id === commentId);
            
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);

                    await post.save();

                    return post;
                } else {
                    throw new AuthenticationError("This action is not allowed!");
                }
            } else {
                throw new UserInputError("Oops, we could`t find this post!")
            }
        }
    }
}