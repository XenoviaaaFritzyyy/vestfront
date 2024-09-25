// src/components/Charts/MonthlyFundingChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart elements
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyFundingChart = ({ userId, companyId }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyFunding = async () => {
      try {
        // Decide whether to use the passed userId or companyId
        let url = '';
        if (userId) {
          url = `http://localhost:3000/funding-rounds/monthly-funding/${userId}`;
        } else if (companyId) {
          url = `http://localhost:3000/funding-rounds/company-monthly-funding/${companyId}`;
        } else {
          const storedUserId = localStorage.getItem('userId');
          if (storedUserId) {
            url = `http://localhost:3000/funding-rounds/monthly-funding/${storedUserId}`;
          } else {
            throw new Error('User ID or Company ID must be provided');
          }
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = response.data;
        const labels = data.map(item => item.month);
        const totals = data.map(item => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Funding',
              data: totals,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching monthly funding data:', error);
        setLoading(false);
      }
    };

    fetchMonthlyFunding();
  }, [userId, companyId]);

  if (loading) return <p>Loading...</p>;

  return <Line data={chartData} />;
};

export default MonthlyFundingChart;
