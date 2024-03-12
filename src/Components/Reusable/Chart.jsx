import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DailyTravelDuration = ({ tripData }) => {
  const options = {
    responsive: true,
  };

  //   const filteredData = tripData?.data.filter((item) => {
  //     return (
  //       dayjs(item.createdAt).format("MMM-DD-YY") == dayjs().format("MMM-DD-YY")
  //     );
  //   });

  let plateNos = {};

  //   filteredData.forEach((trip, index) => {
  //     let plateNo = trip.vehicle_id.plate_no;
  //     if (!plateNos[plateNo]) {
  //       plateNos[plateNo] = {
  //         totalDuration: 0,
  //         // locations: [],
  //         plate_no: plateNo,
  //       };
  //     }

  //     const startDate = dayjs(trip.locations[0].date);
  //     const endDate = dayjs(trip.locations[trip.locations.length - 1].date);
  //     const duration = endDate.diff(startDate);
  //     plateNos[plateNo].totalDuration += duration;
  //     // plateNos[plateNo].locations.push(location);
  //   });

  const obj = Object.values(plateNos);

  const data = {
    labels: obj?.map((item) => item.plate_no),
    datasets: [
      {
        label: "Hours",
        data: obj?.map((item) => {
          let totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
          let hours = Math.floor(totalMinutes / 60);
          return hours;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Minutes",
        data: obj?.map((item) => {
          let totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
          let minutes = totalMinutes % 60;
          return minutes;
        }),
        backgroundColor: "rgba(78, 14, 229, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default DailyTravelDuration;
