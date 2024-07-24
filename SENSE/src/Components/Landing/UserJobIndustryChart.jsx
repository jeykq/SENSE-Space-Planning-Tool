import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const UserJobIndustryChart = () => {
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const retry = async (fn, retries = 3, delay = 1000) => {
        try {
          return await fn();
        } catch (error) {
          if (retries === 0) throw error;
          await new Promise(res => setTimeout(res, delay));
          return retry(fn, retries - 1, delay);
        }
      };

      try {
        const fetchUsers = () => axios.post('https://api.sensespacesplanningtool.com/user/list', {});
        const fetchIndustries = () => axios.post('https://api.sensespacesplanningtool.com/job_industry/list', {});
        
        const usersResponse = await retry(fetchUsers);
        const industriesResponse = await retry(fetchIndustries);

        if (!usersResponse.data || !usersResponse.data.body) {
          throw new Error('No user data returned');
        }

        const users = usersResponse.data.body;
        const industryCounts = {};
        users.forEach(user => {
          const industryId = user.job_industry_id;
          industryCounts[industryId] = (industryCounts[industryId] || 0) + 1;
        });

        const totalUsers = users.length;

        if (!industriesResponse.data || !industriesResponse.data.body) {
          throw new Error('No job industry data returned');
        }

        const industries = industriesResponse.data.body;
        const chartLabels = industries.map(industry => industry.name);
        const seriesData = industries.map(industry => ((industryCounts[industry.id] || 0) / totalUsers) * 100);

        setChartData({
          series: seriesData,
          options: {
            labels: chartLabels,
            dataLabels: {
              enabled: true,
              formatter: (val) => `${val.toFixed(2)}%`,
              style: {
                fontSize: '10px',
                colors: ['#FFF']
              }
            },
            legend: {
              position: 'right',
              fontSize: '15px'
            },
            plotOptions: {
              pie: {
                customScale: 1.0,
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: 'Total Users',
                      formatter: function(w) {
                        return totalUsers.toFixed(0);
                      },
                      style: {
                        color: '#FFF'
                      }
                    }
                  }
                }
              }
            },
            tooltip: {
              y: {
                formatter: function(val) {
                  return `${val.toFixed(2)}%`;
                }
              }
            }
          }
        });

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className='text-black text-4xl text-center m-20 font-semibold'>Users by Job Industry</h2>
      <div className='w-full flex justify-center'>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type='donut'
          width='600'
          height='600'
        />
      </div>
    </div>
  );
};

export default UserJobIndustryChart;
