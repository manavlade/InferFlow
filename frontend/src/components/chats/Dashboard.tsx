import {
  Activity,
  AlertTriangle,
  Bot,
  Clock3,
  Database,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { InferenceLog } from "@/api/chats/chat";

interface DashboardProps {
  logs: InferenceLog[];
}

const Dashboard = ({
  logs,
}: DashboardProps) => {

  const totalRequests = logs.length;

  const successRequests = logs.filter(
    (log) => log.status === "success"
  ).length;

  const failedRequests = logs.filter(
    (log) => log.status === "error"
  ).length;

  const avgLatency =
    logs.reduce((acc, log) => acc + log.latency, 0) /
    (logs.length || 1);

  const totalTokens = logs.reduce(
    (acc, log) => acc + (log.total_tokens || 0),
    0
  );

  return (

    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="mb-8">

        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-white" />

          <h1 className="text-3xl font-bold">
            InferFlow Dashboard
          </h1>
        </div>

        <p className="text-zinc-400">
          Monitor inference requests, latency,
          token usage and model performance.
        </p>

      </div>

      {/* Stats */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
          mb-8
        "
      >

        <MetricCard
          title="Total Requests"
          value={totalRequests}
          icon={<Activity />}
        />

        <MetricCard
          title="Average Latency"
          value={`${avgLatency.toFixed(2)}s`}
          icon={<Clock3 />}
        />

        <MetricCard
          title="Total Tokens"
          value={totalTokens}
          icon={<Bot />}
        />

        <MetricCard
          title="Errors"
          value={failedRequests}
          icon={<AlertTriangle />}
        />

      </div>

      {/* Analytics */}
      <div
        className="
          grid grid-cols-1
          xl:grid-cols-3
          gap-6
          mb-8
        "
      >

        {/* Success Rate */}
        <div
          className="
            bg-zinc-950
            border border-zinc-800
            rounded-2xl
            p-6
          "
        >

          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="text-green-500" />

            <h2 className="font-semibold text-lg">
              Success Rate
            </h2>
          </div>

          <div className="space-y-4">

            <div>
              <p className="text-zinc-400 text-sm">
                Successful Requests
              </p>

              <h2 className="text-4xl font-bold">
                {successRequests}
              </h2>
            </div>

            <div>
              <p className="text-zinc-400 text-sm">
                Failed Requests
              </p>

              <h2 className="text-4xl font-bold text-red-500">
                {failedRequests}
              </h2>
            </div>

          </div>

        </div>

        {/* Provider Info */}
        <div
          className="
            bg-zinc-950
            border border-zinc-800
            rounded-2xl
            p-6
          "
        >

          <div className="flex items-center gap-2 mb-5">
            <Database />

            <h2 className="font-semibold text-lg">
              Provider Info
            </h2>
          </div>

          <div className="space-y-4">

            <InfoRow
              label="Provider"
              value="Gemini"
            />

            <InfoRow
              label="Model"
              value="gemini-2.5-flash"
            />

            <InfoRow
              label="Logs Stored"
              value={logs.length}
            />

          </div>

        </div>

        {/* Performance */}
        <div
          className="
            bg-zinc-950
            border border-zinc-800
            rounded-2xl
            p-6
          "
        >

          <div className="flex items-center gap-2 mb-5">
            <Clock3 />

            <h2 className="font-semibold text-lg">
              Performance
            </h2>
          </div>

          <div className="space-y-4">

            <InfoRow
              label="Average Latency"
              value={`${avgLatency.toFixed(2)}s`}
            />

            <InfoRow
              label="Total Tokens"
              value={totalTokens}
            />

            <InfoRow
              label="Total Requests"
              value={totalRequests}
            />

          </div>

        </div>

      </div>

      {/* Recent Logs */}
      <div
        className="
          bg-zinc-950
          border border-zinc-800
          rounded-2xl
          p-6
        "
      >

        <div className="flex items-center gap-2 mb-6">

          <Activity />

          <h2 className="text-xl font-semibold">
            Recent Inference Logs
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-zinc-800">

                <th className="text-left py-3 text-zinc-400 font-medium">
                  Status
                </th>

                <th className="text-left py-3 text-zinc-400 font-medium">
                  Model
                </th>

                <th className="text-left py-3 text-zinc-400 font-medium">
                  Latency
                </th>

                <th className="text-left py-3 text-zinc-400 font-medium">
                  Tokens
                </th>

                <th className="text-left py-3 text-zinc-400 font-medium">
                  Prompt
                </th>

              </tr>

            </thead>

            <tbody>

              {logs.slice().reverse().map((log) => (

                <tr
                  key={log.id}
                  className="
                    border-b border-zinc-900
                    hover:bg-zinc-900/40
                    transition
                  "
                >

                  <td className="py-4">

                    <div className="flex items-center gap-2">

                      {
                        log.status === "success"
                          ? (
                            <CheckCircle2
                              size={18}
                              className="text-green-500"
                            />
                          )
                          : (
                            <XCircle
                              size={18}
                              className="text-red-500"
                            />
                          )
                      }

                      <span className="capitalize">
                        {log.status}
                      </span>

                    </div>

                  </td>

                  <td className="py-4">
                    {log.model}
                  </td>

                  <td className="py-4">
                    {log.latency.toFixed(2)}s
                  </td>

                  <td className="py-4">
                    {log.total_tokens || 0}
                  </td>

                  <td
                    className="
                      py-4
                      text-zinc-400
                      max-w-[300px]
                      truncate
                    "
                  >
                    {log.input_preview}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


// ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const MetricCard = ({
  title,
  value,
  icon,
}: MetricCardProps) => {

  return (

    <div
      className="
        bg-zinc-950
        border border-zinc-800
        rounded-2xl
        p-5
      "
    >

      <div
        className="
          flex items-center justify-between
          mb-4
        "
      >

        <span className="text-zinc-400">
          {title}
        </span>

        <div className="text-zinc-300">
          {icon}
        </div>

      </div>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>

    </div>
  );
};


// ─────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string | number;
}

const InfoRow = ({
  label,
  value,
}: InfoRowProps) => {

  return (

    <div className="flex items-center justify-between">

      <span className="text-zinc-400">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>

    </div>
  );
};

export default Dashboard;