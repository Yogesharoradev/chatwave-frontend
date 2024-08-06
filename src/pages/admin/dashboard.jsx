import React, { useEffect, useRef } from "react";
import AdminLayout from "../../layout/adminlayout";
import { Card, Input, Button, Tooltip, Typography, message } from "antd";
import { MdAdminPanelSettings } from "react-icons/md";
import moment from "moment";
import { IoNotificationsOutline } from "react-icons/io5";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import { CiChat2 } from "react-icons/ci";
import Chart from "chart.js/auto";
import { useGetStatsQuery } from "../../redux/api/api";

const Dashboard = () => {
  const { data, error } = useGetStatsQuery();

  if (error) {
    message.error('Failed to load stats');
  }

  const lineChartRef = useRef(null);
  const donutChartRef = useRef(null);

  const { stats } = data || {};

  useEffect(() => {
    if (stats) {
      const ctxLine = lineChartRef.current.getContext("2d");
      const lineChartInstance = new Chart(ctxLine, {
        type: "line",
        data: {
          labels: stats.last7DaysMessages.map((_, index) => moment().subtract(6 - index, 'days').format('MMM D')),
          datasets: [
            {
              label: "Messages",
              data: stats.last7DaysMessages,
              fill: true,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
      });

      const ctxDonut = donutChartRef.current.getContext("2d");
      const donutChartInstance = new Chart(ctxDonut, {
        type: "doughnut",
        data: {
          labels: ["Single Chats", "Group Chats"],
          datasets: [
            {
              data: [stats.totalChatsCount - stats.groupCount, stats.groupCount],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
              offset: 40,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });

      return () => {
        lineChartInstance.destroy();
        donutChartInstance.destroy();
      };
    }
  }, [stats]);

  const Appbar = (
    <Card>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2 md:w-8/12 w-auto">
          <MdAdminPanelSettings className="text-4xl text-blue-600" />
          <Input placeholder="Search" />
          <Button type="primary" className="rounded-lg">
            Search
          </Button>
        </div>
        <div>
          <Typography className="text-xl font-semibold md:block hidden">
            {moment().format("dddd , D MMMM YYYY")}
          </Typography>
          <Tooltip title="Notifications">
            <Button className="border-0 md:hidden">
              <IoNotificationsOutline className="text-2xl" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );

  return (
    <AdminLayout>
      <main className="flex flex-col gap-4 z-0">
        {Appbar}

        <div className="flex md:flex-row flex-col md:justify-between gap-4 items-center">
          <Card title="Messages per Day" className="w-full">
            <canvas ref={lineChartRef} />
          </Card>
          <Card title="Chats Breakdown (Donut Chart)" className="w-full">
            <canvas ref={donutChartRef} />
          </Card>
        </div>

        {stats && <Widgets stats={stats} />}
      </main>
    </AdminLayout>
  );
};

const Widgets = ({ stats }) => (
  <div className="flex md:flex-row flex-col justify-between items-center mx-3 gap-4">
    <Widget title={"Users"} value={stats.usersCount} icon={<UserOutlined />} />
    <Widget title={"Chats"} value={stats.totalChatsCount} icon={<CiChat2 />} />
    <Widget title={"Messages"} value={stats.messagesCount} icon={<MessageOutlined />} />
  </div>
);

const Widget = ({ title, value, icon }) => (
  <div className="flex flex-col items-center space-y-5 w-full border-4 p-7">
    <Typography className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-400">
      {value}
    </Typography>
    <div className="text-2xl flex items-center gap-2">
      {icon}
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  </div>
);

export default Dashboard;
