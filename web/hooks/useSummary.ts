import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";

export const useSummary = (userId: string | null | undefined) => {
  return useMutation({
    mutationFn: async (content: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data: jobInfo } = await aiApi.summarize({ content });
      const jobId = jobInfo.jobId;

      // Poll until completed
      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const { data: status } = await aiApi.getJobStatus(jobId);
            if (status.state === "completed") {
              clearInterval(interval);
              // status.result is the Prisma record. result field contains the stringified summary.
              const summaryData = status.result;
              try {
                // If it was stringified in worker (Worker line 26), parse it
                const summaryText = JSON.parse(summaryData.result);
                resolve(summaryText);
              } catch {
                resolve(summaryData.result);
              }
            } else if (status.state === "failed") {
              clearInterval(interval);
              reject(new Error(status.failedReason || "Summary job failed"));
            }
          } catch (err) {
            clearInterval(interval);
            reject(err);
          }
        }, 1000); // poll every second
      });
    },
  });
};
