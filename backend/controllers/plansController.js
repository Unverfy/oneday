const Plan = require("../models/Plan");
const logHistory = require("../middleware/historyLogger");

// @desc    Get plans
// @route   GET /api/plans
// @access  Private
const getPlans = async (req, res) => {
  try {
    const { status, priority, limit = 10, page = 1 } = req.query;
    
    let query = { userId: req.user.id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;

    const plans = await Plan.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ date: 1 }); // Sort by closest date

    const total = await Plan.countDocuments(query);

    res.status(200).json({
      data: plans,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create plan
// @route   POST /api/plans
// @access  Private
const createPlan = async (req, res) => {
  try {
    const { title, description, date, priority } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Please add a title and date field" });
    }

    const plan = await Plan.create({
      title,
      description,
      date,
      priority,
      userId: req.user.id,
    });

    await logHistory(req.user.id, "Created a plan", { planId: plan._id, title });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Check for user
    if (plan.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // If status changed to completed
    if (req.body.status === "completed" && plan.status !== "completed") {
      await logHistory(req.user.id, "Completed a plan", { planId: updatedPlan._id, title: updatedPlan.title });
    } else {
      await logHistory(req.user.id, "Updated a plan", { planId: updatedPlan._id });
    }

    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Check for user
    if (plan.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await plan.deleteOne();
    await logHistory(req.user.id, "Deleted a plan", { planId: req.params.id });

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};
