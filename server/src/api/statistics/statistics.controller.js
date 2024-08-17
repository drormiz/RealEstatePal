import { PropertyModel } from "../../models/property.model.js";
import { PurchaseGroupRequestModel } from "../../models/purchaseGroupRequest.model.js";
import { UserModel } from "../../models/user.model.js";

const calculatePercentile = (data, percentile) => {
  const sorted = data.slice().sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index];
};

const countInRanges = (data, ranges) => {
  const counts = new Array(ranges.length - 1).fill(0);
  data.forEach((price) => {
    for (let i = 0; i < ranges.length - 1; i++) {
      if (price >= ranges[i] && price <= ranges[i + 1]) {
        counts[i]++;
        break;
      }
    }
  });

  return ranges.slice(0, -1).map((start, i) => ({
    range: `${start} - ${ranges[i + 1]}`,
    count: counts[i],
  }));
};

export const getStatistics = async (req, res, next) => {
  try {
    const propertyTypeDistribution = await PropertyModel.aggregate([
      { $group: { _id: "$propertyType", count: { $sum: 1 } } },
    ]);

    const requestStatusDistribution = await PurchaseGroupRequestModel.aggregate(
      [
        {
          $match: {
            status: { $in: ["approved", "rejected"] },
          },
        },
        {
          $project: {
            status: 1,
            timeTaken: { $subtract: ["$updatedAt", "$createdAt"] },
          },
        },
        {
          $group: {
            _id: "$status",
            averageTimeTaken: { $avg: "$timeTaken" },
          },
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            averageTimeTaken: {
              $toInt: { $divide: ["$averageTimeTaken", 60000] },
            },
          },
        },
      ]
    );

    let userRegistrationTrends = await UserModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    userRegistrationTrends = userRegistrationTrends.reduce(
      (acc, current, index) => {
        if (index === 0) {
          acc.push(current);
        } else {
          acc.push({
            _id: current._id,
            count: acc[index - 1].count + current.count,
          });
        }
        return acc;
      },
      []
    );

    const allPrices = await PropertyModel.find({}).select("price").exec();
    const prices = allPrices.map((p) => p.price).sort((a, b) => a - b);

    const q1 = calculatePercentile(prices, 25);
    const q2 = calculatePercentile(prices, 50);
    const q3 = calculatePercentile(prices, 75);

    const boundaries = [Math.min(...prices), q1, q2, q3, Math.max(...prices)];
    const propertyPriceDistribution = countInRanges(prices, boundaries);

    const statisticsData = {
      propertyTypeDistribution,
      requestStatusDistribution,
      userRegistrationTrends,
      propertyPriceDistribution,
    };

    res.status(200).json(statisticsData);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
