import {
  Activity,
  AlertTriangle,
  Bot,
  Clock3,
  Database,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Cpu,
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
    logs.reduce(
      (acc, log) => acc + log.latency,
      0
    ) / (logs.length || 1);

  const totalTokens = logs.reduce(
    (acc, log) => acc + (log.total_tokens || 0),
    0
  );

  const successRate = (
    (successRequests / (totalRequests || 1)) * 100
  ).toFixed(1);

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-b
        from-white
        via-zinc-50
        to-zinc-100
        text-zinc-900
        p-6
      "
    >

      <div className="mb-10">

        <div className="flex items-center gap-4 mb-4">

          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-gradient-to-br
              from-blue-600
              to-blue-500
              flex items-center justify-center
              shadow-xl shadow-blue-500/20
            "
          >

            <Sparkles className="text-white" />

          </div>

          <div>

            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
                text-zinc-900
              "
            >
              InferFlow Dashboard
            </h1>

            <p className="text-zinc-500 mt-1">
              Monitor inference requests,
              latency, token usage and
              AI performance metrics.
            </p>

          </div>

        </div>

      </div>

      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-10
        "
      >

        <MetricCard
          title="Total Requests"
          value={totalRequests}
          icon={<Activity size={20} />}
        />

        <MetricCard
          title="Average Latency"
          value={`${avgLatency.toFixed(2)}s`}
          icon={<Clock3 size={20} />}
        />

        <MetricCard
          title="Total Tokens"
          value={totalTokens}
          icon={<Bot size={20} />}
        />

        <MetricCard
          title="Error Requests"
          value={failedRequests}
          icon={<AlertTriangle size={20} />}
        />

      </div>

      <div
        className="
          grid grid-cols-1
          xl:grid-cols-3
          gap-6
          mb-10
        "
      >

        {/* Success Rate */}
        <AnalyticsCard
          title="Success Rate"
          icon={
            <TrendingUp
              className="text-green-600"
            />
          }
        >

          <div className="space-y-5">

            <div>

              <p className="text-zinc-500 text-sm">
                Request Health
              </p>

              <h2
                className="
                  text-5xl
                  font-bold
                  text-zinc-900
                  mt-1
                "
              >
                {successRate}%
              </h2>

            </div>

            <div className="space-y-3">

              <StatusRow
                color="bg-green-500"
                label="Successful"
                value={successRequests}
              />

              <StatusRow
                color="bg-red-500"
                label="Failed"
                value={failedRequests}
              />

            </div>

          </div>

        </AnalyticsCard>

        {/* Provider */}
        <AnalyticsCard
          title="Provider Info"
          icon={
            <Database className="text-blue-600" />
          }
        >

          <div className="space-y-5">

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

            <InfoRow
              label="Status"
              value="Operational"
              valueClass="text-green-600"
            />

          </div>

        </AnalyticsCard>

        {/* Performance */}
        <AnalyticsCard
          title="Performance"
          icon={
            <Cpu className="text-violet-600" />
          }
        >

          <div className="space-y-5">

            <InfoRow
              label="Average Latency"
              value={`${avgLatency.toFixed(2)}s`}
            />

            <InfoRow
              label="Token Usage"
              value={totalTokens}
            />

            <InfoRow
              label="Requests"
              value={totalRequests}
            />

            <InfoRow
              label="Streaming"
              value="Enabled"
              valueClass="text-blue-600"
            />

          </div>

        </AnalyticsCard>

      </div>

      <div
        className="
          bg-white/80
          backdrop-blur-xl
          border border-zinc-200
          rounded-3xl
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            px-6 py-5
            border-b
            border-zinc-200
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-10 h-10
                rounded-xl
                bg-blue-50
                flex items-center justify-center
              "
            >

              <Activity
                size={18}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-zinc-900
                "
              >
                Recent Inference Logs
              </h2>

              <p className="text-sm text-zinc-500">
                Real-time request monitoring
              </p>

            </div>

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
                bg-zinc-50
                border-b
                border-zinc-200
              "
            >

              <tr>

                <TableHead>Status</TableHead>

                <TableHead>Model</TableHead>

                <TableHead>Latency</TableHead>

                <TableHead>Tokens</TableHead>

                <TableHead>Prompt</TableHead>

              </tr>

            </thead>

            <tbody>

              {logs
                .slice()
                .reverse()
                .map((log) => (

                  <tr
                    key={log.id}
                    className="
                      border-b
                      border-zinc-100
                      hover:bg-zinc-50/80
                      transition-all
                    "
                  >

                    {/* Status */}
                    <td className="px-6 py-5">

                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-3 py-1.5
                          rounded-full
                          text-sm
                          font-medium
                          border
                        "
                      >

                        {
                          log.status === "success"
                            ? (
                              <>
                                <CheckCircle2
                                  size={16}
                                  className="text-green-600"
                                />

                                <span className="text-green-700">
                                  Success
                                </span>
                              </>
                            )
                            : (
                              <>
                                <XCircle
                                  size={16}
                                  className="text-red-600"
                                />

                                <span className="text-red-700">
                                  Failed
                                </span>
                              </>
                            )
                        }

                      </div>

                    </td>

                    {/* Model */}
                    <td className="px-6 py-5">

                      <div>

                        <p
                          className="
                            font-semibold
                            text-zinc-900
                          "
                        >
                          {log.model}
                        </p>

                        <p
                          className="
                            text-xs
                            text-zinc-500
                            mt-1
                          "
                        >
                          {log.provider}
                        </p>

                      </div>

                    </td>

                    {/* Latency */}
                    <td className="px-6 py-5">

                      <span
                        className="
                          font-semibold
                          text-zinc-800
                        "
                      >
                        {log.latency.toFixed(2)}s
                      </span>

                    </td>

                    {/* Tokens */}
                    <td className="px-6 py-5">

                      <span
                        className="
                          inline-flex
                          items-center
                          px-3 py-1
                          rounded-full
                          bg-blue-50
                          text-blue-700
                          text-sm
                          font-medium
                        "
                      >
                        {log.total_tokens || 0}
                      </span>

                    </td>

                    {/* Prompt */}
                    <td
                      className="
                        px-6 py-5
                        max-w-[350px]
                      "
                    >

                      <p
                        className="
                          text-sm
                          text-zinc-600
                          line-clamp-2
                          leading-6
                        "
                      >
                        {log.input_preview}
                      </p>

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
        relative
        overflow-hidden

        bg-white/80
        backdrop-blur-xl

        border
        border-zinc-200

        rounded-3xl
        p-6

        shadow-sm

        hover:shadow-xl
        hover:-translate-y-1

        transition-all
        duration-300
      "
    >

      <div
        className="
          absolute
          top-0
          right-0
          w-32 h-32
          bg-blue-100/40
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          relative
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <span
          className="
            text-zinc-500
            font-medium
          "
        >
          {title}
        </span>

        <div
          className="
            w-11 h-11
            rounded-2xl
            bg-blue-50
            flex
            items-center
            justify-center
            text-blue-600
          "
        >
          {icon}
        </div>

      </div>

      <h2
        className="
          relative
          text-4xl
          font-bold
          tracking-tight
          text-zinc-900
        "
      >
        {value}
      </h2>

    </div>
  );
};


interface AnalyticsCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const AnalyticsCard = ({
  title,
  icon,
  children,
}: AnalyticsCardProps) => {

  return (

    <div
      className="
        bg-white/80
        backdrop-blur-xl
        border
        border-zinc-200
        rounded-3xl
        p-6
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          mb-6
        "
      >

        <div
          className="
            w-11 h-11
            rounded-2xl
            bg-zinc-100
            flex
            items-center
            justify-center
          "
        >
          {icon}
        </div>

        <h2
          className="
            text-lg
            font-bold
            text-zinc-900
          "
        >
          {title}
        </h2>

      </div>

      {children}

    </div>
  );
};

const TableHead = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  return (

    <th
      className="
        text-left
        px-6 py-4
        text-sm
        font-semibold
        text-zinc-500
      "
    >
      {children}
    </th>

  );
};


interface InfoRowProps {
  label: string;
  value: string | number;
  valueClass?: string;
}

const InfoRow = ({
  label,
  value,
  valueClass = "text-zinc-900",
}: InfoRowProps) => {

  return (

    <div
      className="
        flex
        items-center
        justify-between
      "
    >

      <span className="text-zinc-500">
        {label}
      </span>

      <span
        className={`
          font-semibold
          ${valueClass}
        `}
      >
        {value}
      </span>

    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Status Row
// ─────────────────────────────────────────────────────────────

interface StatusRowProps {
  color: string;
  label: string;
  value: number;
}

const StatusRow = ({
  color,
  label,
  value,
}: StatusRowProps) => {

  return (

    <div
      className="
        flex
        items-center
        justify-between
      "
    >

      <div className="flex items-center gap-2">

        <div
          className={`
            w-2.5 h-2.5 rounded-full
            ${color}
          `}
        />

        <span className="text-zinc-600">
          {label}
        </span>

      </div>

      <span
        className="
          font-semibold
          text-zinc-900
        "
      >
        {value}
      </span>

    </div>
  );
};

export default Dashboard;