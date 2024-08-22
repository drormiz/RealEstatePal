import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { getClient } from "../../../../axios";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartTypes = {
  propertyTypes: { component: Pie, title: "Property Types Distribution" },
  propertyPrices: { component: Bar, title: "Property Prices Distribution" },
  approvalTimes: {
    component: Bar,
    title: "Average Time to Approve/Reject Requests",
  },
  userRegistration: {
    component: Line,
    title: "Total User Registrations Over Time",
  },
};

const formatNumberWithCommas = (number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const Statistics = () => {
  const [statisticsData, setStatisticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("propertyTypes");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data } = await getClient().get("/api/statistics");

        const processedData = {
          propertyTypes: {
            labels: data.propertyTypeDistribution.map((item) => item._id),
            datasets: [
              {
                label: "Property Types Distribution",
                data: data.propertyTypeDistribution.map((item) => item.count),
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                ],
              },
            ],
          },
          propertyPrices: {
            labels: data.propertyPriceDistribution.map((item) =>
              formatNumberWithCommas(item.range)
            ),
            datasets: [
              {
                label: "Property Prices Distribution",
                data: data.propertyPriceDistribution.map((item) => item.count),
                backgroundColor: "#FF6384",
              },
            ],
          },
          approvalTimes: {
            labels: data.requestStatusDistribution.map((item) =>
              capitalizeFirstLetter(item.status)
            ),
            datasets: [
              {
                label: "Average Time to Approve/Reject (in minutes)",
                data: data.requestStatusDistribution.map(
                  (item) => item.averageTimeTaken
                ),
                backgroundColor: "#36A2EB",
              },
            ],
          },
          userRegistration: {
            labels: data.userRegistrationTrends.map((item) => item._id),
            datasets: [
              {
                label: "User Registrations Over Time",
                data: data.userRegistrationTrends.map((item) => item.count),
                fill: false,
                borderColor: "#FFCE56",
              },
            ],
          },
        };

        setStatisticsData(processedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch statistics data.");
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const renderChart = () => {
    if (!statisticsData) return null;

    const { component: ChartComponent, title } = chartTypes[activeChart];
    const chartData = statisticsData[activeChart];

    return (
      <Box display="flex" justifyContent="center" mb={4}>
        <Card
          style={{
            width: activeChart === "propertyTypes" ? "500px" : "550px",
            height: activeChart === "propertyTypes" ? "550px" : "350px",
          }}
        >
          <CardContent>
            <Typography variant="h6">{title}</Typography>
            <ChartComponent
              data={chartData}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => tooltipItem.raw,
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </Box>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={2}
        justifyContent="center"
        mb={4}
        style={{ paddingTop: "20px" }}
      >
        {Object.keys(chartTypes).map((chartType) => (
          <Grid item key={chartType}>
            <Button
              variant={activeChart === chartType ? "contained" : "outlined"}
              onClick={() => setActiveChart(chartType)}
            >
              {chartType.split(/(?=[A-Z])/).join(" ").replace(/\b\w/g, char => char.toUpperCase())}

            </Button>
          </Grid>
        ))}
      </Grid>
      {renderChart()}
    </Container>
  );
};

export default Statistics;
