const Course = require("../model/course_model");
const Category = require("../model/category_model");

// Create a new course (updated for category reference)
exports.createCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // Validate category if provided
    if (courseData.category) {
      const categoryExists = await Category.findById(courseData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Check if course with this name already exists
    const existingCourse = await Course.findOne({
      courseName: courseData.courseName,
    });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course with this name already exists.",
      });
    }

    const newCourse = new Course({
      ...courseData,
      category: courseData.category || null, // Default to null if not provided
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not create course.",
      error: error.message,
    });
  }
};

// Search courses by name and filter by category (updated)
exports.searchCourses = async (req, res) => {
  try {
    const { name, category } = req.query;
    let query = {};

    // Add name filter if provided (case-insensitive search)
    if (name) {
      query.courseName = { $regex: name, $options: "i" };
    }

    // Add category filter if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
      query.category = category;
    }

    const courses = await Course.find(query)
      .populate("subjects", "subjectName")
      .populate("category", "title")
      .sort({ courseName: 1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error searching courses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not search courses.",
      error: error.message,
    });
  }
};

// Get all courses - updated to filter by category if provided
exports.getAllCourses = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
      query.category = category;
    }

    const courses = await Course.find(query)
      .populate("subjects", "subjectName")
      .populate("category", "title");

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch courses.",
      error: error.message,
    });
  }
};

// Get courses by category (updated)
exports.getCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists in database
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Find courses that reference this category
    const courses = await Course.find({ category: categoryId })
      .populate("subjects", "subjectName")
      .populate("category", "title");

    return res.status(200).json({
      success: true,
      count: courses.length,
      category: category.title,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses by category:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch courses by category.",
      error: error.message,
    });
  }
};

// Update course by ID (updated for category reference)
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updateData = req.body;

    // Validate category if provided in update
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("subjects", "subjectName")
      .populate("category", "title");

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update course.",
      error: error.message,
    });
  }
};

// Publish course (updated to populate category)
exports.publishCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { isPublished: true },
      { new: true }
    )
      .populate("subjects", "subjectName")
      .populate("category", "title");

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course published successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error publishing course:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not publish course.",
      error: error.message,
    });
  }
};

// Get course by ID (updated to populate category)
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId)
      .populate("subjects", "subjectName")
      .populate("category", "title");
    // .populate("mockTests", "testName");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch course.",
      error: error.message,
    });
  }
};

// Delete course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not delete course.",
      error: error.message,
    });
  }
};
