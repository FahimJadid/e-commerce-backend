const Blog = require("../models/BlogModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");

// createBlog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: "success",
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// updateBlog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({
      status: "success",
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// getBlog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const findBlog = await Blog.findById(id);
    await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    res.json({
      status: "success",
      message: "Blog fetched successfully",
      blog: findBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// getAllBlogs

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const findAllBlogs = await Blog.find({});

    res.json({
      status: "success",
      message: "All blogs fetched successfully",
      blogs: findAllBlogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// deleteBlog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({
      status: "success",
      message: "Blog Deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// likeBlog
// const likeBlog = asyncHandler(async (req, res) => {
//   const { blogId } = req.body;
//   validateMongoId(blogId);

//   const blog = await Blog.findById(blogId);

//   if (!blog) {
//     return res.status(404).json({ message: "Blog not found" });
//   }

//   const loginUserId = req?.user?._id;

//   const isLiked = blog.isLiked;

//   //   const alreadyDisliked = blog.dislikes.includes(loginUserId);
//   const alreadyDisliked = blog.dislikes.find(
//     (userId) => userId?.toString() === loginUserId?.toString()
//   );

//   if (alreadyDisliked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { dislikes: loginUserId },
//         isDisliked: false,
//       },
//       { new: true }
//     );
//     res.json({
//       status: "success",
//       message: "Blog undisliked successfully",
//       blog,
//     });
//   }

//   if (isLiked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { likes: loginUserId },
//         isLiked: false,
//       },
//       { new: true }
//     );
//     res.json({
//       status: "success",
//       message: "Blog unliked successfully",
//       blog,
//     });
//   } else {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $push: { likes: loginUserId },
//         isLiked: true,
//       },
//       { new: true }
//     );
//     res.json({
//       status: "success",
//       message: "Blog liked successfully",
//       blog,
//     });
//   }
// });

const likeBlog = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    validateMongoId(blogId);

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const loginUserId = req?.user?._id;

    // Check if the user has already disliked the blog
    const alreadyDisliked = blog.dislikes.includes(loginUserId);

    if (alreadyDisliked) {
      await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json({
        status: "success",
        message: "Blog undisliked successfully",
      });
    }

    // Check if the user has already liked the blog
    const alreadyLiked = blog.likes.includes(loginUserId);

    // if (alreadyLiked) {
    //   const blog = await Blog.findByIdAndUpdate(
    //     blogId,
    //     {
    //       $pull: { likes: loginUserId },
    //       isLiked: false,
    //     },
    //     { new: true }
    //   );
    //   res.json({
    //     status: "success",
    //     message: "Blog unliked successfully",
    //     blog,
    //   });
    // } else {
    //   const blog = await Blog.findByIdAndUpdate(
    //     blogId,
    //     {
    //       $push: { likes: loginUserId },
    //       isLiked: true,
    //     },
    //     { new: true }
    //   );
    //   res.json({
    //     status: "success",
    //     message: "Blog liked successfully",
    //     blog,
    //   });
    // }

    const updateQuery = alreadyLiked
      ? {
          $pull: { likes: loginUserId },
          isLiked: false,
        }
      : {
          $push: { likes: loginUserId },
          isLiked: true,
        };

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateQuery, {
      new: true,
    });

    const actionMessage = alreadyLiked ? "unliked" : "liked";

    res.json({
      status: "success",
      message: `Blog ${actionMessage} successfully`,
      blog: updatedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
};
